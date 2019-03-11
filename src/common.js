export const colors = [`black`, `yellow`, `blue`, `green`, `pink`];

export const months = [`January`, `February`, `Marth`, `April`, `May`, `June`,
  `July`, `August`, `September`, `October`, `November`, `December`];

export function createElement(template) {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
}
