<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <router-link :to="routes.home.path">
          <img
            :src="logo"
            class="logo q-ma-sm"
            :alt="t('layout.header.logoAlt')"
          />
        </router-link>

        <q-space />

        <logged-in-dropdown v-if="user" />
        <q-btn
          class="self-stretch"
          flat
          :label="t('misc.login')"
          :to="loginPath"
          :disable="route.name === 'login'"
          v-else
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item v-for="link in links" :key="link.path" :to="link.path">
          <q-item-section v-if="link.icon" avatar>
            <q-icon :name="link.icon" />
          </q-item-section>

          <q-item-section>{{ link.title }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-if="authChecked" />
      <loading-page v-else />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import logo from 'assets/img/logo_full_white.png';

import { routes } from 'router/routes';
import { useAuthStore } from 'stores/auth';

import LoggedInDropdown from 'components/layout/LoggedInDropdown.vue';

import LoadingPage from 'pages/LoadingPage.vue';

const { t } = useI18n();
const leftDrawerOpen = ref(false);

const authStore = useAuthStore();
const { user, checked: authChecked } = storeToRefs(authStore);

const route = useRoute();

const links = computed(() => [
  {
    title: t('layout.drawer.companies'),
    icon: 'warehouse',
    path: routes.companies.path,
  },
]);

const loginPath = computed(() => {
  const search = new URLSearchParams();
  search.set('goto', route.path);
  return routes.login.path + '?' + search.toString();
});
</script>

<style scoped lang="scss">
.logo {
  height: 40px;
}
</style>
