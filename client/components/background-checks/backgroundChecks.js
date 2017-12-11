/**
 * Created by tjdfa on 1/17/2016.
 */
import * as Helpers from '../../../both/helpers/helpers';

Template.backgroundChecks.onCreated(function () {
	this.backgroundReportsReactive = new ReactiveArray([]);
	this.reportBreakdownReactive = new ReactiveArray([]);

	let self = this;
	getReports(self);
});

Template.backgroundChecks.events({
	'click [data-toggle=collapse]': function(event, template) {
		let report = this;
		let results = [];

		if (!isExpandable(report)) return;

		for (let property in report.breakdown)  {
			if (report.breakdown.hasOwnProperty(property)) {
				results.push({
					name: Helpers.toTitleCase(property),
					result: Helpers.toTitleCase(report.breakdown[property].result)
				});
			}
		}

		template.reportBreakdownReactive.set(results);
	}
});

Template.backgroundChecks.helpers({
	backgroundReports: function() {
		return Template.instance().backgroundReportsReactive.get();
	},
	reportBreakdown: function(){
		return Template.instance().reportBreakdownReactive.get();
	},
	isExpandable: function(report) {
		return isExpandable(report);
	}
});

Template.profileBackgroundChecks.helpers({
	username: function() {
		return Router.current().params.user;
	}
});

function getReports(template) {
	let path = Iron.Location.get().path;

	// When accessed via profile or account.
	let username = path.includes("users")
		? Router.current().params.user
		: Meteor.user().username;

	Meteor.call('getReports', username, function(error, response) {
		if (!error && response.result === "success") {
			template.backgroundReportsReactive.set(response.data);
		}
	});
}

function isExpandable(report) {
	return report.name.toLowerCase() === "ssn trace";
}