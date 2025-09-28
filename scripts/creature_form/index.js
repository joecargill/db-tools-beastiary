import { buildForm } from "./form.js";
import { updateOutput } from "./output.js";

document.addEventListener("DOMContentLoaded", () => {
  const formContainer = document.getElementById("creature-form-container");
  const outputContainer = document.getElementById("creature-json-output");

  let data = {};

  function handleChange(name, value) {
    data[name] = value;
    updateOutput(outputContainer, data);
  }

  const form = buildForm(handleChange);
  formContainer.appendChild(form);
});
