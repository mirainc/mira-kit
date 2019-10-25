// import captureSandboxFailure from './captureSandboxFailure';
import inAllowedRequestDomains from './inAllowedRequestDomains';

export default (privateFetch, allowedRequestDomains) => {
  return (url, payload) => {
    console.warn(
      'mireRequestResource is deprecated, please use fetch instead.',
    );

    const requestPayload = {
      ...payload,
      cache: 'default',
    };
    if (!inAllowedRequestDomains(allowedRequestDomains, url)) {
      throw new Error(
        `Invalid URL '${url}', domain not allowed. To allow it please add it to allowedRequestDomains in your raydiant.config.js.`,
      );
    }
    return privateFetch(url, requestPayload);
  };
};
