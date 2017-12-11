/**
 * Created by tjdfa on 5/16/2016.
 */
import * as Response from '../helpers/response';
import { JobPostings } from "../../both/collections/jobPosting";
import * as Location from "../../both/helpers/location";

Meteor.methods({
	createJobPosting: function(jobPosting) {
		if (!Meteor.userId()) return;
		
		jobPosting['postingUserId'] = Meteor.userId();
		
		// Denormalizing data.
		jobPosting['username'] = Meteor.user().username;
		jobPosting['primaryChurch'] = Meteor.user().profile.primaryChurch;
		jobPosting['latitude'] = Meteor.user().privateProfile.address.latitude;
		jobPosting['longitude'] = Meteor.user().privateProfile.address.longitude;

		// If there isn't an expiration, give the start.
		if (!jobPosting.expiration) {
			jobPosting.expiration = jobPosting.startDate;
		}

		try {
			// This should validate for us.
			JobPostings.insert(jobPosting, {validationContext: "insertForm"});
			return Response.success();
		}
		catch (exception) {
			return Response.handleError(exception);
		}
	},
	updateJobPosting: function(jobPostingModifier) {
		if (!Meteor.userId()) return;

		try {
			let jobPosting = JobPostings.findOne({_id: jobPostingModifier._id});

			// Quit if not yours.
			if (jobPosting['postingUserId'] !== Meteor.userId()) return;

			// User shouldn't be trying to change owner of post.
			if (jobPostingModifier.modifier.$set.postingUserId) return;

			// This should validate for us.
			JobPostings.update({_id: jobPostingModifier._id}, jobPostingModifier.modifier, {validationContext: "updateForm"});
			return Response.success();
		}
		catch (exception) {
			return Response.handleError(exception);
		}
	},
	removeJobPosting: function(jobPostId) {
		if (!Meteor.userId()) return;
		check(jobPostId, String);

		try {
			let jobPosting = JobPostings.findOne({_id: jobPostId});

			// Quit if not yours.
			if (jobPosting['postingUserId'] !== Meteor.userId()) return;

			JobPostings.remove({_id: jobPostId});
			return Response.success();
		}
		catch (exception) {
			return Response.handleError(exception);
		}
	},
	findJobPostings: function(options) {
		if (!Meteor.userId()) return;

		if (options) {
			check(options, {
				user: Match.Optional(String),
				oneTime: Match.Optional(String),
				startDate: Match.Optional(Date),
				maximumDistance: Match.Optional(Number)
			});
		}
		else {
			options = {};
		}

		let searchCriteria = {};

		if (options.user) searchCriteria.postingUserId = options.user;
		if (options.oneTime) searchCriteria.oneTime = options.oneTime;
		if (options.startDate) searchCriteria.startDate = {"$gte": options.startDate};

		// Expiration date is greater than current day.
		searchCriteria.expiration = {"$gte": new Date()};

		// Don't do location stuff if a user was specified.
		if (!options.user) {
			let user = Meteor.users.findOne({_id: this.userId});
			let boundingBox = Location.getBoundingBoxForUser(user, options.maximumDistance);

			searchCriteria.latitude = {
				"$lte": boundingBox.north,
				"$gte": boundingBox.south
			};
			searchCriteria.longitude = {
				"$lte": boundingBox.west,
				"$gte": boundingBox.east
			};
		}

		let jobPostings = JobPostings.find(searchCriteria, {fields: {
			latitude: 0, longitude: 0
		}}).fetch();

		return Response.success(jobPostings);
	},
	getJobPosting: function(id) {
		if (!Meteor.userId()) return;

		check(id, String);

		try {
			let jobPosting = JobPostings.findOne({_id: id});
			return Response.success(jobPosting);
		}
		catch (exception) {
			return Response.handleError(exception)
		}
	}
});

