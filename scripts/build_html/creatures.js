import fs from "fs";
import path from "path";
import * as glob from "glob";

export default function buildCreaturePages() {
  const creatureMetadata = [];

  // Root creatures directory
  const rootDir = path.resolve(new URL("../../../creatures", import.meta.url).pathname);
  // Public output directory
  const publicDir = path.resolve(new URL("../../../public", import.meta.url).pathname);

  ["monster", "npc"].forEach(type => {
    const files = glob.sync(`${type}/**/*.json`, { cwd: rootDir });

    files.forEach(file => {
      const filePath = path.join(rootDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      const name = path.basename(file, ".json");
      const creatureDir = path.join(publicDir, type, name);

      // Ensure directory exists
      fs.mkdirSync(creatureDir, { recursive: true });

      // Render and write HTML
      const html = renderCreatureHTML(data, type);
      fs.writeFileSync(path.join(creatureDir, "index.html"), html);

      creatureMetadata.push({ name: data.name, type, tags: data.tags ?? [], path: `/${type}/${name}` });
      console.log(`✅ Generated ${type} HTML: ${name}`);
    });
  });

  return creatureMetadata;
}

function renderCreatureHTML(creature, type) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${creature.name} (${type})</title>
</head>
<body>
  <h1>${creature.name} (${type})</h1>
  <pre>${JSON.stringify(creature, null, 2)}</pre>
</body>
</html>`;
}
