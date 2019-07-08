import { Template } from 'meteor/templating';
import { Tickets } from '../api/tickets.js';

import './body.html';

Template.queue.helpers({
    tickets() {
        return Tickets.find({}, {sort: { coins: -1 }});
        //return [{levelCode:"1234"}, {levelCode:"4325"}]
    },
});

Template.submittedCourses.helpers({
    submittedCourses() {
        return Tickets.find({}, {sort: { createdAt: -1 }});
    },
});

Template.body.events({
    'submit .new-submit'(event) {
        // Prevent default browser form submit
        event.preventDefault();
     
        // Get value from form element
        const target = event.target;
        const levelCode = target.levelCode.value;

        target.levelCode.value = "";
     
        // Insert a task into the collection
        Tickets.insert({
          levelCode: levelCode,
          createdAt: new Date(), // current time
          coins: 0
        });
     
        // Clear form
        target.text.value = '';
      },
});

Template.submittedCourse.events({
    'click button'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Insert a task into the collection
        Tickets.update(this._id, {
            $set: { coins: this.coins + 1 },
        });
      },
});
