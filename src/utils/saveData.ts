import fs from "node:fs/promises";
import { outputDirectory } from "./constants";
import { tryCatch } from "./tryCatch";

export default async function saveData<T>(filename: string, data: T) {
  while (true) {
    const writeFile = await tryCatch(
      fs.writeFile(new URL(filename, outputDirectory), JSON.stringify(data))
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
}
