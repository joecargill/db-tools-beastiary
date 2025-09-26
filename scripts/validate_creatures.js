import fs from "fs";
import path from "path";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { globSync } from "glob";

// Load schema
const schemaPath = new URL("../schemas/creature.schema.json", import.meta.url);
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));

// Initialize Ajv
const ajv = new Ajv();
addFormats(ajv);

const validate = ajv.compile(schema);

// Root creatures directory
const rootDir = path.resolve(new URL("../creatures", import.meta.url).pathname);

const creatureDirs = ["monster", "npc"];

let allValid = true;

for (const type of creatureDirs) {
  const files = globSync(`${type}/**/*.json`, { cwd: rootDir });
  for (const file of files) {
    const filePath = path.join(rootDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const valid = validate(data);
    if (!valid) {
      allValid = false;
      console.error(`❌ ${filePath} failed validation:`);
      console.error(validate.errors);
    } else {
      console.log(`✅ ${filePath} is valid`);
    }
  }
}

if (!allValid) {
  process.exit(1);
} else {
  console.log("All creature JSON files are valid!");
}
