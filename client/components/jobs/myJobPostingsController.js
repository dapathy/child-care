/**
 * Created by tjdfa on 5/15/2016.
 */
import {JobPostings} from "../../../both/collections/jobPosting";

MyJobPostingsController = AppController.extend({
	waitOn: function () {
		SubscriptionManager.subscribe("job-postings");
	},
	onAfterAction: function () {
		Meta.setTitle("My job postings");
	},
	data: {}
});

Template.myJobPostings.helpers({
	myJobPostings: function() {
		return JobPostings.find({postingUserId: Meteor.userId()}).fetch();
	}
});