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

1. [Web Resources](#web-requests)
1. [File Resources](#file-resources)
1. [Responses](#responses)

## Web Resources
#### `constructor(url: string)`
Creates and returns a resource located at the specified URL.

#### `request(...options): Promise<MiraResourceResponse>`
`MiraWebResource` instances have 5 methods for requesting via HTTP/HTTPS; one for each HTTP method.

- `get`
- `post`
- `put`
- `delete`
- `head`

Each method takes any of several options:

| Option | Type | Methods | Description |
| ------ | ---- | ------- | ----------- |
| `queryParams` | `{string: any}` | All | Serialized and sent in the query string. |
| `bodyPayload` | `{string: any}` | PUT, POST | Serialized and sent in the body. |
| `headers` | `{string: string}` | All | HTTP headers. |
| `allowRedirects` | `boolean` | All | Whether or not redirect following is allowed. |

## File Resources
#### `constructor(propertyName: string)`
Creates and returns a user-uploaded file resource. The `propertyName` refers to the `file` type presentation property you wish to retrieve. The file represented by the resource will be specific to the current version of the current presentation.

#### `get(): Promise<MiraResourceResponse>`
Performs an HTTPS GET request to fetch the file.

## Responses
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
| `blob(): ?Blob` | Returns a Blob representation of the response contents. | -->
