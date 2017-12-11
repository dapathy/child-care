/**
 * Created by tjdfa on 3/5/2016.
 */
OrderBackgroundChecksController = AppController.extend({
	onAfterAction: function () {
		Meta.setTitle('Order background checks');
	},
	data: {}
});

Template.orderBackgroundChecks.onRendered(function(){
	formatSsn("#ssn-input");
	setupBraintree();
});

function setupBraintree() {
	Meteor.call("getToken", function(error, response) {
		if (error) {
			toastr.error(error.message);
		}
		else if (response.result === "failure"){
			toastr.error(response.message);
		}
		else {
			braintree.setup(response.data.clientToken, "dropin", {
				container: "dropin-container",

				paymentMethodNonceReceived: function (event, nonce) {
					// We received a payment nonce from Braintree.
					// we need to send it to the server, along with any relevant form data
					// to make a transaction

					let checkPackage = $('input[name="packageOptions"]:checked').val();
					let ssn = $('#ssn-input').val();
					let ids = [];

					ids.push({
						type: "ssn",
						value: ssn
					});

					Meteor.call('createCheck', checkPackage, ids, nonce, function(error, response) {
						if (error) {
							toastr.error(error.message);
						}
						else if (response.result === "failure"){
							toastr.error(response.message);
						}
						else {
							toastr.success("Background check order completed successfully");
							Router.go('/user/backgroundChecks');
						}
					});
				}
			});
		}
	});
}

function formatSsn(id) {
	$(id).keyup(function() {
		let val = this.value.replace(/\D/g, '');
		let newVal = '';
		if(val.length > 4) {
			this.value = val;
		}
		if((val.length > 3) && (val.length < 6)) {
			newVal += val.substr(0, 3) + '-';
			val = val.substr(3);
		}
		if (val.length > 5) {
			newVal += val.substr(0, 3) + '-';
			newVal += val.substr(3, 2) + '-';
			val = val.substr(5);
		}
		newVal += val;
		this.value = newVal;
	});
}