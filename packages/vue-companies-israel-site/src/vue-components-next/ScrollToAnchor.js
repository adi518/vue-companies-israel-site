import { flattenRoutes } from "../utils";

const getPaths = (router) =>
  flattenRoutes(router.options.routes).reduce(
    (acc, route) => ({ ...acc, [route.path]: 1 }),
    {}
  );

// https://stackoverflow.com/questions/52292603/is-there-a-callback-for-window-scrollto
function scrollTo(offset, callback = () => {}) {
  const onScroll = function () {
    if (window.pageYOffset === Math.floor(offset)) {
      window.removeEventListener("scroll", onScroll);
      callback();
    }
  };
  window.addEventListener("scroll", onScroll);
  onScroll();
  window.scrollTo({
    top: offset,
    behavior: "smooth",
  });
}

const beforeEach = (to, from, next) => {
  if (to.matched.length) return next();
  next({ path: `${from.path}?a=${to.path.substr(1)}` });
};

const ScrollToAnchor = (
  router,
  { offsetY = async () => 0, offsetMultiplier = 2 } = {}
) => {
  if (ScrollToAnchor.Component) return ScrollToAnchor.Component;
  const paths = [];
  if (router) {
    paths.concat(getPaths(router));
    router.beforeEach(beforeEach);
  }
  if (offsetMultiplier) {
    const offsetYCopy = offsetY;
    offsetY = () => offsetYCopy() * offsetMultiplier;
  }
  const globalAnchorClickListener = new GlobalAnchorClickListener(
    paths,
    offsetY
  );
  ScrollToAnchor.Component = {
    data: () => ({ isMounted: false }),
    mounted() {
      this.isMounted = true;
      this.scrollToLocalAnchor();
      globalAnchorClickListener.add();
    },
    beforeUnmount() {
      this.isMounted = false;
      globalAnchorClickListener.remove();
    },
    methods: {
      async scrollToLocalAnchor() {
        if (!this.isMounted) return;
        // https://stackoverflow.com/a/901144/4106263
        // https://stackoverflow.com/a/11662717/4106263
        // https://stackoverflow.com/a/56895999/4106263
        const urlParams = new URLSearchParams(window.location.hash.substr(2));
        const anchorId = urlParams.get("a");
        if (anchorId) {
          await this.$nextTick();
          scrollToAnchor(anchorId, offsetY);
        }
      },
    },
    render() {
      return null;
    },
  };
  return ScrollToAnchor.Component;
};

ScrollToAnchor.Component = null;

const scrollToAnchor = (anchorElOrId, offsetY = () => 0) => {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      let anchorEl;
      if (anchorElOrId instanceof HTMLAnchorElement) {
        // derive id from anchor `href` and look for an
        // element with that id, otherwise fallback to anchor.
        const hrefAsId = anchorElOrId.getAttribute("href").substr(1);
        if (document.getElementById(hrefAsId)) {
          anchorEl = document.getElementById(hrefAsId);
        } else {
          anchorEl = anchorElOrId;
        }
      } else {
        anchorEl =
          document.getElementById(anchorElOrId) ||
          document.querySelector(`[href='#${anchorElOrId}'`);
      }
      const y = () =>
        anchorEl.getBoundingClientRect().top + window.pageYOffset - offsetY();
      scrollTo(y());
      resolve();
    });
  });
};

class GlobalAnchorClickListener {
  static createClickHandler = (paths, offsetY = () => 0) => async (event) => {
    const anchorEl = event.target.closest("a") || event.target;
    if (!(anchorEl instanceof HTMLAnchorElement) || !/^#/.test(anchorEl.hash)) {
      return;
    }
    const path = anchorEl.hash?.substr(1);
    if (!paths[path] && window.location.host === anchorEl.host) {
      event.preventDefault();
      await scrollToAnchor(anchorEl, offsetY);
      window.location.hash = `?a=${path}`;
    }
  };
  constructor(paths, offsetY) {
    const handleClick = GlobalAnchorClickListener.createClickHandler(
      paths,
      offsetY
    );
    this.add = () => document.addEventListener("click", handleClick, true);
    this.remove = () => document.removeEventListener("click", handleClick);
  }
}

// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
export function closestPolyfill() {
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;
  }

  if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      var el = this;

      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }
}

closestPolyfill();

export default ScrollToAnchor;
