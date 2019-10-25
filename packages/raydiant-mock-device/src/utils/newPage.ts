import { launch } from 'puppeteer';
import { headless, isCI } from './constants';

const newBrowser = () =>
  launch({
    args: [
      // running as root in docker requires --no-sandbox flag
      isCI ? '--no-sandbox' : null,
    ].filter(arg => !!arg),
    headless,
    devtools: !headless,
  });

const newPage = async () => {
  const browser = await newBrowser();
  const [page] = await browser.pages();

  // close browser after closing page
  const closePage = page.close.bind(page);
  page.close = async () => {
    const closed = await closePage();
    await browser.close();
    return closed;
  };

  await page.setViewport({ width: 1200, height: 800 });

  return page;
};

export default newPage;
