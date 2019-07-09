import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tickets = new Mongo.Collection('tickets');

export const TicketStates = {
    InQueue: 1,
    Reserved: 2,
    Returned: 3
}

Meteor.methods({
    'tickets.insert'(levelCode, levelStyle) {
        check(levelCode, String);
        check(levelStyle, String);

        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error('Not logged in!');
        }

        var re = /...[- ]?...[- ]?.../;
        if (!levelCode.match(re)) {
            throw new Meteor.Error('Invalid level code!');
        }

        if (levelStyle == null || levelStyle == "") {
            throw new Meteor.Error("Invalid level style!");
        }

        // Insert a task into the collection
        Tickets.insert({
            levelCode: levelCode,
            levelStyle: levelStyle,
            createdAt: new Date(), // current time
            coins: 0,
            createdBy: Meteor.userId(),
            createdByName: Meteor.user().username,
            status: TicketStates.InQueue,
          });
   },
    'tickets.addCoin'(ticketId) {
        check(ticketId, String);

        if (!Meteor.userId()) {
            throw new Meteor.Error('Not logged in!');
        }

        var userData = Meteor.user();
        if (userData == null) {
            throw new Meteor.Error('No user found!');
        }

        if (userData.coins == null || isNaN(userData.coins)) {
            userData.coins = 0;
        }

        if (userData.coins <= 0) {
            throw new Meteor.Error('Not enough coins!');
        }

        Tickets.update(ticketId, {
            $set: { coins: this.coins + 1 },
        });

        userData.coins = userData.coins - 1;
        Meteor.users.update({_id: Meteor.userId()}, {$set: { 'coins': userData.coins}});
    },
});
