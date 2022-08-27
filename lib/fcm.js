/*
 * See details:
 * https://firebase.google.com/docs/cloud-messaging/send-message#send_using_the_fcm_legacy_http_api
 */
const HPA   = require('https-proxy-agent')
const fetch = require('cross-fetch');
const jws   = require("jws");

// post with http-proxy agent 
const postJson = async (url, optHeaders, json) => {
  const headers = {
    'Accept'      : 'application/json',
    'Content-Type': 'application/json',
    ...optHeaders,
  }
  const body = JSON.stringify(json)

  const agent = process.env.http_proxy ?
    new HPA(process.env.http_proxy) : undefined;

  const resp = await fetch(url, { method: 'POST', headers, body, agent })

  if (resp.ok) {
    return resp.json()
  }

  return Promise.reject({ status: resp.status, body: await resp.json() })
}

// request access-token for given google-service-account
const googleAccessToken = async (serviceAccount, lifetime = 60) => {
  const header = { alg: 'RS256' }
  const payload= {
    iss  : serviceAccount.client_email,
    aud  : 'https://www.googleapis.com/oauth2/v4/token',
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    iat  : Math.floor(Date.now() / 1000),
    exp  : Math.floor(Date.now() / 1000) + lifetime,
  }

  const json = await postJson(payload.aud, {}, {
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion :  await jws.sign({ header, payload, secret: serviceAccount.private_key })
  })

  return json.access_token
}

//
const sendMessageLegacy = async (serverKey, to, payload) => {
  const url = 'https://fcm.googleapis.com/fcm/send'
  const headers = {
    'Authorization': `key=${serverKey}`,
  }
  const json = await postJson(url, headers, {
    to, ...payload, // direct_boot_ok: true,
  })
  return (json.failure === 0) ? json: Promise.reject(json)
}

// GCP serviceAccount is { ..., client_email, private_key }
const sendMessageV1 = async (serviceAccount, token, payload) => {
  const url = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`
  const headers = {
    'Authorization': `Bearer ${await googleAccessToken(serviceAccount)}`,
  }
  return postJson(url, headers, {
    message: { token, ...payload/*, android: { direct_boot_ok: true */}
  })
}

/**/
module.exports = {
  sendMessageLegacy, sendMessageV1
};
