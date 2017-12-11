/**
 * Created by tjdfa on 11/28/2015.
 */
import { ProfilePictures } from "../../both/collections/images";

// publishes private data to current user
Meteor.publish("user-data", function () {
	if (this.userId) {
		return Meteor.users.find({_id: this.userId},
			{fields: {'privateProfile': 1, 'status': 1}});
	} else {
		return this.ready();
	}
});

Meteor.publish("user-profile", function (username) {
	check(username, String);

	return Meteor.users.find({username: username}, {fields: {username: 1, profile: 1}});
});

// Needed for updating the picture.
Meteor.publish("profile-picture-update", function() {
	let userId = this.userId;

	// Ignore file chunks being used by Resumable.js for current uploads.
	return ProfilePictures.find(
		{
			'metadata._Resumable': { $exists: false },
			'metadata.owner': userId
		});
});
