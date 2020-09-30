import {nanoid} from "nanoid";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import StatisticsView from "./view/stats.js";
import TripPresenter from "./presenter/trip.js";
import HeaderPresenter from "./presenter/header.js";
import {remove, render, RenderPosition} from "./utils/render.js";
import {FilterType, MenuItem, UpdateType} from "./const.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic ${nanoid()}`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;
const api = new Api(END_POINT, AUTHORIZATION);

const headerContainerElement = document.querySelector(`.page-header`);
const boardContainerElement = document.querySelector(`.page-main .page-body__container`);

const filterModel = new FilterModel();
const pointsModel = new PointsModel();

let tripPresenter = null;
let headerPresenter = null;

Promise.all([
  api.getDestinationsList(),
  api.getOffersList()
])
.then(([destinations, offers]) => {
  let statsComponent = null;
  const handleSiteMenuClick = (menuItem) => {
    switch (menuItem) {
      case MenuItem.POINTS:
        tripPresenter.destroy();
        tripPresenter.init();
        remove(statsComponent);
        break;
      case MenuItem.STATS:
        tripPresenter.destroy();
        if (statsComponent !== null) {
          remove(statsComponent);
        }
        statsComponent = new StatisticsView(pointsModel.getPoints());
        render(boardContainerElement, statsComponent, RenderPosition.BEFOREEND);
        break;
    }
  };

  headerPresenter = new HeaderPresenter(headerContainerElement, pointsModel, filterModel, tripPresenter, handleSiteMenuClick);
  tripPresenter = new TripPresenter(boardContainerElement, filterModel, pointsModel, api, destinations, offers, headerPresenter);
  headerPresenter.init();
  tripPresenter.init();
})
.then(() => api.getPoints())
.then((points) => {
  pointsModel.setPoints(points, UpdateType.INIT);

  document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tripPresenter.destroy();
    filterModel.setFilter(UpdateType.AFFECTS_HEADER, FilterType.EVERYTHING);
    tripPresenter.init();
    tripPresenter.createPoint();
    headerPresenter.switchDisablingNewEventBtn();
  });
});
