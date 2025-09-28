import path from "path";

import copyFolder from "../copy_folder.js";

export default function copyScripts() {
  process.stdout.write("Copying Scripts");
  const scriptsDir = path.resolve("scripts/creature_form");
  const publicDir = path.resolve("public/scripts/creature_form");
  copyFolder(scriptsDir, publicDir);
  console.log("✅");
}
