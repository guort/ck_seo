import Cookies from 'js-cookie'

const TokenKey = 'Vue-SEO-Token'
const UserKey = 'Vue-SEO-User'
const rolesKey = 'Vue-SEO-Roles'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUserInfo(user) {
  user = JSON.stringify(user)
  return Cookies.set(UserKey, user)
}

export function getUserInfo() {
  var user = Cookies.get(UserKey)
  if (user) {
    return JSON.parse(user)
  }
  return null
}

export function removeUserInfo() {
  return Cookies.remove(UserKey)
}

export function setRoles(roles) {
  return Cookies.set(rolesKey, roles)
}

export function getRoles() {
  if (Cookies.get(rolesKey)) {
    return JSON.parse(Cookies.get(rolesKey))
  } else {
    return []
  }
}

export function removeRoles() {
  return Cookies.remove(rolesKey)
}
