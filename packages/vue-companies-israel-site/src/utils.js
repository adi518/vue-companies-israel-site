import packageJson from "../package.json";

// https://www.samanthaming.com/tidbits/49-2-ways-to-merge-arrays/#merge-array-with-push-%F0%9F%A4%94
export function parseTable(table) {
  const headers = [];
  return Array.from(table.rows).reduce(
    (parsed, row) => {
      const buffer = [];
      Array.from(row.children)
        .map(mapCol)
        .forEach((col, colIndex) => {
          if (col.tagName.toLowerCase() === "th") {
            parsed.thead.push(col);
            if (colIndex === getTableHeadChildren(table).length - 1) {
              headers.push(...mapHeaders(table));
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

export function getTableIndex(table) {
  return table
    .map((row) =>
      Object.entries(row).map(([, col]) => [col.innerTextLowerCase, row])
    )
    .flat();
}

function getTableHeadChildren(table) {
  return Array.from(table.tHead.rows[0].children);
}

function mapHeaders(table) {
  return getTableHeadChildren(table).map((col) => mapCol(col).innerText);
}

function mapRow(headers, row) {
  return headers.reduce(
    (cols, col, index) => ({ ...cols, [col]: row[index] }),
    {}
  );
}

function mapCol(col) {
  const { tagName, innerText: innerTextCopy, innerHTML } = col;
  const innerText = innerTextCopy.trim();
  return {
    tagName: tagName.toLowerCase(),
    innerHTML,
    innerText: innerText,
    innerTextLowerCase: innerText.toLowerCase(),
  };
}

const DAY_MS = 8.64e7;

function getStorageKey(key) {
  return `${packageJson.name}-${key}`;
}

// https://www.sohamkamani.com/blog/javascript-localstorage-with-ttl-expiry/
export function setLocalStorage(keyCopy, value, ttl = DAY_MS) {
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
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" });
  const days = new Date(year, date.getMonth(), 0).getDate();
  return `${month} ${days}, ${year}`;
}

export function createErrorHandler(callback) {
  return function handleError(error) {
    console.error(error);
    callback(error);
    return { error };
  };
}

export function createElement(html) {
  return new Promise((resolve) => {
    const element = document.createElement("template");
    element.innerHTML = html;
    window.requestAnimationFrame(() => resolve(element.content));
  });
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}
