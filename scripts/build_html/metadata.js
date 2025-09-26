import fs from "fs";
import path from "path";

const CREATURES_DIR = path.join("creatures");
const PUBLIC_DIR = path.join("public");
const METADATA_PATH = path.join(PUBLIC_DIR, "metadata.json");

// Load JSON files recursively and build metadata
function loadJsonFilesRecursively(dir, typeLabel) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const items = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      items.push(...loadJsonFilesRecursively(fullPath, typeLabel));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      const data = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
      items.push({
        type: typeLabel,
        name: data.name,
        tags: data.tags ?? [],
        path: `/${typeLabel}/${entry.name.replace(".json", "")}`
      });
    }
  }

  return items.sort((a, b) => a.name.localeCompare(b.name));
}

// Build full metadata
export function buildCreatureMetadata() {
  const monsters = loadJsonFilesRecursively(path.join(CREATURES_DIR, "monster"), "monster");
  const npcs = loadJsonFilesRecursively(path.join(CREATURES_DIR, "npc"), "npc");
  return { monsters, npcs };
}

// Write metadata.json
export function generateMetadataFile() {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  const metadata = buildCreatureMetadata();
  fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2));
  console.log("✅ metadata.json generated!");
}
