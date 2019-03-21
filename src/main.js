import makeData from './data.js';
import Task from './task.js';
import TaskEdit from './task-edit.js';
import Filter from './filter.js';
import moment from 'moment';
import flatpickr from 'flatpickr';
import {createTagChart, createColorChart} from './statistik.js';

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

const deleteTask = (tasks, i) => {
  tasks.splice(i, 1);
  return tasks;
};

const createTasks = (count) => {
  const tasks = [];
  for (let i = 0; i < count; i++) {
    tasks.push(makeData(i));
  }
  return tasks;
};

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
      task.title = newObject.title;
      task.tags = newObject.tags;
      task.color = newObject.color;
      task.repeatingDays = newObject.repeatingDays;
      task.dueDate = newObject.dueDate;

      taskComponent.update(task);
      taskComponent.render();
      boardTasksElement.replaceChild(taskComponent.element, editTaskComponent.element);
      editTaskComponent.unrender();
    };

    editTaskComponent.onDelete = () => {
      deleteTask(tasks, i);
      editTaskComponent.unrender();
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
    mainFilterElement.appendChild(filterComponent.render()[0]);
    mainFilterElement.appendChild(filterComponent.render()[1]);

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

let tasks = [];
tasks = createTasks(25);
renderFilters(filtersData, tasks);
controlStatisticElement.addEventListener(`click`, onClickStatistic);

statisticInput.placeholder = moment(moment().startOf(`week`)).format(`D MMM`) + ` - ` + moment(moment().endOf(`week`)).format(`D MMM`);

flatpickr(statisticInput, {altInput: true, altFormat: `j F`, mode: `range`, dateFormat: `j F Y`});
statisticInput.addEventListener(`change`, onStaticticInputChange);
