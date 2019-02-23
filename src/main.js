import makeFilter from './make-filter.js';
import makeTask from './make-task.js';

const mainFilterElement = document.querySelector(`.main__filter`);
const boardTasksElement = document.querySelector(`.board__tasks`);
const maxTasks = 30;

const getRandom = (count) => Math.floor(count * Math.random());

const renderTemplate = (template = ``) => {
  const templateElement = document.createElement(`template`);
  templateElement.innerHTML = template;
  return templateElement.content;
};

const renderTasks = (count) => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    fragment.appendChild(renderTemplate(makeTask()));
  }
  boardTasksElement.innerHTML = ``;
  boardTasksElement.appendChild(fragment);
};

const filtersData = [
  {name: `All`, count: 15},
  {name: `Overdue`, count: 2},
  {name: `Today`, count: 3},
  {name: `Favorites`, count: 1},
  {name: `Repeating`, count: 5},
  {name: `Tags`, count: 1},
  {name: `Archive`, count: 3},
];

const createCountfiltersData = (data) => {
  data.forEach((filter) => {
    filter.count = getRandom(maxTasks);
  });
};

createCountfiltersData(filtersData);

const renderFilter = (data) => {
  const id = data.name.toLocaleLowerCase();

  const fragment = renderTemplate(makeFilter(id, data.id, data.count));
  const input = fragment.querySelector(`input`);
  input.addEventListener(`change`, () => renderTasks(data.count));
  return fragment;
};

const renderFilters = (data) => {
  const fragment = document.createDocumentFragment();
  data.forEach((filter) => fragment.appendChild(renderFilter(filter)));
  mainFilterElement.innerHTML = ``;
  mainFilterElement.appendChild(fragment);
};

renderFilters(filtersData);
