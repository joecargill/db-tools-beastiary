import buildCreaturePages from "./generate_html/creatures.js";
import buildIndexPage from "./generate_html/index.js";

export default function generateHTML() {
  buildCreaturePages();
  
  buildIndexPage();
}
