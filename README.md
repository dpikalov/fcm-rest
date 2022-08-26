# FCM REST
FCM implementation based on REST API with proxy support. No dependencies on firebase framework.

## Installation
```
npm install fcm-lite
```
## Usage
```
// esm
import fcm from 'fcm-lite/index.mjs'

// cjs
//const fcm = require('fcm-lite')

// message recipient
const clientToken = 'ZkVNZ...'

// Use legacy FCM API
const serverKey = 'AAAA...'
await fcm.sendMessageLegacy(serverKey, clientToken, {
  notification: { title: 'Hi there' }
})

// Use v1 FCM API
const gcpServiceAccount = {
  client_email: '***',
  project_id  : '***',
  private_key : '***',
  ...
}
await fcm.sendMessageV1(gcpServiceAccount, clientToken, {
  notification: { title: 'Hi there' }
})

```