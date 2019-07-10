import { Template } from 'meteor/templating';
import { Tickets } from '../api/tickets.js';
import { Accounts } from 'meteor/accounts-base'

import './profile.html';

export const IsLoggedIn = (reportFailure = false) => {
    var loggedIn = (Meteor.userId() != null);
    if (reportFailure && !loggedIn) {
        sAlert.error('Please sign in first.');
    }

    return loggedIn;
}

Template.profile.helpers({
    GetCoinAmount() {
        var user = Meteor.user();
        if (user == null) {
            return 0;
        }

        var coins = user.coins;
        if (coins == undefined) {
            return 0;
        }

        return coins;
    }
});