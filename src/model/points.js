import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(points, updateType, update) {
    this._points = points.slice();

    this._notify(updateType, update);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          price: point.base_price,
          time: {
            startTime: point.date_from !== null ? new Date(point.date_from) : point.date_from,
            endTime: point.date_to !== null ? new Date(point.date_to) : point.date_to
          },
          destination: point.destination.name,
          isFavorite: point.is_favorite,
          description: point.destination.description,
          pictures: point.destination.pictures
        }
    );

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.photos;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "base_price": point.price,
          "date_from": point.time.startTime,
          "date_to": point.time.endTime,
          "destination": {name: point.destination, description: point.description || ``, pictures: point.pictures || []},
          "is_favorite": point.isFavorite ? point.isFavorite : false,
          "pictures": point.pictures || []
        }
    );

    delete adaptedPoint.price;
    delete adaptedPoint.time.startTime;
    delete adaptedPoint.time.endTime;
    delete adaptedPoint.description;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.time;
    delete adaptedPoint.icon;

    return adaptedPoint;
  }
}
