import { Accounts } from 'meteor/accounts-base';
 
Accounts.ui.config({
    requestPermissions: {
      discord: ['identify', 'email']
    },
    passwordSignupFields: 'USERNAME_AND_EMAIL',
});
