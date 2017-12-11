/**
 * Created by tjdfa on 4/24/2016.
 */
RegistrationController = AppController.extend({
	waitOn: function() {
		SubscriptionManager.subscribe("user-data");
		SubscriptionManager.subscribe("profile-picture-update");
	},
	onAfterAction: function () {
		Meta.setTitle("Finish your registration");
	},
	data: {}
});

Template.registration.onCreated(function() {
	this.registrationStateReactive = new ReactiveVar(0);
});

Template.registration.helpers({
	registrationState: function() {
		return Template.instance().registrationStateReactive.get();
	},
	hasUserType: function() {
		return Meteor.user().profile.userType;
	}
});

// Need to wait for successful form submission before advancing.
AutoForm.addHooks(['registrationForm'], {
	onSuccess: function() {
		const MAX_STATE = 3;
		const PROVIDER_STATE = 1;

		let nextState = this.template.parent().registrationStateReactive.get() + 1;

		if (nextState === PROVIDER_STATE && Meteor.user().profile.userType !== 'provider') {
			nextState++;	//skip this state
		}
		else if (nextState === MAX_STATE) {
			let username = Meteor.user().username;
			Router.go('/users/' + username);
		}

		this.template.parent().registrationStateReactive.set(nextState);
	}
});