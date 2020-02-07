const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-a56d3-firebase-adminsdk-ashku-fd5b652ec4.json')
const databaseURL = 'https://fcm-a56d3.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-a56d3/messages:send'
const deviceToken =
  'cZNVaTekrhUd5aGAyecdMd:APA91bF-RkVS_kyyUrh55h4-GbjrEpwBtpIXfYPLNzUN-WN2cZC5FNWfTyG_ks9-aJxAUmLjKt0HEb14_JIm0_83v2oahG4MV7A1Fy-bYfxYYu8jMB6Xx8DCa5oK28J-T8LRrDV2SaAQ'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()