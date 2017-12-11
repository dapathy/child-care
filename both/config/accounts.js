AccountsTemplates.configure({
	// Behavior
	confirmPassword: true,
	enablePasswordChange: true,
	forbidClientAccountCreation: false,
	overrideLoginErrors: true,
	sendVerificationEmail: true,
	lowercaseUsername: false,
	focusFirstInput: true,
	socialLoginStyle: 'popup', // or 'popup' or 'redirect'

	// Appearance
	showAddRemoveServices: false,
	showForgotPasswordLink: true,
	showLabels: true,
	showPlaceholders: true,
	showResendVerificationEmailLink: false,

	// Client-side Validation
	continuousValidation: false,
	negativeFeedback: false,
	negativeValidation: true,
	positiveValidation: true,
	positiveFeedback: true,
	showValidating: true,

	// Hooks
	onLogoutHook: onLogout,
	onSubmitHook: onSubmit
});

// Add username field
AccountsTemplates.addField({
	_id: 'username',
	type: 'text',
	required: true,
	func: function(value){
		if (Meteor.isClient) {
			console.log("Validating username...");
			let self = this;
			Meteor.call("userExists", value, function(err, userExists){
				if (!userExists)
					self.setSuccess();
				else
					self.setError(userExists);
				self.setValidating(false);
			});
			return;
		}
		// Server
		return Meteor.call("userExists", value);
	}
});

AccountsTemplates.addField({
	_id: 'userType',
	type: 'radio',
	displayName: "User Type",
	required: true,
	select: [
		{
			text: 'Provider',
			value: 'provider'
		},
		{
			text: 'Seeker',
			value: 'seeker'
		}
		//{
		//	text: 'Both',
		//	value: 'both'
		//}
	]
});

if (Meteor.isServer) {
	Accounts.onCreateUser(function (options, user) {
		user.profile = options.profile ? options.profile : {};

		// Initialize some required objects.
		user.privateProfile = {};
		user.restrictedProfile = {};

		if (user.services.facebook) {
			return handleFacebookRegistration(user)
		}
		else if (user.services.google) {
			return handleGoogleRegistration(user);
		}

		return user;
	});
}

function handleGoogleRegistration(user) {
	user.profile = {};
	user.profile.firstName = user.services.google.given_name;
	user.profile.lastName = user.services.google.family_name;

	let email = user.services.google.email;

	user.emails = [{
		address: email,
		verified: true
	}];
	user.username = getUniqueUserNameFromEmail(email);

	return user;
}

function handleFacebookRegistration(user) {
	user.profile = {};
	user.profile.firstName = user.services.facebook.first_name;
	user.profile.lastName = user.services.facebook.last_name;

	let email = user.services.facebook.email;

	user.emails = [{
		address: email,
		verified: true
	}];
	user.username = getUniqueUserNameFromEmail(email);

	return user;
}

// Only runs on server
function getUniqueUserNameFromEmail(email){
	let username = email.split("@")[0];
	let usernameAlreadyExists = Meteor.call("userExists", username);

	// Append random numbers if username already exists for some reason.
	if (usernameAlreadyExists) {
		return username + (Math.floor((Math.random() * 999) + 1)).toString();
	}
	else {
		return username;
	}
}

// State can be "signIn" or "signUp"
function onSubmit(error, state) {
	if (!error) {
		if (state === "signIn") {
			Meteor.defer(function() {
				let userType = Meteor.user().profile.userType;
				if (userType === 'seeker') {
					Router.go('/findProviders');
				} else {
					Router.go('/findJobPostings');
				}
			});
		}
	}
}

function onLogout() {
	Router.go('/');
}
