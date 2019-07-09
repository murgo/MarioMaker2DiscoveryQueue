import { Template } from 'meteor/templating';
import { Tickets, TicketStates } from '../api/tickets.js';

import './body.html';
import './profile.js';

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

Template.submittedCourses.helpers({
    submittedCourses() {
        if (!isLoggedIn()) {
            return null;
        }
        return Tickets.find({createdBy: Meteor.userId()}, {sort: { createdAt: -1 }});
    },
});

Template.body.events({
    'submit .new-submit'(event) {
        // Prevent default browser form submit
        event.preventDefault();
     
        if (!isLoggedIn(true)) {
            return;
        }
        console.log("Submitting course...");

        // Get value from form element
        const target = event.target;
        const levelCode = target.levelCode.value;

        const levelStyle = target.levelStyle.value;

        // clear ui
        target.reset();
     
        // Insert a task into the collection
        Meteor.call('tickets.insert', levelCode, levelStyle, errorHandler('Course submitted!'));

        console.log("Course submission sent...");
      },
});

Template.submittedCourse.events({
    'click button'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        if (!isLoggedIn(true)) {
            return;
        }

        Meteor.call('tickets.addCoin', this._id, errorHandler());
      },
});

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
