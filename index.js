/*jshint esversion: 6 */
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('passport-local');

const models = require('./models');

const app = express();
const port = process.env.PORT || 5000;

// MIDDLEWARE   
app.use(bodyParser.urlencoded({ extended: false })); //urlencoded is the type of data you want it parsed as.
app.use(cors());
app.use(cors({ credentials: true, origin: 'null,https://pacific-plains-42070.herokuapp.com' }));
app.use(express.static('public'));
app.use(session({ secret: 'aoj3idungeid8xlek20i3nd8', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// PASSPORT CONFIGURATION
passport.use(new passportLocal.Strategy({
    //configurations
    usernameField: 'email',
    passwordField: 'plainPassword'
}, function(email, plainPassword, done){
    //authentication logic: success or failure
    models.User.findOne({ email: email }).then(function(user){
        if (!user){
            return done(null, false);
        }else{
            user.verifyPassword(plainPassword, function(result){
                if(result){
                    return done(null, user);
                }else{
                    return done(null, false);
                }
            });
        }
    }).catch(function (err){
        done(err);
    });
}));
// passport.use(google & facebook)

// PASSPORT SERIALIZATION & DESERIALIZATION
passport.serializeUser(function(user, done){
    // called when user is authenticated
    done(null, user._id);
});

passport.deserializeUser(function(userId, done){
    // this is called before any future request
    models.User.findOne({_id: userId}).then(function(user){
        done(null, user);
    }).catch(function(err){
        done(err);
    });
});

app.get('/session', function (req, res){
    if (req.user){
        res.json(req.user);
    }else{
        res.sendStatus(401);
    }
});

app.delete('/session', function (req, res){
    if (req.user){
        res.sendStatus(200);
        req.logout();
    }else{
        res.sendStatus(401);
    }
});

//REST USER METHOD
app.post('/session', passport.authenticate('local'), function(req, res){
    res.sendStatus(201);
});

// RETRIEVE PLAYERS
app.get('/players', function (req, res){
    console.log("user", req.user);
    if (!req.user){
        res.sendStatus(401);
        return;
    }

    let dbQuery = {user: req.user._id};
    let dbSort = {};

    // if(req.query.startsWith){
    //     dbQuery.player_name = new RegExp('^'+req.query.startsWith, 'C');
    // }
    // if(req.query.playerEquals){
    //     dbQuery.player_name = req.query.playerEquals;
    // }
    if(req.query.sortBy == "player_ppg"){
        dbSort.player_ppg = "desc";
    }
    models.Player.find(dbQuery).sort(dbSort).then(function(players){
        res.json(players);
    });
});

// RETRIEVE ONE PLAYER
app.get('/players/:playerId', function (req, res){
    if (!req.user){
        res.sendStatus(401);
        return;
    }
    let playerId = req.params.playerId;
    // query the mongoose model
    models.Player.findOne({ _id: playerId }).then(function(player){
        if (player){
            res.json(player);
        }else{
            res.sendStatus(404);
        }
    }, function (){
        res.sendStatus(400);
    });
});

// CREATE ONE PLAYER
app.post('/players', function (req, res){
    if (!req.user){
        res.sendStatus(401);
        return;
    }

    console.log("the body", req.body);

    // create an instance of the mongoose model
    let player = new models.Player({
        player_name: req.body.player_name,
        user: req.user._id
    });

    // insert into the mongoose model
    player.save().then(function(){

        res.sendStatus(201);
    }).catch(function (err){
        if (err.errors){
        var messages = {};
        for (let e in err.errors){
            messages[e] = err.errors[e].message;
        }
        res.status(422).json(messages);
        } else{
            res.sendStatus(500);
        }
    });
});

// DELETE ONE PLAYER
app.delete('/players/:playerId', function (req, res){
    if (!req.user){
        res.sendStatus(401);
        return;
    }
    let playerId = req.params.playerId;
    // query the mongoose model
    models.Player.findOneAndDelete({ _id: playerId }).then(function(player){
        if (player){
            res.json(player);
        }else{
            res.sendStatus(404);
        }
    }).catch(function (err){
        res.sendStatus(400);
        console.log("There was a problem deleting your player", err);
    });
});

// UPDATE ONE PLAYER
app.put('/players/:playerId', function (req, res){
    if (!req.user){
        res.sendStatus(401);
        return;
    }
    let playerId = req.params.playerId;
    // query the mongoose model
    models.Player.findById({ _id: playerId }).then(function(player){
        player.player_name = req.body.player_name;
        player.player_ppg += parseInt(req.body.player_ppg);
        player.player_rebounds += parseInt(req.body.player_rebounds);
        player.player_assists += parseInt(req.body.player_assists);
        player.player_steals += parseInt(req.body.player_steals);
        player.player_blocks += parseInt(req.body.player_blocks);
        player.player_turnovers += parseInt(req.body.player_turnovers);
        player.player_fouls += parseInt(req.body.player_fouls);
        //Divide each line by game history
        player.save().then(function(){
            res.sendStatus(202);
        }).catch(function (err){
            if (err.errors){
            var messages = {};
            for (let e in err.errors){
                messages[e] = err.errors[e].message;
            }
            res.status(422).json(messages);
            } else{
                res.sendStatus(500);
            }
        });
    });
});

app.post('/users', function (req, res){
    console.log("the body", req.body);
    // Store hash in your password DB.
    let user = new models.User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
    });
    console.log("moving to encrypting password");
    user.setEncryptedPassword(req.body.plainPassword, function(){
        user.save().then(function(){
            console.log("user save in action");
            res.sendStatus(201);
        }).catch(function (err){
            console.log("catch error", err);
            if (err.errors){
                console.log("user erros log");
                var messages = {};
                for (let e in err.errors){
                    messages[e] = err.errors[e].message;
                }
                res.status(422).json(messages);
            } else{
                res.sendStatus(500);
            }
            // ADDRESS UNIQUENESS IN EMAIL VALIDATION
        });
    });
});

app.listen(port, function(){
    console.log(`listening on port ${port}!`);
});

/* Passport Steps:
1. install -npm --save
2. import - require
3. use middleware
4. configure local strategy (use google or fb later)
    - refer to "strategy" on passport documentation
5. Configure sessions
    - Serialization and deserialization
    - Cookies - behind the scenes (passport does it for you)
6. Add a route for authentication
7. Authorization logic

*/

// Notes:
// github.com/djholt/file-upload-s3-demo for file upload example
// 

// This is for user side, app.js:
// // Load hash from your password DB.
// bcrypt.compare(myPlaintextPassword, hash).then(function(result) {
//     // result == true
// });
// bcrypt.compare(someOtherPlaintextPassword, hash).then(function(result) {
//     // result == false
// });