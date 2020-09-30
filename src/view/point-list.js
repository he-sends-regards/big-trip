import AbstractView from "./abstract.js";

const createPointListElement = () => {
  return (
    `<ul class="trip-events__list"></ul>`
  );
};

export default class PointList extends AbstractView {
  getTemplate() {
    return createPointListElement();
  }
}
