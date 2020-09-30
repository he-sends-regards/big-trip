import {getTimePeriod} from "./point.js";

export const countCosts = (points) => {
  const costTypes = {
    flight: `fly`,
    checkIn: `stay`,
    drive: `drive`,
    sightseeing: `look`,
    restaurant: `eat`,
    taxi: `ride`,
    bus: `ride`,
    train: `ride`,
    transport: `ride`,
    ship: `ride`
  };

  return points.reduce((acc, point) => {
    if (Object.keys(costTypes).includes(point.type)) {
      acc[costTypes[point.type]] += point.price;
    }
    if (point.type === `check-in`) {
      acc.stay += point.price;
    }
    return acc;
  }, {
    fly: 0,
    stay: 0,
    drive: 0,
    look: 0,
    eat: 0,
    ride: 0
  });
};

export const countTransportTypes = (points) => {
  const transportTypes = {
    drive: `drive`,
    taxi: `ride`,
    bus: `ride`,
    train: `ride`,
    transport: `ride`,
    flight: `fly`,
    ship: `sail`
  };
  return points.reduce((acc, point) => {
    if (Object.keys(transportTypes).includes(point.type)) {
      acc[transportTypes[point.type]] += 1;
    }

    return acc;
  }, {
    drive: 0,
    ride: 0,
    fly: 0,
    sail: 0
  });
};

export const countTimeSpend = (points) => {
  const costTypes = {
    flight: `flight`,
    checkIn: `check-in`,
    drive: `drive`,
    sightseeing: `sightseeing`,
    restaurant: `restaurant`,
    taxi: `taxi`,
    bus: `bus`,
    train: `train`,
    transport: `transport`,
    ship: `ship`
  };
  return points.reduce((acc, point) => {
    if (point.type !== `check-in` && (point.type === null || !Object.keys(costTypes).includes(point.type))) {
      return acc;
    }

    const currentPointTimePeriod = Math.floor(getTimePeriod(point).period / 60);

    if (point.type === `check-in`) {
      acc.checkIn += currentPointTimePeriod;
    }
    acc[costTypes[point.type]] += currentPointTimePeriod;
    return acc;
  }, {
    flight: 0,
    checkIn: 0,
    drive: 0,
    sightseeing: 0,
    restaurant: 0,
    taxi: 0,
    bus: 0,
    train: 0,
    transport: 0,
    ship: 0
  });
};
