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

        let courseId = userData.reservedCourseId;
        return courseId != null;
    },
});

Template.playCourse.events({
    'click .play-button'(event, instance) {
        // Prevent default browser form submit
        event.preventDefault();
     
        if (!IsLoggedIn(true)) {
            return;
        }
    },
});
