/**
 * Created by tjdfa on 12/11/2016.
 */
import SimpleSchema from 'simpl-schema';

export let Reviews = new Meteor.Collection("reviews");

let Schema = {};

SimpleSchema.extendOptions(['autoform']);

Schema.Review = new SimpleSchema({
	reviewerUsername: {
		type: String
	},
	subjectId: {
		type: String
	},
	rating: {
		type: Number
	},
	description: {
		type: String,
		autoform: {
			afFieldInput: {
				type: "textarea"
			}
		}
	},
	date: {
		type: Date
	}
});

Reviews.attachSchema(Schema.Review);