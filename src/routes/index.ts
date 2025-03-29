import { NextFunction, Request, Response, Router } from 'express';
import puppeteer, { Page } from 'puppeteer';

import { Ok } from '../common/responses/success.response';
import { API_PREFIX } from '../constants';
import { errorHandler } from '../middlewares/error.middleware';

interface Item {
    title: string | null;
    description: string | null;
    price: string | null;
    oldPrice: string | null;
    image: string | null;
}

const route = (app: Router) => {
    app.get('/', (_: Request, res: Response) => {
        res.json({ status: 'running' });
    });

    app.get(`${API_PREFIX}/crawls`, async (req: Request, res: Response, next: NextFunction) => {
        try {
            let url: string = req.query.url!.toString();
            let type: string = req.query.type!.toString();

            let results: Item[] = [];
            if (type === 'grab') {
                results = await crawlsGrab(url);
            } else if (type === 'shopee') {
                results = await crawlsShopeeFood(url);
            }

            new Ok({ data: results, total: results.length }).send(res);
        } catch (error) {
            next(error);
        }
    });

    app.use(errorHandler);
};

// crawls in web grab food
const crawlsGrab = async (url: string): Promise<Item[]> => {
    // const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--start-maximized'] }); // this code to launches the browser
    const browser = await puppeteer.launch({
        args: ['--no-sandbox']
    });

    const page: Page = await browser.newPage();

    await page.setUserAgent(
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    );

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Scroll to the bottom of the page
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });

    // Check if network is idle after scrolling
    await page.waitForNetworkIdle();

    const results: Item[] = await page.evaluate(async (): Promise<Item[]> => {
        let response: Item[] = [];
        let items: NodeListOf<Element> = document.querySelectorAll('.menuItem___1HHmD');

        for (const item of items) {
            // check if element is disabled it mean food is out of stock
            if (!item.querySelector('.disableOverlay___1mnNv')) {
                const title = item.querySelector('.itemNameTitle___1sFBq')?.textContent ?? null;
                const description = item.querySelector('.itemDescription___2cIzt')?.textContent ?? null;
                const oldPrice = item.querySelector('.originPrice___202WH')?.textContent ?? null;
                const price = item.querySelector('.discountedPrice___3MBVA')?.textContent ?? null;
                const image = item.querySelector('img.realImage___2TyNE.show___3oA6B')?.getAttribute('src') ?? null;

                response.push({
                    title,
                    description,
                    price,
                    image,
                    oldPrice
                });
            }
        }

        return response;
    });

    await browser.close();

    return results;
};

// crawls in web shopee food
const crawlsShopeeFood = async (url: string): Promise<Item[]> => {
    const browser = await puppeteer.launch({
        // headless: false,
        args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins',
            '--disable-site-isolation-trials',
            '--no-sandbox'
        ]
    });

    const page: Page = await browser.newPage();
    page.setViewport({ width: 1280, height: 926 });

    // Thêm Tiêu đề
    await page.setExtraHTTPHeaders({
        'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'upgrade-insecure-requests': '1',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9,en;q=0.8'
    });

    await page.goto(url, { waitUntil: 'networkidle0' });

    const items = await scrapeShopeeFoodItems(page, extractShopeeFoodItems, 1000);

    await browser.close();

    return items;
};

function extractShopeeFoodItems() {
    const extractedElements = document.querySelectorAll('.item-restaurant-row');
    const items: Item[] = [];
    for (let element of extractedElements) {
        if (!element.querySelector('.btn-over')) {
            const title =
                element.querySelector('.row > .item-restaurant-info > .item-restaurant-name')?.textContent ?? null;
            const description =
                element.querySelector('.row > .item-restaurant-info > .item-restaurant-desc')?.textContent ?? null;
            const oldPrice = element.querySelector('.old-price')?.textContent?.replace('đ', '') ?? null;
            const price = element.querySelector('.current-price')?.textContent?.replace('đ', '') ?? null;
            const image = element.querySelector('img')?.getAttribute('src') ?? null;

            items.push({
                title,
                description,
                price,
                image,
                oldPrice
            });
        }
    }
    return items;
}

async function scrapeShopeeFoodItems(page: Page, extractItems: any, itemCount: number, scrollDelay = 800) {
    let items: Item[] = [];

    const wait = (duration: number) => {
        console.log('waiting', duration);
        return new Promise((resolve) => setTimeout(resolve, duration));
    };
    let previousHeight;
    while (items.length < itemCount) {
        items = [...items, ...(await page.evaluate(extractItems))];
        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
        wait(scrollDelay);
    }
    return items;
}

export { route };
