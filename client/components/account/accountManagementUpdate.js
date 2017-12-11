/**
 * Created by tjdfa on 1/1/2016.
 */
Template.accountManagementUpdate.events({
	'click [data-action=hideAccount]': function (event, template) {
		Meteor.call("hideAccount");
	},
	'click [data-action=showAccount]': function (event, template) {
		Meteor.call("showAccount");
	}
});

Template.accountManagementUpdate.helpers({
	userStatus: function() {
		let user = Meteor.user();
		if (user.status === 'hidden') {
			return 'Hidden';
		} else if (user.emails[0].verified) {
			return 'Verified';
		} else {
			return 'Unverified';
		}
	}
});