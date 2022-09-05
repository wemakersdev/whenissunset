
import { getAssetFromKV } from "@cloudflare/kv-asset-handler"


export interface GlobalScope extends WorkerGlobalScope{
  DEV_PORT: number
  IS_DEV: boolean
}


declare var self: GlobalScope;
declare var WAITLIST_KV: KVNamespace;



export interface ISharedItem{
  key: string;
  owner: string
}


export class Worker {
  public async handle(request: Request) {
    try {

      const url = new URL(request.url);

      /**
       * handle pre-flight request
       */
      if (request.method === 'OPTIONS') {
        return new Response('', {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          }
        });
      }

      if (url.pathname.startsWith("/api")) {
        return this.handleApiRequest(request);
      }

      throw new Error(`Unsupported pathname: ${url.pathname}`)
    } catch (e: any) {
      let pathname = new URL(request.url).pathname
      return new Response(`"${pathname}" not found ${e.message}`, {
        status: 404,
        statusText: "not found",
      })
    }

  }

  /**
   * get all keys from kv
   * @param {KVNamespace} kv
   * @param options
   * @param {string | undefined} options.cursor
   * @param {string | undefined} options.prefix
   * @returns {Promise<string[]>}
   */
  private async getKeys(kv: KVNamespace, options?: {
    cursor?: string,
    prefix?: string
  }): Promise<any[]> {
    let keys = await kv.list({
      cursor: options?.cursor,
      prefix: options?.prefix
    });

    if(keys.list_complete){
      return keys.keys || [];
    }
    const nextKeys = await this.getKeys(kv, {
      cursor: keys.cursor,
      prefix: options?.prefix
    });
    return keys.keys.concat(nextKeys);
  }
  

  generateKeyString(userId: string, key: string) {
    return `${userId}-${key}`
  }

  async handleApiRequest(request: Request) {

    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      const userId = url.searchParams.get("userId")
      const key = url.searchParams.get("key")
      const shared = url.searchParams.get("shared")
      const sharedUserId = url.searchParams.get("sharedUserId")

      const getKeys = async (userId: string) => {
        const keys = await this.getKeys(WAITLIST_KV, {
          prefix: this.generateKeyString(userId, "")
        });
        return keys.filter(key => key.name.includes(userId)).map(k => k.name.replace(`${userId}-`, ''));
      }

      let dataRes: any = null;

      if(pathname === "/api/geo"){
        const cf = request.cf
        dataRes = {
          geo: {
            longitude: cf?.longitude || "",
            latitude: cf?.latitude || "",
          }
        }
      }

      if (pathname === "/api/keys" && userId) {
        dataRes = await getKeys(userId)
      }

      if (pathname === "/api/get-item" && key && userId) {
        const _data = await WAITLIST_KV.get(this.generateKeyString(userId, key))
        dataRes = _data ? JSON.parse(_data) : null
      }

      if (pathname === "/api/set-item" && key && userId) {
        const body: any = await request?.json()
        await WAITLIST_KV.put(this.generateKeyString(userId, key), JSON.stringify(body.data))
        dataRes = {
          success: true
        }
      }

      if (pathname === "/api/remove-item" && key && userId) {
        await WAITLIST_KV.delete(this.generateKeyString(userId, key))
        dataRes = {
          success: true
        }
      }

      if (pathname === "/api/set-shared" && key && userId && sharedUserId) {
        await this.updateSharedSpaces(sharedUserId, items => {
          return [...items, {
            owner: userId,
            key
          }]
        })

        dataRes = {
          success: true
        }
      }

      if (pathname === "/api/get-shared" && userId ) {
       const data = await this.getSharedSpaces(userId)
        dataRes = data
      }


      if (pathname.startsWith("/api/waitlist/join")) {
        const body: any = await request?.json();

        const cf = request.cf

        await this.handleWaitlistJoin({
          email: body.email,
          geo: {
            longitude: cf?.longitude || "",
            latitude: cf?.latitude || "",
          }
        });

        return new Response(JSON.stringify({
          success: true,
          body: body
        }))
      }

      return new Response(JSON.stringify({
        data: dataRes
      }))
    } catch (err: any) {
      console.error(err)
      return new Response(`${err.message}`)
    }
  }



  async updateSharedSpaces(userId: string, callback: (items: ISharedItem[]) => ISharedItem[]){
    const _data = await WAITLIST_KV.get(this.generateKeyString(userId, "shared"))
    const data = _data ? JSON.parse(_data) : null
    const items = data ? data.items : [];

    const newItems = callback(items);

    await WAITLIST_KV.put(this.generateKeyString(userId, "shared"), JSON.stringify({
      items: newItems
    })) 
  }


  async getSharedSpaces(userId: string){
    const _data = await WAITLIST_KV.get(this.generateKeyString(userId, "shared"))
    const data = _data ? JSON.parse(_data) : null
    return data ? data.items : [];
  }


  /**
   * generate a random string
   */
  private generateRandomString(length: number) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }


  async handleWaitlistJoin({ email, geo }: { email: string, geo: { longitude: string, latitude: string } }) {

    const key = this.generateRandomString(10);
    await WAITLIST_KV.put(key, JSON.stringify({
      email,
      geo
    }))
  }
}

export const handleRequest = (request: Request) => {
  return new Worker().handle(request)
}

export const handleStaticKv = async (event: FetchEvent) => {
  try {
    try {
      return await getAssetFromKV(event)
    } catch (err: any) {
      const url = new URL(event.request.url);
      url.pathname = "/index.html"

      return await getAssetFromKV({
        request: new Request(url.toString()),
        waitUntil(promise) {
          return promise
        }
      })
    }
  } catch (e: any) {
    let pathname = new URL(event.request.url).pathname
    return new Response(`"${pathname}" not found ${e.message}`, {
      status: 404,
      statusText: "not found",
    })
  }
}



self.addEventListener('fetch', (event) => {
  const fetchEvent = event as FetchEvent;
  const url = new URL(fetchEvent.request.url);

  if(url.host.startsWith("www.")){
    const res = Response.redirect(url.toString().replace("www.", ""), 301)
    fetchEvent.respondWith(res)
    return;
  }

  if (url.pathname.startsWith("/api")) {
    fetchEvent.respondWith(handleRequest(fetchEvent.request));
  } else {
    if(self.IS_DEV){
      fetchEvent.respondWith(proxyRequest(fetchEvent))
    }else{
      fetchEvent.respondWith(handleStaticKv(fetchEvent))
    }
  }
});

const getProxyUrl = (): string => {
  const devUrl = `http://localhost:${self.DEV_PORT}`
  return devUrl
}

const proxyRequest = (fetchEvent: FetchEvent) => {
  const url = new URL(fetchEvent.request.url);
  const devUrl = getProxyUrl()
  const proxyUrl = new URL(`${devUrl}${url.pathname}`)

  proxyUrl.hash = url.hash
  proxyUrl.search = url.search

  return fetch(proxyUrl.toString(), {
    method: fetchEvent.request.method,
    headers: fetchEvent.request.headers,
    body: fetchEvent.request.body
  })
}
