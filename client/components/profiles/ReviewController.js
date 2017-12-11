/**
 * Created by tjdfa on 12/16/2016.
 */
import { Reviews } from "../../../both/collections/review";

ReviewController = AppController.extend({
	waitOn: function () {
		SubscriptionManager.subscribe("user-profile", this.params.user);
	},
	onAfterAction: function () {
		Meta.setTitle("Create review");
	},
	data: {}
});

Template.review.helpers({
	'ReviewsCollection': () => Reviews
});

const FORM_NAME = "reviewForm";
Template.review.events({
	'click #create-review-button': function(event, template) {
		let subjectId = Meteor.users.findOne({username: Router.current().params.user})._id;
		let description = AutoForm.getFieldValue("description", FORM_NAME);
		let rating = $('#rating-control').data('userrating');

		if (!rating || !description) {
			toastr.error("Please provide a rating and description.");
			return;
		}

		let review = {
			subjectId: subjectId,
			description: description,
			rating: rating
		};

		Meteor.call('createReview', review, function(error, response) {
			if (error || response.result !== "success") {
				toastr.error("Review was not created.")
			}
			else {
				toastr.success("Review created successfully.");
				Router.go('/users/' + Router.current().params.user);
			}
		});
	},
	'click #cancel-review-button': function() {
		Router.go('/users/' + Router.current().params.user);
	}
});