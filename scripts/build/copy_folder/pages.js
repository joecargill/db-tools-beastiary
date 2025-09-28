import path from "path";

import copyFolder from "../copy_folder.js";

export default function copyPages() {
  process.stdout.write("Copying HTML Pages");
  const pagesDir = path.resolve("pages");
  const publicDir = path.resolve("public");
  copyFolder(pagesDir, publicDir);
  console.log("✅");
}
