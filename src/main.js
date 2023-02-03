import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8000/'
axios.defaults.headers.common['Authorization'] = 'Bearer 9|l3lWNZWPGwfjPhd0ndVj3s28DStClgngaLDwQ0pg'

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
