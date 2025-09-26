import validateCreatures from "./validate/creatures.js";

export default function validateAll() {
  validateCreatures();
}

if (process.argv[1].endsWith("validate.js")) {
  validateAll();
}
