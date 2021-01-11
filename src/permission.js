import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getRoles } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import store from '@/store'
NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles && store.getters.roles.length > 0) {
        next()
      } else {
        const accessRoutes = await store.dispatch('permission/generateRoutes', getRoles())
        router.options.routes = accessRoutes
        router.addRoutes(accessRoutes)
        next({ path: to.redirectedFrom })
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
