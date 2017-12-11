/**
 * Created by tjdfa on 1/10/2016.
 */
SettingsController = AppController.extend({
	waitOn: function() {
		SubscriptionManager.subscribe("user-data");
		SubscriptionManager.subscribe("profile-picture-update");
	},
	onAfterAction: function () {
		Meta.setTitle('Settings');
	},
	data: {}
});

Template.settings.onRendered(function () {
	let route = Router.current().params.page;

	switch(route) {
		case 'backgroundChecks':
			$('#settings-tabs').find('a[href="#background-checks"]').tab('show');
			break;
		case 'profileUpdate':
			$('#settings-tabs').find('a[href="#profile"]').tab('show');
			break;
		case 'payments':
			$('#settings-tabs').find('a[href="#payments"]').tab('show');
			break;
		default:
			$('#settings-tabs').find('a[href="#account"]').tab('show');
			break;
	}
});

Template.settings.events({
	"click #account-link": function() {
		$('#settings-tabs').find('a[href="#account"]').tab('show');
	}
});