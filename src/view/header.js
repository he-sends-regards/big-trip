import AbstractView from "./abstract.js";

const createHeaderMenuTemplate = (destinationTemplate, price, datePeriod) => {
  return (
    `<div class="page-body__container  page-header__container">
      <img class="page-header__logo" src="img/logo.png" width="42" height="42" alt="Trip logo">
      <div class="trip-main">
        <section class="trip-main__trip-info  trip-info">
          <div class="trip-info__main">
            <h1 class="trip-info__title">${destinationTemplate}</h1>
            <p class="trip-info__dates">${datePeriod}</p>
          </div>
          <p class="trip-info__cost">Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span></p>
        </section>

        <div class="trip-main__trip-controls  trip-controls">
        </div>
      </div>
    </div>`
  );
};

export default class HeaderMenu extends AbstractView {
  constructor(points, pointsDates) {
    super();

    this._points = points;

    this._destinations = [...new Set(this._points.reduce((destinationList, point) => {
      return [...destinationList, point.destination];
    }, []))];

    this._destinationTemplate = this._destinations.length <= 3 ? this._destinations.reduce((acc, el) => {
      if (this._destinations.indexOf(el) === this._destinations.length - 1) {
        return `${acc}${el}`;
      }
      return `${acc}${el} &mdash; `;
    }, ``) : `${this._destinations[0]} &mdash; ...  &mdash; ${this._destinations[this._destinations.length - 1]}`;

    const totalPointsPrice = this._points.length === 0 ? 0 : this._points.reduce((totalPrice, point) => {
      return totalPrice + point.price;
    }, 0);

    const totalPointsOffersPrice = this._points.length === 0 ? 0 : this._points.reduce((totalPrice, point) => {
      const pointOffersTotalPrice = point.offers.length === 0 ? 0 : point.offers.reduce((totalOffersPrice, offer) => {
        return totalOffersPrice + offer.price;
      }, 0);
      return totalPrice + pointOffersTotalPrice;
    }, 0);

    this._price = totalPointsPrice + totalPointsOffersPrice;

    this._pointsDates = pointsDates;
    this._pointsDays = this._pointsDates.reduce((acc, el) => [...acc, el.getDate()], []);

    this._startMonth = this._pointsDates.length !== 0 ? this._pointsDates[0].toLocaleString(`en-US`, {month: `long`}) : ``;
    this._startDay = this._pointsDates.length !== 0 ? this._pointsDates[0].getDate() : ``;
    this._endMonth = this._pointsDates.length !== 0 ? this._pointsDates[pointsDates.length - 1].toLocaleString(`en-US`, {month: `long`}) : ``;
    this._endDay = this._pointsDates.length !== 0 ? this._pointsDates[pointsDates.length - 1].getDate() : ``;

    this._datePeriod = `${this._startMonth} ${this._startDay}&nbsp;&mdash;&nbsp;${this._endMonth} ${this._endDay}`;
  }

  getTemplate() {
    return createHeaderMenuTemplate(this._destinationTemplate, this._price, this._datePeriod);
  }
}
