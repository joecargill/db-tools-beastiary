import fs from "fs";
import path from "path";
import Mustache from "mustache";
import { getCreatureMetadata } from "../metadata.js";

export default function buildIndexPage() {
  const publicDir = path.resolve("public");
  const template = fs.readFileSync(path.resolve("templates/index.html"), "utf-8");

  const metadata = getCreatureMetadata();

  const grouped = {
    monsters: metadata.filter((c) => c.type === "monster"),
    npcs: metadata.filter((c) => c.type === "npc"),
  };

  const html = Mustache.render(template, grouped);
  fs.writeFileSync(path.join(publicDir, "index.html"), html);
  console.log("✅ Main index.html generated!");
}
