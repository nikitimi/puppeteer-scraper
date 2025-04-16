import type { Stats } from "../schemas/Stats";

export default function getBaseStats(ul: HTMLUListElement) {
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
}
