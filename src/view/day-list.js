import AbstractView from "./abstract.js";

const createListTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class List extends AbstractView {
  getTemplate() {
    return createListTemplate();
  }
}
