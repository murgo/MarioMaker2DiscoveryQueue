import { Template } from 'meteor/templating';
import { Tickets } from '../api/tickets.js';

import './profile.html';

export const ErrorHandler = (successText) => {
    return function(err) {
        if (err) {
            console.log(err);
            sAlert.error(err.error);
        } else if (successText) {
            sAlert.success(successText);
        }
    };
}

export const IsLoggedIn = (reportFailure = false) => {
    var loggedIn = (Meteor.userId() != null);
    if (reportFailure && !loggedIn) {
        sAlert.error('Please log in');
    }
    return loggedIn;
}
