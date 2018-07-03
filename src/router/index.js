import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import ClosedIssues from '@/components/ClosedIssues'
import Input from '@/components/Input'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Input',
      component: Input
    },
    {
      path: '/closed-issues',
      name: 'ClosedIssues',
      component: ClosedIssues,
    }
  ]
})

router.afterEach((to, from) => {
  if (from.path === '/closed-issues') {
    location.reload(true);
  }
})

export default router;