/**
 * Created by tjdfa on 9/18/2016.
 */
import { ConversationsCollection } from '../../both/collections/messaging/conversation';
import { ParticipantsCollection } from '../../both/collections/messaging/participant';
import { MessagesCollection } from '../../both/collections/messaging/message';

Meteor.publishComposite("conversations", {
	find: function() {
		return ConversationsCollection.find({
			_participants: {$in: [this.userId]}
		});
	},
	children: [
		{
			// participant for each conversation
			find: function(conversation) {
				return ParticipantsCollection.find({
					conversationId: conversation._id
				});
			},
			children: [
				{
					// user profile for each participant
					find: function(participant) {
						return Meteor.users.find({
							_id: participant.userId
						}, {fields: {username: 1, profile: 1}});
					}
				}
			]
		},
		{
			// messages for each conversation
			find: function(conversation) {
				return MessagesCollection.find({
					conversationId: conversation._id
				});
			}
		}
	]
});