import Mark from "mark.js";
import packageJson from "../package.json";

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
  const value = innerText.toLowerCase();
  return {
    ...(tagName === TableCellTags.Td && { header }),
    value,
    tagName,
    innerHTML,
    innerHTMLCopy: innerHTML,
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
    window.requestAnimationFrame(() => resolve(element));
  });
}

// https://stackoverflow.com/a/33704783/4106263
export function capitalizeFirstLetter(str) {
  return str[0].toUpperCase() + str.slice(1);
}

export async function highlightHTML(str, ranges, options) {
  const template = await createTemplateElement(str);
  const mark = new Mark(template.content, options);
  mark.markRanges(ranges.map(([start, length]) => ({ start, length })));
  return template.innerHTML;
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
