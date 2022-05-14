import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { FirebaseError } from 'firebase/app';
import { getFirebaseErrorTranslationKey } from 'src/services/i18n';
import { useAuthStore } from 'src/stores/auth';
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { routes } from 'src/router/routes';

export function useFeedback() {
  const i18n = useI18n();
  const $q = useQuasar();

  const notifyError = (message: string) =>
    $q.notify({
      color: 'red-8',
      textColor: 'white',
      icon: 'warning',
      message,
    });

  const notifySuccess = (message: string) =>
    $q.notify({
      color: 'green-8',
      textColor: 'white',
      icon: 'done',
      message,
    });

  const handleFirebaseError = (error: FirebaseError) => {
    notifyError(i18n.t(getFirebaseErrorTranslationKey(i18n, error)));
  };

  return { notifyError, notifySuccess, handleFirebaseError, notify: $q.notify };
}

export function useOnlyAuthed() {
  const auth = useAuthStore();
  const router = useRouter();

  watch(
    auth,
    (store) => {
      if (!store.user) {
        router.push(routes.login.path);
      }
    },
    {
      immediate: true,
    }
  );
}
