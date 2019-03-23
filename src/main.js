import Task from './task.js';
import TaskEdit from './task-edit.js';
import Filter from './filter.js';
import moment from 'moment';
import flatpickr from 'flatpickr';
import {createTagChart, createColorChart} from './statistik.js';
import API from './api.js';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/task-manager`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const mainFilterElement = document.querySelector(`.main__filter`);
const boardTasksElement = document.querySelector(`.board__tasks`);
const controlStatisticElement = document.querySelector(`#control__statistic`);
const containerStatistic = document.querySelector(`.statistic`);
const containerTasks = document.querySelector(`.board`);
const statisticInput = containerStatistic.querySelector(`.statistic__period-input`);
const tagsCtxWrap = document.querySelector(`.statistic__tags-wrap`);
const colorsCtxWrap = document.querySelector(`.statistic__colors-wrap`);
const tagsCtx = document.querySelector(`.statistic__tags`);
const colorsCtx = document.querySelector(`.statistic__colors`);
const boardNoTasks = document.querySelector(`.board__no-tasks`);


const renderTasks = (tasks) => {
  boardTasksElement.innerHTML = ``;

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const taskComponent = new Task(task);
    const editTaskComponent = new TaskEdit(task);
    taskComponent.render();
    boardTasksElement.appendChild(taskComponent.element);

    taskComponent.onEdit = () => {
      editTaskComponent.render();
      boardTasksElement.replaceChild(
          editTaskComponent.element,
          taskComponent.element);
      taskComponent.unrender();
    };

    editTaskComponent.onSubmit = (newObject) => {
      editTaskComponent.element.querySelector(`.card__inner`).style.borderColor = `#000000`;
      task.tags = newObject.tags;
      task.color = newObject.color;
      task.repeatingDays = newObject.repeatingDays;
      task.dueDate = newObject.dueDate;

      const block = () => {
        editTaskComponent.element.querySelector(`.card__save`).disabled = true;
        editTaskComponent.element.querySelector(`.card__save`).innerHTML = `Saving...`;
        editTaskComponent.element.querySelector(`.card__text`).disabled = true;
      };

      const unblock = () => {
        editTaskComponent.element.querySelector(`.card__save`).disabled = false;
        editTaskComponent.element.querySelector(`.card__save`).innerHTML = `Save`;
        editTaskComponent.element.querySelector(`.card__text`).disabled = false;
      };

      block();

      api.updateTask({id: task.id, data: task.toRAW()})
      .then((response) => {
        if (response) {
          unblock();
          taskComponent.update(response);
          taskComponent.render();
          boardTasksElement.replaceChild(taskComponent.element, editTaskComponent.element);
          editTaskComponent.unrender();
        }
      }).catch(() => {
        editTaskComponent.shake();
        unblock();
      });
    };

    editTaskComponent.onDelete = ({id}) => {
      editTaskComponent.element.querySelector(`.card__inner`).style.borderColor = `#000000`;
      const block = () => {
        editTaskComponent.element.querySelector(`.card__delete`).disabled = true;
        editTaskComponent.element.querySelector(`.card__delete`).innerHTML = `Deleting...`;
        editTaskComponent.element.querySelector(`.card__text`).disabled = true;
      };

      const unblock = () => {
        editTaskComponent.element.querySelector(`.card__delete`).disabled = false;
        editTaskComponent.element.querySelector(`.card__delete`).innerHTML = `Delete`;
        editTaskComponent.element.querySelector(`.card__text`).disabled = false;
      };

      block();
      api.deleteTask({id})
        .then(() => api.getTasks())
        .then(renderTasks)
        .catch(() => {
          editTaskComponent.shake();
          unblock();
        });
    };
  }
};

const filtersData = [
  {id: 1, name: `All`, count: 5, checked: true},
  {id: 2, name: `Overdue`, count: 2, checked: false},
  {id: 3, name: `Today`, count: 3, checked: false},
  {id: 4, name: `Favorites`, count: 1, checked: false},
  {id: 5, name: `Repeating`, count: 5, checked: false},
  {id: 6, name: `Tags`, count: 1, checked: false},
  {id: 7, name: `Archive`, count: 3, checked: false},
];

const renderFilters = (data, tasks) => {
  mainFilterElement.innerHTML = ``;

  data.forEach((filter) => {
    const filterComponent = new Filter(filter);
    mainFilterElement.appendChild(filterComponent.render());

    filterComponent.onFilter = () => {
      containerStatistic.classList.add(`visually-hidden`);
      containerTasks.classList.remove(`visually-hidden`);
      switch (filterComponent._name) {
        case `All`:
          return renderTasks(tasks);

        case `Overdue`:
          return renderTasks(tasks.filter((it) => it.dueDate < Date.now()));

        case `Today`:
          return renderTasks(tasks.filter(() => true));

        case `Repeating`:
          return renderTasks(tasks.filter((it) => [...Object.entries(it.repeatingDays)]
              .some((rec) => rec[1])));
      }
      return renderTasks(tasks);
    };

    if (filterComponent._checked) {
      filterComponent._onFilter();
    }
  });
};

const onClickStatistic = function () {
  tagsCtxWrap.classList.remove(`visually-hidden`);
  colorsCtxWrap.classList.remove(`visually-hidden`);
  containerStatistic.classList.remove(`visually-hidden`);
  containerTasks.classList.add(`visually-hidden`);
  createTagChart(tagsCtx);
  createColorChart(colorsCtx);
};

const onStaticticInputChange = function () {
  createTagChart(tagsCtx);
  createColorChart(colorsCtx);
};

const startLoadTasks = () => {
  boardTasksElement.classList.add(`visually-hidden`);
  boardNoTasks.classList.remove(`visually-hidden`);
  boardNoTasks.innerHTML = `Loading tasks...`;
};

const errorLoadTasks = () => {
  boardNoTasks.innerHTML = `Something went wrong while loading your tasks. Check your connection or try again later`;
};

const stopLoadTasks = () => {
  boardTasksElement.classList.remove(`visually-hidden`);
  boardNoTasks.classList.add(`visually-hidden`);
};

startLoadTasks();

api.getTasks()
  .then((tasks) => {
    renderFilters(filtersData, tasks);
  }).then(stopLoadTasks)
  .catch(errorLoadTasks);

controlStatisticElement.addEventListener(`click`, onClickStatistic);

statisticInput.placeholder = `${moment().startOf(`week`).format(`D MMM`)} - ${moment().endOf(`week`).format(`D MMM`)}`;
flatpickr(statisticInput, {
  altInput: true,
  altFormat: `j F`,
  mode: `range`,
  dateFormat: `Y-m-d`,
  onChange(selectedDates, dateStr, instance) {
    dateStr = moment(selectedDates[0], `YYYY-MMMM-DD`).format(`D MMM`);
    if (selectedDates[1]) {
      dateStr = `${moment(selectedDates[0], `YYYY-MMMM-DD`).format(`D MMM`)} - ${moment(selectedDates[1], `YYYY-MMMM-DD`).format(`D MMM`)}`;
    }
    instance.altInput.value = dateStr;
  }
});
statisticInput.addEventListener(`change`, onStaticticInputChange);
