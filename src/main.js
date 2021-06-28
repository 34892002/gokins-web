import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
import comm from '@/assets/comm'
import Message from '@/components/message'

import '@/assets/css/comm.css'
import '@/assets/css/icon.sass'

Vue.config.performance = true;
Vue.use(CoreuiVue);
Vue.use(Message);
Vue.use(comm);
Vue.prototype.$log = console.log.bind(console);

new Vue({
    el: '#app',
    router,
    store,
    icons,
    template: '<App/>',
    components: {
        App
    }
})