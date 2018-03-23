import captureSandboxFailure from './captureSandboxFailure';
import inAllowedRequestDomains from './inAllowedRequestDomains';

export default (target, allowedRequestDomains) => {
  const privateFetch = target.fetch.bind(target);

  // Clobber XMLHttpRequest because it is not available in the Mira sandbox.
  target.XMLHttpRequest = captureSandboxFailure(
    'XMLHttpRequest',
    'miraRequestResource',
  );

  // Clobber fetch because it is not available on MiraLinks
  target.fetch = captureSandboxFailure('fetch', 'miraRequestResource');

  return (url, payload) => {
    const requestPayload = {
      ...payload,
      cache: 'default',
    };
    if (!inAllowedRequestDomains(allowedRequestDomains, url)) {
      throw new Error(
        `Invalid URL '${url}', domain not allowed. To allow it please add it to allowedRequestDomains in your mira.config.js.`,
      );
    }
    return privateFetch(url, requestPayload);
  };
};
