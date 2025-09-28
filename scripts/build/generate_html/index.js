import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import { getCreatureMetadata } from "../metadata.js";

export default function buildIndexPage() {
  process.stdout.write("Generating Index HTML");
  const publicDir = path.resolve("public");
  const templateSource = fs.readFileSync(path.resolve("templates/index.html"), "utf-8");

  const template = Handlebars.compile(templateSource);
  const metadata = getCreatureMetadata();

  // Sort alphabetically by name
  metadata.sort((a, b) => a.name.localeCompare(b.name));

  // Group by first letter
  const grouped = {};
  metadata.forEach((creature) => {
    const letter = creature.name[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(creature);
    process.stdout.write(".");
  });

  const html = template({ grouped });

  fs.writeFileSync(path.join(publicDir, "index.html"), html);
  console.log("✅");
}
