import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../containers/Home.vue'
import Login from '../components/Login.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载导航守卫
router.beforeEach((to, from, next) => {
  /**
   * to: 即将到哪个页面
   * from：从那个页面跳转过来
   * next：放行函数，
   *  next(): 放行
   *  next('/path'): 强制跳转
   */
  if (to.path === '/login') return next()

  // 获取token
  const token = window.sessionStorage.getItem('token')
  // token不存在，跳转至login页
  if (!token) return next('/login')
  // token存在，则放行
  next()
})

export default router
