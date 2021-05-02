/*jshint esversion: 6 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
mongoose.connect('mongodb+srv://cgardner:Cadorian27!@cluster0-jnaty.mongodb.net/playerdatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

var Player = mongoose.model('Player', {
    player_name: {
        type: String,
        require: [true, "You must have a player name"]
    },
    player_ppg: {
        type: Number,
        default: 0
    },
    player_rebounds: {
        type: Number,
        default: 0
    },
    player_assists: {
        type: Number,
        default: 0
    },
    player_steals: {
        type: Number,
        default: 0
    },
    player_blocks: {
        type: Number,
        default: 0
    },
    player_turnovers: {
        type: Number,
        default: 0
    },
    player_fouls: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
});

var userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    encryptedPassword: {
        type: String,
        required: true
    },
});

// Post encrypted password to database
userSchema.methods.setEncryptedPassword = function(plainPassword, callbackFunction){
    bcrypt.hash(plainPassword, 12).then(hash => {
        this.encryptedPassword = hash;
        callbackFunction();
    });
};

// Verify password on a retrieve from a user
userSchema.methods.verifyPassword = function(plainPassword, callbackFunction){
    bcrypt.compare(plainPassword, this.encryptedPassword).then(result => {
        callbackFunction(result);
    });
};

var User = mongoose.model('User', userSchema);

module.exports = {
    Player: Player,
    User: User
};