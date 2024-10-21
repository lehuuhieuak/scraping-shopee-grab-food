import { NextFunction, Request, Response, Router } from 'express';
import puppeteer, { Page } from 'puppeteer';

import { Ok } from '../common/responses/success.response';
import { API_PREFIX } from '../constants';
import { errorHandler } from '../middlewares/error.middleware';

interface Item {
    title: string | null;
    description: string | null;
    price: string | null;
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
            }

            new Ok({ data: results }).send(res);
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
        args: ["--no-sandbox"]
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
                const price = item.querySelector('.discountedPrice___3MBVA')?.textContent ?? null;
                const image = item.querySelector('img.realImage___2TyNE.show___3oA6B')?.getAttribute('src') ?? null;

                response.push({
                    title,
                    description,
                    price,
                    image
                });
            }
        }

        return response;
    });

    await browser.close();

    return results;
};

export { route };
