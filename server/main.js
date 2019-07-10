import { Meteor } from 'meteor/meteor';

import '../imports/api/server/tickets.js';
import './service-config.js';

Meteor.startup(() => {
  // code to run on server at startup
});

Accounts.onCreateUser((options, user) => {
  user.coins = 0;
  user.reservedTicketId = "";
  user.createdAt = new Date();

  if (options.profile) {
    user.profile = options.profile;
  }
  
  return user;
});

// Publish user data
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, {fields: {coins: 1, reservedTicketId: 1}});
  }else{
    this.ready();
  }
});