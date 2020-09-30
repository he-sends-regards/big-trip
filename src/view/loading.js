import AbstractView from "./abstract.js";

const createNoPointsTemplate = () => {
  return `<p style="text-align:center; color:#000}">
     Loading...
   </p>`;
};

export default class Loading extends AbstractView {
  getTemplate() {
    return createNoPointsTemplate();
  }
}
