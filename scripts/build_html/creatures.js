import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { globSync } from "glob";
import Mustache from "mustache";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "../../creatures");
const PUBLIC_DIR = path.resolve(__dirname, "../../public");
const LAYOUT_TEMPLATE = fs.readFileSync(
  path.resolve(__dirname, "../../templates/creature.html"),
  "utf-8"
);

export default function buildCreaturePages() {
  ["monster", "npc"].forEach((type) => buildTypePages(type));
}

function buildTypePages(type) {
  const typeTemplate = loadTypeTemplate(type);
  const creatureFiles = getCreatureFiles(type);
  const validNames = creatureFiles.map(file => path.basename(file, ".json"));

  cleanOldPublicFiles(type, validNames);

  creatureFiles.forEach((file) => {
    const creatureData = loadCreatureData(file);
    generateCreatureHtml(creatureData, type, typeTemplate);
  });

  console.log(`🎉 Finished building ${type} pages`);
}

// --------------------------- Helpers ---------------------------

function loadTypeTemplate(type) {
  const templatePath = path.resolve(__dirname, `../../templates/${type}.html`);
  return fs.readFileSync(templatePath, "utf-8");
}

function getCreatureFiles(type) {
  return globSync(`${type}/**/*.json`, { cwd: ROOT_DIR });
}

function cleanOldPublicFiles(type, validNames) {
  const typePublicDir = path.join(PUBLIC_DIR, type);
  if (!fs.existsSync(typePublicDir)) return;

  const existingDirs = fs.readdirSync(typePublicDir);
  existingDirs.forEach((dir) => {
    if (!validNames.includes(dir)) {
      fs.rmSync(path.join(typePublicDir, dir), { recursive: true, force: true });
      console.log(`🗑️  Removed old ${type} HTML: ${dir}`);
    }
  });
}

function loadCreatureData(file) {
  const filePath = path.join(ROOT_DIR, file);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function generateCreatureHtml(data, type, typeTemplate) {
  const name = data.name;
  const creatureDir = path.join(PUBLIC_DIR, type, name);
  fs.mkdirSync(creatureDir, { recursive: true });

  const body = Mustache.render(typeTemplate, data);
  const html = Mustache.render(LAYOUT_TEMPLATE, {
    body,
    name: data.name,
    type: type.charAt(0).toUpperCase() + type.slice(1),
  });

  fs.writeFileSync(path.join(creatureDir, "index.html"), html);
  console.log(`✅ Generated ${type} HTML: ${name}`);
}
