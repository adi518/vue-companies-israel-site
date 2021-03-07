<template>
  <Nav v-slot="scope">
    <Toggle
      disabled
      unit="rem"
      width="50"
      height="25"
      fontSize="14"
      checkedText="🌜"
      uncheckedText="🌞"
      dotClass="toggle-dot"
      dotColor="currentColor"
      checkedBg="var(--color-secondary2)"
      uncheckedBg="var(--color-secondary2)"
      :value="toggleDarkMode"
      @click="toggleDarkMode = !toggleDarkMode"
    />
    <Social>
      <GitHubAnchor
        :class="{ 'is-sticky': scope.isSticky }"
        href="https://github.com/JonathanDn/vue-companies-israel"
      />
    </Social>
  </Nav>
  <Header :companies="companies" />
  <Container content>
    <Heading level="3" href="#what-is-vuejs">What is Vue.js?</Heading>
    <p>
      <a href="https://vuejs.org/">Vue.js</a> is an open-source
      model–view–viewmodel front end JavaScript framework for building user
      interfaces and single-page applications. It was created by Evan You, and
      is maintained by him and the rest of the active core team members.
      <a href="https://en.wikipedia.org/wiki/Vue.js">Wikipedia</a>
    </p>
  </Container>
  <Container content id="get-started">
    <Search @input="onSearch" />
    <Table :keyword="keyword" @ready="onTableReady" />
    <p>
      <Small>
        * Table does NOT contain freelancers, consultancies, software
        contractors or open source projects working with
        <a href="https://vuejs.org/">Vue.js</a>.
      </Small>
    </p>
  </Container>
  <Container content>
    <Heading level="3" href="#explore-resources">Explore Resources</Heading>
    <Swiper :space-between="16" :breakpoints="swiperBreakpoints">
      <SwiperSlide>
        <a href="https://madewithvuejs.com/">
          <Slide src="resources/made-with-vuejs.png" />
        </a>
      </SwiperSlide>
      <SwiperSlide>
        <a href="https://github.com/vuejs/awesome-vue">
          <Slide src="resources/awesome-vue.svg" />
        </a>
      </SwiperSlide>
      <SwiperSlide>
        <a href="https://www.vuemastery.com/">
          <Slide src="resources/vue-mastery.svg" />
        </a>
      </SwiperSlide>
      <SwiperSlide>
        <a href="https://daily.dev/">
          <Slide src="resources/daily-dev.png" />
        </a>
      </SwiperSlide>
      <SwiperSlide>
        <a href="https://www.udemy.com/course/vuejs-2-the-complete-guide/">
          <Slide src="resources/udemy.svg" />
        </a>
      </SwiperSlide>
      <SwiperSlide>
        <a href="https://www.vuemastery.com/pdf/Vue-3-Cheat-Sheet.pdf">
          <Slide cover src="resources/vue-composition-api-cheatsheet.png" />
        </a>
      </SwiperSlide>
    </Swiper>
    <!-- <Heading level="3" href="#made-by">Upcoming Meetups</Heading> -->
    <Heading level="3" href="#made-by">Made by</Heading>
    <Contributors owner="JonathanDn" repository="vue-companies-israel" />
    <Heading level="3" href="#contributing">Contributing</Heading>
    <p>
      If your company is currently working with
      <a href="https://vuejs.org/">Vue.js</a>, open a
      <a href="https://github.com/JonathanDn/vue-companies-israel/pulls">
        pull request</a
      >
      to add it to the table above. If it's also currently recruiting, make sure
      to check the <b>Recruiting</b> column.
    </p>
    <Heading level="3" href="#links">Community</Heading>
    <Community />
    <Heading level="3" href="#links">Links</Heading>
    <Links />
  </Container>
  <Footer />
  <ScrollToTop />
  <ScrollToAnchor />
</template>

<script setup>
// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md

// https://stackoverflow.com/a/58193460/4106263
// https://github.com/vuejs/composition-api/issues/317
// https://stackoverflow.com/questions/64231942/vue-ref-on-custom-child-component-not-working

import "./styles/global.scss";

import axios from "axios";
import { reactive, onMounted } from "vue";

import Table from "./components/Table.vue";
import Slide from "./components/Slide.vue";
import Links from "./components/Links.vue";
import Search from "./components/Search.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

import {
  getNavHeight,
  ScrollToAnchor as ScrollToAnchorCreator,
} from "./vue-components-next";

const ScrollToAnchor = ScrollToAnchorCreator(null, {
  offsetY: getNavHeight,
});

import { ref } from "vue";

const keyword = ref("");
const companies = ref(null);
const toggleDarkMode = ref(true);
const meetups = reactive({ value: [] });

const swiperBreakpoints = {
  0: {
    slidesPerView: 3,
  },
  991.98: {
    slidesPerView: 6,
  },
};

const meetupsUrl =
  "https://api.meetup.com/find/groups?radius=1&category=253&order=members";

const getMeetups = () => axios.get(meetupsUrl);

const onSearch = (event) => (keyword.value = event.target.value);
const onTableReady = ({ length }) => (companies.value = length);

onMounted(async () => {
  // const { data: meetups } = await getMeetups();
  // meetups.value = meetups;
  // console.log(meetups);
});
</script>

<style lang="scss">
@import "swiper/swiper-bundle.min.css";

#app {
  min-width: 320px;
  background-color: var(--color-secondary);
}

.toggle-dot {
  transition: background-color var(--transition-duration);

  &:hover {
    background-color: var(--color-primary) !important;
  }
}

.github-anchor {
  margin-left: auto;
}
</style>
