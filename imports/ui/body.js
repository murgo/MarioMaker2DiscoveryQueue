import { Template } from 'meteor/templating';
import { Tickets, TicketStates } from '../api/tickets.js';

import './body.html';
import './profile.js';
import './queue.js';
import './playcourse.js';
import './submitcourse.js';

function errorHandler(successText) {
    return function(err) {
        if (err) {
            console.log(err);
            sAlert.error(err.error);
        } else if (successText) {
            sAlert.success(successText);
        }
    };
}

function isLoggedIn(reportFailure = false) {
    var loggedIn = (Meteor.userId() != null);
    if (reportFailure && !loggedIn) {
        sAlert.error('Please log in');
    }
    return loggedIn;
}