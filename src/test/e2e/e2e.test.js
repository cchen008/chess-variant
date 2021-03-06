const puppeteer = require('puppeteer');

describe('App Level Tests', () => {
  test('the user can create a game', async () => {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 80,
    });
    const page = await browser.newPage();
    await page.goto(
      'http://chess-variant-20191210113159-hostingbucket-develop.s3-website-us-east-1.amazonaws.com/',
    );

    await page.click('#btncreategame');
    await page.select('#select-variant', 'Antichess');
    await page.click('#btnwhite');
    await browser.close();
  }, 9999);
});
