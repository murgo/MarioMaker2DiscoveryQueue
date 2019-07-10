import { Template } from 'meteor/templating';
import { IsLoggedIn } from "./profile.js";

import './playcourse.html';
import { Tickets } from '../api/tickets.js';

Template.playCourse.helpers({
    hasReservedCourse() {
        if (!IsLoggedIn()) {
            return false;
        }

        var userData = Meteor.user();
        if (userData == null) {
            return false;
        }

        let reservedTicketId = userData.reservedTicketId;
        return reservedTicketId != null && reservedTicketId != "";
    },
    getReservedCourse() {
        if (!IsLoggedIn()) {
            return null;
        }

        var userData = Meteor.user();
        if (userData == null) {
            return null;
        }

        let reservedTicketId = userData.reservedTicketId;
        if (reservedTicketId == null) {
            return null;
        }

        return Tickets.findOne({_id: reservedTicketId});
    },
});

Template.playCourse.events({
    'click .play-button'(event, instance) {
        // Prevent default browser form submit
        event.preventDefault();
     
        if (!IsLoggedIn(true)) {
            return;
        }

        // Reserve course
        Meteor.call("tickets.reserveCourse", (err, result) => {
            if (err) {
                console.log(err);
                sAlert.error(err.error);
            } else {
                if (result) {
                    sAlert.success("Course reserved! Go play!");
                } else {
                    sAlert.info("No suitable courses in queue. Go ahead and submit some courses for others!");
                }
            }
        });
    },

    'submit .course-played'(event, instance) {
        // Prevent default browser form submit
        event.preventDefault();
     
        if (!IsLoggedIn(true)) {
            return;
        }

        // Get value from form element
        const target = event.target;
        const courseStyle = target.courseStyle.value;

        // Reserve course
        Meteor.call("tickets.coursePlayed", courseStyle, (err, result) => {
            if (err) {
                console.log(err);
                sAlert.error(err.error);
            } else {
                if (result > 0) {
                    sAlert.success("You earned a coin! Ka-ching!");
                } else if (result == 0) {
                    sAlert.info("Too bad :|");
                } else {
                    sAlert.error("Incorrect course style! You lose a coin.")
                }
            }
        });
    },    
});
