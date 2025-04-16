import type { Heroes } from "./utils/schemas/Heroes.js";

import puppeteer, { type LaunchOptions } from "puppeteer-core";
import getBaseStats from "./utils/epic-seven/getBaseStats.js";
import getHeroInitialDetails from "./utils/epic-seven/getHeroInitialDetails.js";
import saveData from "./utils/saveData.js";
import { tryCatch } from "./utils/tryCatch.js";

const heroes: Heroes[] = [];

/** Get image, name, and base stats of Epic Seven heroes. */
async function getHeroesData() {
  const puppeteerOptions = {
    executablePath:
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    // headless: false,
  } satisfies LaunchOptions;

  const browser = await tryCatch(puppeteer.launch(puppeteerOptions));
  if (!browser.data) return console.info(browser.error.message);

  const page = await tryCatch(browser.data.newPage());
  if (!page.data) return console.info(page.error.message);

  await page.data.goto("https://epic7db.com/heroes");

  const liNode = await tryCatch(
    // page.data.$$eval("li.hero", (ul) => ul) // Uncomment to target all hero list.
    page.data.$("li.hero")
  );

  if (!liNode.data) return console.info(liNode.error?.message);
  const heroList = await tryCatch(liNode.data.evaluate(getHeroInitialDetails));

  if (!heroList.data) console.info(heroList.error.message);

  for (const currentHero of [heroList.data]) {
    if (!currentHero) continue;
    const heroSearchResult = heroes.find(
      ({ link }) => link === currentHero?.link
    );
    // Skip if hero exists in the array.
    if (heroSearchResult) continue;

    if (!currentHero.link) continue;
    await tryCatch(page.data.goto(currentHero.link));

    const stats = await tryCatch(page.data.$eval("ul.stats", getBaseStats));

    if (!stats.data) {
      console.info(stats.error?.message);
      continue;
    }
    heroes.push({ ...currentHero, stats: stats.data });
    console.log("Successfully logged the hero's stats.");
  }

  await saveData("heroes.json", heroes);
  await browser.data.close();
}

getHeroesData();
