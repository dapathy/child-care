/**
 * Created by tjdfa on 12/17/2015.
 */

export let ProfilePictures = new FileCollection("profilePictures", {
	resumable: true,
	http: [
		{
			method: 'get',
			path: '/id/:_id',  // this will be at route "/gridfs/profilePictures/id/:_id"
			lookup: function (params, query) {  // uses express style url params
				return { _id: params._id};       // a query mapping url to myFiles
			}
		}
	]
});

let imageTypes = {
	'image/jpeg': true,
	'image/png': true,
	'image/gif': true,
	'image/tiff': true
};

if (Meteor.isClient) {

	Meteor.startup(function() {

		// When a file is added via drag and drop
		ProfilePictures.resumable.on('fileAdded', function (file) {

			if (!imageTypes[file.file.type]) {
				toastr.error("This file is not an image.")
			}

			// Remove previous if it exists.
			Meteor.call("removeProfilePicture", function() {
				// Create a new file in the file collection to upload
				ProfilePictures.insert({
						_id: file.uniqueIdentifier,  // This is the ID resumable will use
						filename: file.fileName,
						contentType: file.file.type
					},
					function (err, _id) {  // Callback to .insert
						if (err) { return console.error("File creation failed!", err); }

						// Once the file exists on the server, start uploading
						ProfilePictures.resumable.upload();
					}
				);
			});
		});

		ProfilePictures.resumable.on('fileSuccess', function(file) {
			// Only add to user once upload has finished.
			Meteor.call("addProfilePictureToUser");
			toastr.success("Profile picture added successfully.")
		});
	});

}