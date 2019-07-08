import { Mongo } from 'meteor/mongo';
 
export const Tickets = new Mongo.Collection('tickets');

export const TicketStates = {
    InQueue: 1,
    Reserved: 2,
    Returned: 3
}