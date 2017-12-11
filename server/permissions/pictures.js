/**
 * Created by tjdfa on 8/13/2016.
 */

import {ProfilePictures} from "../../both/collections/images";

ProfilePictures.allow({
	// TODO: convert to method.
	insert: function (userId, file) {
		// Assign the proper owner when a file is created
		file.metadata = file.metadata || {};
		file.metadata.owner = userId;
		return true;
	},
	remove: function (userId, file) {
		// Handled in methods.
		return false;
	},
	read: function (userId, file) {
		return true;
	},
	// This rule secures the HTTP REST interfaces' PUT/POST
	// Necessary to support Resumable.js
	write: function (userId, file, fields) {
		// Only owners can upload file data
		// TODO: return userId === file.metadata.owner;
		return true;
	}
});