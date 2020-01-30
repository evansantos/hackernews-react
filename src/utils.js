import {
  LINKS_PER_PAGE,
  MILLISECONDSPERMINUTE,
  MILLISECONDSPERHOUR,
  MILLISECONDSPERDAY,
  MILLISECONDSPERMONTH,
  MILLISECONDSPERYEAR
} from "./contants";

const timeDifference = (current, previous) => {
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

export const getDomain = url => {
  var matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
  return matches && matches[1]; // domain will be null if no match is found
};

export const isNewPage = props => props.location.pathname.includes("new");
export const pageIndex = props =>
  props.match.params.page ? (props.match.params.page - 1) * LINKS_PER_PAGE : 0;
export const getPage = props => parseInt(props.match.params.page, 10);
export const queryParams = page => {
  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
  const first = isNewPage ? LINKS_PER_PAGE : 100;
  const orderBy = isNewPage ? "createdAt_DESC" : null;

  return { skip, first, orderBy };
};
