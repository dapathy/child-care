/**
 * Created by tjdfa on 10/15/2016.
 */
import { ConversationsCollection, Conversation } from '../../both/collections/messaging/conversation';
import { ParticipantsCollection } from '../../both/collections/messaging/participant';
import { MessagesCollection } from '../../both/collections/messaging/message';

Meteor.methods({
	createConversation: function(userId) {
		if (!Meteor.userId()) return;
		check(userId, String);

		let hasExistingConversation = Meteor.call("findExistingConversationWithUsers", [userId]);
		if (hasExistingConversation) return;

		// Adds logged in user automatically.
		let conversation = new Conversation();
		conversation._id = ConversationsCollection.insert(conversation);
		let user = Meteor.users.findOne({_id: userId});
		conversation.addParticipant(user);
	},
	sendMessage: function(conversationId, message) {
		if (!Meteor.userId()) return;
		check(conversationId, String);
		check(message, String);

		// Don't want user sending messages to other conversations.
		let conversation = ConversationsCollection.findOne({_id: conversationId});
		let inConversation = isParticipatingInConversation(conversation);
		if (!inConversation) return;

		let newMessage = { body: message, conversationId: conversationId, inFlight: true };
		MessagesCollection.insert(newMessage);
	},
	findExistingConversationWithUsers(users) {
		check(users, [String]);

		users.push(Meteor.userId());

		const conversation = ConversationsCollection.findOne({ _participants: { $size: users.length, $all: users } });

		return conversation && conversation._id;
	},
});

function isParticipatingInConversation(conversation) {
	return !!ParticipantsCollection.findOne({ userId: Meteor.userId(), conversationId: conversation._id, deleted: { $exists: false } });
}

// Add the creator of the collection as a participant on the conversation
ConversationsCollection.after.insert(function afterInsert(userId, document) {
	ParticipantsCollection.insert({ conversationId: document._id, read: true });
});

// When we delete a conversation, clean up the participants and messages that belong to the conversation
ConversationsCollection.after.remove(function afterRemove(userId, document) {
	MessagesCollection.direct.remove({ conversationId: document._id });
	ParticipantsCollection.direct.remove({ conversationId: document._id });
});

ParticipantsCollection.after.insert(function afterInsert(userId, document) {
	ConversationsCollection.update(document.conversationId, { $addToSet: { _participants: document.userId } });
});

ParticipantsCollection.after.update(function afterUpdate(userId, document) {
	if (document.deleted) {
		if (this.transform().conversation().isReadOnly()) {
			ConversationsCollection.remove(document.conversationId);
		} else {
			ConversationsCollection.update(document.conversationId, { $pull: { _participants: document.userId } });
		}
	}
});

// After a message is sent we need to update the ParticipantsCollection and ConversationsCollection
MessagesCollection.after.insert(function afterInsert(userId, document) {
	// Grab the current time
	const date = new Date();

	/* Find out who is currently looking at the message.. We don't want to
	 * set their status to unread as it will trigger notifications for the user
	 *
	 * Tracking observations is done through the "viewingConversation" subscription
	 */
	const observers = ParticipantsCollection.find({
		conversationId: document.conversationId,
		observing: {
			$not: { $size: 0 },
		},
	}, {
		fields: { userId: 1 },
	}).map(participant => participant.userId);

	// Set the read status to false for users not observing the conversation
	ParticipantsCollection.update({
		conversationId: document.conversationId, userId: { $nin: observers },
	}, {
		$set: { read: false, date },
	}, {
		multi: true,
	});

	// update the date on the conversation for sorting the conversation from newest to oldest
	ConversationsCollection.update(document.conversationId, { $set: { date } });
});