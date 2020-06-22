import { AxiosInstance } from 'axios'

export namespace KrakenSDK {
  export type Params = { SECRET: string; KEY: string; version?: string; Http: Http.Object }
  export namespace Http {
    export type Options = { SECRET: string; KEY: string }
    export type Object = { axios: AxiosInstance; makeRequest: Function }
    export type Request = { path: string; params: object; config: object; callback: Function }
  }
}
