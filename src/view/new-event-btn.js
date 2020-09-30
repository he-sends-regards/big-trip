import AbstractView from "./abstract.js";

const createNewEventBtnElement = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
  );
};

export default class NewEventBtn extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createNewEventBtnElement();
  }
}
