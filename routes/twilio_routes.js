require('dotenv').load()

const twilio = require('twilio')(process.env.TWILIO_accountSid, process.env.TWILIO_authToken)


const verifyNumber = require('../api/twilio_api').verifyNumber
const VoiceResponse = require('twilio').twiml.VoiceResponse

// Globally define the number you want to receive messages and calls from.
const my_number = 'MY_PHONE_NUMBER'

exports.receive_sms = (req, res, next) => {
  console.log(req.body)

  if (req.body.From === my_number) {
    // Send a message from your phone to number

    let body = req.body.Body

    // extract phone number from body, let's set the rule by separating via a space
    let phone = body.split(' ')[0]
    let message = body.split(' ').slice(1)
    console.log(phone, message)

    // verify the number and the format of the number
    verifyNumber(phone)
      .then((formatted_number) => {

        return twilio.messages.create({
          from: req.body.To,
          body: message,
          to: formatted_number,
        })
      })
      .then((data) => {
        console.log(data)

        res.send(twilio.toString())
      })
      .catch((err) => {
        // an error had occurred during verification
        // means an invalid phone number was passed in
        // let's send a default message back to the main phone, stating the correct format.

        twilio.messages.create({
          from: req.body.To,
          body: `ERROR: Invalid Format \n  { Response format: ${req.body.To} [SPACE] [MESSAGE]}`,
          to: req.body.From
        })
        .then((data) => {

          res.send(twilio.toString())
        })
        .catch((err) => {
          console.log(err)
          res.send(twilio.toString())
        })
      })
  } else {
    console.log(`Messaging coming from: ${req.body.From}: ${req.body.Body}`)

    twilio.messages
      .create({
          from: req.body.To,
          body: `(Received on ${req.body.To}) From ${req.body.From}: \n ${req.body.Body}.\n\n { Response format: ${req.body.To} [SPACE] [MESSAGE]}`,
          to: my_number,
        })
        .then((message) => {
          console.log(message)
          res.send(twilio.toString())
        })
        .catch((err) => {
          console.log(err)
        })
  }
}

exports.receive_call = (req, res, next) => {
  const from = req.body.From
  const to = req.body.To
  console.log(`Incoming Call from ${from} to ${to}`)

  if (from === my_number) {
    // TLDR
  } else {
    // incoming call to your number

    const voiceResponse = new VoiceResponse()

    const dial = voiceResponse.dial({ callerId: from, })
    dial.number(my_number)

    console.log(dial)
    console.log(voiceResponse.toString())

    res.type('text/xml')
    res.send(voiceResponse.toString())
  }
}
