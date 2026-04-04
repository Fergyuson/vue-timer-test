import { createRouter, createWebHistory } from 'vue-router'
import TimerView from '@/views/TimerView.vue'
import TimersListView from '@/views/TimersListView.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/timer' },
    { path: '/timer', name: 'timer', component: TimerView },
    { path: '/timers', name: 'timers', component: TimersListView },
  ],
})