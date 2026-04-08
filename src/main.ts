import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useTimerStore } from '@/stores/timer'
import { useRecordsStore } from '@/stores/records'


import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()


app.use(pinia)
useTimerStore(pinia).hydrate()
useRecordsStore(pinia).hydrate()

app.use(router)
app.mount('#app')