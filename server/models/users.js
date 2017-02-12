'use strict';

var mongoose = require('mongoose');

var User = new mongoose.Schema({
	twitter: {
	    id: String,
		displayName: String,
		username: String
    },
    bars_attending: [String]
});

module.exports = mongoose.model('User', User);