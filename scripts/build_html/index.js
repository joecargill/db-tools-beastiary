import fs from "fs";
import path from "path";
import Mustache from "mustache";
import { generateMetadataFile, buildCreatureMetadata } from "./metadata.js";

const PUBLIC_DIR = path.join("public");
const TEMPLATE_PATH = path.join("templates/index.html");

// Build main index page
export default function buildIndexPage() {
  // Regenerate metadata
  generateMetadataFile();
  const metadata = buildCreatureMetadata();

  const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");
  const html = Mustache.render(template, metadata);

  fs.writeFileSync(path.join(PUBLIC_DIR, "index.html"), html);
  console.log("🎉 Main index.html generated!");
}
