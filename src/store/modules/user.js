import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken, setUserInfo, getUserInfo, setRoles, removeRoles } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import store from '@/store'
import baseRoles from '@/baseRoles.js'
import { user_roles } from '@/baseRoles.js'
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  userInfo: getUserInfo(),
  hasGetInfo: false
}

function setPermission(roles, r) {
  r.forEach(item => {
    roles.push(item['label'])
    if (item['children']) {
      return setPermission(roles, item['children'])
    }
  })
  return roles
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    setToken(token)
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
    setRoles(roles)
  },
  SET_USERINFO: (state, users) => {
    state.userInfo = users
    setUserInfo(users)
  },
  setHasGetInfo(state, status) {
    state.hasGetInfo = status
  }
}

const actions = {
  setRoles({ commit }, roles) {
    commit('SET_ROLES', roles)
  },
  // user login
  login({ commit, state, dispatch }, userInfo) {
    const { account, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ suser: account.trim(), spass: password }).then(async(response) => {
        const data = response
        if (data.code === 200) {
          const adminname = data.adminname || ''
          const token = data.token || ''
          let roles = []

          if (adminname === '管理员') {
            roles = setPermission(roles, baseRoles)
          } else {
            roles = setPermission(roles, user_roles)
          }

          commit('SET_TOKEN', token)
          commit('SET_USERINFO', {
            user: account.trim()
          })

          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          router.options.routes = accessRoutes
          router.addRoutes(accessRoutes)
          resolve(response)
        } else {
          resolve(response)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().finally(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        removeRoles()
        resetRouter()
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
