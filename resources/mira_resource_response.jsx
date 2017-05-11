class MiraResourceResponse {
  // MARK: Properties
  headers: Object;
  didRedirect: boolean;
  statusCode: number;
  url: string;
  raw: ArrayBuffer;

  // MARK: Constructors
  constructor(
    headers: Object,
    didRedirect: boolean,
    statusCode: number,
    url: string,
    raw: ArrayBuffer,
  ) {
    this.headers = headers;
    this.didRedirect = didRedirect;
    this.statusCode = statusCode;
    this.url = url;
    this.raw = raw;
  }

  // MARK: Accessors
  text(): ?string {
    return new TextDecoder('utf-8').decode(new Uint8Array(this.raw));
  }

  binary(): ?string {
    return String.fromCharCode.apply(null, new Uint8Array(this.raw));
  }

  json(): ?Object {
    return JSON.parse(this.text());
  }

  blob(): ?Blob {
    return new Blob([this.raw], { type: this.headers['content-type'] });
  }
}

// MARK: Exports
export default MiraResourceResponse;
