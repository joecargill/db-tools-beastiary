import fs from "fs";
import path from "path";
import { creatureKeyOrder } from "./rules.js";

function reorderKeys(obj) {
  const reordered = {};
  for (const key of creatureKeyOrder) {
    if (obj[key] !== undefined) reordered[key] = obj[key];
  }
  return reordered;
}

function formatCreatures() {
  ["monster", "npc"].forEach((type) => {
    const dir = path.join("creatures", type);
    if (!fs.existsSync(dir)) return;

    fs.readdirSync(dir).forEach((file) => {
      if (!file.endsWith(".json")) return;

      const filePath = path.join(dir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      const formatted = reorderKeys(data);

      fs.writeFileSync(filePath, JSON.stringify(formatted, null, 2) + "\n", "utf-8");
      console.log(`✅ Formatted ${type}/${file}`);
    });
  });
}

export default formatCreatures;

// If run directly
if (process.argv[1].endsWith("creatures.js")) {
  formatCreatures();
}
