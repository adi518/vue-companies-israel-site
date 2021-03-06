import * as Components from "./vue-components-next-export";

export { getNavHeight } from "./Nav.vue";
export { default as ScrollToAnchor } from "./ScrollToAnchor";

const Plugin = {
  install(Vue) {
    Object.keys(Components).forEach((key) =>
      Vue.component(key, Components[key])
    );
  },
};

export default Plugin;
