import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import { getCreatureMetadata } from "../metadata.js";

export default function buildIndexPage() {
  const publicDir = path.resolve("public");
  const templateSource = fs.readFileSync(path.resolve("templates/index.html"), "utf-8");

  // Compile the Handlebars template
  const template = Handlebars.compile(templateSource);

  const metadata = getCreatureMetadata();

  const grouped = {
    monsters: metadata.filter((c) => c.type === "monster"),
    npcs: metadata.filter((c) => c.type === "npc"),
  };

  // Render the template with grouped data
  const html = template(grouped);

  fs.writeFileSync(path.join(publicDir, "index.html"), html);
  console.log("✅ Main index.html generated!");
}
