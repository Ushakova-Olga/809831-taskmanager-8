export default (id, name, count, checked = false) =>
  `
    <input
      type="radio"
      id="filter__${id}"
      class="filter__input visually-hidden"
      name="filter"
      ${checked ? `checked` : ``}
    />
    <label for="filter__${id}" class="filter__label">
      ${name}
      <span class="filter__${id}-count">${count}</span>
    </label>
  `;
