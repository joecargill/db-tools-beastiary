import fs from "fs";
import path from "path";
import Ajv from "ajv";

const schema = JSON.parse(fs.readFileSync(path.resolve("schemas/creature.schema.json"), "utf-8"));
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

export default function validateCreatures() {
  ["monster", "npc"].forEach((type) => {
    const typeDir = path.join("creatures", type);
    if (!fs.existsSync(typeDir)) return;

    fs.readdirSync(typeDir).forEach((file) => {
      if (!file.endsWith(".json")) return;
      const data = JSON.parse(fs.readFileSync(path.join(typeDir, file), "utf-8"));
      const valid = validate(data);
      if (!valid) console.error(`❌ ${file} failed validation`, validate.errors);
      else console.log(`✅ ${file} is valid`);
    });
  });
}
