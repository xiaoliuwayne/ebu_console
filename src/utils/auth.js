import Cookies from 'js-cookie'

const CookiesKey = 'User-Id'

export function getUserId() {
  return Cookies.get(CookiesKey)
}

export function setUserId(userId) {
  return Cookies.set(CookiesKey, userId)
}

export function removeUserId() {
  return Cookies.remove(CookiesKey)
}
