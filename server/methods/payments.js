/**
 * Created by tjdfa on 2/27/2016.
 */
import * as Response from '../helpers/response';
import * as Helpers from '../../both/helpers/helpers';
import * as Email from '../email/config';
import {BraintreeGateway} from "../startup/init";

Meteor.methods({
	getToken: function() {
		if (!Meteor.userId()) return;

		let paymentId = getPaymentId();

		let options = {};

		if (paymentId) {
			options['customerId'] = paymentId;
		}

		try {
			let generateToken = Meteor.wrapAsync(BraintreeGateway.clientToken.generate, BraintreeGateway.clientToken);
			let response = generateToken(options);
			return Response.success(response);
		}
		catch (exception) {
			return Response.handleError(exception);
		}
	},
	getPayments: function() {
		if (!Meteor.userId()) return;

		let paymentId = getPaymentId();

		try {
			Future = Npm.require('fibers/future');
			let future = new Future();
			let data = [];

			let stream = BraintreeGateway.transaction.search(function (search) {
				search.customerId().is(paymentId)
			});

			// TODO: limit results?
			stream.on('data', function(transaction){
				data.push(formatTransaction(transaction));
			});

			stream.on("end", function () {
				return future.return(Response.success(data));
			});

			return future.wait();
		}
		catch(exception) {
			return Response.handleError(exception);
		}
	}
});

export function createTransaction(nonce, amount) {
	try {
		let transaction = {
			amount: amount,
			paymentMethodNonce: nonce,
			options: {
				submitForSettlement: true,
				storeInVaultOnSuccess: true
			}
		};
		let createSale = Meteor.wrapAsync(BraintreeGateway.transaction.sale, BraintreeGateway.transaction);
		let result = createSale(transaction);
		Response.success(result);
		sendPaymentEmail(result.transaction, false);
		return result;
	}
	catch(exception) {
		throw new Error(exception);
	}

}

export function cancelTransaction(transaction) {
	let transactionId = transaction.id;
	if (!transactionId) return;

	let result;
	try {
		if (transaction.status === "submitted_for_settlement") {
			let voidTransaction = Meteor.wrapAsync(BraintreeGateway.transaction.void, BraintreeGateway.transaction);
			result = voidTransaction(transactionId);
			sendPaymentEmail(transaction, true, "voided");
		} else if (transaction.status === "settling" || transaction.status === "settled") {
			let refundTransaction = Meteor.wrapAsync(BraintreeGateway.transaction.refund, BraintreeGateway.transaction);
			result = refundTransaction(transactionId);
			sendPaymentEmail(transaction, true, "refunded");
		}

		Response.success(result);
	}
	catch (exception) {
		// Not rethrowing here.  We're already in trouble.
		Response.handleError(exception);
	}
}

// Verify user info exists before using.
function createCustomer() {
	try {
		let user = Meteor.user();
		let customer = {
			firstName: user.profile.firstName,
			lastName: user.profile.lastName,
			email: user.emails[0].address
		};
		let createCustomer = Meteor.wrapAsync(BraintreeGateway.customer.create, BraintreeGateway.customer);
		let result = createCustomer(customer);

		let paymentId = result.customer.id;
		savePaymentId(paymentId);
		return paymentId;
	}
	catch (exception) {
		Response.handleError(exception);
		return null;
	}
}

function formatTransaction(transaction) {
	return {
		createdAt: Helpers.formatDateLocal(transaction.createdAt),
		amount: transaction.amount,
		merchantAccountId: transaction.merchantAccountId,
		status: Helpers.toTitleCase(transaction.status)
	}
}

function savePaymentId(newId) {
	try {
		Meteor.users.update({_id: Meteor.userId()}, {$set: {"restrictedProfile.paymentId": newId }});
		return true;
	}
	catch (exception) {
		Response.handleError(exception);
		return false;
	}
}

function getPaymentId() {
	return (Meteor.user().restrictedProfile)
		? (!Meteor.user().restrictedProfile.paymentId) ? createCustomer() : Meteor.user().restrictedProfile.paymentId
		: createCustomer();
}

function sendPaymentEmail(transaction, isCancelling, action) {
	let subject = "Christian Child Care - Payment Update";
	let message;

	if (!isCancelling) {
		message = "Your payment of " + transaction.amount + " for transaction, " + transaction.id + ", has been received successfully and is now being processed."
	}
	else {
		message = "An error has occurred. Your payment of " + transaction.amount + " for transaction, " + transaction.id + ", has been " + action + ".";
	}

	Email.sendEmail(subject, message);
}
