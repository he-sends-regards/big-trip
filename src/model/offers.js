import Observer from "../utils/observer.js";

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers.slice();
  }

  getOffers() {
    return this._offers;
  }

  updateOffer(updateType, update) {
    const index = this._offers.findIndex((offer) => offer.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting offer`);
    }

    this._offers = [
      ...this._offers.slice(0, index),
      update,
      ...this._offers.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addoffer(updateType, update) {
    this._offers = [
      update,
      ...this._offers
    ];

    this._notify(updateType, update);
  }

  deleteoffer(updateType, update) {
    const index = this._offers.findIndex((offer) => offer.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting offer`);
    }

    this._offers = [
      ...this._offers.slice(0, index),
      ...this._offers.slice(index + 1)
    ];

    this._notify(updateType);
  }
}
