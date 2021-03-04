<template>
  <!-- https://stackoverflow.com/questions/1071927/how-can-i-force-overflow-hidden-to-not-use-up-my-padding-right-space -->
  <div ref="root" class="table">
    <div class="scroll-container">
      <table>
        <thead>
          <tr>
            <th
              v-for="(col, index) in state.head"
              :key="index"
              :style="tdStyle"
              @click="sortTable(col.innerText)"
            >
              {{ col.innerText }}
              <span v-if="col.innerText === state.sortColumn">
                {{ state.ascending ? "↑" : "↓" }}
              </span>
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
          <tr class="no-results" v-if="keyword && state.rows.length === 0">
            <td :colspan="state.head.length">Nope, can't find that. 😪</td>
          </tr>
          <tr class="error" v-if="state.error">
            <td :colspan="state.head.length">
              An error has occurred while retrieving the table.
              <a href="/">Try again?</a> 🥵
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="state.lastUpdated" class="last-updated">
      <Small>Last updated: {{ getDisplayDate(state.lastUpdated) }}</Small>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import marked from "marked";
import Small from "./Small.vue";
import { ref, watch, reactive, computed, onMounted } from "vue";

import {
  parseTable,
  isProduction,
  createElement,
  getTableIndex,
  getDisplayDate,
  setLocalStorage,
  getLocalStorage,
  createErrorHandler,
} from "../utils";

const readmeUrl =
  "https://raw.githubusercontent.com/JonathanDn/vue-companies-israel/main/README.md";

export default {
  emits: ["ready"],
  props: { keyword: { type: String } },
  setup(props, { emit }) {
    const root = ref(null);
    const scrollContainer = ref(null);

    const state = reactive({
      head: [],
      rows: [],
      index: [],
      lastUpdated: "",
      sortColumn: null,
      ascending: false,
    });

    const getRef = () => root.value;

    const handleError = createErrorHandler((error) => (state.error = error));

    const getReadme = async () => await axios.get(readmeUrl).catch(handleError);

    const getTable = () =>
      new Promise(async (resolve) => {
        const table = getLocalStorage("table");
        if (table) {
          resolve({ table: table.value, date: table.date });
        } else {
          const { error, data: readme } = await getReadme();
          if (error) {
            resolve({ error });
          } else {
            const html = marked(readme);
            const fragment = await createElement(html);
            const element = fragment.querySelector("table");
            const table = parseTable(element);
            const date = setLocalStorage("table", table);
            resolve({ table, date });
          }
        }
      });

    const sortTable = (col, { ascending = true } = {}) => {
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

    const sortByIndex = (index, opts) =>
      sortTable(state.head[index].innerText, opts);

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
    const filter = (keyword) => {
      const matched = new Set();
      state.index.forEach(([value, row]) => {
        if (value.match(new RegExp(keyword))) {
          matched.add(row);
        }
      });
      return Array.from(matched);
    };

    watch(
      () => props.keyword,
      (keyword) => (state.rows = filter(keyword))
    );

    onMounted(async () => {
      const { table, date, error } = await getTable().catch(handleError);

      if (!error) {
        state.index = getTableIndex(table.tbody);
        state.head = table.thead;
        state.rows = table.tbody;
        state.lastUpdated = date;

        sortByIndex(1, { ascending: false });
        emit("ready", { length: state.rows.length });
      }
    });

    const tdStyle = computed(() => ({ width: `${100 / state.head.length}%` }));

    return {
      Small,
      root,
      state,
      getRef,
      tdStyle,
      sortTable,
      getDisplayDate,
      scrollContainer,
    };
  },
};
</script>

<style lang="scss" scoped>
// https://github.com/vuejs/rfcs/blob/master/active-rfcs/0023-scoped-styles-changes.md

$background-color: darken($color-secondary, 3.75%);

.table {
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
    width: 6rem;
    height: 6rem;
    background-color: var(--color-secondary);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-primary);
  }
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
  padding-top: 8rem;
  text-align: right;
}

table {
  width: 100%;
  position: relative;
  border-collapse: collapse;
}

tr {
  border-spacing: 0;
  transition: background-color var(--transition-duration);
}

th,
td {
  min-width: 256rem;
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
  }
}

td {
  padding-top: 16rem;

  &:first-child {
    border-top-left-radius: 16rem;
    border-bottom-left-radius: 16rem;

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
