import crypto from 'crypto'
import { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios'

import * as Constants from './constants'
import * as Utils from './utils'
import Http from './Http'

import { KrakenSDK } from './types'

export default class Kraken {
  private SECRET: string
  private KEY: string
  private prefix: string
  private Http: KrakenSDK.Http.Object

  constructor({ KEY, SECRET, version }: KrakenSDK.Params) {
    this.SECRET = SECRET
    this.KEY = KEY
    this.prefix = !!version ? version : Constants.version
    this.Http = Http({ KEY, SECRET })
  }

  /**
   * @docs https://github.com/axios/axios
   * @description You can intercept requests or responses before they are handled by then or catch.
   */
  public addRequestInterceptor(
    onBeforeCallback: (
      value: AxiosRequestConfig
    ) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
    onErrorCallback: (error: AxiosError) => AxiosError | Promise<AxiosError>
  ): any {
    return this.Http.axios.interceptors.request.use(onBeforeCallback, onErrorCallback)
  }

  /**
   * @docs https://github.com/axios/axios
   * @description If you need to remove an interceptor later you can.
   */
  public removeRequestInterceptor(interceptor: any): void {
    this.Http.axios.interceptors.request.eject(interceptor)
  }

  /**
   * @docs https://github.com/axios/axios
   * @description You can intercept requests or responses before they are handled by then or catch.
   */
  public addResponseInterceptor(
    onSuccessCallback: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
    onErrorCallback: (error: AxiosError) => AxiosError | Promise<AxiosError>
  ): any {
    return this.Http.axios.interceptors.response.use(onSuccessCallback, onErrorCallback)
  }

  /**
   * @docs https://github.com/axios/axios
   * @description If you need to remove an interceptor later you can.
   */
  public removeResponseInterceptor(interceptor: any): void {
    this.Http.axios.interceptors.request.eject(interceptor)
  }

  private isPublicMethod(method: string): boolean {
    return Constants.publicMethods.indexOf(method) > -1
  }

  private isPrivateMethod(method: string): boolean {
    return Constants.privateMethods.indexOf(method) > -1
  }

  private methodError(method: string, methods: string[]): string {
    return `${method} not valid private method: ${methods.join(', ')}`
  }

  private signRequest(path: string, queryString: string, timestamp: string): string {
    const secret_buffer = Buffer.from(this.SECRET, 'base64')
    console.log('secret_buffer', secret_buffer)
    const api_post = 'nonce=' + timestamp + queryString
    console.log('api_post', api_post)
    const hash = crypto
      .createHash('sha256')
      .update(api_post)
      .digest('base64')
    console.log('hash', hash)
    const hmac = crypto
      .createHmac('sha512', secret_buffer)
      .update(path + hash)
      .digest('base64')
    console.log('hmac', hmac)
    return hmac
  }

  /**
   * @description Public API method handler.
   */
  public async public(
    method: string,
    paramsObject: object = {},
    cbFunction: Function | undefined = undefined
  ): Promise<any> {
    if (!this.isPublicMethod(method)) {
      throw new Error(this.methodError(method, Constants.publicMethods))
    }

    const [params, cb] = Utils.confirmParams(paramsObject, cbFunction)
    const path = Utils.getPath(this.prefix, 'public', method)

    try {
      return await this.Http.makeRequest({ path, params, config: {}, cb })
    } catch (e) {
      throw e
    }
  }

  /**
   * @description Private API method handler.
   */
  public async private(
    method: string,
    paramsObject: object = {},
    cbfunction: Function | undefined = undefined
  ): Promise<any> {
    if (!this.isPrivateMethod(method)) {
      throw new Error(this.methodError(method, Constants.privateMethods))
    }

    const [params, cb] = Utils.confirmParams(paramsObject, cbfunction)
    const path = Utils.getPath(this.prefix, 'private', method)
    const signature = this.signRequest(path, Utils.getQueryString(params), Utils.getTimestamp())
    const config = { headers: { 'API-Sign': signature } }

    try {
      return await this.Http.makeRequest({ path, params, config, cb })
    } catch (e) {
      throw e
    }
  }
}
