import { Template } from 'meteor/templating';
import { Tickets, TicketStates } from '../api/tickets.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { IsLoggedIn } from "./profile.js";

import './submitcourse.html';

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

Template.submitCourse.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
});

Template.submitCourse.helpers({
    isSubmitting() {
        return Template.instance().state.get('showSubmitCourse');
    },
});

Template.submitCourse.events({
    'submit .new-submit'(event) {
        // Prevent default browser form submit
        event.preventDefault();
     
        if (!IsLoggedIn(true)) {
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
        Meteor.call('tickets.insert', levelCode, levelStyle, ErrorHandler('Course submitted!'));

        console.log("Course submission sent...");
    },

    'click .play-button'(event, instance) {
        // Prevent default browser form submit
        event.preventDefault();
     
        if (!IsLoggedIn(true)) {
            return;
        }

        instance.state.set('showSubmitCourse', true);
    },
});

Template.submittedCourses.helpers({
    submittedCourses() {
        if (!IsLoggedIn()) {
            return null;
        }
        return Tickets.find({createdBy: Meteor.userId()}, {sort: { createdAt: -1 }});
    },
});

Template.submittedCourse.events({
    'click button'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        if (!IsLoggedIn(true)) {
            return;
        }

        Meteor.call('tickets.addCoin', this._id, ErrorHandler());
      },
});
