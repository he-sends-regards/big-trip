import FormView from "../view/form.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

export default class PointNew {
  constructor(pointListContainer, changeData, destinations, offers, headerPresenter) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._destinations = destinations;
    this._offers = offers;
    this._formComponent = null;
    this._headerPresenter = headerPresenter;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._formComponent !== null) {
      return;
    }

    this._formComponent = new FormView(true, this._destinations, this._offers);
    this._formComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._formComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointListContainer, this._formComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._formComponent === null) {
      return;
    }

    remove(this._formComponent);
    this._formComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._formComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._formComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._formComponent.shake(resetFormState);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.AFFECTS_HEADER,
        point
    );
    this._headerPresenter.switchDisablingNewEventBtn();
    this.destroy();
  }

  _handleDeleteClick() {
    this._headerPresenter.switchDisablingNewEventBtn();
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
      this._headerPresenter.switchDisablingNewEventBtn();
    }
  }
}
