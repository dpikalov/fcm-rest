# FCM-REST
[![npm](https://flat.badgen.net/npm/v/fcm-rest)](https://npmjs.com/package/fcm-rest)
[![npm license](https://flat.badgen.net/npm/license/fcm-rest)](https://npmjs.com/package/fcm-rest)
[![npm downloads](https://flat.badgen.net/npm/dm/fcm-rest)](https://npmjs.com/package/fcm-rest)

FCM implementation based on REST API, supports proxy. No dependencies on firebase framework.

Implements ```send-message``` HTTP APIs ```v1``` and ```legacy```

https://firebase.google.com/docs/cloud-messaging/send-message#send_using_the_fcm_legacy_http_api

## Installation
```
npm install fcm-rest
```
## Usage
```
import fcm from 'fcm-rest/index.mjs'
//const fcm = require('fcm-rest')

// recipient
const clientToken = 'ZkVNZ...'
```
```
// Use legacy FCM API
const serverKey = 'AAAA...'
await fcm.sendMessageLegacy(serverKey, clientToken, {
  notification: { title: 'Hi there' }
})
```
```
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