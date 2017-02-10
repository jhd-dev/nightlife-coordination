'use strict';

var mongoose = require('mongoose');

var User = new mongoose.Schema({
	twitter: {
	    id: String,
		displayName: String,
		username: String
    }
});

module.exports = mongoose.model('User', User);