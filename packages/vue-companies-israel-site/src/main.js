import gtag from "vue-gtag-next";
import { createApp } from "vue";

import App from "./App.vue";

const app = createApp(App);

app.use(gtag, { config: { id: "G-BKK301VXEG" } }).mount("#app");
