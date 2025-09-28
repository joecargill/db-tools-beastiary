import fs from "fs";
import path from "path";

function copyFolder(srcDir, destDir) {
  
  if (!fs.existsSync(srcDir)) return;

  fs.mkdirSync(destDir, { recursive: true });

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) copyFolder(srcPath, destPath);
    else if (entry.isFile()) fs.copyFileSync(srcPath, destPath);
    process.stdout.write(".");
  }
  
}

export default function copyAssets() {
  process.stdout.write("Copying Assets");
  const assetsDir = path.resolve("assets");
  const publicDir = path.resolve("public");
  copyFolder(assetsDir, publicDir);
  console.log("✅");
}
