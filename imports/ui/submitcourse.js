import { Template } from 'meteor/templating';
import { Tickets, TicketStates } from '../api/tickets.js';

import './submitcourse.html';

Template.submittedCourses.helpers({
    submittedCourses() {
        if (!isLoggedIn()) {
            return null;
        }
        return Tickets.find({createdBy: Meteor.userId()}, {sort: { createdAt: -1 }});
    },
});

Template.submittedCourses.events({
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
