import Vue from 'vue'
import Router from 'vue-router'
import VueCookies from 'vue-cookies'
import Course from '@/components/Course'
import Grades from '@/components/Grades'
import Home from '@/components/Home'
import Students from '@/components/Students'
import Login from '@/components/Login'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/course',
      name: 'Course',
      component: Course
    },
    {
      path: '/grades',
      name: 'Grades',
      component: Grades
    },
    {
      path: '/students',
      name: 'Students',
      component: Students
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (!VueCookies.get('id')) {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  } else {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  }
})

export default router
