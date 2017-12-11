/**
 * Created by tjdfa on 11/28/2015.
 */
import * as Response from '../helpers/response';
import {GoogleMaps} from "../startup/init";
import {JobPostings} from "../../both/collections/jobPosting";
import * as Location from "../../both/helpers/location";

Meteor.methods({
	updateUser: function(userModifier) {
		if (!Meteor.userId()) return;

		let modifier = userModifier.modifier;

		try {
			if (isValidUserModifier(modifier)) {
				// This will validate for us.
				Meteor.users.update({_id: Meteor.userId()}, modifier, {validationContext: "updateForm"});

				let userModifierString = JSON.stringify(modifier);
				if (userModifierString.includes("address")) {
					updateCoordinates();
				}
				if (userModifierString.includes("primaryChurch")) {
					updateJobPostings({
						primaryChurch: Meteor.user().profile.primaryChurch
					});
				}
			}
		}
		catch (exception) {
			return Response.handleError(exception);
		}
	},
	userExists: function(username){
		check(username, String);
		return !!Meteor.users.findOne({username: username});
	},
	hideAccount: function() {
		if (Meteor.userId()) {
			Meteor.users.update({_id : Meteor.userId()},{$set:{status : 'hidden'}});
		}
	},
	showAccount: function() {
		if (Meteor.userId()) {
			Meteor.users.update({_id : Meteor.userId()},{$set:{status : 'good'}});
		}
	},
	findProviders: function(options) {
		if (options) {
			check(options, {
				gender: Match.Optional(String),
				maximumDistance: Match.Optional(Number)
				// rating?
			});
		}
		else {
			options = {};
		}

		let searchCriteria = {};

		if (options.gender) searchCriteria["profile.providerProfile.gender"] = options.gender;

		// Get non-seekers (providers)
		searchCriteria["profile.userType"] = {"$ne": 'seeker'};

		// Email should be verified
		searchCriteria["emails.0.verified"] = true;

		let user = Meteor.users.findOne({_id: this.userId});
		let boundingBox = Location.getBoundingBoxForUser(user, options.maximumDistance);

		searchCriteria["privateProfile.address.latitude"] = {
			"$lte": boundingBox.north,
			"$gte": boundingBox.south
		};
		searchCriteria["privateProfile.address.longitude"] = {
			"$lte": boundingBox.west,
			"$gte": boundingBox.east
		};

		let providers = Meteor.users.find(searchCriteria, {fields: {
			username: 1, profile: 1
		}}).fetch();

		return Response.success(providers);
	}
});

function updateCoordinates() {
	let userAddress = Meteor.user().privateProfile.address;
	if (!userAddress.street || !userAddress.state) return;

	// TODO: assumptions being made here.
	let address = userAddress.street + "," + userAddress.city + "," + userAddress.state;

	let params = {
		"address": address,
		"language": "en"
	};

	// I have no idea what bindEnvironment does, but we need it.
	GoogleMaps.geocode(params, Meteor.bindEnvironment(function(error, result){
		if (error) return;
		if (!result.results || !result.results[0].geometry) return;

		let location = result.results[0].geometry.location;
		let latitude = location.lat;
		let longitude = location.lng;

		Meteor.users.update({_id: Meteor.userId()}, {$set: {
			"privateProfile.address.latitude": latitude,
			"privateProfile.address.longitude": longitude
		}});

		updateJobPostings({
			latitude: latitude,
			longitude: longitude
		});
	}));
}

function isValidUserModifier(modifier) {
	let restrictedProperties = ['readOnly', 'restrictedProfile'];

	// If user already has a type, don't let them change.
	if (Meteor.user().profile.userType) {
		restrictedProperties.push('userType');
	}

	let modifierString = JSON.stringify(modifier);
	return !restrictedProperties.some(p => modifierString.includes(p));
}

// For updating denormalized data.
function updateJobPostings(value) {
	JobPostings.update({postingUserId: Meteor.userId()}, {$set: value});
}