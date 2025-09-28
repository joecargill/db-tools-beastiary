import generateHTML from "./build/generate_html.js";
import copyAssets from "./build/assets.js";

export default function build() {
  copyAssets();
  generateHTML();
  console.log("🎉 Build complete!");
}

// Run if executed directly
if (process.argv[1].endsWith("build.js")) {
  build();
}
