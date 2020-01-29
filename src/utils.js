import { LINKS_PER_PAGE } from "./contants";

const timeDifference = (current, previous) => {
  const MILLISECONDSPERMINUTE = 60 * 1000;
  const MILLISECONDSPERHOUR = MILLISECONDSPERMINUTE * 60;
  const MILLISECONDSPERDAY = MILLISECONDSPERHOUR * 24;
  const MILLISECONDSPERMONTH = MILLISECONDSPERDAY * 30;
  const MILLISECONDSPERYEAR = MILLISECONDSPERDAY * 365;

  const elapsed = current - previous;

  if (elapsed < MILLISECONDSPERMINUTE / 3) {
    return "just now";
  }

  if (elapsed < MILLISECONDSPERMINUTE) {
    return "less than 1 min ago";
  } else if (elapsed < MILLISECONDSPERHOUR) {
    return Math.round(elapsed / MILLISECONDSPERMINUTE) + " min ago";
  } else if (elapsed < MILLISECONDSPERDAY) {
    return Math.round(elapsed / MILLISECONDSPERHOUR) + " h ago";
  } else if (elapsed < MILLISECONDSPERMONTH) {
    return Math.round(elapsed / MILLISECONDSPERDAY) + " days ago";
  } else if (elapsed < MILLISECONDSPERYEAR) {
    return Math.round(elapsed / MILLISECONDSPERMONTH) + " mo ago";
  } else {
    return Math.round(elapsed / MILLISECONDSPERYEAR) + " years ago";
  }
};

export const timeDifferenceForDate = date => {
  const now = new Date().getTime();
  const updated = new Date(date).getTime();

  return timeDifference(now, updated);
};

export const isNewPage = props => props.location.pathname.includes("new");
export const pageIndex = props =>
  props.match.params.page ? (props.match.params.page - 1) * LINKS_PER_PAGE : 0;
export const page = props => parseInt(props.match.params.page, 10);
