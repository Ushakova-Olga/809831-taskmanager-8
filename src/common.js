export function isRepeated(repeatingDays) {
  return Object.values(repeatingDays).some((it) => it === true);
}

const renderColor = (it, color, id) => {
  let checked = (color === it) ? `checked` : ``;

  return `
    <input
      type="radio"
      id="color-${it}-${id}"
      class="card__color-input card__color-input--${it} visually-hidden"
      name="color"
      value="${it}"
      ${checked}
    />
    <label
      for="color-${it}-${id}"
      class="card__color card__color--${it}"
      >${it}</label
    >`;
};

export function renderColors(task) {
  const colors = [`black`, `yellow`, `blue`, `green`, `pink`];
  let result = ``;
  colors.forEach((it) => {
    result += renderColor(it, task._color, task._id);
  });

  return result;
}

export function renderDate(task) {
  const months = [`January`, `February`, `Marth`, `April`, `May`, `June`,
    `July`, `August`, `September`, `October`, `November`, `December`];
  return `${task._dueDate.getDate()} ${months[task._dueDate.getMonth()]}`;
}

export function renderTime(task) {
  return `${task._dueDate.getHours()}:${task._dueDate.getMinutes()}`;
}

export function repeatStatus(task) {
  return isRepeated(task._repeatingDays) ? `yes` : `no`;
}

export function repeatClass(task) {
  return isRepeated(task._repeatingDays) ? `card--repeat` : ``;
}

export function renderHashtags(task) {
  return [...task._tags].map((it) => `
  <span class="card__hashtag-inner">
    <input
      type="hidden"
      name="hashtag"
      value="repeat"
      class="card__hashtag-hidden-input"
    />
    <button type="button" class="card__hashtag-name">
      #${it}
    </button>
    <button type="button" class="card__hashtag-delete">
      delete
    </button>
  </span>
  `).join(``);
}

export function dateStatus(task) {
  return task._dueDate ? `yes` : `no`;
}

export function dateDisabled(task) {
  return task._dueDate ? `` : `disabled`;
}

const renderRepeatDay = (data) => {
  const checked = data.value ? `checked` : ``;

  return `<input
    class="visually-hidden card__repeat-day-input"
    type="checkbox"
    id="repeat-${data._day}-${data._id}"
    name="repeat"
    value="${data._day}"
    ${checked}
    />
    <label class="card__repeat-day" for="repeat-${data._day}-${data._id}"
    >${data._day}</label
    >`;
};

export function renderRepeatDays(task) {
  let result = ``;
  for (const prop in task.repeatingDays) {
    if (task.repeatingDays[prop] !== undefined) {
      result += renderRepeatDay({value: task.repeatingDays[prop], id: task.id, day: prop});
    }
  }
  return result;
}

export function createElement(template) {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
}
