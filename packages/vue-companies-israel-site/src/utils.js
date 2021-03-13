import { version } from "@vue/runtime-core";
import { rMerge as mergeRanges } from "ranges-merge";
import packageJson from "../package.json";
import Mark from "mark.js";

export const TableCellTags = {
  Td: "td",
  Th: "th",
};

// https://www.samanthaming.com/tidbits/49-2-ways-to-merge-arrays/#merge-array-with-push-%F0%9F%A4%94
export function parseTable(table, onColumn = (col) => col) {
  const headers = [];
  return Array.from(table.rows).reduce(
    (parsed, row) => {
      const buffer = [];
      Array.from(row.children)
        .map((col, index) => onColumn(mapCol(col, headers[index])))
        .forEach((col, index) => {
          if (col.tagName === TableCellTags.Th) {
            parsed.thead.push(col);
            if (index === getLastIndex(getTableHeadChildren(table))) {
              headers.push(...parsed.thead.map((header) => header.value));
            }
          } else if (table.tHead.rows.length === 0) {
            parsed.tbody.push(col);
          } else {
            buffer.push(col);
            if (buffer.length === row.children.length) {
              parsed.tbody.push(mapRow(headers, buffer));
              buffer.length = 0;
            }
          }
        });
      return parsed;
    },
    { thead: [], tbody: [] }
  );
}

function getLastIndex(iteratable) {
  return iteratable.length - 1;
}

function getTableHeadChildren(table) {
  return Array.from(table.tHead.rows[0].children);
}

function mapHeaders(table) {
  return getTableHeadChildren(table).map((col) =>
    mapCol(col).innerText.toLowerCase()
  );
}

function mapRow(headers, row) {
  return headers.reduce(
    (cols, col, index) => ({ ...cols, [col]: row[index] }),
    {}
  );
}

// https://stackoverflow.com/a/1981366/4106263
const replaceSpacesRegExp = / {2,}/g;

function mapCol(col, header) {
  const { tagName: tagNameCopy, innerText: innerTextCopy, innerHTML } = col;
  const innerText = innerTextCopy.trim().replace(replaceSpacesRegExp, " ");
  const tagName = tagNameCopy.toLowerCase();
  return {
    ...(tagName === TableCellTags.Td && { header }),
    value: innerText.toLowerCase(),
    tagName,
    innerHTML,
    innerText,
  };
}

const HALF_DAY_MS = 4.32e7;

function getStorageKey(key) {
  return `${packageJson.name}-${key}`;
}

// https://www.sohamkamani.com/blog/javascript-localstorage-with-ttl-expiry/
export function setLocalStorage(keyCopy, value, ttl = HALF_DAY_MS) {
  const key = getStorageKey(keyCopy);
  const now = new Date();
  const date = now.getTime();
  const item = {
    date,
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
  return item.date;
}

export function getLocalStorage(keyCopy) {
  const key = getStorageKey(keyCopy);
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item;
}

export function flattenRoutes(routes, level = 0, parent = {}) {
  if (Array.isArray(routes)) {
    return routes.reduce((flatRoutes, route) => {
      const { name, path, children, ...restRoute } = route;
      const isRoot = level === 0;
      const nested = !isRoot;
      flatRoutes.push({
        ...restRoute,
        name,
        path,
        level,
        isRoot,
        nested,
        parent: {
          ...parent,
          name: isRoot ? undefined : parent.name,
        },
      });
      if (Array.isArray(children) && children.length) {
        flatRoutes = flatRoutes.concat(
          flattenRoutes(children, level + 1, route)
        );
      }
      return flatRoutes;
    }, []);
  }
}

export function getDisplayDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" });
  return `${month} ${day}, ${year}`;
}

export function createErrorHandler(callback) {
  return function handleError(error) {
    console.error(error);
    callback(error);
    return { error };
  };
}

export function createTemplateElement(html) {
  return new Promise((resolve) => {
    const element = document.createElement("template");
    element.innerHTML = html;
    window.requestAnimationFrame(() => resolve(element.content));
  });
}

// https://stackoverflow.com/a/33704783/4106263
export function capitalizeFirstLetter(str) {
  return str[0].toUpperCase() + str.slice(1);
}

// https://stackoverflow.com/a/43104417/4106263
function stripHtmlToText(html) {
  const element = document.createElement("div");
  element.innerHTML = html;
  const text = element.textContent || element.innerText || "";
  return text.replace("\u200B", "").trim(); // zero width space
}

// TODO preserve HTML
export function getHighlightHTML(
  str,
  ranges,
  { className = "highlight" } = {}
) {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring#description
  return (mergeRanges(ranges) || ranges)
    .reduce((allRanges, range, index, ranges) => {
      const [nextRangeStart] = ranges[index + 1] || [];
      const nextStart = range[1] + 1;
      const nextEnd = nextRangeStart - 1;
      const nextRange = [nextStart, nextEnd || Infinity];
      if (index === 0 && range[0] > 0) allRanges.push([0, range[0] - 1]);
      return allRanges.concat([range.concat(true), nextRange]);
    }, [])
    .map(([start, endCopy, highlight], index, ranges) => {
      const end = endCopy + 1; // normalize to avoid empty string for equal indices
      const highlighted = str.substring(start, end);
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/mark
      if (highlight) return `<mark class="${className}">${highlighted}</mark>`;
      return str.substring(start, end);
    })
    .filter(isTruthyPredicate)
    .join("");
}

function isTruthyPredicate(value) {
  return value;
}

export const createAsync = (setState, onError, { delay } = {}) => async (
  asyncFn
) => {
  setState(true);
  const fnPromise = await asyncFn().catch(onError);
  const delayPromise = new Promise((resolve) => setTimeout(resolve, delay));
  const [, result] = await Promise.all([delayPromise, fnPromise]);
  setState(false);
  return result;
};

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

// if (index === 0 && str === "Yad2") {
//   console.log(ranges);
// }
