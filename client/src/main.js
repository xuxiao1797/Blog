import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import {createDiscreteApi} from 'naive-ui'
import {createPinia} from "pinia"
import {router} from './common/router'
import axios from 'axios'

axios.defaults.baseURL = "http://localhost:8080"

const {message,notification,dialog} = createDiscreteApi(["message","notification","dialog"])

/**
 * axios
 * pinia
 * sass
 * vue-router
 * naive-ui
 * wangeditor
 */


const app = createApp(App)

app.provide("axios",axios)
app.provide("message",message)
app.provide("notification",notification)
app.provide("dialog",dialog)
app.use(naive);
app.use(createPinia());
app.use(router);
app.mount('#app')
