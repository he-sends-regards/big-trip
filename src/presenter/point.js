import FormView from "../view/form.js";
import PointView from "../view/point.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";
import {isDatesEqual} from "../utils/point.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

export default class Point {
  constructor(pointListContainer, changeData, changeMode, destinations, offers) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._destinations = destinations;
    this._offers = offers;

    this._pointComponent = null;
    this._formComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevFormComponent = this._formComponent;

    this._pointComponent = new PointView(point);
    this._formComponent = new FormView(false, this._destinations, this._offers, point);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._formComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._formComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevPointComponent === null || prevFormComponent === null) {
      render(this._pointListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING && prevFormComponent) {
      replace(this._pointComponent, prevFormComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevFormComponent);
  }

  updatePoint(update) {
    this._point = update;

    const prevFormComponent = this._formComponent;
    this._formComponent = new FormView(false, this._destinations, this._offers, update);

    this._formComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._formComponent.setDeleteClickHandler(this._handleDeleteClick);

    replace(this._formComponent, prevFormComponent);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._formComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._formComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._formComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._formComponent.shake(resetFormState);
        break;
    }
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._formComponent);
  }

  _replacePointToForm() {
    this._formComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    replace(this._formComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._formComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._formComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }

  _handleEditClick() {
    this._replacePointToForm();
  }

  _handleFormSubmit(update) {
    const affectsHeaderUpdate = this._point.destination !== update.destination
      || !isDatesEqual(this._point.time.startTime, update.time.startTime)
      || this._point.price !== update.price;

    this._changeData(
        UserAction.UPDATE_POINT,
        affectsHeaderUpdate ? UpdateType.AFFECTS_HEADER : UpdateType.AFFECTS_POINT_ONLY,
        update
    );
  }

  _handleDeleteClick(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.AFFECTS_HEADER,
        point
    );
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_POINT_STATUS,
        UpdateType.AFFECTS_POINT_STATUS_ONLY,
        Object.assign(
            {},
            this._point,
            {
              isFavorite: !this._point.isFavorite
            }
        )
    );
  }
}
