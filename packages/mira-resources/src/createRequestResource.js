// import captureSandboxFailure from './captureSandboxFailure';
import inAllowedRequestDomains from './inAllowedRequestDomains';

export default (privateFetch, allowedRequestDomains) => {
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
