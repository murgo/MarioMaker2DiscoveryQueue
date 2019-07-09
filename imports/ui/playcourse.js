import { Template } from 'meteor/templating';

import './playcourse.html';

Template.playCourse.helpers({
    hasReservedCourse() {
        if (!isLoggedIn()) {
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
