export function updateOutput(container, data) {
  container.textContent = JSON.stringify(data, null, 2);
}
