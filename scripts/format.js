// scripts/format.js
import formatCreatures from "./format/creatures.js";

function main() {
  process.stdout.write("Formatting JSON");

  formatCreatures();

  console.log("✅");
}

main();
