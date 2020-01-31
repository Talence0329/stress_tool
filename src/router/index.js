import Vue from 'vue'
import Router from 'vue-router'

// Containers
const DefaultContainer = () => import('@/containers/DefaultContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

// Jmeter
import Jmeter from '@/views/jmeter/jmeter'

// Work
import Work from '@/views/work/work'

// TestArea
import TestArea from '@/views/testarea/testarea'

Vue.use(Router)

function configRoutes() {
  return [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: DefaultContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'jmeter',
          name: 'Jmeter 管理',
          component: Jmeter
        },
        {
          path: 'work',
          name: '工作管理',
          component: Work
        },
        {
          path: 'testarea',
          name: '測試區域',
          component: TestArea
        }
      ]
    }
  ]
}

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})
