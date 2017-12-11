import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

const MessagesCollection = new Meteor.Collection('messages');

/**
 * The Message Class
 * @class Message
 */
class Message {
    /**
    * Get the user that wrote the message
    * @method user
    * @returns {User} The user who wrote the message
    */
    user() {
        return Meteor.users.findOne(this.userId);
    }

    /**
    * The message timestamp
    * @method timestamp
    * @returns {String} A string representing the time when the message was sent
    */
    timestamp() {
        const now = new Date();
        let stamp = '';

        if (now.toLocaleDateString() !== this.date.toLocaleDateString()) {
            stamp += `${this.date.toLocaleDateString()} `;
        }

        stamp += this.date.toLocaleTimeString();

        return stamp;
    }

    /**
    * The message timestamp
    * @method isInFlight
    * @returns {Boolean} whether the message has been received yet
    */
    isInFlight() {
        return this.inFlight;
    }
}

// Create our message schema
MessagesCollection.attachSchema(new SimpleSchema({
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue() {
            if (this.isInsert) {
                return this.userId;
            }
            return undefined;
        },
        index: 1,
        denyUpdate: true,
    },
    conversationId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        index: 1,
        denyUpdate: true,
    },
    body: {
        type: String,
    },
    date: {
        type: Date,
        autoValue() {
            if (this.isInsert) {
                return new Date();
            }
            return undefined;
        },
        index: -1,
        denyUpdate: true,
    },
    inFlight: {
        type: Boolean,
        autoValue() {
            if (!this.isFromTrustedCode) {
                return true;
            } else if (this.isInsert) {
                return false;
            }
            return undefined;
        },
        denyUpdate: true,
    },
}));

export { Message, MessagesCollection };
