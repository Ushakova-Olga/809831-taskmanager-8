// data.js
export default () => ({
  title: [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`,
  ][Math.floor(Math.random() * 3)],
  dueDate: Date.now() + 1 + Math.pow(-1, 1 + Math.floor(Math.random() * 2)) * Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
  tags: new Set([
    `homework`,
    `theory`,
    `practice`,
    `intensive`,
    `keks`,
  ]),
  picture: `//picsum.photos/100/100?r=${Math.random()}`,
  color: [
    `black`,
    `yellow`,
    `blue`,
    `green`,
    `pink`,
  ][Math.floor(Math.random() * 5)],
  repeatingDays: {
    'mo': [true, false][Math.floor(Math.random() * 2)],
    'tu': false,
    'we': [true, false][Math.floor(Math.random() * 2)],
    'th': false,
    'fr': [true, false][Math.floor(Math.random() * 2)],
    'sa': false,
    'su': false,
  },
  isFavorite: true,
  isDone: false,
});
