import * as Constants from './constants'

import { KrakenSDK } from './types'

export function getQueryString(params: object): string {
  const keys: string[] = Object.keys(params)
  return !!keys.length
    ? `?${keys.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&')}`
    : ''
}

export function isFn(arg: any): boolean {
  return typeof arg === 'function'
}

export function confirmParams(params: object = {}, cb: Function | undefined): any[] {
  return typeof params === 'function' ? [{}, params] : [params, cb]
}

export function getTimestamp(): string {
  return Date.now() + ''
}

export function getPath(prefix: string | false, type: string, method: string): string {
  return `${prefix}/${type}/${method}`
}
