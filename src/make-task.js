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
  for (let prop in task.repeatingDays) {
    if (task.repeatingDays[prop] !== undefined) {
      result += renderRepeatDay({value: task.repeatingDays[prop], id: 1, day: prop});
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
                  placeholder="23 September"
                  name="date"
                />
              </label>
              <label class="card__input-deadline-wrap">
                <input
                  class="card__time"
                  type="text"
                  placeholder="11:15 PM"
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
            <input
              type="radio"
              id="color-black-2"
              class="card__color-input card__color-input--black visually-hidden"
              name="color"
              value="black"
            />
            <label
              for="color-black-2"
              class="card__color card__color--black"
              >black</label
            >
            <input
              type="radio"
              id="color-yellow-2"
              class="card__color-input card__color-input--yellow visually-hidden"
              name="color"
              value="yellow"
            />
            <label
              for="color-yellow-2"
              class="card__color card__color--yellow"
              >yellow</label
            >
            <input
              type="radio"
              id="color-blue-2"
              class="card__color-input card__color-input--blue visually-hidden"
              name="color"
              value="blue"
            />
            <label
              for="color-blue-2"
              class="card__color card__color--blue"
              >blue</label
            >
            <input
              type="radio"
              id="color-green-2"
              class="card__color-input card__color-input--green visually-hidden"
              name="color"
              value="green"
            />
            <label
              for="color-green-2"
              class="card__color card__color--green"
              >green</label
            >
            <input
              type="radio"
              id="color-pink-2"
              class="card__color-input card__color-input--pink visually-hidden"
              name="color"
              value="pink"
              checked
            />
            <label
              for="color-pink-2"
              class="card__color card__color--pink"
              >pink</label
            >
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
