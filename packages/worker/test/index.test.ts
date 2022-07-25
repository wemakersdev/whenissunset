import { handleRequest } from "./../src/index";

test("should respond with 404 when visiting `/api`", async () => {
  const res = await handleRequest(new Request("http://localhost/api"));
  const json: any = await res.json();

  console.log({json})
  expect(res.status).toBe(200);
  expect(json.data).toBe(null)
});


test("should put key in kv", async () => {
  const res = await handleRequest(new Request("http://localhost/api/set-item?userId=123&key=232", {
    method: "POST",
    body: JSON.stringify({
      data: "value"
    })
  }))

  const json: any = await res.json();
  expect(res.status).toBe(200)
  expect(json.data).toHaveProperty("success", true)
})

test("should get key from kv", async () => {
  const res = await handleRequest(new Request("http://localhost/api/get-item?userId=123&key=232"))

  expect(res.status).toBe(200)
  const data1: any = await res.json();
  expect(data1.data).toBe(null)


  await handleRequest(new Request("http://localhost/api/set-item?userId=123&key=232", {
    method: "POST",
    body: JSON.stringify({
      data: "value"
    })
  }))

  const newRes = await handleRequest(new Request("http://localhost/api/get-item?userId=123&key=232"))
  expect(newRes.status).toBe(200)
  const json: any = await newRes.json();
  expect(json).toHaveProperty("data", "value")
})

test("should get keys from kv", async () => {

  const res = await handleRequest(new Request("http://localhost/api/keys?userId=123"))
  expect(res.status).toBe(200)
  const data: any = await res.json();
  expect(data.data).toHaveProperty("keys")
  expect(data.data.keys).toHaveProperty("length", 0)

  // load data
  const promises = ["21312", "13213", "221"].map(key => {
    return handleRequest(new Request(`http://localhost/api/set-item?userId=123&key=${key}`, {
      method: "POST",
      body: JSON.stringify({
        data: "value"
      })
    }))
  })

  await Promise.all(promises)

  const newRes = await handleRequest(new Request("http://localhost/api/keys?userId=123"))
  expect(newRes.status).toBe(200)
  const newData: any = await newRes.json();
  expect(newData.data).toHaveProperty("length", 3)
})

test("should remove a key from kv", async () => {
  // load data
  const promises = ["21312", "13213", "221"].map(key => {
    return handleRequest(new Request(`http://localhost/api/set-item?userId=123&key=${key}`, {
      method: "POST",
      body: JSON.stringify({
        data: "value"
      })
    }))
  })

  await Promise.all(promises)

  const newRes = await handleRequest(new Request("http://localhost/api/remove-item?userId=123&key=13213"))
  expect(newRes.status).toBe(200)
  const newData: any = await newRes.json();
  expect(newData.data).toHaveProperty("success", true)
  const newRes2 = await handleRequest(new Request("http://localhost/api/keys?userId=123"))
  expect(newRes2.status).toBe(200)
  const newData2: any = await newRes2.json();
  expect(newData2.data).toHaveProperty("length", 2)
})


test("should test setting a shared space", async () => {
  const userId = "213123"
  const sharedUserId = "22345";
  const key = "24556"

  const url = new URL("http://localhost/api");

  url.searchParams.set("userId", userId);
  url.searchParams.set("sharedUserId", sharedUserId);
  url.searchParams.set("key", key);
  url.pathname = "/api/set-shared";

  const res = await handleRequest(new Request(url.toString()));

  expect(res.status).toBe(200);
  const json: any = await res.json();
  expect(json.data).toHaveProperty("success", true)

  url.searchParams.set("userId", sharedUserId);
  url.searchParams.delete("sharedUserId");
  url.searchParams.delete("key");
  url.pathname = "/api/get-shared";

  const res2 = await handleRequest(new Request(url.toString()));

  expect(res2.status).toBe(200);
  const json2: any = await res2.json();
  expect(json2.data).toHaveProperty("length", 1)
  expect(json2.data[0]).toHaveProperty("key", key)
  expect(json2.data[0]).toHaveProperty("owner", userId)
})
