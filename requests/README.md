# MiraResource
`MiraResource` is a generic interface for accessing resources via the web.

The `MiraWebResource` class is the canonical way to do HTTP/HTTPS requests in a Mira app. In fact, all other methods of HTTP requesting are disabled within the Mira sandbox. Domains of requested URLs must be listed in the `allowed_request_domains` of the app.

The `MiraFileResource` class is a specialized subclass for accessing user-provided files.

Requests for resources follow a simple object based initialization method and Promise-based response flow.

```js
const req = new MiraWebResource(`https://www.instagram.com/${ig_username}/media/`);

req.get().then((resp) => {

  console.log(resp.statusCode); // 200
  console.log(resp.headers['content-type']); // application/json

  return resp.json()['items'];

}).then((igItems) => {

  const imageURLs = igItems.map((igItem) =>
    igItem.images.standard_resolution.url
  ));

  console.log(imageURLs);
  // [
  //   "https://ig.cdn/13741113_1925952777631716_424018787_n.jpp",
  //   "https://ig.cdn/13721259_1629852643992020_947549713_n.jpg"
  // ]

});
```


# Table of Contents
1. [Creating Requests](#creating-requests)
2. [Executing Requests](#executing-requests)
3. [Receiving Responses](#receiving-responses)

## Creating Resources
#### `constructor(url: string)`
Creates and returns a request for the specified URL.

## Executing Requests
`MiraResource` instances have 5 methods for making the HTTP/HTTPS request; one for each HTTP method.

- `get(...options): Promise`
- `post(...options): Promise`
- `put(...options): Promise`
- `delete(...options): Promise`
- `head(...options): Promise`

| Parameter | Type | Description |
| ------ | ---- | ----------- |
| `queryParams` | `{string: any}` | Serialized and sent in the query string. |
| `bodyPayload` | `{string: any}` | Serialized and sent in the body. |
| `headers` | `{string: string}` | HTTP headers. |
| `auth` | `[string, string]` | Username and password for basic auth. |
| `timeout` | `number` | How long to wait for the server before giving up. |
| `allowRedirects` | `boolean` | Whether or not redirect following is allowed. |

With one notable exception, these methods all work identically; only the underlying HTTP method changes. However, `.get()`, `.delete()`, and `.head()` ignore `bodyPayload`.

## Receiving Responses
#### `class MiraResourceResponse`

| Property | Type | Description |
| -------- | ---- | ----------- |
| `headers` | `{string: string}` | HTTP headers. |
| `didRedirect` | `boolean` | Whether or not redirects were followed. |
| `statusCode` | `number` | Responded HTTP status. |
| `url` | `string` | The final URL of the response. |
| `raw` | `ArrayBuffer` | The raw body of the response. |


| Method | Description |
| ------ | ----------- |
| `json(): ?Object` | Returns the json-encoded content of the response, if any. |
| `text(): ?string` | Returns the UTF8-encoded content of the response, if any. |
| `blob(): ?Blob` | Returns a Blob representation of the response contents. |
