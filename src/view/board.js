import AbstractView from "./abstract.js";

const createBoardTemplate = () => {
  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>
    </section>`
  );
};

export default class Board extends AbstractView {
  getTemplate() {
    return createBoardTemplate();
  }
}
