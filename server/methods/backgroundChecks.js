/**
 * Created by tjdfa on 1/16/2016.
 */
import * as Response from '../helpers/response';
import * as Payments from './payments';
import * as Helpers from '../../both/helpers/helpers';

import {ONFIDO_API_TOKEN} from "../startup/init";

Meteor.methods({
	createCheck: function(checkPackage, ids, nonce) {
		if (!Meteor.userId() || !checkPackage || !nonce) return;

		let reports = generateReports(checkPackage);
		if (!reports) return;

		let applicantId = getApplicantId();
		if (!applicantId) {
			let appResult = createApplicant(ids);
			if (appResult.result === "failure") {
				return appResult;
			}
			else {
				applicantId = appResult.data;
			}
		}

		let check = {
			type: "express",
			reports: reports
		};

		let transactionResult;
		try {
			// Get paid!
			transactionResult = Payments.createTransaction(nonce, getPackageCost(checkPackage));
			if (!transactionResult.success) {
				return Response.failure("Your payment did not go through")
			}

			// This throws an exception on an Onfido error.
			let response = HTTP.post("https://api.onfido.com/v2/applicants/" + applicantId + "/checks",
				{
					headers: {Authorization: "Token token=" + ONFIDO_API_TOKEN},
					data: check
				});

			return Response.success();

		// Handle HTTP or Mongo errors.
		} catch (exception) {
			// Void transaction on error
			if (transactionResult && transactionResult.transaction) {
				Payments.cancelTransaction(transactionResult.transaction);
			}

			return Response.handleError(exception);
		}
	},
	getReports: function(username) {
		if (!Meteor.userId()) return;
		check(username, String);

		try {
			let applicantId = getApplicantId(username);
			if (!applicantId) return Response.success([]);

			// This throws an exception on an Onfido error.
			let response = HTTP.get("https://api.onfido.com/v2/applicants/" + applicantId + "/checks",
				{
					headers: {Authorization: "Token token=" + ONFIDO_API_TOKEN}
				});

			// Onfido screwed up.  Need to parse response manually.
			let data = JSON.parse(response.content);
			let reports = getAllReportsFromChecks(data.checks);
			return Response.success(reports);
		} catch (exception) {
			return Response.handleError(exception);
		}
	}
});

function createApplicant(ids) {
	if (!hasRequiredBackgroundCheckFields())
		return Response.failure("You do not have the required information. Please fill out your Account and Profile information.");

	if (!isFromUsa()) {
		return Response.failure("Background checks can currently only be completed for residents of the United States.")
	}

	let user = Meteor.user();

	let applicant = {
		first_name: user.profile.firstName,
		last_name: user.profile.lastName,
		email: user.emails[0].address,
		dob: moment(user.profile.providerProfile.birthday).utc().format('YYYY-MM-DD'),
		country: "USA", // TODO: Limit to specific country?
		id_numbers: ids	//array
		// addresses (array) for non-usa
	};

	try {
		let response = HTTP.post("https://api.onfido.com/v2/applicants",
			{
				headers: {Authorization: "Token token=" + ONFIDO_API_TOKEN},
				data: applicant
			});

		// Add applicant.
		let applicantId = response.data.id;

		// Set the applicant id for user.
		let _id = Meteor.users.update({_id: Meteor.userId()}, {$set: {"restrictedProfile.applicantId": applicantId }});

		return Response.success(applicantId);

	// Handle HTTP or Mongo errors.
	} catch (exception) {
		return Response.handleError(exception);
	}
}

// These reports are specific to USA
function generateReports(packageName) {
	switch (packageName) {
		case "bronze":
			return [{name: "ssn_trace"}, {name: "sex_offender"}];
		case "silver":
			return [{name: "ssn_trace"}, {name: "sex_offender"}, {name: "national_criminal"}];
		default:
			return null;
	}
}

function getPackageCost(packageName) {
	switch (packageName) {
		case "bronze": return "10.00";
		case "silver": return "15.00";
	}
}

function getApplicantId(username) {
	let user;
	if (username) {
		user = Meteor.users.findOne({username: username});
	}
	else {
		user = Meteor.user();
	}

	return (user.restrictedProfile)
		? user.restrictedProfile.applicantId
		: null;
}

function isFromUsa() {
	return Meteor.user().privateProfile.address.country === "United States";
}

function hasRequiredBackgroundCheckFields() {
	let user = Meteor.user();
	if (!user.profile || !user.privateProfile) return false;

	return  user.profile.firstName &&
			user.profile.lastName &&
			user.emails[0].address &&
			user.profile.providerProfile.birthday &&
			user.privateProfile.address.country;
}

function getAllReportsFromChecks(checks) {
	try {
		let allReports = [];

		for (let i = 0; i < checks.length; ++i) {
			let checkId = checks[i].id;

			// This throws an exception on an Onfido error.
			let response = HTTP.get("https://api.onfido.com/v2/checks/" + checkId + "/reports",
				{
					headers: {Authorization: "Token token=" + ONFIDO_API_TOKEN}
				});

			let reports = response.data.reports;
			allReports = allReports.concat(reports);
		}

		let strippedReports = [];
		for (let j = 0; j < allReports.length; ++j) {
			let fullReport = allReports[j];
			strippedReports.push(formatReport(fullReport));
		}

		return strippedReports;
	}
	catch (exception) {
		throw exception;
	}
}

function formatReport(report) {
	return {
		created_at: Helpers.formatDateLocal(report.created_at),
		name: Helpers.toTitleCase(report.name),
		status: report.status,
		result: report.result,
		breakdown: report.breakdown
	};
}