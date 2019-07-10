import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Tickets, TicketStates } from '../tickets.js';

Meteor.methods({
    'tickets.insert'(courseId, courseStyle) {
        check(courseId, String);
        check(courseStyle, String);

        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error('Not logged in!');
        }

        var re = /...[- ]?...[- ]?.../;
        if (!courseId.match(re)) {
            throw new Meteor.Error('Invalid Course ID!');
        }

        if (courseStyle == null || courseStyle == "") {
            throw new Meteor.Error("Invalid Course style!");
        }

        var cid = courseId.toUpperCase();
        var existing = Tickets.findOne({courseId: cid, status: TicketStates.InQueue});
        if (existing) {
            throw new Meteor.Error("Course with same ID already in queue. One course is allowed only once at a time.");
        }

        // Insert a task into the collection
        Tickets.insert({
            courseId: cid,
            courseStyle: courseStyle,
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
            $inc: { coins: 1 },
        });

        //userData.coins = userData.coins - 1;
        Meteor.users.update({_id: Meteor.userId()}, {$set: { 'coins': userData.coins - 1}});
    },

    'tickets.reserveCourse'() {
        if (!Meteor.userId()) {
            throw new Meteor.Error('Not logged in!');
        }

        var userData = Meteor.user();
        if (userData == null) {
            throw new Meteor.Error('No user found!');
        }

        if (userData.reservedTicketId != null && userData.reservedTicketId != "") {
            throw new Meteor.Error('Already has reserved ticket!');
        }

        var newestTicketArr = Tickets.find({status: TicketStates.InQueue, createdBy: { $ne: Meteor.userId()} }, {sort: { coins: -1, createdAt: 1 }, limit: 1 }).fetch();
        if (newestTicketArr.length != 1) {
            return false;
        }

        var newestTicket = newestTicketArr[0];
        if (newestTicket == null) {
            throw new Meteor.Error("null ticket");
        }

        Tickets.update(newestTicket._id, {
            $set: { status: TicketStates.Reserved },
        });

        //userData.reservedTicketId = newestTicket._id;
        Meteor.users.update({_id: Meteor.userId()}, {$set: { reservedTicketId: newestTicket._id}});
        return true;
    },

    'tickets.coursePlayed'(optionResult) {
        if (!Meteor.userId()) {
            throw new Meteor.Error('Not logged in!');
        }

        var userData = Meteor.user();
        if (userData == null) {
            throw new Meteor.Error('No user found!');
        }

        if (userData.reservedTicketId == null) {
            throw new Meteor.Error('No course reserved!');
        }

        var ticket = Tickets.findOne({_id: userData.reservedTicketId});
        if (ticket == null) {
            //throw new Meteor.Error('No ticket found!');
        }

        if (isNaN(userData.coins)) {
            userData.coins = 0;
        }

        var addCoinAmount = 1;
        var newState = TicketStates.Returned;

        if (optionResult === "skipped") {
            addCoinAmount = 0;
            newState = TicketStates.InQueue;
        } else if (optionResult == "course-missing") {
            addCoinAmount = 0;
            newState = TicketStates.Returned;
        } else {
            var correctStyle = ticket.courseStyle;
            if (optionResult !== correctStyle) {
                addCoinAmount = -1;
                newState = TicketStates.InQueue;
            }
        }

        Tickets.update(userData.reservedTicketId, {
            $set: { status: newState, result: optionResult },
        });

        var newCoinAmount = userData.coins + addCoinAmount;
        Meteor.users.update({_id: Meteor.userId()}, {$set: { reservedTicketId: "", coins: newCoinAmount }});

        return addCoinAmount;
    },
});
