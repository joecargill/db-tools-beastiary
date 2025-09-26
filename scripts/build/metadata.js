import fs from "fs";
import path from "path";

export function getCreatureMetadata() {
  const creaturesDir = path.resolve("creatures");
  const metadata = [];

  ["monster", "npc"].forEach((type) => {
    const typeDir = path.join(creaturesDir, type);
    if (!fs.existsSync(typeDir)) return;

    const files = fs.readdirSync(typeDir, { withFileTypes: true });
    files.forEach((file) => {
      if (!file.name.endsWith(".json")) return;

      const data = JSON.parse(fs.readFileSync(path.join(typeDir, file.name), "utf-8"));
      metadata.push({
        type,
        name: data.name,
        path: `/${type}/${file.name.replace(/\.json$/, "")}`,
      });
    });
  });

  return metadata;
}
