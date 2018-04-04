import parseDomain from 'parse-domain';

export default (allowedRequestDomains, url) => {
  const pUrl = parseDomain(url);
  return allowedRequestDomains.some(domain => {
    const pDomain = parseDomain(domain);
    return (
      pDomain &&
      pUrl &&
      pDomain.domain === pUrl.domain &&
      pDomain.subdomain === pUrl.subdomain &&
      pDomain.tld === pUrl.tld
    );
  });
};
