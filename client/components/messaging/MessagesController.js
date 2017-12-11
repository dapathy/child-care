/**
 * Created by tjdfa on 9/17/2016.
 */

import { ConversationsCollection, Conversation } from '../../../both/collections/messaging/conversation';

MessagesController = AppController.extend({
	waitOn: function () {
		SubscriptionManager.subscribe("conversations");
	},
	onAfterAction: function () {
		Meta.setTitle("Messages");
	},
	data: {}
});

Template.messages.onCreated(function() {
	this.selectedConversationReactive = new ReactiveVar();
});

Template.messages.helpers({
	conversations: function() {
		// The subscription is limited to only our conversations.
		// Sort by newest first.
		let conversations = ConversationsCollection.find({}, {sort: {date: -1}}).fetch();
		if (!conversations || conversations.length === 0) return [];

		for (let conversation of conversations) {
			Object.setPrototypeOf(conversation, new Conversation());
			formatConversation(conversation);
		}

		let user = Router.current().params.query.user;
		if (user) {
			let selectedConversation = conversations.find((conversation) => {
				return conversation.participant.username === user;
			});
			Template.instance().selectedConversationReactive.set(selectedConversation);
		} else {
			Template.instance().selectedConversationReactive.set(conversations[0]);
		}

		scrollToBottom();
		return conversations;
	},
	selectedConversation: function() {
		return Template.instance().selectedConversationReactive.get();
	},
	isConversationActive: function(conversation) {
		let selectedConversation = Template.instance().selectedConversationReactive.get();
		if (selectedConversation) {
			return conversation.participant.username === selectedConversation.participant.username;
		} else {
			return false;
		}
	},
	messages: function() {
		let conversation = Template.instance().selectedConversationReactive.get();
		// Handles case where no conversation exists.
		if (conversation.hasOwnProperty("date")) {
			let messages = conversation.messages().fetch();
			for (let message of messages) {
				formatMessage(message);
			}
			return messages;
		}
		return [];
	}
});

Template.messages.events({
	'click .conversation-item': function(event, template) {
		template.selectedConversationReactive.set(this);
		scrollToBottom();
	},
	'click #new-message-button': function(event, template) {
		let messageTextElement = $("#new-message-text");
		let messageText = messageTextElement.val();
		let conversation = template.selectedConversationReactive.get();
		Meteor.call("sendMessage", conversation._id, messageText, function () {
			scrollToBottom();
		});
		messageTextElement.val("");
	}
});

function formatMessage(message) {
	let user = Meteor.users.findOne(message.userId);
	message["user"] = user;

	message.date = formatDate(message.date);
}

function formatConversation(conversation) {
	// Assume first participant is the other guy.
	let participants = conversation.participants().fetch();
	if (participants && participants.length > 0) {
		let user = Meteor.users.findOne(participants[0].userId);
		conversation["participant"] = user;
	}

	conversation.date = formatDate(conversation.date);
}

function scrollToBottom() {
	// One defer wasn't reliable.
	Meteor.defer(function() {
		Meteor.defer(function() {
			let conversation = $('#message-stream');
			conversation.scrollTop(conversation.prop('scrollHeight'));
		});
	});
}

function formatDate(date) {
	return moment(date).format("MMM Do YY");
}