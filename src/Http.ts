import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

import * as Constants from './constants'
import * as Utils from './utils'

import { KrakenSDK } from './types'

export default function(KEY: string): KrakenSDK.Http.Object {
  const Http = {
    axios: axios.create({
      baseURL: Constants.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'API-Key': KEY,
        'User-Agent': 'NodeJS SDK For Kraken Exchange',
      },
    }),
    makeRequest: async ({
      path,
      params,
      config,
      callback,
    }: KrakenSDK.Http.Request): Promise<any> => {
      try {
        const res: AxiosResponse<any> = await Http.axios.post(path, params, config)

        if (!res) {
          throw 'Invalid response from KrakenSDK'
        }

        if (Utils.isFn(callback)) {
          return callback(null, res)
        }

        return res.data
      } catch (e) {
        if (Utils.isFn(callback)) {
          return callback(e, null)
        }

        throw e
      }
    },
  }

  return Http
}
