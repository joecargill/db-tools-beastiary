import { schemaFields } from "./schema_fields.js";
import { createInput } from "./inputs.js";

export function buildForm(onChange) {
  const form = document.createElement("form");

  schemaFields.forEach((field) => {
    const input = createInput(field, onChange);
    form.appendChild(input);
  });

  return form;
}
