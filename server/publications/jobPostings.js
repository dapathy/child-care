/**
 * Created by tjdfa on 5/15/2016.
 */
import { JobPostings } from "../../both/collections/jobPosting";

// This is only used by user to find own posts.
Meteor.publish("job-postings", function() {
	if (!this.userId) return this.ready();

	let searchCriteria = {};

	searchCriteria.postingUserId = this.userId;

	// Expiration date is greater than current day.
	searchCriteria.expiration = {"$gte": new Date()};

	return JobPostings.find(searchCriteria);
});

