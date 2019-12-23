const crypto = require('crypto')
const axios = require('axios')

class Kraken {
  constructor({ KEY, SECRET }) {
    this.SECRET = SECRET
    this.KEY = KEY
    this.prefix = '0'
    this.base = 'https://api.kraken.com'

    this.Axios = axios.create({
      baseURL: this.base,
      headers: {
        'Content-Type': 'application/json',
        'API-Key': this.KEY,
        'User-Agent': 'NodeJS SDK For Kraken Exchange',
      },
    })
  }

  /*
   * Get NONCE timestamp
   */
  getTimestamp() {
    return new Date().getTime()
  }

  /*
   * Get Signature path
   */
  getPath(type, method) {
    return this.prefix + '/' + type + '/' + method
  }

  /*
   * Get Signature queryString
   * params Object
   */
  getQueryString(params) {
    let queryString
    if (params !== undefined) {
      queryString = []
      for (let key in params) {
        queryString.push(key + '=' + params[key])
      }
      queryString.sort()
      queryString = queryString.join('&')
    } else {
      queryString = ''
    }
    return queryString
  }

  /*
   * Check against public methods
   */
  isPublicMethod(method) {
    return (
      ['Time', 'Assets', 'AssetPairs', 'Ticker', 'Depth', 'Trades', 'Spread', 'OHLC'].indexOf(
        method
      ) > -1
    )
  }

  /*
   * Check against private methods
   */
  isPrivateMethod(method) {
    return (
      [
        'Balance',
        'TradeBalance',
        'OpenOrders',
        'ClosedOrders',
        'QueryOrders',
        'TradesHistory',
        'QueryTrades',
        'OpenPositions',
        'Ledgers',
        'QueryLedgers',
        'TradeVolume',
        'AddOrder',
        'CancelOrder',
        'DepositMethods',
        'DepositAddresses',
        'DepositStatus',
        'WithdrawInfo',
        'Withdraw',
        'WithdrawStatus',
        'WithdrawCancel',
      ].indexOf(method) > -1
    )
  }

  /*
   * Check if params argument is missing for cb
   */
  confirmParams(params, cb) {
    return typeof params === 'function' ? [{}, params] : [params, cb]
  }

  /*
   * Check if var is function
   */
  isFn(arg) {
    return typeof arg === 'function'
  }

  /*
   * Create authorization signature
   */
  getSignature(path, queryString, timestamp) {
    const secret_buffer = new Buffer(this.SECRET, 'base64')
    const hash = new crypto.createHash('sha256')
    const hmac = new crypto.createHmac('sha512', secret_buffer)
    const hash_digest = hash.update(timestamp + queryString).digest('binary')
    return hmac.update(path + hash_digest, 'binary').digest('base64')
  }

  /*
   * Make a public API request
   */
  async public(method, params = {}, cb = false) {
    if (this.isPublicMethod(method)) {
      const paramsCBArray = this.confirmParams(params, cb)
      const params = paramsCBArray[0]
      const cb = paramsCBArray[1]
      const path = this.getPath('public', method)
      const { data } = await this.Axios.post(path, params)
        .then(res => this.isFn(cb) && cb(null, res))
        .catch(res => this.isFn(cb) && cb(e, null))
      return data
    } else {
      throw new Error(
        method +
          "is not a valid API method `'Time', 'Assets', 'AssetPairs', 'Ticker', 'Depth', 'Trades', 'Spread', 'OHLC'`."
      )
    }
  }

  /*
   * Make a private API request
   */
  async private(method, params = {}, cb = false) {
    if (this.isPrivateMethod(method)) {
      const paramsCBArray = this.confirmParams(params, cb)
      const params = paramsCBArray[0]
      const cb = paramsCBArray[1]
      const path = this.getPath('private', method)
      const timestamp = this.getTimestamp()
      const queryString = this.getQueryString(params)
      const signature = this.getSignature(path, queryString, timestamp)

      const { data } = await this.Axios.post(path, params, {
        headers: {
          'API-Sign': signature,
        },
      })
        .then(res => this.isFn(cb) && cb(null, res))
        .catch(res => this.isFn(cb) && cb(e, null))
      return data
    } else {
      throw new Error(
        method +
          "is not a valid API method `'Time', 'Assets', 'AssetPairs', 'Ticker', 'Depth', 'Trades', 'Spread', 'OHLC'`."
      )
    }
  }
}
