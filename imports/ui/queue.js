import { Template } from 'meteor/templating';
import { Tickets, TicketStates } from '../api/tickets.js';

import './queue.html';

Template.queue.helpers({
    tickets() {
        return Tickets.find({ status: {$ne: TicketStates.Returned } }, {sort: { coins: -1, createdAt: 1 }});
    },
});

Template.queuedCourse.helpers({
    isReserved() {
        return this.status == TicketStates.Reserved;
    },
    isMyOwn() {
        return this.createdBy == Meteor.userId();
    }
});
