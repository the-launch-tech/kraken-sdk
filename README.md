# Kraken SDK 1.0.0

Not published to NPM yet. Scheduled to publish on Friday (06/27/2020)

---

##### Credit notes: inspired By https://github.com/nothingisdead/npm-kraken-api

- Differences:

  - Written in Typescript, compiled to ES5
  - Structure
  - Flexibility
  - Axios interceptor callbacks
  - Minimal dependencies
  - Non-deprecated use of crypto

---

All endpoints matched semantically.

Typescript integrated.

Version 2.x.x will contain a WebSocket implementation.

## Additional Features

- Axios `interceptor` callbacks on KrakenInstance

## Installation

Not published yet.

## Import Package(s)

- `const Kraken = require('kraken-node-sdk')`
- Or ES6 imports: `import Kraken from 'kraken-node-sdk'`

## Usage

```javascript
const Kraken = require('kraken-node-sdk')

const KrakenInstance = new Kraken({
  KEY: 'xxxxxxxxxx',
  SECRET: 'xxxxxxxx',
})

const requestInterceptor = KrakenInstance.addRequestInterceptor(
  config => config,
  error => error
)

const responseInterceptor = KrakenInstance.addResponseInterceptor(
  response => response,
  error => error
)

...

KrakenInstance.public('Time', { ... })
  .then(console.log)
  .catch(console.error)

...

KrakenInstance.removeRequestInterceptor(requestInterceptor)
```

## Auxillary Helper Methods

#### `addRequestInterceptor`

- Docs

  - Callback to access Axios interceptor.
  - `const interceptor = KrakenInstance.addRequestInterceptor(onBeforeCallback, onErrorCallback)`

- Types

```typescript
(
  onBeforeCallback (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
  onErrorCallback: (error: AxiosError) => AxiosError | Promise<AxiosError>
) => any
```

---

#### `removeRequestInterceptor`

- Docs

  - Callback to access Axios interceptor.
  - `KrakenInstance.removeRequestInterceptor(interceptor)`

- Types

```typescript
(interceptor: any) => void
```

---

## History

- `1.0.0` Initial Commit

## Credits

- Company: ©2019 The Launch
- Author: Daniel Griffiths
- Role: Founder and Engineer
- Project: ©2020 CryptoDock

## License

MIT Licence ©2020 Daniel Griffiths
