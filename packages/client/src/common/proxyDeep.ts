import ProxyDeep from 'proxy-deep'


export interface IGetProxyOptions<T>{
	get: (keyPath: string[]) => T[keyof T];
	set: (keyPath: string[], value: string) => void;
}

export const getProxy = <T extends object>(options: IGetProxyOptions<T>) => {
	  const proxy = new ProxyDeep<T>({
		  path: []
	  } as T, {
		get(target:any, property, receiver){

			const currentPath:any = this.path
			const val:any = options.get([...(currentPath), property]);
			if(val && typeof val === "object" && !val.proxy){
				const _val:any = this.nest(val);
				return _val
			}
			return val
		},
		set(target: any, property:any, value){
			// if(this.path && this.path.length){
			const currentPath: any = this.path || []
			options.set([...currentPath, property],value )
			// }
			return true
		}	
	  })

	  return proxy;
}
