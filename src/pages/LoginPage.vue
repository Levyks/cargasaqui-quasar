<template>
  <q-page class="row justify-center items-center">
    <q-card bordered class="q-ma-sm" style="width: min(500px, 100%)">
      <q-form ref="form" @submit="onSubmit">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ t('login.title') }}</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="email"
            name="email"
            type="email"
            :label="t('login.fields.email.label')"
            class="q-mb-sm"
            lazy-rules
            :rules="[createDefaultRequiredRule(t), createEmailRule(t)]"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>
          <PasswordInput class="q-mb-sm" v-model="password" required />
        </q-card-section>

        <q-card-actions class="q-px-lg">
          <q-btn
            unelevated
            size="lg"
            color="accent"
            class="full-width"
            type="submit"
            :label="t('login.submit')"
          />
        </q-card-actions>

        <q-card-section class="text-center q-pa-sm q-mb-lg">
          <router-link to="#" class="text-grey-8">{{
            t('login.forgotPassword')
          }}</router-link>
        </q-card-section>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { Loading, QForm } from 'quasar';
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';

import {
  createDefaultRequiredRule,
  createEmailRule,
} from 'services/validation';

import { routes } from 'router/routes';
import { useAuthStore } from 'stores/auth';
import { useFeedback } from 'composables';

import PasswordInput from 'components/misc/PasswordInput.vue';

const router = useRouter();
const i18n = useI18n();
const t = i18n.t;
const { handleFirebaseError } = useFeedback();

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

let form = $ref<QForm | null>(null);
let email = $ref<string | null>(null);
let password = $ref<string | null>(null);

function getRedirectToUrl(): string {
  const url = new URL(window.location.href);
  return url.searchParams.get('goto') || routes.home.path;
}

function onSubmit() {
  // Just to avoid a null-check down below
  if (!email || !password) return;

  Loading.show();
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      router.push(getRedirectToUrl());
    })
    .catch(handleFirebaseError)
    .finally(() => {
      password = null;
      form?.resetValidation();
      Loading.hide();
    });
}

watch(user, (u) => {
  if (u) router.push(getRedirectToUrl());
});
</script>
