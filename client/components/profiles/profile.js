/**
 * Created by tjdfa on 11/22/2015.
 */
import { Reviews } from "../../../both/collections/review";

ProfileViewController = AppController.extend({
	waitOn: function() {
		SubscriptionManager.subscribe('user-profile', this.params.user);

		if (this.data()) {
			SubscriptionManager.subscribe('reviews', this.data()._id);
		}
	},
	onAfterAction: function () {
		Meta.setTitle(this.params.user + '\'s profile');
	},
	data: function() {return Meteor.users.findOne({username: this.params.user}); }
});

Template.profileView.helpers({
	age: function() {
		let controller = Iron.controller();
		let birthday = controller.data().profile.providerProfile.birthday;
		return moment().diff(birthday, 'years');
	},
	reviews: function() {
		// This should only get the current page's user.
		return Reviews.find().fetch();
	},
	totalRating: function() {
		let reviews = Reviews.find().fetch();
		let numberOfReviews = reviews.length;
		if (numberOfReviews === 0) return 0;

		let sum = 0;
		for (let review of reviews) {
			sum += review.rating;
		}
		return sum / numberOfReviews;
	}
});

Template.profileView.events({
	'click #message-button': function(event, template) {
		let user = template.data;
		Meteor.call("createConversation", user._id);
		Router.go('messages', null, {query: 'user=' + user.username});
	}
});