import {nanoid} from "nanoid";
import moment from "moment";

export const formatPointDate = (date) => {
  if (!(date instanceof Date)) {
    return ``;
  }

  return moment(date).format(`hh:mm`);
};

export const filterElementsByDay = (elements, day) => {
  return elements.filter((point) => {
    return point.time.startTime.getDate() === day;
  });
};

export const sortPointsDates = (points) => {
  const pointsDates = points
    .reduce((dates, point) => {
      return [...dates, point.time.startTime];
    }, [])
    .sort((dateA, dateB) => dateA > dateB);

  const uniqDates = [];

  return (
    pointsDates.filter((date) => {
      const currentDateAndMonthStr = `${date.getMonth()} ${date.getDate()}`;
      if (uniqDates.includes(currentDateAndMonthStr)) {
        return false;
      }
      uniqDates.push(currentDateAndMonthStr);
      return true;
    })
  );
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortPointTime = (pointA, pointB) => {
  const weight = getWeightForNullDate(getTimePeriod(pointA).period, getTimePeriod(pointB).period);

  if (weight !== null) {
    return weight;
  }

  return getTimePeriod(pointB).period - getTimePeriod(pointA).period;
};

export const sortPointPrice = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.price, pointB.price);

  if (weight !== null) {
    return weight;
  }

  return pointB.price - pointA.price;
};

export const isDatesEqual = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return true;
  }

  return moment(dateA).isSame(dateB, `day`);
};

export const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);

  return new Date(currentDate);
};

export const isPointExpired = (date) => {
  if (date === null) {
    return false;
  }

  const currentDate = getCurrentDate();

  return moment(currentDate).isAfter(date, `day`);
};

export const generateId = () => nanoid();

export const getTimePeriod = (point) => {
  const startTime = point.time.startTime;
  const endTime = point.time.endTime;

  const diffMs = endTime - startTime;

  const msInDay = 86400000;
  const msInHour = 3600000;
  const msInMinute = 60000;

  const daysDiff = Math.floor(diffMs / msInDay);
  const hoursDiff = Math.floor((diffMs % msInDay) / msInHour);
  const minutesDiff = Math.round(((diffMs % msInDay) % msInHour) / msInMinute);

  const timePeriodTemplate = `${daysDiff > 1 ? `${daysDiff}D ` : ``} ${hoursDiff !== 0 ? `${hoursDiff}H ` : ``}${minutesDiff !== 0 ? `${minutesDiff}M` : ``}`;
  const timePeriod = minutesDiff + hoursDiff * 60 + daysDiff * 24 * 60;

  return {
    periodTemplate: timePeriodTemplate,
    period: timePeriod
  };
};

export const createPointIcon = (type) => {
  return `img/icons/${type.toLowerCase()}.png`;
};

export const createTypeWithArticle = (pointType) => {
  const pointTypeInCorrectCase = pointType.charAt(0).toUpperCase() + pointType.slice(1);
  const pointTypeArticle = [`Check-in`, `Sightseeing`, `Restaurant`].includes(pointTypeInCorrectCase) ? `in` : `to`;

  return `${pointTypeInCorrectCase} ${pointTypeArticle}`;
};
