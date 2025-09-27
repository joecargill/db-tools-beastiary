import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { globSync } from "glob";
import Handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function buildCreaturePages() {
  const rootDir = path.resolve(__dirname, "../../../creatures");
  const publicDir = path.resolve(__dirname, "../../../public");
  const templatesDir = path.resolve(__dirname, "../../../templates");

  // Load and compile the parent creature layout
  const creatureLayoutSource = fs.readFileSync(path.join(templatesDir, "creature.html"), "utf-8");
  const creatureLayout = Handlebars.compile(creatureLayoutSource);

  // Remove old creature files
  ["monster", "npc"].forEach((type) => {
    const typeDir = path.join(publicDir, type);
    if (fs.existsSync(typeDir)) {
      fs.rmSync(typeDir, { recursive: true, force: true });
    }
  });

  ["monster", "npc"].forEach((type) => {
    const templatePath = path.join(templatesDir, `${type}.html`);
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateSource);

    const files = globSync(`${type}/*.json`, { cwd: rootDir });

    files.forEach((file) => {
      const filePath = path.join(rootDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      const name = path.basename(file, ".json");
      const creatureDir = path.join(publicDir, type, name);
      fs.mkdirSync(creatureDir, { recursive: true });

      // Render the inner template (monster.html or npc.html)
      const innerHtml = template(data);

      // Wrap with creature.html layout
      const finalHtml = creatureLayout({ content: innerHtml, name: data.name, type });

      fs.writeFileSync(path.join(creatureDir, "index.html"), finalHtml);
      console.log(`✅ Generated ${type} HTML: ${name}`);
    });
  });
}
