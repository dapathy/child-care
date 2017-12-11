import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { ConversationsCollection } from './conversation';

const ParticipantsCollection = new Meteor.Collection('participants');

/**
 * The Participant Class
 * @class Participant
 */
class Participant {
    /**
     * Get the user that is the participant
     * @method user
     * @returns {User} The user who is the participant in the conversation
     */
    user() {
        return Meteor.users.findOne(this.userId);
    }

    /**
     * Get the conversation that the participant is involved in
     * @method conversation
     * @returns {Conversation} The conversation the user is participating in
     */
    conversation() {
        return ConversationsCollection.findOne(this.conversationId);
    }

    /**
     * Check if the user is observing the conversation
     * @method isObserving
     * @returns {Boolean} Whether the user is observing the conversation
     */
    isObserving() {
        return this.observing && this.observing.length > 0;
    }

    /**
     * Check if the participant is typing
     * @returns {Boo} Whether or not the participant is typing
     */
    isTyping() {
        return this.typing;
    }
}

// Create the participant schema
ParticipantsCollection.attachSchema(new SimpleSchema({
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue() {
            if (this.isInsert && !this.isSet) {
                return this.userId;
            }
            return undefined;
        },
        denyUpdate: true,
        index: 1,
    },
    conversationId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        denyUpdate: true,
        index: 1,
    },
    read: {
        type: Boolean,
        defaultValue: false,
    },
    deleted: {
        type: Boolean,
        optional: true,
    },
    date: {
        type: Date,
        autoValue() {
            return new Date();
        },
        index: -1,
    },
    observing: {
        type: Array,
        defaultValue: [],
        index: 1,
    },
    'observing.$': {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    typing: {
        type: Boolean,
        defaultValue: false,
    },

}));

export {ParticipantsCollection, Participant};
