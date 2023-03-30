import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import {createDiscreteApi} from 'naive-ui'
import {createPinia} from "pinia"
import {router} from './common/router'
import axios from 'axios'
import { AdminStore} from './stores/AdminStore'

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
app.provide("server_url",axios.defaults.baseURL)
app.use(naive);
app.use(createPinia());
app.use(router);

//每个请求头部添加token
const adminStore = AdminStore()
axios.interceptors.request.use((config) =>{
  config.headers.token = adminStore.token
  return config
})


app.mount('#app')
