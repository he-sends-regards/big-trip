import AbstractView from "./abstract.js";
import {SortType} from "../const.js";

const createSortTemplate = (currentSortType) => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
		<span class="trip-sort__item  trip-sort__item--day">Day</span>
		<div class="trip-sort__item  trip-sort__item--event">
			<input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" ${currentSortType === SortType.DEFAULT ? `checked` : ``}>
			<label class="trip-sort__btn ${currentSortType === SortType.DEFAULT ? `trip__filter--active` : ``}" for="sort-event" data-sort-type="${SortType.DEFAULT}">Event</label>
		</div>
		<div class="trip-sort__item  trip-sort__item--time">
			<input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" ${currentSortType === SortType.TIME ? `checked` : ``}>
			<label class="trip-sort__btn ${currentSortType === SortType.TIME ? `trip__filter--active` : ``}" for="sort-time" data-sort-type="${SortType.TIME}">
				Time
				<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
					<path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
				</svg>
			</label>
		</div>
		<div class="trip-sort__item  trip-sort__item--price">
			<input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" ${currentSortType === SortType.PRICE ? `checked` : ``}>
			<label class="trip-sort__btn ${currentSortType === SortType.PRICE ? `trip__filter--active` : ``}" for="sort-price" data-sort-type="${SortType.PRICE}">
				Price
				<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
					<path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
				</svg>
			</label>
		</div>
		<span class="trip-sort__item  trip-sort__item--offers">Offers</span>
	</form>`
  );
};

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }

    evt.preventDefault();
    evt.target.previousElementSibling.checked = true;
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
