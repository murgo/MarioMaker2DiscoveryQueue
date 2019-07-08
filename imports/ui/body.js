import { Template } from 'meteor/templating';
import { Tickets, TicketStates } from '../api/tickets.js';

import './body.html';
import './profile.js';

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
     
        var re = /...[- ]?...[- ]?.../;
        if (!levelCode.match(re)) {
            sAlert.error("Invalid level code!");
            return;
        }

        if (levelStyle == null || levelStyle == "") {
            sAlert.error("Invalid level style!");
            return;
        }

        // Insert a task into the collection
        Tickets.insert({
          levelCode: levelCode,
          createdAt: new Date(), // current time
          coins: 0,
          createdBy: Meteor.userId(),
          createdByName: Meteor.user().username,
          status: TicketStates.InQueue,
        });

        console.log("Course submitted!");
        sAlert.success('Course submitted!');
     
        // Clear form
        target.text.value = '';
      },
});

Template.submittedCourse.events({
    'click button'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        if (!isLoggedIn(true)) {
            return;
        }

        // Insert a task into the collection
        Tickets.update(this._id, {
            $set: { coins: this.coins + 1 },
        });
      },
});

Template.playCourse.helpers({
    hasReservedCourse() {
        if (!isLoggedIn()) {
            return false;
        }

        console.log(Meteor.user())

        let courseId = Meteor.user().reservedCourseId;
        return courseId != null;
    },
});
