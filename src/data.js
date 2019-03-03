// data.js
const titles = [`Изучить теорию`, `Сделать домашку`, `Пройти интенсив на соточку`];
const tags = [`homework`, `theory`, `practice`, `intensive`, `keks`];
const colors = [`black`, `yellow`, `blue`, `green`, `pink`];


const getRandomItem = (array) => array[Math.floor(array.length * Math.random())];

const getTagsSet = (tagsArray) => new Set([
  tagsArray[Math.floor(Math.random() * tagsArray.length)],
  tagsArray[Math.floor(Math.random() * tagsArray.length)],
  tagsArray[Math.floor(Math.random() * tagsArray.length)],
]);

const getRepeatingDays = () => ({
  'mo': [true, false][Math.floor(Math.random() * 2)],
  'tu': false,
  'we': [true, false][Math.floor(Math.random() * 2)],
  'th': false,
  'fr': [true, false][Math.floor(Math.random() * 2)],
  'sa': false,
  'su': false,
});

const getDate = () => {
  const months = [``, `Февраля`, `Марта`, `Апреля`, `Мая`, `Июня`,
    `Июля`, `Августа`, `Сентября`, `Октября`, `Ноября`, `Декабря`];
  let myDate = new Date();
  myDate.setDate(myDate.getDate() + Math.floor(Math.random() * 14));
  return {date: myDate.getDate() + ` ` + months[myDate.getMonth()], time: myDate.getHours() + `:` + myDate.getMinutes()};
};

const getRandomBoolean = () => [true, false][Math.floor(Math.random() * 2)];

export const getTask = (number) => ({
  id: number,
  title: getRandomItem(titles),
  dueDate: getDate(),
  tags: getTagsSet(tags),
  picture: `http://picsum.photos/100/100?r=${Math.random()}`,
  color: getRandomItem(colors),
  repeatingDays: getRepeatingDays(),
  isFavorite: getRandomBoolean(),
  isDone: getRandomBoolean()
});

export default (number) => getTask(number);
