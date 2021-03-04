<template>
  <div class="contributors">
    <template v-for="(contributor, index) in contributors" :key="index">
      <img
        :src="contributor.avatar_url"
        :title="contributor.login"
        :alt="contributor.login"
      />
    </template>
    <Error v-if="error.value">{{ error.value ? error.value : error }}</Error>
  </div>
</template>

<script setup>
// https://api.github.com/repos/JonathanDn/vue-companies-israel

import axios from "axios";
import { ref, reactive, defineProps, onMounted } from "vue";
import { createErrorHandler, setLocalStorage, getLocalStorage } from "../utils";

import Error from "./Error.vue";

const error = reactive({ value: null });

const handleError = createErrorHandler((err) => (error.value = err.message));

const props = defineProps({
  owner: { type: String, required: true },
  repository: { type: String, required: true },
});

const getUrl = (owner, repository) =>
  `https://api.github.com/repos/${owner}/${repository}/contributors`;

const contributors = reactive([]);

const getContributors = async () => {
  const storage = getLocalStorage("contributors");
  if (storage) return storage.value;
  const { error, data: contributors } = await axios
    .get(getUrl(props.owner, props.repository))
    .catch(handleError);
  if (error) return [];
  setLocalStorage("contributors", contributors);
  return contributors;
};

const contributorsLimit = 10;

onMounted(async () => {
  const response = await getContributors().catch(handleError);
  contributors.push(...response.slice(0, contributorsLimit));
});
</script>

<style lang="scss" scoped>
.contributors {
  display: flex;
  margin-top: 32rem;

  img {
    width: 32rem;
    display: block;
    margin-left: -8rem;
    border-radius: 50%;
  }
}
</style>
