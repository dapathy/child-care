/**
 * Created by tjdfa on 7/31/2016.
 */
import SimpleSchema from 'simpl-schema';

export let Location = new SimpleSchema({
	id: {
		type: String,
		optional: true
	},
	name: {
		type: String,
		label: "Primary church",
		optional: true
	}
});