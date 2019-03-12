require('dotenv').load()
const twilio = require('twilio')(process.env.TWILIO_accountSid, process.env.TWILIO_authToken)

exports.verifyNumber = (number) => {
  const p = new Promise((res, rej) => {
    // console.log('formatting Phone number', number)
    return twilio.lookups.v1
    .phoneNumbers(number)
    .fetch()
    .then((data) => {
      // console.log(data)
      res(data.phoneNumber)
    })
    .catch((err) => {
      console.log(err)
      rej(err)
    })
  })
  return p
}
