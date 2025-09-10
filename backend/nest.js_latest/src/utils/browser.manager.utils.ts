// import * as fs from 'fs';
// import handlebars from 'handlebars';
// import * as path from 'path';
// import puppeteer from 'puppeteer';
// import { v4 as uuidv4 } from 'uuid';
// import { BadRequestApiException } from './response.manager.utils';

// // Global browser management for reuse across function calls
// class BrowserManager {
//   private static instance: BrowserManager;
//   private browser: any = null;
//   private browserPromise: Promise<any> | null = null;
//   private creationTime: number = 0;
//   private readonly MAX_BROWSER_AGE = 5 * 60 * 1000; // 5 minutes

//   static getInstance(): BrowserManager {
//     if (!BrowserManager.instance) {
//       BrowserManager.instance = new BrowserManager();
//     }
//     return BrowserManager.instance;
//   }

//   async getBrowser() {
//     // Check if browser is too old or disconnected
//     if (
//       this.browser &&
//       (Date.now() - this.creationTime > this.MAX_BROWSER_AGE ||
//         !this.browser.isConnected())
//     ) {
//       await this.closeBrowser();
//     }

//     if (this.browser && this.browser.isConnected()) {
//       return this.browser;
//     }

//     if (this.browserPromise) {
//       return this.browserPromise;
//     }

//     this.browserPromise = this.createBrowser();
//     this.browser = await this.browserPromise;
//     this.browserPromise = null;
//     this.creationTime = Date.now();

//     return this.browser;
//   }

//   private async createBrowser() {
//     const browserArgs = [
//       '--no-sandbox',
//       '--disable-setuid-sandbox',
//       '--disable-dev-shm-usage',
//       '--disable-gpu',
//       '--disable-web-security',
//       '--disable-extensions',
//       '--disable-plugins',
//       '--disable-background-timer-throttling',
//       '--disable-backgrounding-occluded-windows',
//       '--disable-renderer-backgrounding',
//       '--disable-features=TranslateUI,VizDisplayCompositor',
//       '--single-process',
//       '--no-zygote',
//       '--memory-pressure-off',
//       '--aggressive-cache-discard',
//       '--disable-ipc-flooding-protection',
//       '--max_old_space_size=256',
//       '--disable-default-apps',
//       '--disable-sync',
//       '--disable-translate',
//       '--hide-scrollbars',
//       '--mute-audio',
//       '--no-first-run',
//       '--disable-background-networking',
//     ];

//     try {
//       const browser = await puppeteer.launch({
//         headless: true,
//         executablePath:
//           process.env.PUPPETEER_EXECUTABLE_PATH ||
//           (process.env.NODE_ENV === 'production'
//             ? '/usr/bin/google-chrome-stable'
//             : undefined),
//         args: browserArgs,
//         timeout: 25000,
//         ignoreDefaultArgs: ['--disable-extensions'],
//         defaultViewport: null,
//       });

//       // Handle browser disconnection
//       browser.on('disconnected', () => {
//         console.log('Browser disconnected, clearing instance');
//         this.browser = null;
//         this.creationTime = 0;
//       });

//       return browser;
//     } catch (error) {
//       console.error('Failed to create browser:', error);
//       this.browserPromise = null;
//       throw error;
//     }
//   }

//   async closeBrowser() {
//     if (this.browser) {
//       try {
//         await this.browser.close();
//       } catch (error) {
//         console.warn('Error closing browser:', error);
//       } finally {
//         this.browser = null;
//         this.creationTime = 0;
//       }
//     }
//   }
// }

// // Standalone PDF generation function
// export async function generatePdfFromTemplate(
//   templatePath: string,
//   data: any,
//   options: {
//     format?: 'A4' | 'A3' | 'Letter';
//     zoom?: string;
//     viewport?: { width: number; height: number };
//     timeout?: number;
//     waitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
//     printBackground?: boolean;
//   } = {},
// ): Promise<Buffer> {
//   const requestId = uuidv4();
//   let page: any = null;
//   const startTime = Date.now();

//   // Default options
//   const {
//     format = 'A4',
//     zoom = '80%',
//     viewport = { width: 1200, height: 800 },
//     timeout = 45000,
//     waitUntil = 'networkidle0',
//     printBackground = true,
//   } = options;

//   try {
//     console.log(
//       `[${requestId}] Starting PDF generation from template: ${path.basename(templatePath)}`,
//     );

//     // Validate template exists
//     if (!fs.existsSync(templatePath)) {
//       throw new BadRequestApiException({
//         message: `Template file not found: ${templatePath}`,
//       });
//     }

//     // Load and compile template
//     const templateHtml = fs.readFileSync(templatePath, 'utf8');
//     const template = handlebars.compile(templateHtml);
//     const html = template(data);

//     console.log(`[${requestId}] Template compiled, getting browser instance`);

//     // Get browser instance with retry logic
//     const browserManager = BrowserManager.getInstance();
//     let browser;
//     let retryCount = 0;
//     const maxRetries = 2;

//     while (retryCount <= maxRetries) {
//       try {
//         browser = await browserManager.getBrowser();
//         break;
//       } catch (error) {
//         retryCount++;
//         if (retryCount > maxRetries) {
//           throw new BadRequestApiException({
//             message: `Failed to get browser after ${maxRetries} retries: ${error.message}`,
//           });
//         }
//         console.warn(
//           `[${requestId}] Browser creation failed, retry ${retryCount}/${maxRetries}`,
//         );
//         await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
//       }
//     }

//     console.log(`[${requestId}] Creating new page`);
//     page = await browser.newPage();

//     // Set timeouts based on Cloud Run constraints
//     const pageTimeout = Math.min(timeout, 50000); // Max 50 seconds for operations
//     page.setDefaultTimeout(pageTimeout);
//     page.setDefaultNavigationTimeout(pageTimeout);

//     // Error handling
//     page.on('error', (error: any) => {
//       console.error(`[${requestId}] Page error:`, error);
//     });

//     page.on('pageerror', (error: any) => {
//       console.warn(`[${requestId}] Page script error:`, error);
//     });

//     // Optimize viewport
//     await page.setViewport(viewport);

//     // // Block resources to save memory and speed up loading
//     // await page.setRequestInterception(true);
//     // page.on('request', (request: any) => {
//     //   const resourceType = request.resourceType();
//     //   if (
//     //     [
//     //       'image',
//     //       'media',
//     //       'font',
//     //       'texttrack',
//     //       'object',
//     //       'beacon',
//     //       'csp_report',
//     //       'imageset',
//     //     ].includes(resourceType)
//     //   ) {
//     //     request.abort();
//     //   } else {
//     //     request.continue();
//     //   }
//     // });

//     console.log(`[${requestId}] Setting page content`);

//     // Set content with timeout protection
//     await Promise.race([
//       page.setContent(html, {
//         waitUntil,
//         timeout: Math.min(timeout - 5000, 25000), // Leave buffer for PDF generation
//       }),
//       new Promise((_, reject) =>
//         setTimeout(
//           () =>
//             reject(
//               new BadRequestApiException({
//                 message: 'Content loading timeout',
//               }),
//             ),
//           Math.min(timeout - 3000, 27000),
//         ),
//       ),
//     ]);

//     // Verify page is still active
//     if (page.isClosed()) {
//       throw new BadRequestApiException({
//         message: 'Page closed unexpectedly during content loading',
//       });
//     }

//     // Apply zoom if specified
//     if (zoom && zoom !== '100%') {
//       console.log(`[${requestId}] Applying zoom: ${zoom}`);
//       await Promise.race([
//         page.evaluate((zoomValue: string) => {
//           document.body.style.zoom = zoomValue;
//         }, zoom),
//         new Promise((_, reject) =>
//           setTimeout(
//             () =>
//               reject(
//                 new BadRequestApiException({
//                   message: 'Zoom application timeout',
//                 }),
//               ),
//             3000,
//           ),
//         ),
//       ]);
//     }

//     // Final check before PDF generation
//     if (page.isClosed()) {
//       throw new BadRequestApiException({
//         message: 'Page closed before PDF generation',
//       });
//     }

//     console.log(`[${requestId}] Generating PDF`);

//     // Generate PDF with aggressive timeout
//     const remainingTime = Math.max(
//       timeout - (Date.now() - startTime) - 2000,
//       10000,
//     );
//     const pdfBuffer = await Promise.race([
//       page.pdf({
//         format: format as any,
//         printBackground,
//         timeout: Math.min(remainingTime, 25000),
//       }),
//       new Promise<never>((_, reject) =>
//         setTimeout(
//           () =>
//             reject(
//               new BadRequestApiException({ message: 'PDF generation timeout' }),
//             ),
//           Math.min(remainingTime + 2000, 27000),
//         ),
//       ),
//     ]);

//     const totalTime = Date.now() - startTime;
//     console.log(`[${requestId}] PDF generated successfully in ${totalTime}ms`);

//     return Buffer.from(pdfBuffer);
//   } catch (error: any) {
//     const totalTime = Date.now() - startTime;
//     console.error(
//       `[${requestId}] PDF generation failed after ${totalTime}ms:`,
//       error,
//     );

//     // Handle specific Cloud Run errors
//     if (
//       error.name === 'TargetCloseError' ||
//       error.message?.includes('Session closed') ||
//       error.message?.includes('Connection closed')
//     ) {
//       // Force browser reset on session errors
//       const browserManager = BrowserManager.getInstance();
//       await browserManager.closeBrowser();

//       throw new BadRequestApiException({
//         message: `PDF generation failed: Browser session terminated unexpectedly. This may be due to Cloud Run resource limits. (Request: ${requestId})`,
//       });
//     }

//     if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
//       throw new BadRequestApiException({
//         message: `PDF generation failed: Operation timed out after ${totalTime}ms. Consider reducing template complexity. (Request: ${requestId})`,
//       });
//     }

//     if (
//       error.message?.includes('Navigation failed') ||
//       error.message?.includes('net::')
//     ) {
//       throw new BadRequestApiException({
//         message: `PDF generation failed: Content loading error. Check template validity. (Request: ${requestId})`,
//       });
//     }

//     throw new BadRequestApiException({
//       message: `PDF generation failed: ${error.message} (Request: ${requestId})`,
//     });
//   } finally {
//     // Always clean up the page, but preserve browser for reuse
//     if (page && !page.isClosed()) {
//       try {
//         await Promise.race([
//           page.close(),
//           new Promise((_, reject) =>
//             setTimeout(
//               () =>
//                 reject(
//                   new BadRequestApiException({ message: 'Page close timeout' }),
//                 ),
//               5000,
//             ),
//           ),
//         ]);
//         console.log(`[${requestId}] Page closed successfully`);
//       } catch (error) {
//         console.warn(`[${requestId}] Error closing page:`, error);
//       }
//     }
//   }
// }

// // Convenience wrapper for your specific use case
// export async function generateStatementPdf(data: any): Promise<Buffer> {
//   const isProduction = process.env.NODE_ENV === 'production';
//   const templatePath = isProduction
//     ? '/app/templates/statment-of-account.hbs' // Path in Docker/Cloud Run
//     : path.join(__dirname, '../../templates/statment-of-account.hbs'); // Path in local development

//   return generatePdfFromTemplate(templatePath, data, {
//     format: 'A4',
//     zoom: '80%',
//     viewport: { width: 1200, height: 800 },
//     timeout: 45000,
//     waitUntil: 'domcontentloaded',
//     printBackground: true,
//   });
// }
import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as path from 'path';
import { Browser, chromium, Page } from 'playwright';
import { v4 as uuidv4 } from 'uuid';

class BrowserManager {
  private static instance: BrowserManager;
  private browser: Browser | null = null;
  private browserPromise: Promise<Browser> | null = null;
  private creationTime: number = 0;
  private readonly MAX_BROWSER_AGE = 5 * 60 * 1000; // 5 minutes

  static getInstance(): BrowserManager {
    if (!BrowserManager.instance) {
      BrowserManager.instance = new BrowserManager();
    }
    return BrowserManager.instance;
  }

  async getBrowser(): Promise<Browser> {
    // Check if browser is too old or disconnected
    if (
      this.browser &&
      (Date.now() - this.creationTime > this.MAX_BROWSER_AGE ||
        !this.browser.isConnected())
    ) {
      await this.closeBrowser();
    }

    if (this.browser && this.browser.isConnected()) {
      return this.browser;
    }

    if (this.browserPromise) {
      return this.browserPromise;
    }

    this.browserPromise = this.createBrowser();
    this.browser = await this.browserPromise;
    this.browserPromise = null;
    this.creationTime = Date.now();

    return this.browser;
  }

  private async createBrowser(): Promise<Browser> {
    try {
      const browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-extensions',
          '--disable-plugins',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-features=TranslateUI,VizDisplayCompositor',
          '--single-process',
          '--no-zygote',
          '--memory-pressure-off',
          '--aggressive-cache-discard',
          '--disable-ipc-flooding-protection',
          '--max_old_space_size=256',
          '--disable-default-apps',
          '--disable-sync',
          '--disable-translate',
          '--hide-scrollbars',
          '--mute-audio',
          '--no-first-run',
          '--disable-background-networking',
        ],
        timeout: 25000,
      });

      // Handle browser disconnection
      browser.on('disconnected', () => {
        console.log('Browser disconnected, clearing instance');
        this.browser = null;
        this.creationTime = 0;
      });

      return browser;
    } catch (error) {
      console.error('Failed to create browser:', error);
      this.browserPromise = null;
      throw error;
    }
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      try {
        await this.browser.close();
      } catch (error) {
        console.warn('Error closing browser:', error);
      } finally {
        this.browser = null;
        this.creationTime = 0;
      }
    }
  }
}

@Injectable()
export class PlaywrightPdfService {
  async generatePdfFromTemplate(
    templatePath: string,
    data: any,
    options: {
      format?: 'A4' | 'A3' | 'Letter';
      zoom?: number;
      viewport?: { width: number; height: number };
      timeout?: number;
      waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
      printBackground?: boolean;
      margin?: {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
      };
    } = {},
  ): Promise<Buffer> {
    const requestId = uuidv4();
    let page: Page | null = null;
    const startTime = Date.now();

    // Default options
    const {
      format = 'A4',
      zoom = 0.8,
      viewport = { width: 1200, height: 800 },
      timeout = 45000,
      waitUntil = 'networkidle',
      printBackground = true,
      margin = { top: '20px', bottom: '20px', left: '15px', right: '15px' },
    } = options;

    try {
      console.log(
        `[${requestId}] Starting PDF generation from template: ${path.basename(templatePath)}`,
      );

      // Validate template exists
      if (!fs.existsSync(templatePath)) {
        throw new BadRequestException({
          message: `Template file not found: ${templatePath}`,
        });
      }

      // Load and compile template
      const templateHtml = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateHtml);
      const html = template(data);

      console.log(`[${requestId}] Template compiled, getting browser instance`);

      // Get browser instance with retry logic
      const browserManager = BrowserManager.getInstance();
      let browser: Browser;
      let retryCount = 0;
      const maxRetries = 2;

      while (retryCount <= maxRetries) {
        try {
          browser = await browserManager.getBrowser();
          break;
        } catch (error) {
          retryCount++;
          if (retryCount > maxRetries) {
            throw new BadRequestException({
              message: `Failed to get browser after ${maxRetries} retries: ${error.message}`,
            });
          }
          console.warn(
            `[${requestId}] Browser creation failed, retry ${retryCount}/${maxRetries}`,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * retryCount),
          );
        }
      }

      console.log(`[${requestId}] Creating new page`);

      // Create browser context with timeout
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: zoom,
      });

      page = await context.newPage();

      // Set timeouts
      const pageTimeout = Math.min(timeout, 50000); // Max 50 seconds for operations
      page.setDefaultTimeout(pageTimeout);

      // Error handling
      page.on('pageerror', (error) => {
        console.warn(`[${requestId}] Page script error:`, error);
      });

      page.on('crash', () => {
        console.error(`[${requestId}] Page crashed`);
      });

      // Optimize by blocking unnecessary resources
      await page.route('**/*', (route) => {
        const request = route.request();
        const resourceType = request.resourceType();

        // Block images, media, fonts for performance (uncomment if needed)
        // if (['image', 'media', 'font'].includes(resourceType)) {
        //   route.abort();
        // } else {
        route.continue();
        // }
      });

      console.log(`[${requestId}] Setting page content`);

      // Set content with timeout protection
      await Promise.race([
        page.setContent(html, {
          waitUntil,
          timeout: Math.min(timeout - 5000, 25000), // Leave buffer for PDF generation
        }),
        new Promise<never>((_, reject) =>
          setTimeout(
            () =>
              reject(
                new BadRequestException({
                  message: 'Content loading timeout',
                }),
              ),
            Math.min(timeout - 3000, 27000),
          ),
        ),
      ]);

      // Verify page is still active
      if (page.isClosed()) {
        throw new BadRequestException({
          message: 'Page closed unexpectedly during content loading',
        });
      }

      // Wait for any dynamic content to load
      try {
        await page.waitForLoadState('networkidle', { timeout: 5000 });
      } catch (error) {
        console.warn(
          `[${requestId}] Network idle timeout - proceeding with PDF generation`,
        );
      }

      // Final check before PDF generation
      if (page.isClosed()) {
        throw new BadRequestException({
          message: 'Page closed before PDF generation',
        });
      }

      console.log(`[${requestId}] Generating PDF`);

      // Generate PDF with aggressive timeout
      const remainingTime = Math.max(
        timeout - (Date.now() - startTime) - 2000,
        10000,
      );

      const pdfBuffer = await Promise.race([
        page.pdf({
          format: format as any,
          printBackground,
          margin,
          // timeout: Math.min(remainingTime, 25000),
          preferCSSPageSize: true,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(
            () =>
              reject(
                new BadRequestException({ message: 'PDF generation timeout' }),
              ),
            Math.min(remainingTime + 2000, 27000),
          ),
        ),
      ]);

      const totalTime = Date.now() - startTime;
      console.log(
        `[${requestId}] PDF generated successfully in ${totalTime}ms`,
      );

      return pdfBuffer;
    } catch (error: any) {
      const totalTime = Date.now() - startTime;
      console.error(
        `[${requestId}] PDF generation failed after ${totalTime}ms:`,
        error,
      );

      // Handle specific errors
      if (
        error.name === 'TargetClosedError' ||
        error.message?.includes(
          'Target page, context or browser has been closed',
        ) ||
        error.message?.includes('Connection closed')
      ) {
        // Force browser reset on session errors
        const browserManager = BrowserManager.getInstance();
        await browserManager.closeBrowser();

        throw new BadRequestException({
          message: `PDF generation failed: Browser session terminated unexpectedly. This may be due to resource limits. (Request: ${requestId})`,
        });
      }

      if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
        throw new BadRequestException({
          message: `PDF generation failed: Operation timed out after ${totalTime}ms. Consider reducing template complexity. (Request: ${requestId})`,
        });
      }

      if (
        error.message?.includes('Navigation failed') ||
        error.message?.includes('net::')
      ) {
        throw new BadRequestException({
          message: `PDF generation failed: Content loading error. Check template validity. (Request: ${requestId})`,
        });
      }

      throw new BadRequestException({
        message: `PDF generation failed: ${error.message} (Request: ${requestId})`,
      });
    } finally {
      // Always clean up the page and context, but preserve browser for reuse
      if (page && !page.isClosed()) {
        try {
          const context = page.context();
          await Promise.race([
            context.close(),
            new Promise((_, reject) =>
              setTimeout(
                () =>
                  reject(
                    new BadRequestException({
                      message: 'Context close timeout',
                    }),
                  ),
                5000,
              ),
            ),
          ]);
          console.log(`[${requestId}] Context closed successfully`);
        } catch (error) {
          console.warn(`[${requestId}] Error closing context:`, error);
        }
      }
    }
  }

  // Convenience wrapper for your specific use case
  async generateStatementPdf(data: any): Promise<Buffer> {
    const isProduction = process.env.NODE_ENV === 'production';
    const templatePath = isProduction
      ? '/app/templates/statment-of-account.hbs' // Path in Docker/Cloud Run
      : path.join(__dirname, '../../templates/statment-of-account.hbs'); // Path in local development

    return this.generatePdfFromTemplate(templatePath, data, {
      format: 'A4',
      zoom: 0.8,
      viewport: { width: 1200, height: 800 },
      timeout: 45000,
      waitUntil: 'domcontentloaded',
      printBackground: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '15px',
        right: '15px',
      },
    });
  }

  // Method to install browsers (run this during app startup or deployment)
  static async installBrowsers(): Promise<void> {
    try {
      const { execSync } = require('child_process');
      console.log('Installing Playwright browsers...');
      execSync('npx playwright install chromium', { stdio: 'inherit' });
      console.log('Playwright browsers installed successfully');
    } catch (error) {
      console.error('Failed to install Playwright browsers:', error);
      throw error;
    }
  }
}

// Utility function to clean up resources (call on app shutdown)
export async function cleanupPdfResources(): Promise<void> {
  try {
    const browserManager = BrowserManager.getInstance();
    await browserManager.closeBrowser();
    console.log('PDF resources cleaned up successfully');
  } catch (error) {
    console.warn('Error cleaning up PDF resources:', error);
  }
}

// Health check function
export async function checkPdfGeneratorHealth(): Promise<{
  status: string;
  message: string;
}> {
  try {
    const browserManager = BrowserManager.getInstance();
    const browser = await browserManager.getBrowser();

    if (browser && browser.isConnected()) {
      return { status: 'healthy', message: 'PDF generator is ready' };
    } else {
      return {
        status: 'degraded',
        message: 'Browser not connected, will recreate on next request',
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `PDF generator error: ${error.message}`,
    };
  }
}
