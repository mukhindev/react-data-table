import typescript from "@rollup/plugin-typescript";
import { copyFile } from "node:fs/promises";
import { dirname, resolve, basename } from "node:path";

const externalStyles = (options = {}) => {
  const { dir = "", styleFileExt = ["css", "scss"] } = options;

  if (!dir) {
    throw Error("ExternalStyles: dir is required");
  }

  return {
    name: "externalStyles",
    async resolveId(id, sourceFile) {
      if (styleFileExt.some((el) => id.endsWith(el))) {
        const sourceDir = dirname(sourceFile);
        const targetFile = resolve(sourceDir, id);

        await copyFile(targetFile, resolve(dir, basename(targetFile)));

        return { id, external: true };
      }
    },
  };
};

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "es",
  },
  plugins: [
    externalStyles({ dir: "dist" }),
    typescript({ declaration: true, declarationDir: "dist" }),
  ],
  external: ["react", "react-dom", "react/jsx-runtime"],
};
