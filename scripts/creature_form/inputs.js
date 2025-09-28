export function createInput(field, onChange) {
  const wrapper = document.createElement("div");
  wrapper.className = "field";

  const label = document.createElement("label");
  label.textContent = field.name;
  wrapper.appendChild(label);

  let input;

  if (field.type === "text" || field.type === "number") {
    input = document.createElement("input");
    input.type = field.type;
  } else if (field.type === "textarea") {
    input = document.createElement("textarea");
  } else if (field.type === "select") {
    input = document.createElement("select");
    field.options.forEach((opt) => {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      input.appendChild(o);
    });
  } else if (field.type === "array") {
    input = createArrayInput(field, onChange);
  }

  if (input && field.type !== "array") {
    input.addEventListener("input", () => onChange(field.name, input.value));
    wrapper.appendChild(input);
  } else if (field.type === "array") {
    wrapper.appendChild(input);
  }

  return wrapper;
}

function createArrayInput(field, onChange) {
  const container = document.createElement("div");
  const list = document.createElement("div");
  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.textContent = `Add ${field.name}`;
  container.appendChild(list);
  container.appendChild(addBtn);

  const values = [];

  function addItem(initialValue = field.itemType ? "" : {}) {
    const itemWrapper = document.createElement("div");
    itemWrapper.className = "array-item";

    const valueRef = initialValue;
    values.push(valueRef);

    if (field.itemType) {
      const input = document.createElement("input");
      input.type = field.itemType === "number" ? "number" : "text";
      input.value = valueRef;
      input.addEventListener("input", () => {
        const idx = values.indexOf(valueRef);
        if (idx > -1) values[idx] = input.value;
        onChange(field.name, values);
      });
      itemWrapper.appendChild(input);
    } else if (field.fields) {
      field.fields.forEach((subField) => {
        const subInput = createInput(subField, (name, val) => {
          valueRef[name] = val;
          onChange(field.name, values);
        });
        itemWrapper.appendChild(subInput);
      });
    }

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      const idx = values.indexOf(valueRef);
      if (idx > -1) values.splice(idx, 1);
      itemWrapper.remove();
      onChange(field.name, values);
    });
    itemWrapper.appendChild(removeBtn);

    list.appendChild(itemWrapper);
    onChange(field.name, values);
  }

  addBtn.addEventListener("click", () => addItem());
  return container;
}

