import {colors, months} from './common.js';
import Component from './component.js';

export default class TaskEdit extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._title = data.title;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._picture = data.picture;
    this._repeatingDays = data.repeatingDays;
    this._color = data.color;
    this._isFavorite = data.isFavorite;
    this._isDone = data.isDone;

    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onSubmit = null;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onSubmit === `function`) {
      this._onSubmit();
    }
  }

  _isRepeated() {
    return Object.values(this._repeatingDays).some((it) => it === true);
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  renderColor(it) {
    let checked = (this._color === it) ? `checked` : ``;

    return `
      <input
        type="radio"
        id="color-${it}-${this._id}"
        class="card__color-input card__color-input--${it} visually-hidden"
        name="color"
        value="${it}"
        ${checked}
      />
      <label
        for="color-${it}-${this._id}"
        class="card__color card__color--${it}"
        >${it}</label
      >`;
  }

  _renderColors() {
    let result = ``;
    colors.forEach((it) => {
      result += this.renderColor(it, this._color, this._id);
    });

    return result;
  }

  _renderDate() {
    return `${this._dueDate.getDate()} ${months[this._dueDate.getMonth()]}`;
  }

  _renderTime() {
    return `${this._dueDate.getHours()}:${this._dueDate.getMinutes()}`;
  }


  _repeatStatus() {
    return this._isRepeated() ? `yes` : `no`;
  }

  _repeatClass() {
    return this._isRepeated() ? `card--repeat` : ``;
  }

  _dateStatus() {
    return this._dueDate ? `yes` : `no`;
  }

  _dateDisabled() {
    return this._dueDate ? `` : `disabled`;
  }

  _renderRepeatDay(data) {
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

  _renderRepeatDays() {
    let result = ``;
    for (const prop in this._repeatingDays) {
      if (this._repeatingDays[prop] !== undefined) {
        result += this._renderRepeatDay({value: this._repeatingDays[prop], id: this._id, day: prop});
      }
    }
    return result;
  }

  _renderHashtags() {
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

  get template() {
    return `<article class="card card--edit card--${this._color} ${this._repeatClass()}">
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
                date: <span class="card__date-status">${this._dateStatus()}</span>
              </button>

              <fieldset class="card__date-deadline" ${this._dateDisabled()}>
                <label class="card__input-deadline-wrap">
                  <input
                    class="card__date"
                    type="text"
                    placeholder="${this._renderDate()}"
                    name="date"
                  />
                </label>
                <label class="card__input-deadline-wrap">
                  <input
                    class="card__time"
                    type="text"
                    placeholder="${this._renderTime()}"
                    name="time"
                  />
                </label>
              </fieldset>

              <button class="card__repeat-toggle" type="button">
                repeat:<span class="card__repeat-status">${this._repeatStatus()}</span>
              </button>

              <fieldset class="card__repeat-days" disabled>
                <div class="card__repeat-days-inner">
                  ${this._renderRepeatDays()}
                </div>
              </fieldset>
            </div>

            <div class="card__hashtag">
              <div class="card__hashtag-list">
                ${this._renderHashtags()}
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
              ${this._renderColors()}
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
    this._element.querySelector(`.card__form`)
      .addEventListener(`submit`, this._onSubmitButtonClick);
  }

  unbind() {
    this._element.querySelector(`.card__form`)
      .removeEventListener(`submit`, this._onSubmitButtonClick);
  }
}
