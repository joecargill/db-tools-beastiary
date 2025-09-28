import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { globSync } from "glob";
import Handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load spell references and sources once
const spellRefsPath = path.resolve(__dirname, "../../../references/spells.json");
const spellReferences = JSON.parse(fs.readFileSync(spellRefsPath, "utf-8"));

const sourcesPath = path.resolve(__dirname, "../../../references/sources.json");
const sources = JSON.parse(fs.readFileSync(sourcesPath, "utf-8"));
const validSpells = new Set(Object.keys(spellReferences));

export default function buildCreaturePages() {
  process.stdout.write("Generating Creature HTML");
  const rootDir = path.resolve(__dirname, "../../../creatures");
  const publicDir = path.resolve(__dirname, "../../../public");
  const templatesDir = path.resolve(__dirname, "../../../templates");

  // Load and compile the parent creature layout
  const creatureLayoutSource = fs.readFileSync(
    path.join(templatesDir, "creature.html"),
    "utf-8"
  );
  const creatureLayout = Handlebars.compile(creatureLayoutSource);

  // Remove old creature files
  ["monster", "npc"].forEach((type) => {
    const typeDir = path.join(publicDir, type);
    if (fs.existsSync(typeDir)) fs.rmSync(typeDir, { recursive: true, force: true });
  });

  ["monster", "npc"].forEach((type) => {
    const templatePath = path.join(templatesDir, `${type}.html`);
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateSource);

    const files = globSync(`${type}/*.json`, { cwd: rootDir });

    files.forEach((file) => {
      const filePath = path.join(rootDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      // Link spell references for NPCs
      if (data.type === "NPC" && Array.isArray(data.spells)) {
        data.spells = linkSpells(data.spells);
      }

      const name = path.basename(file, ".json");
      const creatureDir = path.join(publicDir, type, name);
      fs.mkdirSync(creatureDir, { recursive: true });

      // Render inner template (npc.html or monster.html)
      const innerHtml = template(data);

      // Wrap with creature.html layout
      const finalHtml = creatureLayout({ content: innerHtml, name: data.name, type });

      fs.writeFileSync(path.join(creatureDir, "index.html"), finalHtml);
      process.stdout.write(".");
    });
  });

  console.log("✅");
}

/**
 * Converts an array of spell names into HTML strings with linked references.
 */
 function linkSpells(spells) {
  if (!Array.isArray(spells)) return spells;

  return spells.map((spellName) => {
    if (!validSpells.has(spellName)) return spellName;

    const ref = spellReferences[spellName];
    let linkedRef = ref;

    Object.entries(sources).forEach(([abbr, url]) => {
      linkedRef = `<a class="link-source" href="${url}" target="_blank">[${linkedRef}]</a>`
    });

    return `${spellName} ${linkedRef}`;
  });
}
