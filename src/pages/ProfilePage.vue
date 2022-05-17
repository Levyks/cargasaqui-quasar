<template>
  <q-page class="row justify-center items-center">
    <q-card bordered class="q-ma-sm" style="width: min(500px, 100%)">
      <q-form ref="form" @submit="onSubmit">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ t('profile.title') }}</div>
        </q-card-section>

        <q-card-section>
          <q-input
            :model-value="user?.email"
            :label="t('profile.fields.email.label')"
            name="email"
            type="email"
            class="q-mb-sm"
            disable
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            v-model="displayName"
            :label="t('profile.fields.name.label')"
            name="name"
            type="text"
            class="q-mb-sm"
            lazy-rules
            :rules="[createDefaultRequiredRule(t)]"
          >
            <template v-slot:prepend>
              <q-icon name="badge" />
            </template>
          </q-input>

          <hr class="q-my-md" />

          <PasswordInputWithMeter
            :label="t('profile.fields.newPassword.label')"
            :hint="t('profile.fields.newPassword.notice')"
            class="q-mb-sm"
            v-model="password"
          />

          <template v-if="password">
            <PasswordInput
              :label="t('profile.fields.newPasswordConfirmation.label')"
              class="q-mb-sm"
              v-model="passwordConfirm"
              :rules="[createPasswordConfirmationRule(t, password)]"
              :required="!!password"
            />

            <PasswordInput
              :label="t('profile.fields.currentPassword.label')"
              class="q-mb-sm"
              v-model="currentPassword"
              :hint="t('profile.fields.currentPassword.notice')"
              :required="!!password"
            />
          </template>
        </q-card-section>

        <q-card-actions class="q-pa-lg">
          <q-btn
            unelevated
            size="lg"
            color="accent"
            class="full-width"
            type="submit"
            :label="t('profile.submit')"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { Loading, QForm } from 'quasar';
import {
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  updatePassword,
} from '@firebase/auth';

import {
  createDefaultRequiredRule,
  createPasswordConfirmationRule,
} from 'services/validation';

import { useAuthStore } from 'stores/auth';

import PasswordInput from 'components/misc/PasswordInput.vue';
import PasswordInputWithMeter from 'components/misc/PasswordInputWithMeter.vue';
import { watch } from 'vue';
import { useFeedback, useOnlyAuthed } from 'composables';

useOnlyAuthed();
const i18n = useI18n();
const t = i18n.t;
const { handleFirebaseError, notifyError, notifySuccess } = useFeedback();

const authStore = useAuthStore();
let { user } = $(storeToRefs(authStore));

let form = $ref<QForm | null>(null);

let displayName = $ref<string | null>(null);
let password = $ref<string | null>(null);
let passwordConfirm = $ref<string | null>(null);
let currentPassword = $ref<string | null>(null);

function clearPasswords() {
  password = null;
  passwordConfirm = null;
  currentPassword = null;
  form?.resetValidation();
}

function onSubmit() {
  if (!user || !user.email) return;

  let wasPasswordChanged = false;
  const promises = [];

  if (displayName !== user.displayName) {
    promises.push(
      updateProfile(user, { displayName }).catch((e) => {
        console.error('foi aqui', e);
        throw e;
      })
    );
  }

  if (password) {
    const auth = getAuth();

    const promise = signInWithEmailAndPassword(auth, user.email, password).then(
      () => {
        if (currentPassword === password) {
          notifyError(t('errors.newPasswordSameAsOld'));
          return;
        }

        return updatePassword(user!, password!).then(
          () => (wasPasswordChanged = true)
        );
      }
    );

    promises.push(promise);
  }

  Loading.show();
  return Promise.all(promises)
    .then(() => {
      notifySuccess(t('profile.saved'));
      if (wasPasswordChanged) user = null;
    })
    .catch(handleFirebaseError)
    .finally(() => {
      clearPasswords();
      Loading.hide();
    });
}

watch(
  $$(user),
  (u) => {
    if (!u) return;
    if (u.displayName) displayName = u.displayName;
  },
  {
    immediate: true,
  }
);
</script>
