import { ref, watch } from "vue";
import { useWindowScrollPosition } from "vue-use-web";

const SCROLL_HEIGHT_SCALE = 0.667;

export default {
  name: "ScrollToTopScope",
  setup() {
    const isScrollEndRef = ref(false);
    const { y: scrollYPosition } = useWindowScrollPosition();
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
    const isScrollEnd = () =>
      new Promise((resolve) =>
        window.requestAnimationFrame(() => {
          resolve(
            window.innerHeight + scrollYPosition.value >=
              document.body.scrollHeight * SCROLL_HEIGHT_SCALE
          );
        })
      );
    watch(
      () => scrollYPosition.value,
      async () => (isScrollEndRef.value = await isScrollEnd())
    );
    return { isScrollEndRef, scrollToTop };
  },
  render() {
    const { isScrollEndRef: isScrollEnd, scrollToTop } = this;
    return this.$slots.default?.({ isScrollEnd, scrollToTop });
  },
};
