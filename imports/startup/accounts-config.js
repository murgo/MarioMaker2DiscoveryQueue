import { Accounts } from 'meteor/accounts-base';
 
Accounts.ui.config({
    requestPermissions: {
      discord: ['identify']
    },
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL',
});
