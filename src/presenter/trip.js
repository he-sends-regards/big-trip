import BoardView from "../view/board.js";
import NoPointsView from "../view/no-points.js";
import SortView from "../view/sort.js";
import DayListView from "../view/day-list.js";
import DayView from "../view/day.js";
import PointListView from "../view/point-list.js";
import LoadingView from "../view/loading.js";
import PointPresenter, {State as PointPresenterViewState} from "./point.js";
import PointNewPresenter from "./point-new.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortPointsDates, filterElementsByDay, sortPointTime, sortPointPrice} from "../utils/point.js";
import {filter} from "../utils/filters.js";
import {SortType, UpdateType, UserAction} from "../const.js";

export default class Trip {
  constructor(boardContainer, filterModel, pointsModel, api, destinations, offers, headerPresenter) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._boardContainer = boardContainer;

    this._destinations = destinations;
    this._offers = offers;

    this._boardComponent = new BoardView();
    this._noPointsComponent = new NoPointsView();
    this._sortComponent = null;
    this._dayListComponent = new DayListView();
    this._loadingComponent = new LoadingView();

    this._currentSortType = SortType.DEFAULT;
    this._renderedPointsCount = this._getPoints().length;
    this._pointPresenter = {};
    this._dayComponents = [];
    this._arePointsBelongsDay = true;
    this._isLoading = true;
    this._api = api;

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._dayListComponent, this._handleViewAction, this._destinations, this._offers, headerPresenter);
  }

  init() {
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._dayListComponent, RenderPosition.BEFOREEND);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  destroy() {
    this._clearBoard({resetDaySeparation: true, resetSortType: true});

    remove(this._dayListComponent);
    remove(this._boardComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint() {
    this._pointNewPresenter.init();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);


    switch (this._currentSortType) {
      case SortType.TIME:
        this._arePointsBelongsDay = false;
        return filteredPoints.sort(sortPointTime);
      case SortType.PRICE:
        this._arePointsBelongsDay = false;
        return filteredPoints.sort(sortPointPrice);
    }
    this._arePointsBelongsDay = true;
    return filteredPoints;
  }

  _clearBoard({resetDaySeparation = false, resetSortType = false} = {}) {
    const pointCount = this._getPoints().length;

    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._clearDayList();
    this._pointPresenter = {};

    remove(this._sortComponent);
    remove(this._noPointsComponent);
    remove(this._loadingComponent);

    if (resetDaySeparation) {
      this._arePointsBelongsDay = false;
    } else {
      this._renderedPointsCount = Math.min(pointCount, this._renderedPointsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _clearDayList() {
    this._dayComponents.forEach(remove);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
      remove(this._sortComponent);
    }

    if (!this._isLoading) {
      this._sortComponent = new SortView(this._currentSortType);
      this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

      render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _renderDay(dayComponent, pointListComponent) {
    render(this._dayListComponent, dayComponent, RenderPosition.BEFOREEND);
    render(dayComponent, pointListComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(container, point) {
    const pointPresenter = new PointPresenter(container, this._handleViewAction, this._handleModeChange, this._destinations, this._offers);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints(points) {
    if (this._arePointsBelongsDay) {
      sortPointsDates(points).forEach((date, dayNumber = 0) => {
        dayNumber += 1;

        const day = date.getDate();

        const filteredPoints = filterElementsByDay(points, day);

        const dayComponent = new DayView(dayNumber, filteredPoints[0].time.startTime);
        this._dayComponents.push(dayComponent);

        const pointListComponent = new PointListView();

        filteredPoints.forEach((point) => {
          this._renderPoint(pointListComponent, point);
        });

        this._renderDay(dayComponent, pointListComponent);
      });
    } else {
      points.forEach((point) => {
        this._renderPoint(this._dayListComponent, point);
      });
    }
  }

  _renderNoPoints() {
    render(this._boardContainer, this._noPointsComponent, RenderPosition.BEFOREEND);
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    const points = this._getPoints();
    const pointsCount = points.length;

    if (pointsCount === 0 && !this._isLoading) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPoints(this._getPoints().slice(0, pointsCount));
  }

  _renderLoading() {
    render(this._boardComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
        .then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        })
        .catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
        .then((response) => {
          this._pointsModel.addPoint(updateType, response);
        })
        .catch(() => {
          this._pointNewPresenter.setAborting();
        });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
        .then(() => {
          this._pointsModel.deletePoint(updateType, update);
        })
        .catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
      case UserAction.UPDATE_POINT_STATUS:
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.AFFECTS_POINT_ONLY:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.AFFECTS_POINT_STATUS_ONLY:
        this._pointPresenter[data.id].updatePoint(data);
        break;
      case UpdateType.AFFECTS_HEADER:
        this._clearBoard({resetDaySeparation: true, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearBoard({resetDaySeparation: true});
    this._renderBoard();
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }
}
