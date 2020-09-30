import AbstractView from "./abstract.js";

const createTripDayElement = (dayNumber, date) => {
  const month = date.toLocaleString(`en-US`, {month: `long`});

  return (
    `<li class="trip-days__item  day">
		<div class="day__info">
			<span class="day__counter">${dayNumber}</span>
			<time class="day__date" datetime="${date}">${month.slice(0, 3)} ${date.getDate()}</time>
		</div>
	</li>`
  );
};

export default class Day extends AbstractView {
  constructor(dayNumber, date) {
    super();
    this._dayNumber = dayNumber || 0;
    this._date = date || new Date();
  }

  getTemplate() {
    return createTripDayElement(this._dayNumber, this._date);
  }
}
