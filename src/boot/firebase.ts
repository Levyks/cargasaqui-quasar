import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from 'src/stores/auth';

export default () => {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.DEV;

  const firebaseConfig = {
    apiKey: 'AIzaSyCNIXEVPjfm4ndnbeMNfyQwylAuzErtT14',
    authDomain: 'cargasaqui.firebaseapp.com',
    projectId: 'cargasaqui',
    storageBucket: 'cargasaqui.appspot.com',
    messagingSenderId: '5455008520',
    appId: '1:5455008520:web:40e84524ecfaab630fd2bd',
  };

  const app = initializeApp(firebaseConfig);

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
      '6LesZ-UfAAAAAKtr2qlUMiOiOT9ThY8D4lzrjHzx'
    ),
    isTokenAutoRefreshEnabled: true,
  });

  const auth = getAuth(app);
  const authStore = useAuthStore();

  onAuthStateChanged(auth, (userAuth) => {
    authStore.user = userAuth;
    authStore.checked = true;
    console.log('AuthStateChanged -> ', authStore.user);
  });
};
