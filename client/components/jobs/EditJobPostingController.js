/**
 * Created by tjdfa on 1/1/2017.
 */
import {JobPostings} from "../../../both/collections/jobPosting";
import * as Helpers from '../../../both/helpers/helpers';

let method = "Create"; // Or Edit
EditJobPostingController = AppController.extend({
	waitOn: function () {
		SubscriptionManager.subscribe("job-postings");
	},
	onAfterAction: function () {
		method = Helpers.toTitleCase(Router.current().params.method);
		Meta.setTitle(method + " job posting");
	},
	data: {}
});

Template.editJobPosting.helpers({
	method: () => method,
	selectedJobPosting: function() {
		if (method === "Edit") {
			let id = Router.current().params._id;
			return JobPostings.findOne({_id: id});
		}
		else {
			return null;
		}
	},
	JobPostingsCollection: () => JobPostings
});

Template.editJobPosting.events({
	"click #delete-job-posting-button": function(event, template) {
		let postId = Router.current().params._id;
		Meteor.call("removeJobPosting", postId, function(error, response) {
			if (response && response.result === "success") {
				toastr.success("Job posting was deleted successfully")
			}
			else {
				toastr.error("There was an error when deleting the job posting")
			}
		});

		Router.go('/myJobPostings');
	},
	"change #start-date": function(event, template) {
		let startDate = $(event.currentTarget).datepicker('getDate');
		if (!startDate) return;
		let currentExpiration = $("#expiration-date").datepicker('getDate');

		if (!currentExpiration || currentExpiration < startDate) {
			$("#expiration-date").datepicker('update', startDate);
		}
	}
});

// Return to previous page when form is submitted.
AutoForm.addHooks(['createJobPostingForm', 'updateJobPostingForm'], {
	onSuccess: function() {
		Router.go('/myJobPostings');
	}
});