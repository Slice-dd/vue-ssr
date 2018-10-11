import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export function createRouter () {
  return new Router({
    // mode: 'history',
    routes: [
      { path: '/', component: () => import('@/modules/pms/view/Index') },
      { path: '/detail/:id', component: () => import('@/modules/pms/view/Detail') },
    ]
  })
}
