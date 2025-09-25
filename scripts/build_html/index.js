import fs from "fs";
import path from "path";
import buildCreaturePages from "./creatures.js";

export default function buildIndex() {
  const publicDir = path.resolve(new URL("../../public", import.meta.url).pathname);

  // Get metadata for all current creatures
  const creatures = buildCreaturePages();

  // Group by type -> then by subdirectory
  const grouped = {};
  creatures.forEach(c => {
    const type = c.type; // monster or npc
    const parts = c.path.split("/").slice(2); // remove leading /type/
    const subdir = parts.length > 1 ? parts.slice(0, -1).join("/") : "";
    grouped[type] ??= {};
    grouped[type][subdir] ??= [];
    grouped[type][subdir].push(c);
  });

  // Generate HTML
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dragonbane Bestiary</title>
</head>
<body>
  <h1>Dragonbane Bestiary</h1>
`;

  Object.entries(grouped).forEach(([type, subdirs]) => {
    html += `<h2>${capitalize(type)}</h2>\n`;

    Object.entries(subdirs).forEach(([subdir, items]) => {
      if (subdir) html += `<h3>${capitalize(subdir)}</h3>\n`;
      html += "<ul>\n";
      items.forEach(c => {
        html += `  <li><a href="${c.path}">${c.name}</a></li>\n`;
      });
      html += "</ul>\n";
    });
  });

  html += `
</body>
</html>`;

  fs.writeFileSync(path.join(publicDir, "index.html"), html);
  console.log("🎉 Main index.html generated with nested subheadings!");
}

function capitalize(str) {
  return str
    .split("_")
    .map(s => s[0].toUpperCase() + s.slice(1))
    .join(" ");
}
