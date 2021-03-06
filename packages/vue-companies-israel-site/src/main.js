import gtag from "vue-gtag-next";
import { createApp } from "vue";

import App from "./App.vue";
import Components from "@/vue-components-next";

const app = createApp(App);

app.use(Components);
app.use(gtag, { config: { id: "G-BKK301VXEG" } });

app.mount("#app");
