const bodyParser = require('body-parser')
// routes
const twilio = require('twilio')
const Test = require('./routes/test_routes')
const TwilioRoutes = require('./routes/twilio_routes')

// bodyParser attempts to parse any request into JSON format
const json_encoding = bodyParser.json({type:'*/*'})
// bodyParser attempts to parse any request into GraphQL format
// const graphql_encoding = bodyParser.text({ type: 'application/graphql' })

module.exports = function(app){

	app.use(bodyParser())

	// routes
	app.get('/test', json_encoding, Test.test)

	app.post('/receive_sms', [twilio.webhook({ validate: false })], TwilioRoutes.receive_sms)
	app.post('/receive_call', [json_encoding], TwilioRoutes.receive_call)

}
