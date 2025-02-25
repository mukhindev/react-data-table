import { readdir, lstat, readFile, copyFile } from "node:fs/promises";
import { resolve, relative } from "node:path";

const transferableAssets = [".css", "module.css"];
const tsconfigJson = await readFile("./tsconfig.json");
const tsconfig = JSON.parse(tsconfigJson);

if (!tsconfig.compilerOptions.rootDir) {
  throw Error("tsconfig.json compilerOptions.rootDir not found");
}

if (!tsconfig.compilerOptions.outDir) {
  throw Error("tsconfig.json compilerOptions.outDir not found");
}

const rootDir = resolve(tsconfig.compilerOptions.rootDir);
const outDir = resolve(tsconfig.compilerOptions.outDir);

const transfer = async (dir) => {
  const src = await readdir(dir);

  for await (const file of src) {
    const path = resolve(dir, file);
    const fileStat = await lstat(path);

    if (fileStat.isDirectory()) {
      await transfer(path);
      continue;
    }

    if (transferableAssets.some((el) => file.endsWith(el))) {
      const relativePath = relative(rootDir, path);
      await copyFile(path, resolve(outDir, relativePath));
    }
  }
};

await transfer(rootDir);
