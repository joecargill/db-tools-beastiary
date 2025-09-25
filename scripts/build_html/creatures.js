import fs from "fs";
import path from "path";
import { globSync } from "glob";

export default function buildCreaturePages() {
  const creatureMetadata = [];

  const rootDir = path.resolve(new URL("../../creatures", import.meta.url).pathname);
  const publicDir = path.resolve(new URL("../../public", import.meta.url).pathname);

  ["monster", "npc"].forEach(type => {
    const typeJsonDir = path.join(rootDir, type);
    const typePublicDir = path.join(publicDir, type);

    const files = globSync("**/*.json", { cwd: typeJsonDir });
    const validDirs = files.map(file => path.join(typePublicDir, path.dirname(file), path.basename(file, ".json")));

    if (fs.existsSync(typePublicDir)) {
      const existingHtmlDirs = getAllHtmlDirs(typePublicDir);
      const toRemove = existingHtmlDirs.filter(d => !validDirs.includes(d));
      toRemove.forEach(d => {
        fs.rmSync(d, { recursive: true, force: true });
        console.log(`🗑 Removed outdated HTML folder: ${d}`);
      });
    }

    files.forEach(file => {
      const filePath = path.join(typeJsonDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      const relativeDir = path.dirname(file);
      const name = path.basename(file, ".json");
      const creatureDir = path.join(typePublicDir, relativeDir, name);

      fs.mkdirSync(creatureDir, { recursive: true });
      fs.writeFileSync(path.join(creatureDir, "index.html"), renderCreatureHTML(data, type));

      creatureMetadata.push({
        name: data.name,
        type,
        tags: data.tags ?? [],
        path: `/${type}/${relativeDir !== "." ? relativeDir + "/" : ""}${name}`
      });

      console.log(`✅ Generated ${type} HTML: ${data.name}`);
    });
  });

  return creatureMetadata;
}

/** Main renderer, delegates to type-specific function */
function renderCreatureHTML(creature, type) {
  if (type === "monster") return renderMonsterHTML(creature);
  if (type === "npc") return renderNpcHTML(creature);
  return `<pre>${JSON.stringify(creature, null, 2)}</pre>`;
}

/** Render Monster HTML */
function renderMonsterHTML(monster) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${monster.name} (Monster)</title>
</head>
<body>
  <h1>${monster.name} (Monster)</h1>

  <h2>Stats</h2>
  <ul>
    <li><strong>Size:</strong> ${monster.size}</li>
    <li><strong>Movement:</strong> ${monster.movement}</li>
    <li><strong>Armor:</strong> ${monster.armor}</li>
    <li><strong>HP:</strong> ${monster.hp}</li>
    ${monster.wp !== undefined ? `<li><strong>WP:</strong> ${monster.wp}</li>` : ""}
    ${monster.resistance ? `<li><strong>Resistance:</strong> ${monster.resistance}</li>` : ""}
    ${monster.immunity ? `<li><strong>Immunity:</strong> ${monster.immunity}</li>` : ""}
    ${monster.weakness ? `<li><strong>Weakness:</strong> ${monster.weakness}</li>` : ""}
  </ul>

  ${monster.skills?.length ? `<h2>Skills</h2>
  <ul>
    ${monster.skills.map(s => `<li>${s.name} ${s.level}</li>`).join("\n")}
  </ul>` : ""}

  ${monster.effects?.length ? `<h2>Effects</h2>
  <ul>
    ${monster.effects.map(e => `<li><strong>${e.name}:</strong> ${e.description}</li>`).join("\n")}
  </ul>` : ""}

  ${monster.tags?.length ? `<h2>Tags</h2>
  <ul>
    ${monster.tags.map(t => `<li>${t}</li>`).join("\n")}
  </ul>` : ""}

</body>
</html>`;
}

/** Render NPC HTML */
function renderNpcHTML(npc) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${npc.name} (NPC)</title>
</head>
<body>
  <h1>${npc.name} (NPC)</h1>

  <h2>Stats</h2>
  <ul>
    <li><strong>Size:</strong> ${npc.size}</li>
    <li><strong>Movement:</strong> ${npc.movement}</li>
    ${npc.armors?.length ? `<li><strong>Armor Items:</strong>
      <ul>
        ${npc.armors.map(a => `<li>${a.name} (Rating: ${a.rating})</li>`).join("\n")}
      </ul>
    </li>` : ""}
    <li><strong>HP:</strong> ${npc.hp}</li>
    ${npc.wp !== undefined ? `<li><strong>WP:</strong> ${npc.wp}</li>` : ""}
    ${npc.damage_bonus ? `<li><strong>Damage Bonus:</strong> ${npc.damage_bonus}</li>` : ""}
    ${npc.resistance ? `<li><strong>Resistance:</strong> ${npc.resistance}</li>` : ""}
    ${npc.immunity ? `<li><strong>Immunity:</strong> ${npc.immunity}</li>` : ""}
    ${npc.weakness ? `<li><strong>Weakness:</strong> ${npc.weakness}</li>` : ""}
  </ul>

  ${npc.skills?.length ? `<h2>Skills</h2>
  <ul>
    ${npc.skills.map(s => `<li>${s.name} ${s.level}</li>`).join("\n")}
  </ul>` : ""}

  ${npc.spells?.length ? `<h2>Spells</h2>
  <ul>
    ${npc.spells.map(s => `<li>${s}</li>`).join("\n")}
  </ul>` : ""}

  ${npc.abilities?.length ? `<h2>Abilities</h2>
  <ul>
    ${npc.abilities.map(a => `<li>${a}</li>`).join("\n")}
  </ul>` : ""}

  ${npc.weapons?.length ? `<h2>Weapons</h2>
  <ul>
    ${npc.weapons.map(w => `<li>${w.name} (Level ${w.level}, Damage: ${w.damage}, Durability: ${w.durability})</li>`).join("\n")}
  </ul>` : ""}

  ${npc.effects?.length ? `<h2>Effects</h2>
  <ul>
    ${npc.effects.map(e => `<li><strong>${e.name}:</strong> ${e.description}</li>`).join("\n")}
  </ul>` : ""}

  ${npc.tags?.length ? `<h2>Tags</h2>
  <ul>
    ${npc.tags.map(t => `<li>${t}</li>`).join("\n")}
  </ul>` : ""}

</body>
</html>`;
}

/** Helper: recursively get all folders containing index.html */
function getAllHtmlDirs(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    const fullPath = path.join(dir, d.name);
    if (d.isDirectory()) return getAllHtmlDirs(fullPath);
    if (d.isFile() && d.name === "index.html") return [dir];
    return [];
  });
}
