import { Injectable } from '@nestjs/common';
import { UPLOAD_DIRNAME } from '../../upload/service/upload.service';
import puppeteer, { Browser, Page, PDFOptions, PuppeteerNode } from 'puppeteer';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import {
    fileData,
    FileDataType,
    PUBLIC_BASE_DIR,
} from '../../../utils/upload.utils';

dotenv.config();

const { PWD, SOURCE_CODE } = process.env;

/**
 * The upload pdf path
 */
export const HTML2PDF_UPLOAD_DIRNAME = `${PUBLIC_BASE_DIR}/${UPLOAD_DIRNAME}/pdf`;

/**
 * The template pdf path
 */
export const HTML2PDF_TEMPLATE_DIRNAME = `${PWD}${SOURCE_CODE}/templates/pdf`;

/**
 * The wait until
 */
export const WAIT_UTIL = 'networkidle2';

@Injectable()
export class HtmlToPdfService {
    /**
     * The puppeteer Node
     */
    private readonly _puppeteerNode: PuppeteerNode;

    /**
     * The HTML to PDF Service
     */
    public constructor() {
        this._puppeteerNode = puppeteer;
    }

    /**
     * Create a pdf from a url result
     * @param url
     * @param path
     * @param options
     * @returns
     */
    public async fromUrl(
        url: string,
        path: string,
        options?: PDFOptions,
    ): Promise<FileDataType | { success: boolean; error: string }> {
        return new Promise(async (resolve, reject) => {
            this._getData(
                path,
                async (page, browser) => {
                    // Open URL in current page
                    await page.goto(url, { waitUntil: WAIT_UTIL });
                },
                options,
            )
                .then((res) => resolve(res))
                .catch((e) => {
                    console.error(e);
                    resolve({
                        success: false,
                        error: e.message,
                    });
                });
        });
    }

    /**
     * Create a pdf from a url result
     * @param template
     * @param path
     * @param options
     * @returns
     */
    public async fromTemplate(
        template: string,
        path: string,
        options?: PDFOptions,
    ): Promise<FileDataType | { success: boolean; error: string }> {
        return new Promise(async (resolve, reject) => {
            this._getData(
                path,
                async (page, browser) => {
                    // Set template path
                    const templatePath = `${HTML2PDF_TEMPLATE_DIRNAME}/${template}`;

                    // Check if exist
                    if (!fs.existsSync(templatePath)) {
                        return {
                            success: false,
                            error: `The template ${template} doesn't exist`,
                        };
                    }

                    // Read template file
                    const content = fs.readFileSync(templatePath, {
                        encoding: 'utf-8',
                    });

                    // Open URL in current page
                    await page.setContent(content, { waitUntil: WAIT_UTIL });
                },
                options,
            )
                .then((res) => resolve(res))
                .catch((e) => {
                    console.error(e);
                    resolve({
                        success: false,
                        error: e.message,
                    });
                });
        });
    }

    /**
     * Create a pdf from a url result
     * @param content
     * @param path
     * @param options
     * @returns
     */
    public async fromContent(
        content: string,
        path: string,
        options?: PDFOptions,
    ): Promise<FileDataType | { success: boolean; error: string }> {
        return new Promise(async (resolve, reject) => {
            this._getData(
                path,
                async (page, browser) => {
                    // Open URL in current page
                    await page.setContent(content, { waitUntil: WAIT_UTIL });
                },
                options,
            )
                .then((res) => resolve(res))
                .catch((e) => {
                    console.error(e);
                    resolve({
                        success: false,
                        error: e.message,
                    });
                });
        });
    }

    /**
     * Return Data response
     * @param path
     * @param callback
     * @param options
     * @returns
     */
    private async _getData(
        path: string,
        callback: (page: Page, browser: Browser) => Promise<any>,
        options?: PDFOptions,
    ): Promise<FileDataType | { success: boolean; error: string }> {
        return new Promise(async (resolve, reject) => {
            try {
                // Create a browser instance
                const browser = await this._puppeteerNode.launch({
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--autoplay-policy=user-gesture-required',
                        '--disable-background-networking',
                        '--disable-background-timer-throttling',
                        '--disable-backgrounding-occluded-windows',
                        '--disable-breakpad',
                        '--disable-client-side-phishing-detection',
                        '--disable-component-update',
                        '--disable-default-apps',
                        '--disable-dev-shm-usage',
                        '--disable-domain-reliability',
                        '--disable-extensions',
                        '--disable-features=AudioServiceOutOfProcess',
                        '--disable-hang-monitor',
                        '--disable-ipc-flooding-protection',
                        '--disable-notifications',
                        '--disable-offer-store-unmasked-wallet-cards',
                        '--disable-popup-blocking',
                        '--disable-print-preview',
                        '--disable-prompt-on-repost',
                        '--disable-renderer-backgrounding',
                        '--disable-speech-api',
                        '--disable-sync',
                        '--hide-scrollbars',
                        '--ignore-gpu-blacklist',
                        '--metrics-recording-only',
                        '--mute-audio',
                        '--no-default-browser-check',
                        '--no-first-run',
                        '--no-pings',
                        '--no-zygote',
                        '--password-store=basic',
                        '--use-gl=swiftshader',
                        '--use-mock-keychain',
                    ],
                });

                // Create a new page
                const page = await browser.newPage();

                // Run callback
                try {
                    const resCallback = await callback(page, browser);

                    if (resCallback && !resCallback.success) {
                        return resolve(resCallback);
                    }
                } catch (err) {
                    console.error(err);
                    return resolve({
                        success: false,
                        error: err.message,
                    });
                }

                // Set screen size
                await page.setViewport({ width: 1080, height: 1024 });

                //To reflect CSS used for screens instead of print
                await page.emulateMediaType('screen');

                // Create folder if not exist
                const _fullPath = `${HTML2PDF_UPLOAD_DIRNAME}/${path}`;
                const { dirname, fullPath } = fileData(_fullPath);
                if (!fs.existsSync(dirname)) {
                    fs.mkdirSync(dirname, {
                        mode: '0777',
                        recursive: true,
                    });
                }

                // Download the PDF
                const pdfFileBuffer = await page.pdf(
                    Object.assign(
                        <PDFOptions>{
                            margin: {
                                top: '0',
                                left: '0',
                                right: '0',
                                bottom: '0',
                            },
                            printBackground: true,
                            format: 'A4',
                        },
                        options || {},
                        <PDFOptions>{
                            path: fullPath,
                        },
                    ),
                );

                // Close the browser instance
                await browser.close();

                const data = fileData(fullPath);

                data.buffer = pdfFileBuffer;

                // Return file data
                resolve(data);
            } catch (e) {
                console.error(e);
                resolve({
                    success: false,
                    error: e.message,
                });
            }
        });
    }
}
