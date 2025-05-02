import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: NextRequest) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto('https://www.linkedin.com/login');

    await page.waitForSelector('#username');
    await page.type('#username', process.env.LINKEDIN_USER || '');
    await page.type('#password', process.env.LINKEDIN_PASS || '');
    await page.click('label[for="rememberMeOptIn-checkbox"]');
    await page.waitForSelector('button[data-litms-control-urn="login-submit"]');
    await page.click('button[data-litms-control-urn="login-submit"]');
   
    
    
    await page.waitForSelector('svg use[href="#search-medium"]', { timeout: 80000 });
    const elementHandle = await page.$('svg use[href="#search-medium"]');

    if (elementHandle) {
      const parent = await elementHandle.evaluateHandle((useEl) => {
        let el = useEl as HTMLElement;
        while (el && el.nodeName !== 'BUTTON' && el.nodeName !== 'svg') {
          el = el.parentElement!;
        }
        return el;
      });

      if (parent) {
        await (parent as puppeteer.ElementHandle<Element>).click();
      }
    }

    await page.type('.search-global-typeahead__input', 'MERN hiring');
    await page.keyboard.press('Enter');

    await page.waitForSelector('button.search-reusables__filter-pill-button', { timeout: 60000 });
    const pillButtons = await page.$$('button.search-reusables__filter-pill-button');
 
    for (const btn of pillButtons) {
      const text = await page.evaluate(el => el.innerText.trim().toLowerCase(), btn);
      if (text === 'posts') {
        await btn.click();
        break;
      }
    }

    // Scroll to load more posts
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Space');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    await page.waitForSelector('div.update-components-text');

    const posts = await page.$$eval('div.update-components-text', divs =>
      divs.map(div => div.innerText.trim())
    );

    await browser.close();

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error('Scraping failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
