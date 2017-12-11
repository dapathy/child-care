/**
 * Created by tjdfa on 2/28/2016.
 */
Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
	extended: false
}));

// Node.js style!
Router.route('/webhooks/braintree', {where: 'server'})
	.get(function (req, res) {
		// Defining empty bt_challenge string which will be used to verify destination.
		// https://developers.braintreepayments.com/javascript+node/guides/webhooks/create
		let bt_challenge = "";

		res.statusCode = 200;
		res.end(gateway.webhookNotification.verify(req.query.bt_challenge));
	})
	.post(function (req, res) {

		let btSignatureParam = req.body.bt_signature;
		let btPayloadParam   = req.body.bt_payload;

		gateway.webhookNotification.parse(
			btSignatureParam,
			btPayloadParam,
			function (err, webhookNotification) {
				console.log("[Webhook Received " + webhookNotification.timestamp + "] | Kind: " + webhookNotification.kind + " | Subscription: " + webhookNotification.subscription.id);

				switch(webhookNotification.kind){
					case "subscription_canceled":
						// TODO: Function below needs testing.
						// btUpdateSubscription(webhookNotification.subscription);

						// Send HTTP 200 status code to let Braintree know
						// that we received webhook notification
						res.statusCode = 200;
						res.end("Hi Braintree!");
						break;
					case "subscription_charged_successfully":
						btCreateInvoice(webhookNotification.subscription);

						// Send HTTP 200 status code to let Braintree know
						// that we received webhook notification
						res.statusCode = 200;
						res.end("Hi Braintree!");
						break;
				}

			}
		);

		res.statusCode = 200;
		res.end("Hi Braintree!");
	});
