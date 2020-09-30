import {FilterType} from "../const";
import {isPointExpired} from "./point";

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => !isPointExpired(point.time.startTime)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointExpired(point.time.startTime)),
};
