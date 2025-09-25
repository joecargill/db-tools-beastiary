import fs from "fs";
import path from "path";

export default function buildIndex(creatureMetadata) {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dragonbane Bestiary</title>
  <style>
    body { font-family: sans-serif; padding: 1rem; max-width: 800px; margin: auto; }
    h1, h2 { margin-top: 1.5rem; }
    ul { list-style: disc; margin-left: 2rem; }
  </style>
</head>
<body>
  <h1>Dragonbane Bestiary</h1>

  <h2>Monsters</h2>
  <ul>
    ${creatureMetadata
      .filter(c => c.type === "monster")
      .map(c => `<li><a href="${c.path}">${c.name}</a> (Tags: ${c.tags.join(", ") || "None"})</li>`)
      .join("")}
  </ul>

  <h2>NPCs</h2>
  <ul>
    ${creatureMetadata
      .filter(c => c.type === "npc")
      .map(c => `<li><a href="${c.path}">${c.name}</a> (Tags: ${c.tags.join(", ") || "None"})</li>`)
      .join("")}
  </ul>
</body>
</html>`;

  // Correct path resolution for ES modules
  const outputFile = path.resolve(new URL("../../public/index.html", import.meta.url).pathname);

  // Ensure parent folder exists
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });

  // Write the index file
  fs.writeFileSync(outputFile, indexHtml);
  console.log("🎉 Main index.html generated!");
}
