import { Accounts } from 'meteor/accounts-base';
 
Accounts.ui.config({
    requestPermissions: {
      discord: ['email']
    },
    passwordSignupFields: 'USERNAME_AND_EMAIL',
});
