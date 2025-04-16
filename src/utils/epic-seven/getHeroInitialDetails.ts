import type { Heroes } from "../schemas/Heroes";

export default function getHeroInitialDetails(li: HTMLLIElement) {
  const link = li.querySelector("a")?.getAttribute("href");
  const imageSource = li.querySelector("img.hero-avatar")?.getAttribute("src");
  const name = li.querySelector("h3")?.innerText;
  return { link, imageSource, name } as Omit<Heroes, "stats">;
}
