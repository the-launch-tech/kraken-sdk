export const baseURL: string = 'https://api.kraken.com'

export const version: string = '0'

export const publicMethods: string[] = [
  'Time',
  'Assets',
  'AssetPairs',
  'Ticker',
  'Depth',
  'Trades',
  'Spread',
  'OHLC',
]

export const privateMethods: string[] = [
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
]
