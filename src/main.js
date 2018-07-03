import Http from '@/services/http';
import HttpClient from '@/services/httpClient';
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { store } from './store'
import Alert from '@/components/Shared/Alert.vue'

Vue.use(Vuetify);

Vue.http = new Http(HttpClient);

Vue.component('app-alert', Alert);

Vue.config.productionTip = false;

/* set base paths */
localStorage.setItem('API_BASE', 'https://api.github.com/');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created() {
    this.$store.dispatch('clearUser', null);
  }
})
