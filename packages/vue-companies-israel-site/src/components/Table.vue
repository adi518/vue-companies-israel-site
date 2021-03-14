<template>
  <!-- https://stackoverflow.com/questions/1071927/how-can-i-force-overflow-hidden-to-not-use-up-my-padding-right-space -->
  <Search @input="onSearch" :disabled="state.error" />
  <div class="table-container">
    <div class="scroll-container">
      <table class="table">
        <thead>
          <tr>
            <th
              v-for="(header, index) in state.headers"
              :key="index"
              :style="tdStyle"
              @click="sortTable(header.value)"
            >
              {{ header.innerText }}
              <span v-if="header.value === state.sortColumn">
                {{ state.ascending ? "↑" : "↓" }}
              </span>
              <!-- <span class="filter" v-if="header.value !== state.sortColumn">
                <Filter />
              </span> -->
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in state.rows" :key="index">
            <td
              v-for="(col, index) in row"
              v-html="col.innerHTML"
              :style="tdStyle"
              :key="index"
            ></td>
          </tr>
          <tr
            class="no-results"
            v-if="state.keyword && state.rows.length === 0"
          >
            <td :colspan="state.headers.length">Nope, can't find that. 😪</td>
          </tr>
          <tr class="error" v-if="state.error">
            <td :colspan="state.headers.length">
              An error has occurred while retrieving the table.
              <a href="/">Try again?</a> 🥵
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div style="display: flex; align-items: center; padding-top: 16rem">
      <Loader size="24rem" v-if="state.isFetching" />
      <div v-if="state.lastUpdated" class="last-updated">
        <Small>Last updated: {{ getDisplayDate(state.lastUpdated) }}</Small>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Fuse from "fuse.js";
import marked from "marked";
import { reactive, computed, onMounted } from "vue";

import {
  parseTable,
  createAsync,
  TableCellTags,
  getDisplayDate,
  setLocalStorage,
  getLocalStorage,
  getHighlightHTML,
  createErrorHandler,
  createTemplateElement,
  capitalizeFirstLetter,
} from "../utils";

import Search from "./Search.vue";
import Filter from "./Filter.vue";

import Loader from "../vue-components-next/Loader.vue";

import { merge } from "lodash";

const readmeUrl =
  "https://raw.githubusercontent.com/JonathanDn/vue-companies-israel/main/README.md";

const Columns = {
  Recruiting: {
    value: "recruiting devs",
    replaceValue: "recruiting",
    values: { unchecked: "❌" },
  },
};

export default {
  emits: ["ready"],
  setup(props, { emit }) {
    const state = reactive({
      fuse: {},
      rows: [],
      search: [],
      headers: [],
      allRows: [],
      keyword: "",
      lastUpdated: "",
      sortColumn: null,
      isFetching: false,
      ascending: false,
    });

    const handleError = createErrorHandler((error) => (state.error = error));

    const async = createAsync(
      (isFetching) => (state.isFetching = isFetching),
      handleError,
      { delay: 500 }
    );

    const getReadme = async () => await axios.get(readmeUrl).catch(handleError);

    const getTable = (onColumn) =>
      new Promise(async (resolve) => {
        const table = getLocalStorage("table");
        if (table) {
          resolve({ table: table.value, date: table.date });
        } else {
          const { error, data: readme } = await async(getReadme);
          if (error) {
            resolve({ error });
          } else {
            const html = marked(readme);
            const template = await createTemplateElement(html);
            const element = template.querySelector("table");
            const table = parseTable(element, onColumn);
            const date = setLocalStorage("table", table);
            resolve({ table, date: Date.now() });
          }
        }
      });

    const flattenTable = (table) => {
      return table
        .map((row) =>
          Object.entries(row).map(([, col]) => ({
            innerText: col.innerText,
            value: col.value,
            column: col,
            row,
          }))
        )
        .flat();
    };

    const sortTable = (colCopy, { ascending = true } = {}) => {
      const col = colCopy.toLowerCase();
      if (state.sortColumn === col) {
        state.ascending = !state.ascending;
      } else {
        state.ascending = ascending;
        state.sortColumn = col;
      }
      state.rows = state.rows.sort(
        sortPredicate(state.ascending, (row) => row[col].innerText)
      );
    };

    const sortPredicate = (ascending = true, getter = (value) => value) => (
      aCopy,
      bCopy
    ) => {
      const a = getter(aCopy);
      const b = getter(bCopy);
      if (a > b) return ascending ? 1 : -1;
      if (a < b) return ascending ? -1 : 1;
      return 0;
    };

    const sortByIndex = (index, opts) => {
      sortTable(state.headers[index].innerText, opts);
    };

    // https://fusejs.io/
    // https://github.com/krisk/Fuse/issues/229
    const filterTable = (keyword) => {
      const rows = state.fuse.search(keyword);
      state.search = rows;
      return keyword
        ? [
            ...new Set(
              rows.map(
                ({
                  item: { row, column: col, innerText },
                  matches,
                  matches: [match],
                }) => {
                  // `matches` is an array corresponding to the matched value column,
                  // we then highlight the column value via an array of indices,
                  // because a string can match multiple ranges of characters.
                  if (matches.length) {
                    col.innerHTML = getHighlightHTML(
                      col.innerText,
                      match.indices,
                      { className: "" }
                    );
                  }
                  return row;
                }
              )
            ),
          ]
        : state.allRows;
    };

    const onSearch = (event) => {
      const keyword = event.target.value;
      state.keyword = keyword;
      state.rows = filterTable(keyword);
    };

    const tdStyle = computed(() => ({
      width: `${100 / state.headers.length}%`,
    }));

    const onColumn = (col) => {
      if (
        col.tagName === TableCellTags.Th &&
        col.value === Columns.Recruiting.value
      ) {
        const value = Columns.Recruiting.replaceValue;
        return { ...col, value, innerText: capitalizeFirstLetter(value) };
      } else if (col.header === Columns.Recruiting.replaceValue && !col.value) {
        const value = Columns.Recruiting.values.unchecked;
        return { ...col, value: value.toLowerCase(), innerHTML: value };
      }
      return col;
    };

    onMounted(async () => {
      const { table, date, error } = await getTable(onColumn).catch(
        handleError
      );

      if (error) return;

      const tableHead = table.thead;
      const tableBody = table.tbody;
      const flatTable = flattenTable(tableBody);

      state.fuse = new Fuse(flatTable, {
        keys: ["value"],
        includeMatches: true,
        minMatchCharLength: 2,
      });

      state.lastUpdated = date;

      state.rows = tableBody;
      state.headers = tableHead;
      state.allRows = merge([], tableBody);

      sortByIndex(1, { ascending: false });
      emit("ready", { length: state.rows.length });
    });

    return {
      state,
      Search,
      Filter,
      tdStyle,
      onSearch,
      sortTable,
      getDisplayDate,
    };
  },
};
</script>

<style lang="scss" scoped>
// https://github.com/vuejs/rfcs/blob/master/active-rfcs/0023-scoped-styles-changes.md

$background-color: darken($color-secondary, 3.75%);

.table-container {
  padding: 16rem;
  scroll-margin-top: inherit;
  border-radius: 0 0 16rem 16rem;
  background-color: $background-color;
  box-shadow: 0 0 16rem rgba(white, 0.1);
}

// https://stackoverflow.com/a/48084076/4106263
// https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior
.scroll-container {
  height: 680rem;
  overflow-x: auto;
  overflow-y: auto;

  // https://gist.github.com/adi518/4d6f9db343e42d5d5da98f317d0e740a
  &::-webkit-scrollbar,
  &::-webkit-scrollbar-thumb {
    border-radius: 16rem;
  }

  &::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  // https://css-tricks.com/almanac/properties/s/scrollbar/
  &::-webkit-scrollbar {
    width: 8rem;
    height: 8rem;
    background-color: var(--color-secondary);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-secondary2);
  }
}

.filter {
  opacity: 0;
  transition: opacity var(--transition-duration);
}

.no-results {
  &:hover {
    color: currentColor;
    background-color: inherit;
  }
}

.error {
  color: var(--color-error);

  &:hover {
    color: var(--color-error);
    background-color: inherit;
  }
}

.last-updated {
  margin-left: auto;
}

.table {
  width: 100%;
  position: relative;
  counter-reset: rowNumber;
  border-collapse: collapse;
}

tr {
  border-spacing: 0;
  transition: background-color var(--transition-duration);
}

th,
td {
  min-width: 276rem;
  padding-left: 16rem;
  padding-right: 16rem;
  padding-bottom: 16rem; // pixel-perfect padding
}

// https://css-tricks.com/position-sticky-and-table-headers/
th {
  top: 0; // required for stickiness
  cursor: pointer;
  text-align: left;
  position: sticky;
  user-select: none;
  background-color: $background-color;
  transition: color var(--transition-duration);

  &:hover {
    color: var(--color-hover);

    .filter {
      opacity: 1;

      path {
        color: var(--color-hover);
      }
    }
  }
}

td {
  padding-top: 16rem;

  &:first-child {
    border-top-left-radius: 16rem;
    border-bottom-left-radius: 16rem;

    &:before {
      min-width: 16rem;
      margin-right: 16rem;
      display: inline-block;
      content: counter(rowNumber);
      text-align: right;
      font-family: Consolas;
      counter-increment: rowNumber;
      color: var(--color-secondary2);
    }

    :deep(img) {
      margin-right: 1ch;
    }
  }

  &:last-child {
    border-top-right-radius: 16rem;
    border-bottom-right-radius: 16rem;
  }

  :deep(img) {
    vertical-align: middle;
  }
}

tbody {
  tr {
    background-image: linear-gradient(
      180deg,
      rgba(139, 122, 122, 0.025) 0,
      transparent 50%
    );

    &:hover {
      color: var(--color-hover);
      background-color: rgba(black, 0.5);

      :deep(a) {
        color: var(--color-hover);
      }
    }
  }
}
</style>
