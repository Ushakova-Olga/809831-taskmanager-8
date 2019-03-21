export const colors = [`black`, `yellow`, `blue`, `green`, `pink`];

export const months = [`January`, `February`, `Marth`, `April`, `May`, `June`,
  `July`, `August`, `September`, `October`, `November`, `December`];

export function createElement(template) {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
}

// Возвращает массив из 2-х элементов
export function createElements(template) {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return [newElement.firstElementChild, newElement.lastElementChild];
}
