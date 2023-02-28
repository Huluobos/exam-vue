// @ts-ignore
import Cookies from 'js-cookie'

const TokenKey = 'kcbToken'
const MsgTokenKey = 'msgToken'
const RefreshToken = 'refreshToken'
const UserInfoKey  = 'userInfo'

export function getCookieToken() {
  return Cookies.get(TokenKey)
}

export function setCookieToken(token: any) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getCookieMsgToken() {
  return Cookies.get(MsgTokenKey)
}

export function setCookieMsgToken(token: any) {
  return Cookies.set(MsgTokenKey, token)
}

export function removeMsgToken() {
  return Cookies.remove(MsgTokenKey)
}

export function setRefreshToken(refreshToken:any) {
  return Cookies.set(RefreshToken, refreshToken)
}
export function getRefreshToken() {
  return Cookies.get(RefreshToken)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshToken)
}

// userInfo
export function getUserInfoCookies() {
  return Cookies.get(UserInfoKey) ? JSON.parse(Cookies.get(UserInfoKey)) : ''
}

export function setUserInfoCookies(info: any) {
  return Cookies.set(UserInfoKey, JSON.stringify(info))
}
export function removeUserInfoCookies() {
  return Cookies.remove(UserInfoKey)
}
