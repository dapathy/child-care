/**
 * Created by tjdfa on 11/22/2015.
 */

// Meteor provides some defaults here.  To be sure, deny everything.
Meteor.users.deny({
	insert: function() {
		return true;
	},
	update: function () {
		return true;
	},
	remove: function() {
		return true;
	}
});