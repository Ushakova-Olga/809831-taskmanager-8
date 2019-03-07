import makeFilter from './make-filter.js';
import makeData from './data.js';
import task from './task.js';
import taskEdit from './task-edit.js';

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
  boardTasksElement.innerHTML = ``;

  for (let i = 0; i < count; i++) {
    const taskComponent = task(makeData(i));
    const editTaskComponent = taskEdit(makeData(i));
    boardTasksElement.appendChild(taskComponent.render());
    taskComponent.onEdit = () => {
      editTaskComponent.render();
      boardTasksElement.replaceChild(editTaskComponent.element, taskComponent.element);
      taskComponent.unrender();
    };

    editTaskComponent.onSubmit = () => {
      taskComponent.render();
      boardTasksElement.replaceChild(taskComponent.element, editTaskComponent.element);
      editTaskComponent.unrender();
    };
  }
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

  const fragment = renderTemplate(makeFilter(id, data.name, data.count));
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
