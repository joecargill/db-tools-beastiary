import fs from "fs";
import path from "path";
import Ajv from "ajv";
import { creatureKeyOrder } from "../format/rules.js";

// Load schema
const schema = JSON.parse(fs.readFileSync(path.resolve("schemas/creature.schema.json"), "utf-8"));
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

// Load spell references
const spellRefsPath = path.resolve("references/spells.json");
const spellReferences = JSON.parse(fs.readFileSync(spellRefsPath, "utf-8"));
const validSpells = new Set(Object.keys(spellReferences));

export default function validateCreatures() {
  let failed = false;
  let formatFailed = false;

  ["monster", "npc"].forEach((type) => {
    const typeDir = path.join("creatures", type);
    if (!fs.existsSync(typeDir)) return;

    fs.readdirSync(typeDir).forEach((file) => {
      if (!file.endsWith(".json")) return;

      const filePath = path.join(typeDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      // Schema validation
      const validSchema = validate(data);
      if (!validSchema) {
        console.error(`❌ ${file} failed schema validation:`, validate.errors);
        failed = true;
      }

      // Spell validation for NPCs
      if (data.type === "NPC" && Array.isArray(data.spells)) {
        data.spells.forEach((spell) => {
          if (!validSpells.has(spell)) {
            console.error(`❌ ${file} has invalid spell: "${spell}"`);
            failed = true;
          }
        });
      }

      // Format validation
      const canonical = {};
      creatureKeyOrder.forEach((key) => {
        if (key in data) canonical[key] = data[key];
      });

      const actualJson = JSON.stringify(data, Object.keys(data));
      const expectedJson = JSON.stringify(canonical, Object.keys(canonical));
      if (actualJson !== expectedJson) {
        formatFailed = true;
        failed = true;
      }

      if (validSchema && !formatFailed) {
        console.log(`✅ ${file} passed validation`);
      }
    });
  });

  if (formatFailed) {
    console.error("❌ Some JSON files are not correctly formatted. Please run `npm run format`.");
  }

  if (failed) {
    console.error("❌ One or more creatures failed validation.");
    process.exit(1);
  } else {
    console.log("✅ All creatures are valid");
  }
}
