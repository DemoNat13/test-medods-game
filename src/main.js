import Vue from 'vue';
import App from './App.vue';

import '@/styles/index.scss';

Vue.config.productionTip = false;
Vue.config.devtools = true;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
