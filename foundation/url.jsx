class URL {
  // MARK: Properties
  _urlString: string

  protocol: string
  hostname: string
  port: number
  pathname: string
  query: string
  hash: string
  host: string

  // MARK: Constructors
  constructor(url: string) {
    this._urlString = url;
    const domElement = document.createElement('a');
    domElement.href = this._urlString;

    this.protocol = domElement.protocol;
    this.hostname = domElement.hostname;
    this.port = domElement.port;
    this.pathname = domElement.pathname;
    this.query = domElement.search;
    this.hash = domElement.hash;
    this.host = domElement.host;
  }
}


// MARK: Exports
export default URL;
