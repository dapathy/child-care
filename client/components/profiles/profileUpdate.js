/**
 * Created by tjdfa on 11/22/2015.
 */
import {ProfilePictures} from "../../../both/collections/images";
import * as Autocomplete from "../../common/scripts/autocomplete";

Template.basicInfoUpdate.onRendered(function() {
	initializePrimaryChurchAutocomplete();
});

Template.profilePictureUpdate.events({
	'click #remove-profile-picture': function(event, template) {
		Meteor.call("removeProfilePicture");
	}
});

Template.profilePictureUpdate.onRendered(function () {
	// This assigns a file upload drop zone to some DOM node
	ProfilePictures.resumable.assignDrop($(".fileDrop"));

	// This assigns a browse action to a DOM node
	ProfilePictures.resumable.assignBrowse($(".fileBrowse"));
});

function initializePrimaryChurchAutocomplete() {
	const churchFieldId = 'primary-church-field';
	let churchField = document.getElementById(churchFieldId);

	// Initialize popover.
	$(churchField).popover();

	// Show current value.
	if (Meteor.user() && Meteor.user().profile.primaryChurch) {
		churchField.value = Meteor.user().profile.primaryChurch.name;
	}

	Autocomplete.initializeAutocomplete(churchFieldId, function(place) {
		// Save church.
		Meteor.call('updateUser', { $set: { 'profile.primaryChurch': place }});

		// Don't show alert during registration. It's not using autosave.
		if (!Iron.Location.get().path.includes("registration")) {
			toastr.success("Changes saved successfully");
		}
	});
}
