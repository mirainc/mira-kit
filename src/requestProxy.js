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

// Clobber XMLHttpRequest
XMLHttpRequest = captureSandboxFailure('XMLHttpRequest', 'MiraRequestResource');

// Clobber fetch
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

// constructor for MiraRequestResources
export default allowedRequestDomains => {
  // Create request resource
  const MiraRequestResource = (url, method, payload = {}) => {
    const requestPayload = {
      method,
      cache: 'default',
      ...payload,
    };
    if (!inAllowedRequestDomains(allowedRequestDomains, url)) {
      throw new Error(
        `Invalid URL ${url} domain not found in allowed_request_domains`,
      );
    }
    return privateFetch(url, requestPayload);
  };

  // Create file request resource
  const MiraFileRequestResource = (fileProp, method) => {
    const requestPayload = {
      method,
    };
    const responsePayload = {};
    return privateFetch(fileProp.url, requestPayload);
  };

  return {
    MiraRequestResource,
    MiraFileRequestResource,
  };
};
