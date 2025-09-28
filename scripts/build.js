import generateHTML from "./build/generate_html.js";
import copyAssets from "./build/copy_folder/assets.js";
import copyScripts from "./build/copy_folder/scripts.js";
import copyPages from "./build/copy_folder/pages.js";


export default function build() {
  // copy static resources to public
  copyAssets();
  copyScripts();
  copyPages();

  // generate HTML from JSON data
  generateHTML();

  console.log("🎉 Build complete!");
}

// Run if executed directly
if (process.argv[1].endsWith("build.js")) {
  build();
}
