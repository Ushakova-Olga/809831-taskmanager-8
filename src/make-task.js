const isRepeating = (days) => {
  return Object.values(days).some((v) => v);
};

const renderRepeatDay = (data) => {
  const checked = data.value ? `checked` : ``;

  return `<input
    class="visually-hidden card__repeat-day-input"
    type="checkbox"
    id="repeat-${data.day}-${data.id}"
    name="repeat"
    value="${data.day}"
    ${checked}
    />
    <label class="card__repeat-day" for="repeat-${data.day}-${data.id}"
    >${data.day}</label
    >`;
};

const renderRepeatDays = (task) => {
  let result = ``;
  for (const prop in task.repeatingDays) {
    if (task.repeatingDays[prop] !== undefined) {
      result += renderRepeatDay({value: task.repeatingDays[prop], id: task.id, day: prop});
    }
  }
  return result;
};

const renderHashtags = (tags) => {
  return [...tags].map((it) => `
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
};

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

const renderColors = (task) => {
  const colors = [`black`, `yellow`, `blue`, `green`, `pink`];
  let result = ``;
  colors.forEach((it) => {
    result += renderColor(it, task.color, task.id);
  });

  return result;
};

const renderDate = (date) => {
  const months = [`January`, `February`, `Marth`, `April`, `May`, `June`,
    `July`, `August`, `September`, `October`, `November`, `December`];
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

const renderTime = (date) => {
  return `${date.getHours()}:${date.getMinutes()}`;
};

export default (task) => {
  const repeatStatus = isRepeating(task.repeatingDays) ? `yes` : `no`;

  return `<article class="card card--${task.color} card--repeat">
  <form class="card__form" method="get">
    <div class="card__inner">
      <div class="card__control">
        <button type="button" class="card__btn card__btn--edit">
          edit
        </button>
        <button type="button" class="card__btn card__btn--archive">
          archive
        </button>
        <button
          type="button"
          class="card__btn card__btn--favorites card__btn--disabled"
        >
          favorites
        </button>
      </div>

      <div class="card__color-bar">
        <svg class="card__color-bar-wave" width="100%" height="10">
          <use xlink:href="#wave"></use>
        </svg>
      </div>

      <div class="card__textarea-wrap">
        <label>
          <textarea
            class="card__text"
            placeholder="Start typing your text here..."
            name="text"
          >
          ${task.title}</textarea
          >
        </label>
      </div>

      <div class="card__settings">
        <div class="card__details">
          <div class="card__dates">
            <button class="card__date-deadline-toggle" type="button">
              date: <span class="card__date-status">no</span>
            </button>

            <fieldset class="card__date-deadline" disabled>
              <label class="card__input-deadline-wrap">
                <input
                  class="card__date"
                  type="text"
                  placeholder="${renderDate(task.dueDate)}"
                  name="date"
                />
              </label>
              <label class="card__input-deadline-wrap">
                <input
                  class="card__time"
                  type="text"
                  placeholder="${renderTime(task.dueDate)}"
                  name="time"
                />
              </label>
            </fieldset>

            <button class="card__repeat-toggle" type="button">
              repeat:<span class="card__repeat-status">${repeatStatus}</span>
            </button>

            <fieldset class="card__repeat-days" disabled>
              <div class="card__repeat-days-inner">
                ${renderRepeatDays(task)}
              </div>
            </fieldset>
          </div>

          <div class="card__hashtag">
            <div class="card__hashtag-list">
              ${renderHashtags(task.tags)}
            </div>

            <label>
              <input
                type="text"
                class="card__hashtag-input"
                name="hashtag-input"
                placeholder="Type new hashtag here"
              />
            </label>
          </div>
        </div>

        <label class="card__img-wrap">
          <input
            type="file"
            class="card__img-input visually-hidden"
            name="img"
          />
          <img
            src="${task.picture}"
            alt="task picture"
            class="card__img"
          />
        </label>

        <div class="card__colors-inner">
          <h3 class="card__colors-title">Color</h3>
          <div class="card__colors-wrap">
            ${renderColors(task)}
          </div>
        </div>
      </div>

      <div class="card__status-btns">
        <button class="card__save" type="submit">save</button>
        <button class="card__delete" type="button">delete</button>
      </div>
    </div>
  </form>
  </article>`;
};
