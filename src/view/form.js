import flatpickr from "flatpickr";
import he from "he";
import SmartView from "./smart.js";
import OfferView from "./offer.js";
import {formatPointDate, createPointIcon, createTypeWithArticle} from "../utils/point.js";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_POINT = {
  destination: ``,
  name: ``,
  icon: ``,
  time: {startTime: new Date(), endTime: new Date()},
  price: 0,
  offers: []
};


const createFormElement = (isAddingForm, pointData, destinations, offersList) => {
  const {type, destination, time, price, offers, isFavorite, isDisabled, isSaving, isDeleting} = pointData;
  const {startTime, endTime} = time;
  const name = type ? createTypeWithArticle(type) : ``;

  const destinationNameList = [];
  destinations.forEach((destinationItem) => {
    destinationNameList.push(destinationItem.name);
  });

  const destinationPicturesList = [];
  destinations.forEach((destinationItem) => {
    if (destinationItem.name === destination) {
      destinationPicturesList.push(destinationItem.pictures);
    }
  });

  let destinationDescription = ``;
  destinations.forEach((destinationItem) => {
    if (destinationItem.name === destination) {
      destinationDescription = destinationItem.description;
    }
  });

  const destinationPicturesListTemplate = destinationPicturesList.flat().reduce((acc, el) => {
    return `${acc}<img class="event__photo" src="${el.src}" alt="Event photo">`;
  }, ``);

  const destinationListTemplate = destinationNameList.reduce((template, destinationEl) => {
    return `${template}<option value="${destinationEl}"></option>`;
  }, ``);

  const offersTemplates = type ? offersList.reduce((acc, offer) => {
    const isCurrentOfferChecked = offers.some((checkedOffer) => {
      return offer.title === checkedOffer.title;
    });

    return `${acc}<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}" type="checkbox" name="event-offer-${offer.title}" ${isCurrentOfferChecked && !isAddingForm ? `checked` : ``}>
    <label class="event__offer-label" for="event-offer-${offer.title}" data-name="${offer.title}" data-price="${offer.price}">
      ${new OfferView(offer).getTemplate()}
    </label>
  </div>`;
  }, ``) : `No choosed type`;

  const isTimePeriodCorrect = time && startTime < endTime;

  return (
    `<div>
    <form class="trip-events__item event  event--edit" action="#" method="post">
			<header class="event__header">
				<div class="event__type-wrapper">
					<label class="event__type  event__type-btn" for="event-type-toggle-1">
						<span class="visually-hidden">Choose event type</span>
						<img class="event__type-icon" width="17" height="17" src="${type ? createPointIcon(type) : ``}" alt="">
					</label>
					<input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

					<div class="event__type-list">
						<fieldset class="event__type-group">
							<legend class="visually-hidden">Transfer</legend>

							<div class="event__type-item">
								<input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${type === `taxi` ? `checked` : ``}>
								<label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
							</div>

							<div class="event__type-item">
								<input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${type === `bus` ? `checked` : ``}>
								<label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
							</div>

							<div class="event__type-item">
								<input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${type === `train` ? `checked` : ``}>
								<label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
							</div>

							<div class="event__type-item">
								<input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${type === `ship` ? `checked` : ``}>
								<label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
							</div>

							<div class="event__type-item">
								<input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport"  ${type === `transport` ? `checked` : ``}>
								<label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
							</div>

							<div class="event__type-item">
								<input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${type === `drive` ? `checked` : ``}>
								<label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
							</div>

							<div class="event__type-item">
								<input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${type === `flight` ? `checked` : ``}>
								<label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
							</div>
						</fieldset>

						<fieldset class="event__type-group">
							<legend class="visually-hidden">Activity</legend>

							<div class="event__type-item">
								<input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${type === `check-in` ? `checked` : ``}>
								<label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
							</div>

							<div class="event__type-item">
								<input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${type === `sightseeing` ? `checked` : ``}>
								<label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
							</div>

							<div class="event__type-item">
								<input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${type === `restaurant` ? `checked` : ``}>
								<label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
							</div>
						</fieldset>
					</div>
				</div>

				<div class="event__field-group  event__field-group--destination">
					<label class="event__label  event__type-output" for="event-destination-1">
						${name || ``}
					</label>
					<input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination) || ``}" list="destination-list-1">
					<datalist id="destination-list-1">
            ${destinationListTemplate}
					</datalist>
				</div>

				<div class="event__field-group  event__field-group--time">
					<label class="visually-hidden" for="event-start-time-1">
						From
					</label>
					<input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatPointDate(startTime) || `00/00/00 00:00`}">
					&mdash;
					<label class="visually-hidden" for="event-end-time-1">
						To
					</label>
					<input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatPointDate(endTime) || `00/00/00 00:00`}">
				</div>

				<div class="event__field-group  event__field-group--price">
					<label class="event__label" for="event-price-1">
						<span class="visually-hidden">Price</span>
						&euro;
					</label>
					<input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${isAddingForm ? 0 : `${price || 0}`}">
				</div>

				<button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled || !isTimePeriodCorrect ? `disabled` : ``}>${isSaving ? `Saving...` : `Save`}</button>
				<button class="event__reset-btn" type="reset">${isAddingForm ? `Cancel` : `${isDeleting ? `Deleting...` : `Delete`}`}</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
				<label class="event__favorite-btn" for="event-favorite-1">
					<span class="visually-hidden">Add to favorite</span>
					<svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
						<path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
					</svg>
				</label>

				<button class="event__rollup-btn" type="button">
					<span class="visually-hidden">Open event</span>
				</button>
			</header>

			<section class="event__details">
				<section class="event__section  event__section--offers">
					<h3 class="event__section-title  event__section-title--offers">Offers</h3>

					<div class="event__available-offers">
						${offersTemplates}
					</div>
				</section>
        ${isAddingForm ? `
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinationDescription}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${destination ? destinationPicturesListTemplate : ``}
          </div>
        </div>
      </section>` : ``}
			</section>
    </form>
    </div>`
  );
};

export default class Form extends SmartView {
  constructor(isAddingForm, destinations, offers, point = BLANK_POINT) {
    super();
    this._data = Form.parsePointToData(point);
    this._isAddingForm = isAddingForm;
    this._offers = offers;
    this._currentOffers = this._offers.reduce((acc, el) => {
      if (el.type === this._data.type) {
        acc.push(el.offers);
      }
      return acc;
    }, []).flat();
    this._choosenOffers = [];

    this._startDatepicker = null;
    this._endDatepicker = null;

    this._destinations = destinations || [];
    this._destinationsNamesList = this._destinations.reduce((namesList, destinationItem) => {
      return [...namesList, destinationItem.name];
    }, []);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);

    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._destinationToggleHandler = this._destinationToggleHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._offersChooseHandler = this._offersChooseHandler.bind(this);

    this._setStartDatepicker();
    this._setEndDatepicker();
    this._setInnerHandlers();
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  reset(point) {
    this.updateData(Form.parsePointToData(point));
  }

  getTemplate() {
    return createFormElement(this._isAddingForm, this._data, this._destinations, this._currentOffers);
  }

  restoreHandlers() {
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this._setStartDatepicker();
    this._setEndDatepicker();
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;

    this.getElement()
      .querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, this._favoriteClickHandler);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`input`, this._destinationToggleHandler);
    this.getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`click`, this._typeToggleHandler);
    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._priceChangeHandler);
  }

  _setStartDatepicker() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    this._startDatepicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          enableTime: true,
          dateFormat: `y/m/d H:i`,
          defaultDate: this._data.time.startTime,
          onChange: this._startDateChangeHandler
        }
    );
  }

  _setEndDatepicker() {
    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._endDatepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          enableTime: true,
          dateFormat: `y/m/d H:i`,
          defaultDate: this._data.time.endTime,
          onChange: this._endDateChangeHandler
        }
    );
  }

  _typeToggleHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `LABEL`) {
      return;
    }

    const type = evt.target.textContent.toLowerCase();

    this._currentOffers = this._offers.reduce((acc, el) => {
      if (el.type === type) {
        acc.push(el.offers);
      }
      return acc;
    }, []).flat();

    this.updateData({
      type,
      icon: createPointIcon(type),
      name: createTypeWithArticle(type),
      offers: this._currentOffers
    });
  }

  _destinationToggleHandler(evt) {
    evt.preventDefault();
    const destinationName = evt.target.value;
    const destinationData = this._destinationsNamesList.includes(destinationName);

    if (destinationData) {
      evt.target.setCustomValidity(``);
      evt.target.reportValidity();
      this.updateData({
        destination: evt.target.value,
        description: evt.target.value
      });
    } else {
      evt.target.setCustomValidity(`Unknown destination. Please check the entered value.`);
      evt.target.reportValidity();
    }
  }

  _offersChooseHandler() {
    const checkedOffers = Array
      .from(this.getElement().querySelectorAll(`.event__offer-checkbox`))
      .filter((element) => element.checked)
      .map((element) => {
        return {
          title: element.nextElementSibling.dataset.name,
          price: parseInt(element.nextElementSibling.dataset.price, 10)
        };
      });

    this.updateData({
      offers: checkedOffers
    }, true);
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    const inputtedPrice = parseInt(evt.target.value, 10);

    if (!/^\d+$/.test(evt.target.value) || typeof inputtedPrice !== `number` || inputtedPrice < 0) {
      evt.target.setCustomValidity(`Incorrect price. You can use only numbers and greater then zero ones only. Field must be filled`);
      evt.target.reportValidity();
    } else {
      evt.target.setCustomValidity(``);

      this.updateData({
        price: inputtedPrice
      }, true);
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._offersChooseHandler();
    this._callback.formSubmit(Form.parseDataToPoint(this._data));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(Form.parseDataToPoint(this._data));
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._isFavorite = !this._isFavorite;
    this.updateElement();
    this._callback.favoriteClick();
  }

  _startDateChangeHandler([userDate]) {
    if (!userDate) {
      userDate.setHours(23, 59, 59, 999);
    }
    this.updateData({
      time: Object.assign({}, this._data.time, {startTime: userDate})
    });
  }

  _endDateChangeHandler([userDate]) {
    if (!userDate) {
      userDate.setHours(23, 59, 59, 999);
    }
    this.updateData({
      time: Object.assign({}, this._data.time, {endTime: userDate})
    });
  }

  static parsePointToData(point) {
    return Object.assign({}, point, {
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    });
  }

  static parseDataToPoint(data) {
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return Object.assign({}, data);
  }
}
