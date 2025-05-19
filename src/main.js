import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'github-markdown-css/github-markdown-light.css';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.min.css';

const app = createApp(App);
app.use(router);
app.mount('#app');

