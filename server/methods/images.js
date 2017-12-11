/**
 * Created by tjdfa on 10/29/2016.
 */
import {ProfilePictures} from "../../both/collections/images";

Meteor.methods({
	removeProfilePicture: function() {
		// Remove every picture under Id just in case.
		let pictures = ProfilePictures.find({'metadata.owner': Meteor.userId()}).fetch();
		for (let picture of pictures) {
			ProfilePictures.remove(picture._id);
		}

		Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.profilePicture": null}});
	},
	addProfilePictureToUser: function() {
		let profilePicture = ProfilePictures.findOne({'metadata.owner': Meteor.userId()});
		if (!profilePicture) return;

		Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.profilePicture": profilePicture._id._str}});
	}
});