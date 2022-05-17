<template>
  <q-page class="row justify-center items-center">
    <q-card bordered class="q-ma-sm" style="width: min(500px, 100%)">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ t('notFound.title') }}</div>
      </q-card-section>

      <q-card-section class="text-center">
        <div class="row no-wrap items-center q-my-md">
          <q-icon size="80px" name="search_off" />
          <p class="text-body1 q-mb-none">
            {{ t('notFound.description') }}
          </p>
        </div>

        <router-link :to="routes.home.path" class="text-grey-8">{{
          t('notFound.goHome')
        }}</router-link>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { routes } from 'router/routes';

const { t } = useI18n();
</script>
