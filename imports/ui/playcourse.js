import { Template } from 'meteor/templating';
import { IsLoggedIn } from "./profile.js";

import './playcourse.html';

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
        return reservedTicketId != null;
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
                    sAlert.success("Course reserved! Go play it!");
                } else {
                    sAlert.info("No suitable courses in queue, submit some y'all.");
                }
            }
        });
    },
});
