#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const glob = require("glob");

// Paths
const SCHEMA_PATH = path.resolve(__dirname, "../schemas/creature.schema.json");
const CREATURE_DIRS = [
  path.resolve(__dirname, "../creatures/monster"),
  path.resolve(__dirname, "../creatures/npc")
];

// Load schema
const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8"));

// Initialize Ajv
const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);

let hasErrors = false;

CREATURE_DIRS.forEach((dir) => {
  // Recursively find all JSON files
  const files = glob.sync(`${dir}/**/*.json`);

  files.forEach((file) => {
    try {
      const data = JSON.parse(fs.readFileSync(file, "utf8"));
      const valid = validate(data);

      if (!valid) {
        hasErrors = true;
        console.error(`\n❌ Validation errors in file: ${file}`);
        validate.errors.forEach((err) => {
          console.error(` - ${err.instancePath} ${err.message}`);
        });
      } else {
        console.log(`✅ ${file} is valid`);
      }
    } catch (err) {
      hasErrors = true;
      console.error(`\n❌ Failed to read or parse file: ${file}`);
      console.error(err.message);
    }
  });
});

if (hasErrors) {
  console.error("\nOne or more JSON files failed validation.");
  process.exit(1);
} else {
  console.log("\nAll creature JSON files are valid!");
}
