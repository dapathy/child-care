/**
 * Created by tjdfa on 12/31/2016.
 */

ViewJobPostingController = AppController.extend({
	waitOn: function () {
	},
	onAfterAction: function () {
		Meta.setTitle("Job posting");
	},
	data: {}
});

Template.viewJobPosting.onCreated(function() {
	this.jobPostingReactive = new ReactiveVar();

	let self = this;
	getJobPosting(self);
});

Template.viewJobPosting.helpers({
	jobPosting: function() {
		return Template.instance().jobPostingReactive.get();
	}
});

Template.viewJobPosting.events({
	'click #contact-provider-button': function(event, template) {
		let jobPost = template.jobPostingReactive.get();
		let userId = jobPost.postingUserId;
		let username = jobPost.username;
		Meteor.call("createConversation", userId);
		Router.go('messages', null, {query: "user=" + username});
	}
});

function getJobPosting(template) {
	let jobPostingId = Router.current().params._id;
	Meteor.call('getJobPosting', jobPostingId, function(error, response) {
		if (!error && response.result === "success") {
			template.jobPostingReactive.set(response.data);
		}
	});
}