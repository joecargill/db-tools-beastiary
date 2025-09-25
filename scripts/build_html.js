import buildCreaturePages from "./build_html/creatures.js";
import buildIndex from "./build_html/index.js";

const metadata = buildCreaturePages();
buildIndex(metadata);
