import './body.html';
import './profile.js';
import './queue.js';
import './playcourse.js';
import './submitcourse.js';

Meteor.users.deny({
    update() { return true; }
});

Template.body.onCreated(function bodyOnCreated() {
    Meteor.subscribe('tickets');
});
