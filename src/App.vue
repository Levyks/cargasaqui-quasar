<template>
  <router-view v-if="messagesLoaded" />
</template>

<script setup lang="ts">
import { LocaleMessages, useI18n, VueMessageType } from 'vue-i18n';
import { computed } from 'vue';

const i18n = useI18n<LocaleMessages<VueMessageType>>();

const messagesLoaded = computed(() => {
  const localeMessages = i18n.messages.value[i18n.locale.value] || {};

  return Object.keys(localeMessages).length > 0;
});
</script>
