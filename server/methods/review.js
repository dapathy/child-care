/**
 * Created by tjdfa on 12/11/2016.
 */
import { Reviews } from "../../both/collections/review";
import * as Response from '../helpers/response';

Meteor.methods({
	'createReview': function(review) {
		if (!Meteor.userId()) return;
		check(review, {
			rating: Number,
			description: String,
			subjectId: String
		});

		// Handle impossible rating.
		if (review.rating > 5 || review.rating < 0) return;

		// Can't review self.
		if (review.subjectId === Meteor.userId()) return;

		// TODO: check if previously reviewed?
		review['date'] = new Date();
		review['reviewerUsername'] = Meteor.user().username;

		try {
			Reviews.insert(review);
			return Response.success();
		}
		catch (exception) {
			return Response.handleError(exception);
		}
	}
});