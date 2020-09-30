import AbstractView from "./abstract.js";

const createOffersElement = (offer) => {
  const {title, price} = offer;
  return (
    `<li class="event__offer">
		<span class="event__offer-title">${title}</span>
		&plus;
		&euro;&nbsp;<span class="event__offer-price">${price}</span>
	 </li>`
  );
};

export default class Offer extends AbstractView {
  constructor(offer) {
    super();
    this._offer = offer || {};
  }

  getTemplate() {
    return createOffersElement(this._offer);
  }
}
