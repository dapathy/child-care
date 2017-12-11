Router.route('/', {
	name: 'home',
	controller: 'HomeController'
});

Router.route('/messages', {
	name: 'messages',
	controller: 'MessagesController'
});

Router.route('/myJobPostings', {
	name: 'myJobPostings',
	controller: 'MyJobPostingsController'
});
Router.route('/myJobPostings/:method/:_id', {
	name: 'editJobPosting',
	controller: 'EditJobPostingController'
});

Router.route('/findJobPostings', {
	name: 'findJobPostings',
	controller: 'FindJobPostingsController'
});
Router.route('/findJobPostings/:_id', {
	name: 'viewJobPosting',
	controller: 'ViewJobPostingController'
});

Router.route('/findProviders', {
	name: 'findProviders',
	controller: 'FindProvidersController'
});

Router.route('/registration', {
	name: 'registration',
	controller: 'RegistrationController'
});

Router.route('/user/account/orderBackgroundChecks', {
	name: 'orderBackgroundChecks',
	controller: 'OrderBackgroundChecksController'
});
Router.route('/user/:page', {	//account, updateProfile, backgroundChecks, paymentHistory
	name: 'settings',
	controller: 'SettingsController'
});

Router.route('/users/:user', {
	name: 'profileView',
	controller: 'ProfileViewController'
});
Router.route('/users/:user/backgroundChecks', function() {
	this.render('profileBackgroundChecks');
});
Router.route('/users/:user/review', {
	name: 'review',
	controller: 'ReviewController'
});

AccountsTemplates.configureRoute('changePwd', {layoutTemplate: 'appLayout'});
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd', {layoutTemplate: 'appLayout'});
AccountsTemplates.configureRoute('resetPwd', {layoutTemplate: 'appLayout'});
AccountsTemplates.configureRoute('verifyEmail', {layoutTemplate: 'appLayout'});
AccountsTemplates.configureRoute('signIn', {layoutTemplate: 'appLayout'});
AccountsTemplates.configureRoute('signUp', {layoutTemplate: 'appLayout', redirect: 'registration'});

// Ensure signed-in for most custom routes.
Router.plugin('ensureSignedIn', {
	except: _.pluck(AccountsTemplates.routes, 'name').concat(['home'])
});