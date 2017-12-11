/**
 * Created by tjdfa on 12/11/2016.
 */
import { Reviews } from "../../both/collections/review";

Meteor.publish("reviews", function(userId) {
	if (!this.userId) return this.ready();

	check(userId, String);

	return Reviews.find({subjectId: userId});
});