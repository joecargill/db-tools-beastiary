import buildCreaturePages from "./build_html/creatures.js";
import buildIndexPage from "./build_html/index.js";

console.log("🔨 Building creature pages...");
buildCreaturePages();

console.log("🔨 Building main index page...");
buildIndexPage();

console.log("🎉 Build complete!");
