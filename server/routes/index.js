'use strict';

var Yelp = require("yelp");
var User = require("../models/users.js");
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
                    var bars = data.businesses;
                    var recievedAttendance = 0;
                    bars.forEach(function(bar, i){
                        User.find({
                            bars_attending: bar.id
                        }, function(err, users){
                            if (err) throw err;
                            bar.user_attending = req.user ? users.indexOf(req.user.twitter.id) !== -1 : false;
                            bar.number_attending = users.length;
                            bar.index = i;
                            recievedAttendance ++;
                            if (recievedAttendance === bars.length){
                                res.json({
                                    bars: bars
                                });
                            }
                        });
                    });
                })
                .catch(console.error);
        });
    
    app.route('/toggle-going')
        .get(function(req, res){
            if (req.user){
                var updated_bar = JSON.parse(req.query.bar);console.log(req.url, updated_bar, req.query);/////////
                User.findOne({
                    "twitter.id": req.user.twitter.id
                }, function(err, user){
                    if (err) throw err;
                    var index = user.bars_attending.indexOf(updated_bar.id);
                    if (index === -1){
                        user.bars_attending.push(updated_bar.id);
                        updated_bar.user_attending = true;
                        updated_bar.number_attending ++;
                    }else{
                        user.bars_attending.splice(index, 1);
                        updated_bar.user_attending = false;
                        updated_bar.number_attending --;
                    }
                    user.markModified('bars');
                    user.save(function(err){
                         if (err) throw err;
                         res.json({
                             updated_bar: updated_bar
                         });
                    });
                });
            }else{
                res.json({
                    redirect: './auth/twitter'
                });
            }
        });
    
    app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));
    
	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
    
};