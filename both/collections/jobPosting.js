/**
 * Created by tjdfa on 5/15/2016.
 */
import SimpleSchema from 'simpl-schema';
import * as CommonSchemas from "./commonSchemas";

export let JobPostings = new Meteor.Collection("jobPostings");

let Schema = {};

Schema.JobPosting = new SimpleSchema({
	summary: {
		type: String,
		optional: true
	},
	oneTime: {
		type: String,
		optional: false,
		allowedValues: ["One time", "Recurring"],
		label: "Is this a one-time or recurring job?"
	},
	startDate: {
		type: Date,
		optional: false
	},
	// If empty, fill in with start date in server.
	expiration: {
		type: Date,
		optional: true,
		label: "When do you want this posting hidden?"
	},

	// These aren't optional, but they'll be added on the server.
	// Denormalized data points to improve performance.
	postingUserId: {
		type: String,
		optional: true
	},
	username: {
		type: String,
		optional: true
	},
	primaryChurch: {
		type: CommonSchemas.Location,
		optional: true
	},
	latitude: {
		type: Number,
		optional: true
	},
	longitude: {
		type: Number,
		optional: true
	}
});

JobPostings.attachSchema(Schema.JobPosting);
