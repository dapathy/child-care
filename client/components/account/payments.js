/**
 * Created by tjdfa on 3/6/2016.
 */

Template.payments.onCreated(function () {
	let self = this;
	this.paymentsReactive = new ReactiveArray([]);
	getPayments(self);
});

Template.payments.helpers({
	previousPayments: function() {
		return Template.instance().paymentsReactive.get();
	}
});

function getPayments(self) {
	Meteor.call("getPayments", function(error, response) {
		if (!error && response.result === "success") {
			self.paymentsReactive.set(response.data);
		}
	});
}