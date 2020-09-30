import {MenuItem} from "../const.js";
import AbstractView from "./abstract.js";

const ACTIVE_MENU_ITEM_CLASS_NAME = `trip-tabs__btn--active`;

const createSiteMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <h2 class="visually-hidden">Switch trip view</h2>
      <a class="trip-tabs__btn ${ACTIVE_MENU_ITEM_CLASS_NAME}" href="#" data-value="${MenuItem.POINTS}">Table</a>
      <a class="trip-tabs__btn" href="#" data-value="${MenuItem.STATS}">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractView {
  constructor(handleSiteMenuClick) {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
    this._setMenuClickHandler(handleSiteMenuClick);
  }

  getTemplate() {
    return `${createSiteMenuTemplate()}`;
  }

  _setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  _menuClickHandler(evt) {
    if (evt.target.tagName === `A`) {
      evt.preventDefault();

      const activeMenuElement = this.getElement().querySelector(`[data-value=${evt.target.dataset.value}]`);
      const inactiveMenuItem = this.getElement().querySelector(`[data-value=${activeMenuElement.dataset.value === `POINTS` ? `STATS` : `POINTS`}]`);

      activeMenuElement.classList.add(ACTIVE_MENU_ITEM_CLASS_NAME);
      inactiveMenuItem.classList.remove(ACTIVE_MENU_ITEM_CLASS_NAME);

      this._callback.menuClick(evt.target.dataset.value);
    }
  }
}
