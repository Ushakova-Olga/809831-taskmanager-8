import {colors} from './common.js';
import Component from './component.js';
import flatpickr from 'flatpickr';
import moment from 'moment';

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


    this._state.isDate = false;
    this._state.isRepeated = false;

    this._onChangeDate = this._onChangeDate.bind(this);
    this._onChangeRepeated = this._onChangeRepeated.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
  }

  _processForm(formData) {
    const entry = {
      title: ``,
      color: ``,
      tags: new Set(),
      dueDate: new Date(),
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      }
    };

    const taskEditMapper = TaskEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (taskEditMapper[property]) {
        taskEditMapper[property](value);
      }
    }

    entry.dueDate = Date.parse(moment(entry.dueDate, `DD MMMM YYYY hh:mm`).toDate());
    return entry;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.card__form`));
    const newData = this._processForm(formData);
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    this.update(newData);
  }

  _onChangeDate() {
    this._state.isDate = !this._state.isDate;
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _onChangeRepeated() {
    this._state.isRepeated = !this._state.isRepeated;
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _isRepeated() {
    return Object.values(this._repeatingDays).some((it) => it === true);
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onDelete(fn) {
    this._onDelete = () => fn({id: this._id});
  }

  _onDeleteButtonClick() {
    if (typeof this._onDelete === `function`) {
      this._onDelete();
    }
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
    return `${moment(this._dueDate).format(`D MMMM`)}`;
  }

  _renderTime() {
    return `${moment(this._dueDate).format(`h:mm`)}`;
  }


  _repeatStatus() {
    return this._state.isRepeated ? `yes` : `no`;
  }

  _repeatClass() {
    return this._isRepeated() ? `card--repeat` : ``;
  }

  _dateStatus() {
    return this._state.isDate ? `yes` : `no`;

  }

  _dateDisabled() {
    return this._state.isDate ? `` : `disabled`;
  }

  _repeatDisabled() {
    return this._state.isRepeated ? `` : `disabled`;
  }

  blockSave() {
    this._element.querySelector(`.card__save`).disabled = true;
    this._element.querySelector(`.card__save`).innerHTML = `Saving...`;
    this._element.querySelector(`.card__text`).disabled = true;
  }

  unblockSave() {
    this._element.querySelector(`.card__save`).disabled = false;
    this._element.querySelector(`.card__save`).innerHTML = `Save`;
    this._element.querySelector(`.card__text`).disabled = false;
  }

  blockDelete() {
    this._element.querySelector(`.card__delete`).disabled = true;
    this._element.querySelector(`.card__delete`).innerHTML = `Deleting...`;
    this._element.querySelector(`.card__text`).disabled = true;
  }

  unblockDelete() {
    this._element.querySelector(`.card__delete`).disabled = false;
    this._element.querySelector(`.card__delete`).innerHTML = `Delete`;
    this._element.querySelector(`.card__text`).disabled = false;
  }

  _renderRepeatDay(data) {
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

              <fieldset class="card__repeat-days" ${this._repeatDisabled()}>
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
    this._element.querySelector(`.card__date-deadline-toggle`)
        .addEventListener(`click`, this._onChangeDate);
    this._element.querySelector(`.card__repeat-toggle`)
        .addEventListener(`click`, this._onChangeRepeated);

    this._element.querySelector(`.card__delete`)
        .addEventListener(`click`, this._onDeleteButtonClick);

    if (this._state.isDate) {
      flatpickr(this._element.querySelector(`.card__date`), {altInput: true, altFormat: `j F`, dateFormat: `j F Y`});
      flatpickr(this._element.querySelector(`.card__time`), {enableTime: true, noCalendar: true, altInput: true, altFormat: `h:i K`, dateFormat: `h:i K`});
    }
  }

  unbind() {
    this._element.querySelector(`.card__form`)
        .removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__form`)
        .removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`)
        .removeEventListener(`click`, this._onChangeDate);
    this._element.querySelector(`.card__repeat-toggle`)
        .removeEventListener(`click`, this._onChangeRepeated);

    this._element.querySelector(`.card__delete`)
        .removeEventListener(`click`, this._onDeleteButtonClick);
  }

  update(data) {
    this._title = data.title;
    this._tags = data.tags;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
    this._dueDate = data.dueDate ? data.dueDate : this._dueDate;
  }

  // Если произошла ошибка при загрузке дынных на сервер, показываем анимацию
  shake() {
    this._element.querySelector(`.card__inner`).style.borderColor = `#ff0000`;
    const ANIMATION_TIMEOUT = 600;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  static createMapper(target) {
    return {
      hashtag: (value) => target.tags.add(value),
      text: (value) => {
        target.title = value;
      },
      color: (value) => {
        target.color = value;
      },
      repeat: (value) => {
        target.repeatingDays[value] = true;
      },
      date: (value) => {
        target.dueDate = value;
      },
      time: (value) => {
        target.dueDate = target.dueDate ? target.dueDate + ` ` + value : ``;
      },
    };
  }
}
