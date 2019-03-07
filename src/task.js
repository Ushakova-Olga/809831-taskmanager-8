const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

class Task {
  constructor(data) {
    this._id = data.id;
    this._title = data.title;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._picture = data.picture;
    this._repeatingDays = data.repeatingDays;
    this._color = data.color;
    this._isFavorite = data.isFavorite;
    this._isDone = data.isDone;

    this._element = null;
    this._state = {
      // Состояние компонента
    };

    this._onEdit = null;
  }

  _isRepeated() {
    return Object.values(this._repeatingDays).some((it) => it === true);
  }

  renderColors() {
    const colors = [`black`, `yellow`, `blue`, `green`, `pink`];
    let result = ``;
    colors.forEach((it) => {
      result += this.renderColor(it, this._color, this._id);
    });

    return result;
  }

  renderDate() {
    const months = [`January`, `February`, `Marth`, `April`, `May`, `June`,
      `July`, `August`, `September`, `October`, `November`, `December`];
    return `${this._dueDate.getDate()} ${months[this._dueDate.getMonth()]}`;
  }

  renderTime() {
    return `${this._dueDate.getHours()}:${this._dueDate.getMinutes()}`;
  }

  repeatStatus() {
    return this._isRepeated(this._repeatingDays) ? `yes` : `no`;
  }

  renderRepeatDay(data) {
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
  }

  renderRepeatDays() {
    let result = ``;
    for (const prop in this.repeatingDays) {
      if (this.repeatingDays[prop] !== undefined) {
        result += this.renderRepeatDay({value: this.repeatingDays[prop], id: this.id, day: prop});
      }
    }
    return result;
  }

  renderHashtags() {
    return [...this._tags].map((it) => `
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

  renderColor(it, color, id) {
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
  }

  _onEditButtonClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  get element() {
    return this._element;
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  get template() {
    return `<article class="card card--${this._color} card--repeat">
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
            ${this._title}</textarea
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
                    placeholder="${this.renderDate()}"
                    name="date"
                  />
                </label>
                <label class="card__input-deadline-wrap">
                  <input
                    class="card__time"
                    type="text"
                    placeholder="${this.renderTime()}"
                    name="time"
                  />
                </label>
              </fieldset>

              <button class="card__repeat-toggle" type="button">
                repeat:<span class="card__repeat-status">${this.repeatStatus()}</span>
              </button>

              <fieldset class="card__repeat-days" disabled>
                <div class="card__repeat-days-inner">
                  ${this.renderRepeatDays()}
                </div>
              </fieldset>
            </div>

            <div class="card__hashtag">
              <div class="card__hashtag-list">
                ${this.renderHashtags()}
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
              src="${this._picture}"
              alt="task picture"
              class="card__img"
            />
          </label>

          <div class="card__colors-inner">
            <h3 class="card__colors-title">Color</h3>
            <div class="card__colors-wrap">
              ${this.renderColors()}
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
  }

  bind() {
    this._element.querySelector(`.card__btn--edit`)
        .addEventListener(`click`, this._onEditButtonClick.bind(this));
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unbind() {
    // Удаление обработчиков
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}

export default (task) => {
  return new Task(task);
};
