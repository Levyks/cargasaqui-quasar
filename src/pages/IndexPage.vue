<template>
  <q-page class="row items-center justify-evenly">
    <h1>{{ t('layout.header.editProfile') }}</h1>
    <!--<example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component> -->
  </q-page>
</template>

<script lang="ts" setup>
import { Todo, Meta } from 'components/models';
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
