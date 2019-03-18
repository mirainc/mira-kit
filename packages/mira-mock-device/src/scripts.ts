// scripts that get stringified and evaluated in puppeteer page execution context

declare global {
  interface Window {
    handleMessage(eventData: object): void;
    iframe: HTMLIFrameElement;
  }
}

export const handleMessageScript = () => {
  window.addEventListener(
    'message',
    event => window.handleMessage(event.data),
    false,
  );
};

export const injectIframeScript = () => {
  if (window.iframe) document.body.removeChild(window.iframe);
  const iframe = document.createElement('iframe');
  iframe.id = 'iframe';
  document.body.appendChild(iframe);
  window.iframe = iframe;
};

export const setIframeSrcScript = (src: string) => {
  window.iframe.src = src;
};

export const postMessageToIframeScript = (
  message: string,
  targetOrigin: string,
) => {
  window.iframe.contentWindow.postMessage(message, targetOrigin);
};
