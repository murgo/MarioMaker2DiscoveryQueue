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
    'submit .new-submit'(event, instance) {
        // Prevent default browser form submit
        event.preventDefault();
     
        if (!IsLoggedIn(true)) {
            return;
        }
        console.log("Submitting course...");

        // Get value from form element
        const target = event.target;
        const courseId = target.courseId.value;

        const courseStyle = target.courseStyle.value;

        // clear ui
        target.reset();
     
        // Insert a task into the collection
        Meteor.call('tickets.insert', courseId, courseStyle, ErrorHandler('Course submitted!'));
        instance.state.set('showSubmitCourse', false);

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

Template.submittedCourse.helpers({
    canSpendCoin() {
        return (this.status == TicketStates.InQueue && Meteor.user().coins > 0);
    },
    getStatusText() {
        if (this.status == TicketStates.InQueue) {
            return "In queue";
        } else if (this.status == TicketStates.Reserved) {
            return "Reserved for playing";
        } else if (this.status == TicketStates.Returned) {
            return "Played";
        }
    },
    getResultText() {
        var result = "N/A";

        if (this.result == "course-missing") {
            result = "Course missing!"
        } else if (this.result == "skipped") {
            result = "Course skipped";
        } else if (this.result == this.courseStyle) {
            result = "OK";
        } else if (this.result) {
            result = "Player didn't pick correct style";
        }

        return result;
    }
});

Template.submittedCourse.events({
    'click .addCoin'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        if (!IsLoggedIn(true)) {
            return;
        }

        Meteor.call('tickets.addCoin', this._id, ErrorHandler());
      },

    'click .removeTicket'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        if (!IsLoggedIn(true)) {
            return;
        }

        Meteor.call('tickets.archiveTicket', this._id, ErrorHandler());
      },
});
