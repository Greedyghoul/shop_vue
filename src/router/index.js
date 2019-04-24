import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

// 引入各页面路由
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/Users'

Vue.use(Router)

// export default = new Router({   此处需要声明router对象，以便配置路由守卫
const router = new Router({
  routes: [
    // {path: '/', name: 'HelloWorld', component: HelloWorld},
    {path: '/', redirect: '/home'},
    {path: '/login', component: Login},
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {path: '/welcome', component: Welcome},
        {path: '/users', component: Users}]
    }
  ]
})

// 设置路由守卫
router.beforeEach((to, from, next) => {
  var token = window.sessionStorage.getItem('token')
  // 当前用户没有登录系统，并且还在访问非登录路由，就强制执行登录路由
  if (!token && to.path !== '/login') {
    return next('/login')
  }
  next()
})

// 将router导出
export default router
