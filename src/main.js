import {createApp } from 'vue'
import Vuex from './store'
import App from './App.vue'
//import { VueResponsiveComponents } from 'vue-responsive-components'


var app = createApp(App)
app.use(Vuex)
//app.use(VueResponsiveComponents)
app.mount('#app')