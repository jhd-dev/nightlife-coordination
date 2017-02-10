'use strict';

var Yelp = require("yelp");
var path = process.cwd();

module.exports = function(app, passport){
    
    function isLoggedIn(req, res, next){
		if (req.isAuthenticated()){
			return next();
		} else {
			res.redirect('/login');
		}
	}
    
    var yelp = new Yelp({
        consumer_key: process.env.YELP_CONSUMER_KEY,
        consumer_secret: process.env.YELP_CONSUMER_SECRET,
        token: process.env.YELP_TOKEN,
        token_secret: process.env.YELP_TOKEN_SECRET,
    });
    
    app.route('/')
        .get(function(req, res){
            res.sendFile(path + '/client/index.html');
        });
    
    app.route('/api/search')
        .get(function(req, res){
            var location = req.query.location;
            yelp.search({
                category_filter: 'bars',
                location: location,
                limit: 15
            })
                .then(function(data){
                    res.json(data);
                })
                .catch(console.error);
        });
    
    app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));
    
	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
    
};