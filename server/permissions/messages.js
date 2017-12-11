/**
 * Created by tjdfa on 10/15/2016.
 */

import { ConversationsCollection } from '../../both/collections/messaging/conversation';
import { ParticipantsCollection } from '../../both/collections/messaging/participant';
import { MessagesCollection } from '../../both/collections/messaging/message';

// The package has various allows for its collection.
// Override them and deny everything.

ConversationsCollection.deny({
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

ParticipantsCollection.deny({
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

MessagesCollection.deny({
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