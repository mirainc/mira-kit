/* The request proxy is used to fetch resources for a Mira Application.
 * This proxy ensures that all resources fetched are within the allowed request
 * domains. The file resource provides a mechnism to fetch files uploaded to the
 * Mira platform.
 */
import parseDomain from 'parse-domain';

// Clobbering time
const privateFetch = fetch;

const captureSandboxFailure = (value, fallback) => () => {
  let reason = `${value} is unavailable in the Mira sandbox.`;
  if (fallback) {
    reason += `Application should use ${fallback} instead.`;
  }
  // eslint-disable-next-line
  console.warn(reason);
};

// Clobber XMLHttpRequest because it is not available on MiraLinks
XMLHttpRequest = captureSandboxFailure('XMLHttpRequest', 'MiraRequestResource');

// Clobber fetch because it is not available on MiraLinks
fetch = captureSandboxFailure('fetch', 'MiraRequestResource');

// allowed request domains validation
function inAllowedRequestDomains(allowedRequestDomains, url) {
  const pUrl = parseDomain(url);
  return allowedRequestDomains.some(domain => {
    const pDomain = parseDomain(domain);
    // if it is true set it to true, else set it to itself
    return (
      pDomain.domain === pUrl.domain &&
      pDomain.subdomain === pUrl.subdomain &&
      pDomain.tld === pUrl.tld
    );
  });
}

// constructor for miraResources
export default allowedRequestDomains => {
  // Create request resource
  const miraRequestResource = (url, payload) => {
    const requestPayload = {
      ...payload,
      cache: 'default',
    };
    if (!inAllowedRequestDomains(allowedRequestDomains, url)) {
      throw new Error(
        `Invalid URL ${url} domain not found in allowed_request_domains`,
      );
    }
    return privateFetch(url, requestPayload);
  };

  // Create file request resource
  const miraFileResource = (fileProp, method) => {
    if (method !== 'GET' && method !== 'HEAD') {
      throw new Error(
        `Invalid method ${method}, we only support "GET" and "HEAD" for miraFileResource`,
      );
    }
    const requestPayload = {
      method,
    };
    const responsePayload = {};
    return privateFetch(fileProp.url, requestPayload);
  };

  return {
    miraRequestResource,
    miraFileResource,
  };
};
