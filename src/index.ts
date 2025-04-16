import puppeteer, { type Page, type Browser } from "puppeteer-core";
import { tryCatch } from "./utils/tryCatch.js";

async function launchPuppeteer() {
  const browser = await tryCatch<Browser>(
    puppeteer.launch({
      executablePath:
        "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
      headless: false,
    })
  );

  if (!browser.data) return console.info(browser.error.message);

  const page = await tryCatch<Page>(browser.data.newPage());

  if (!page.data) return console.info(page.error.message);

  // await page.data.goto("http://example.com");

  await browser.data.close();
}

launchPuppeteer();
