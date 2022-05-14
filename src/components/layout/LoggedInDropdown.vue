<template>
  <q-btn-dropdown
    flat
    class="self-stretch"
    :label="user?.displayName || user?.email || ''"
  >
    <q-list>
      <q-item clickable v-close-popup :to="routes.profile.path">
        <q-item-section>
          <q-item-label>{{ t('layout.header.editProfile') }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-close-popup @click="onLogout">
        <q-item-section>
          <q-item-label>{{ t('misc.logout') }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { Loading } from 'quasar';

import { useAuthStore } from 'src/stores/auth';
import { routes } from 'src/router/routes';
import { getAuth, signOut } from '@firebase/auth';
import { useFeedback } from 'src/composables';

const { t } = useI18n();

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const router = useRouter();

const { handleFirebaseError } = useFeedback();

function onLogout() {
  const auth = getAuth();

  Loading.show();
  signOut(auth)
    .then(() => {
      router.push(routes.login.path);
    })
    .catch(handleFirebaseError)
    .finally(() => {
      Loading.hide();
    });
}
</script>
