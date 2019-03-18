import { EventEmitter } from 'events';
import { AddressInfo, Server } from 'net';
import { Page, JSONObject } from 'puppeteer';
import { PLAY, PRESENTATION } from './actions/control';
import { PRESENTATION_COMPLETE, PRESENTATION_READY } from './actions/lifecycle';
import {
  handleMessageScript,
  injectIframeScript,
  setIframeSrcScript,
  postMessageToIframeScript,
} from './scripts';
import newPage from './utils/newPage';
import promiseEvent from './utils/promiseEvent';
import staticServer from './utils/staticServer';

const fullScreenWindowStyles = [
  'body { margin: 0; }',
  'iframe { border: 0; width: 100%; height:100%; }',
].join('');

class MockDevice extends EventEmitter {
  page: Page;
  server: Server;
  started: boolean;

  constructor() {
    super();
    this.page = null;
    this.server = null;
    this.started = false;
  }

  start = async () => {
    if (this.started) return;
    this.started = true;

    this.page = await newPage();

    // emit postmessage events from app
    const handleMessage = ({
      type,
      payload,
    }: {
      type: string;
      payload: object;
    }) => this.emit(type, payload);
    await this.page.exposeFunction('handleMessage', handleMessage);
    await this.page.evaluateOnNewDocument(handleMessageScript);

    // open empty page and inject empty iframe;
    await this.page.goto('data:text/html,');
    await this.page.addStyleTag({ content: fullScreenWindowStyles });
    await this.page.evaluate(injectIframeScript);
  };

  stop = async () => {
    if (!this.page) return;
    await this.page.close();
    this.page = null;
  };

  startServer = async (pathname: string) => {
    if (this.server) await this.stopServer();
    this.server = await staticServer(pathname);
  };

  stopServer = async () => {
    await this.server.close();
    this.server = null;
  };

  get serverHostname() {
    return `http://127.0.0.1:${(this.server.address() as AddressInfo).port}`;
  }

  get app() {
    const [frame] = this.page.mainFrame().childFrames();
    return frame;
  }

  load = async (pathToApp: string) => {
    if (!this.started) await this.start();
    if (this.app) await this.unload();

    // serve app as static website
    await this.startServer(pathToApp);

    // point iframe to hosted app
    const appLoaded = promiseEvent(this, 'init');
    await this.page.evaluate(setIframeSrcScript, this.serverHostname);
    await appLoaded;
  };

  unload = async () => {
    if (!this.app) return;
    await this.page.evaluate(setIframeSrcScript, '');
    if (this.server) await this.stopServer();
  };

  sendMessage = async (type: string, payload?: JSONObject) => {
    // simulator builds will filter postmessage based on source === 'mira-simulator'
    // remove this once we stop depending on simulator builds
    // https://github.com/mirainc/mira-kit/blob/98f77a7/packages/mira-simulator/src/createMessenger.js#L9
    const source = 'mira-simulator';

    await this.page.evaluate(
      postMessageToIframeScript,
      { type, payload, source },
      `*`,
    );
  };

  play = async () => {
    await this.sendMessage(PLAY);
  };

  setPresentation = async (application_vars: JSONObject) => {
    await this.sendMessage(PRESENTATION, { application_vars });
  };

  waitForMessage = <Event>(
    eventName: string,
    predicate?: (event: Event) => boolean,
  ) => {
    return promiseEvent<Event>(this, eventName, predicate);
  };

  waitForPresentationReady = () => {
    return this.waitForMessage(PRESENTATION_READY);
  };

  waitForPresentationComplete = () => {
    return this.waitForMessage(PRESENTATION_COMPLETE);
  };
}

export default MockDevice;
