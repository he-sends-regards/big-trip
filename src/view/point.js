import he from "he";
import AbstractView from "./abstract.js";
import OfferView from "./offer.js";
import {createTypeWithArticle, formatPointDate, getTimePeriod, createPointIcon} from "../utils/point.js";

const createPointElement = (pointData = {}) => {
  const {destination, type, time, price, offers} = pointData;
  const {startTime, endTime} = time;

  const offersTemplates = (offers.length > 3 ? offers.slice(0, 3) : offers).reduce((acc, offer) => {
    return `${acc}${new OfferView(offer).getTemplate()}`;
  }, ``);

  return (
    `<li class="trip-events__item">
		<div class="event">
			<div class="event__type">
				<img class="event__type-icon" width="42" height="42" src="${createPointIcon(type)}" alt="Event type icon">
			</div>
			<h3 class="event__title">${createTypeWithArticle(type)} ${he.encode(destination)}</h3>

			<div class="event__schedule">
				<p class="event__time">
					<time class="event__start-time" datetime="2019-03-19T11:20">${formatPointDate(startTime)}</time>
					&mdash;
					<time class="event__end-time" datetime="2019-03-19T13:00">${formatPointDate(endTime)}</time>
				</p>
				<p class="event__duration">${getTimePeriod(pointData).periodTemplate}</p>
			</div>

			<p class="event__price">
				&euro;&nbsp;<span class="event__price-value">${price}</span>
			</p>

			<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersTemplates}
			</ul>

			<button class="event__rollup-btn" type="button">
				<span class="visually-hidden">Open event</span>
			</button>
		</div>
	</li>`
  );
};

export default class Point extends AbstractView {
  constructor(pointData) {
    super();
    this._pointData = pointData || {};

    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createPointElement(this._pointData);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }
}
