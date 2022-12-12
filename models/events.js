const mongoose = require('mongoose');

const eventSchema = mongoose.Event({

});

const Event = mongoose.model('events', eventSchema);

module.exports = Event;