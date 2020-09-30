import HeaderView from "../view/header.js";
import MenuView from "../view/site-menu.js";
import NewEventBtnView from "../view/new-event-btn.js";
import FilterPresenter from "./filter.js";
import {sortPointsDates} from "../utils/point.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {UpdateType, FilterType} from "../const.js";

export default class Header {
  constructor(headerContainer, pointsModel, filterModel, tripPresenter, handleSiteMenuClick) {
    this._headerContainer = headerContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._handleSiteMenuClick = handleSiteMenuClick;
    this._tripPresenter = tripPresenter;
    this._newEventBtnComponent = new NewEventBtnView();

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleNewEventClick = this._handleNewEventClick.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevHeaderComponent = this._headerComponent;
    const points = this._pointsModel.getPoints();
    this._headerComponent = new HeaderView(points, sortPointsDates(points));

    this._filterPresenter = new FilterPresenter(this._headerComponent.getElement().querySelector(`.trip-controls`), this._filterModel, this._pointsModel);
    this._filterPresenter.init();

    render(this._headerComponent.getElement().querySelector(`.trip-main`), this._newEventBtnComponent, RenderPosition.BEFOREEND);

    if (!prevHeaderComponent) {
      render(this._headerContainer, this._headerComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._headerComponent, prevHeaderComponent);
    remove(prevHeaderComponent);

    this._renderMenu(this._handleSiteMenuClick);
  }

  switchDisablingNewEventBtn() {
    this._newEventBtnComponent.getElement().disabled = !this._newEventBtnComponent.getElement().disabled;
  }

  _renderMenu(handleSiteMenuClick) {
    const menuComponent = new MenuView(handleSiteMenuClick);
    render(this._headerComponent.getElement().querySelector(`.trip-controls`), menuComponent, RenderPosition.AFTERBEGIN);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleNewEventClick() {
    this._tripPresenter.destroy();
    this._filterModel.setFilter(UpdateType.AFFECTS_HEADER, FilterType.EVERYTHING);
    this._tripPresenter.init();
    this._tripPresenter.createPoint();
  }
}
