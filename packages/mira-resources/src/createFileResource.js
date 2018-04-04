export default privateFetch => {
  return (fileProp, method) => {
    if (method !== 'GET' && method !== 'HEAD') {
      throw new Error(
        `Invalid method ${method}, "GET" & "HEAD" are the only methods allowed by miraFileResource.`,
      );
    }
    const requestPayload = {
      method,
    };
    return privateFetch(fileProp.url, requestPayload);
  };
};
