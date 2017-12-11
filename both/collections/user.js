/**
 * Created by tjdfa on 11/19/2015.
 */

import SimpleSchema from 'simpl-schema';
import * as CommonSchemas from "./commonSchemas";

let Schema = {};

SimpleSchema.extendOptions([
	'autoform'
]);

Schema.SocialMedia = new SimpleSchema({
	facebook: {
		type: String,
		optional: true,
		regEx: SimpleSchema.RegEx.Url
	},
	twitter: {
		type: String,
		optional: true,
		regEx: SimpleSchema.RegEx.Url
	},
	linkedIn: {
		type: String,
		optional: true,
		regEx: SimpleSchema.RegEx.Url
	}
});

Schema.Address = new SimpleSchema({
	street: {
		type: String,
		label: "Address Line 1",
		optional: true,
		custom: profileValidator
	},
	street2: {
		type: String,
		label: "Address Line 2",
		optional: true
	},
	city: {
		type: String,
		optional: true,
		custom: profileValidator
	},
	// TODO: need country code?
	country: {
		type: String,
		optional: true,
		allowedValues: ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegowina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard and Mc Donald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia (Slovak Republic)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe"],
		custom: profileValidator
	},
	state: {
		type: String,
		optional: true,
		allowedValues: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
		custom: profileValidator
	},
	zipCode: {
		type: String,
		optional: true,
		regEx: /^[0-9]{5}$/,
		custom: profileValidator
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

// Not editable by the user.
Schema.ReadOnlyProviderProfile = new SimpleSchema({
	endorsements: {
		type: SimpleSchema.Integer,
		defaultValue: 0
	},
	timesHired: {
		type: SimpleSchema.Integer,
		defaultValue: 0
	},
	churchVerified: {
		type: Boolean,
		defaultValue: false
	},
	cprCertified: {
		type: Boolean,
		defaultValue: false
	},
	firstAidCertified: {
		type: Boolean,
		defaultValue: false
	}
});

Schema.ProviderProfile = new SimpleSchema({
	birthday: {
		type: Date,
		optional: true,
		custom: profileValidator
	},
	gender: {
		type: String,
		allowedValues: ['Male', 'Female', 'Other'],
		optional: true
	},
	likesPets: {
		type: Boolean,
		defaultValue: false
	},
	education: {
		type: String,
		allowedValues: ['In college', 'College degree', 'Some college', 'None of the above'],
		defaultValue: 'None of the above'
	},
	hourlyRate: {
		type: Number,
		optional: true,
		regEx: /^[+-]?[0-9]{1,3}(?:[0-9]*(?:[.,][0-9]{2})?|(?:,[0-9]{3})*(?:\.[0-9]{2})?|(?:\.[0-9]{3})*(?:,[0-9]{2})?)$/
	},
	generalAvailability:{
		type: String,
		optional: true,
		autoform: {
			afFieldInput: {
				type: "textarea"
			}
		}
	},
	readOnly: {
		type: Schema.ReadOnlyProviderProfile,
		optional: false
	}
});

Schema.UserProfile = new SimpleSchema({
	firstName: {
		type: String,
		optional: true,
		custom: profileValidator
	},
	lastName: {
		type: String,
		optional: true,
		custom: profileValidator
	},
	socialMedia: {
		type: Schema.SocialMedia,
		optional: true
	},
	primaryChurch: {
		type: CommonSchemas.Location,
		optional: true
	},
	bio: {
		type: String,
		optional: true,
		label: "Tell us about yourself in a hundred words",
		autoform: {
			afFieldInput: {
				type: "textarea"
			}
		}
	},
	// This is the _id
	profilePicture: {
		type: String,
		optional: true
	},
	providerProfile: {
		type: Schema.ProviderProfile,
		optional: true
	},
	// User should NOT edit this.
	// Putting this here because UserAccounts needs custom fields to be in the profile.
	// Third party services will need to add post registration.
	userType: {
		type: String,
		allowedValues: ['provider', 'seeker'],
		optional: true,
		custom: profileValidator,
		autoform: {
			type: "select-radio",
			options: function() {
				return [{label: "Provider", value: "provider"}, {label: "Seeker", value: "seeker"}]
			}
		}
	}
});

// Not readable by other users.
Schema.PrivateProfile = new SimpleSchema({
	phoneNumber: {
		type: String,
		optional: true,
		regEx: SimpleSchema.RegEx.Phone
	},
	address: {
		type: Schema.Address,
		optional: true
	}
});

// Not readable or editable by the user.
Schema.RestrictedProfile = new SimpleSchema({
	paymentId: {
		type: Number,
		optional: true
	},
	applicantId: {
		type: String,
		optional: true
	}
});

Schema.User = new SimpleSchema({
	username: {
		type: String,
		optional: false
	},
	emails: {
		type: Array,
		optional: false
	},
	"emails.$": {
		type: Object
	},
	"emails.$.address": {
		type: String,
		regEx: SimpleSchema.RegEx.Email
	},
	"emails.$.verified": {
		type: Boolean
	},
	createdAt: {
		type: Date
	},
	status: {
		type: String,
		defaultValue: 'good',
		allowedValues: ['good', 'hidden']
	},
	profile: {
		type: Schema.UserProfile,
		optional: false
	},
	privateProfile: {
		type: Schema.PrivateProfile,
		optional: false
	},
	restrictedProfile: {
		type: Schema.RestrictedProfile,
		optional: false
	},
	// Make sure this services field is in your schema if you're using any of the accounts packages
	services: {
		type: Object,
		optional: true,
		blackbox: true
	},
	// For use with roles package
	roles: {
		type: Array,
		defaultValue: [Roles.GLOBAL_GROUP]
	},
	"roles.$": {
		type: String
	},
	// In order to avoid an 'Exception in setInterval callback' from Meteor
	heartbeat: {
		type: Date,
		optional: true
	}
});

Meteor.users.attachSchema(Schema.User);

// Profile validation has to disabled so that that the account can be created.
// Need custom validator for after account has been created.
function profileValidator() {
	let isAccountCreated = !!Meteor.userId();
	if (isAccountCreated && (!this.operator || (this.value === null || this.value === ""))) {
		return SimpleSchema.ErrorTypes.REQUIRED;
	}
	return undefined;
}