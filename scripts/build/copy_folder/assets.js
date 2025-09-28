import path from "path";

import copyFolder from "../copy_folder.js";

export default function copyAssets() {
  process.stdout.write("Copying Assets");
  const assetsDir = path.resolve("assets");
  const publicDir = path.resolve("public");
  copyFolder(assetsDir, publicDir);
  console.log("✅");
}
