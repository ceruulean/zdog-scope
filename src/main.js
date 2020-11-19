import {createApp } from 'vue'
import Vuex from './store'
import App from './App.vue'

var app = createApp(App)
app.use(Vuex)
app.mount('#app')