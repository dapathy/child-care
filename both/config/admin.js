/**
 * Created by tjdfa on 3/27/2016.
 */
import {JobPostings} from "../collections/jobPosting";
import {Reviews} from "../collections/review";
import {ConversationsCollection} from "../collections/messaging/conversation";

AdminConfig = {
	name: 'Christian Child Care',
	adminEmails: ['tjdfalcon@gmail.com', 'scotta.waxman@gmail.com'],
	collections: {
		"Meteor.users": {
			icon: 'user',
			tableColumns: [
				{ label: 'Username', name: 'username' },
				{ label: 'User Type', name: 'profile.userType'}
			]
		},
		"JobPostings": {
			collectionObject: JobPostings,
			tableColumns: [
				{ label: "Username", name: 'username'}
			]
		},
		"Reviews": {
			collectionObject: Reviews,
			tableColumns: [
				{ label: "Reviewer Username", name: 'reviewerUsername'},
				{ label: "Subject ID", name: "subjectId"}
			]
		},
		"Conversations": {
			collectionObject: ConversationsCollection
		}
	}
};