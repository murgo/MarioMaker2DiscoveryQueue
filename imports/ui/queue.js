import { Template } from 'meteor/templating';
import { Tickets, TicketStates } from '../api/tickets.js';

import './queue.html';

Template.queue.helpers({
    tickets() {
        return Tickets.find({}, {sort: { coins: -1, createdAt: -1 }});
        //return [{levelCode:"1234"}, {levelCode:"4325"}]
    },
});

Template.queuedCourse.helpers({
    isReserved() {
        return this.status == TicketStates.Reserved;
    }
});
