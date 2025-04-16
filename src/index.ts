import puppeteer, {
  type Page,
  type Browser,
  ElementHandle,
} from "puppeteer-core";
import { tryCatch } from "./utils/tryCatch.js";
import fs from "node:fs/promises";

type Stats = {
  health: string;
  attack: string;
  defense: string;
  speed: string;
};
type Heroes = {
  link?: string | null;
  imageSource?: string | null;
  name: string | null;
  stats?: Stats;
};

const heroes: Heroes[] = [];

async function getHeroesData() {
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

  await page.data.goto("https://epic7db.com/heroes");

  const heroListNode = await tryCatch<ElementHandle<HTMLLIElement> | null>(
    // page.data.$$eval("li.hero", (ul) => ul)
    page.data.$("li.hero")
  );

  if (!heroListNode.data) return console.info(heroListNode.error?.message);

  const imageSourceAndName = await tryCatch(
    heroListNode.data.evaluate((li) => {
      const link = li.querySelector("a")?.getAttribute("href");
      const imageSource = li
        .querySelector("img.hero-avatar")
        ?.getAttribute("src");
      const name = li.querySelector("h3")?.innerText;
      return { link, imageSource, name } as Omit<Heroes, "stats">;
    })
  );

  if (!imageSourceAndName.data) console.info(imageSourceAndName.error.message);

  for (const instance of [imageSourceAndName.data]) {
    if (!instance) continue;
    const heroInstance = heroes.find(({ link }) => link === instance?.link);
    if (heroInstance) continue;

    if (!instance.link) continue;
    await tryCatch(page.data.goto(instance.link));

    const stats = await tryCatch(
      page.data.$eval("ul.stats", (ul) => {
        const listOfStats: [keyof Stats, string][] = [];
        for (const statList of ul.querySelectorAll("li")) {
          const statName = statList.querySelector("img")?.getAttribute("alt");
          const sNameLow = statName?.toLowerCase() as keyof Stats;
          const sanitizedValue = statList.innerText
            .trim()
            .replace(new RegExp(`${statName}: `), "");
          listOfStats.push([sNameLow, sanitizedValue]);
        }
        return Object.fromEntries(listOfStats) as Stats;
      })
    );

    if (!stats.data) {
      console.info(stats.error?.message);
      continue;
    }
    heroes.push({ ...instance, stats: stats.data });

    console.log("Successfully logged the hero's stats.");
  }

  while (true) {
    const outputDirectory = new URL("../output/", import.meta.url);
    const writeFile = await tryCatch(
      fs.writeFile(
        new URL("heroData.json", outputDirectory),
        JSON.stringify(heroes)
      )
    );

    if (!writeFile.error) break;
    const mkdir = await tryCatch(fs.mkdir(outputDirectory));
    if (mkdir.error) {
      console.error(mkdir.error.message);
      console.info(
        "Creating output directory failed, maybe this is due to the file creation permission."
      );
      break;
    }
  }

  await browser.data.close();
}

getHeroesData();
