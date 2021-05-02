/*jshint esversion: 6 */
var URL = "https://pacific-plains-42070.herokuapp.com";
// PLAYER FUNCTIONS ON SERVER
var getPlayersFromServer = function(){
    return fetch(URL+ "/players",{
        credentials: "include",
    });
};

var deletePlayerFromServer = function(playerId){
    return fetch(URL+ "/players/" + playerId,{
        method: "DELETE",
        credentials: "include",
    });
};

var updatePlayerOnServer = function(playerId, newPlayerName, newPlayerPpg, newPlayerRebounds, newPlayerAssists, 
    newPlayerSteals, newPlayerBlocks, newPlayerTurnovers, newPlayerFouls){
        var data = `player_name=${encodeURIComponent(newPlayerName)}`;
        data    += `&player_ppg=${encodeURIComponent(newPlayerPpg)}`;
        data    += `&player_rebounds=${encodeURIComponent(newPlayerRebounds)}`;
        data    += `&player_assists=${encodeURIComponent(newPlayerAssists)}`;
        data    += `&player_steals=${encodeURIComponent(newPlayerSteals)}`;
        data    += `&player_blocks=${encodeURIComponent(newPlayerBlocks)}`;
        data    += `&player_turnovers=${encodeURIComponent(newPlayerTurnovers)}`;
        data    += `&player_fouls=${encodeURIComponent(newPlayerFouls)}`;
    return fetch(URL + "/players/" + playerId,{
        body: data,
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    });
};

var createPlayersOnServer = function(newPlayerName, newPlayerPpg, newPlayerRebounds, newPlayerAssists, newPlayerSteals,
    newPlayerBlocks, newPlayerTurnovers, newPlayerFouls) {
    var data = `player_name=${encodeURIComponent(newPlayerName)}`;
    data    += `&player_ppg=${encodeURIComponent(newPlayerPpg)}`;
    data    += `&player_rebounds=${encodeURIComponent(newPlayerRebounds)}`;
    data    += `&player_assists=${encodeURIComponent(newPlayerAssists)}`;
    data    += `&player_steals=${encodeURIComponent(newPlayerSteals)}`;
    data    += `&player_blocks=${encodeURIComponent(newPlayerBlocks)}`;
    data    += `&player_turnovers=${encodeURIComponent(newPlayerTurnovers)}`;
    data    += `&player_fouls=${encodeURIComponent(newPlayerFouls)}`;
    return fetch(URL + "/players",{
        body: data,
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    });
};

// USERS
var createUserOnServer = function(userFirstName, userLastName, userEmail, userPlainPassword){
    var data = `firstName=${encodeURIComponent(userFirstName)}`;
    data    += `&lastName=${encodeURIComponent(userLastName)}`;
    data    += `&email=${encodeURIComponent(userEmail)}`;
    data    += `&plainPassword=${encodeURIComponent(userPlainPassword)}`;
    return fetch(URL + "/users",{
        body: data,
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    });
};

var getSessionFromServer = function(){
    return fetch(URL + "/session",{
        credentials: "include",
    });
};

var deleteSessionFromServer = function(){
    return fetch(URL + "/session",{
        credentials: "include",
        method: "DELETE",
    });
};

var createSessionOnServer = function(userEmail, userPlainPassword){
    console.log(userEmail, userPlainPassword);
    var data = `email=${encodeURIComponent(userEmail)}`;
    data    += `&plainPassword=${encodeURIComponent(userPlainPassword)}`;
    return fetch(URL + "/session",{
        body: data,
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    });
};

var app = new Vue({
    el: '#app',
    data: {
        newPlayerName: "",
        newPlayerPpg: "",
        newPlayerRebounds: "",
        newPlayerAssists: "",
        newPlayerSteals: "",
        newPlayerBlocks: "",
        newPlayerTurnovers: "",
        newPlayerFouls: "",
        playerId: "",

        userFirstName: "",
        userLastName: "",
        userEmail: "",
        userPlainPassword: "",

        players: [],
        chosenPlayer: "",
        game_date: "",
        currentEditObject: "",
        currentEditId: "",
        stat: "",
        counter: 0,
        loginStatus: "Please log in",
        newUserStatus: "Please enter your information below",

        displayLogIn: true,
        displayCreateNewUser: false,
        displayMain: false,
        showInGame: false,
        showMyTeam: false,
        showAddToPlayerPage: false,
        showAddPlayerPage: false,
        showEditPlayerPage: false,
        showGameHistory: false,
        errors: [],
    },

    methods: {
        // LOG IN BUTTONS
        createNewUserButton: function(){
            this.displayLogIn = false;
            this.displayCreateNewUser = true;
            this.userFirstName = "";
            this.userLastName = "";
            this.userEmail = "";
            this.userPlainPassword = "";
            this.loginStatus = "Please log in";
        },
        logInButton: function(){
            createSessionOnServer(this.userEmail, this.userPlainPassword).then((response)=>{
                if (response.status == 201){
                    this.displayMain = true;
                    this.displayLogIn = false;
                    this.userFirstName = "";
                    this.userLastName = "";
                    this.userEmail = "";
                    this.userPlainPassword = "";
                    this.showPlayers();
                    this.loginStatus = "Please log in";
                }else{
                    response.status = 403;
                    this.loginStatus = "Wrong email or password. Try again.";
                }
            });
            
        },
        // HOME PAGE BUTTONS
        startGameButton: function(){
            this.displayMain = false;
            this.showInGame = true;
        },
        myTeamButton: function(){
            this.displayMain = false;
            this.showMyTeam = true;
        },
        gameHistoryButton: function(){
            this.showGameHistory = true;
            this.displayMain = false;
        },

        // BACK BUTTONS
        backToLogInButton: function(){
            this.displayLogIn = true;
            this.displayCreateNewUser = false;
            this.displayCreateNewUser = false;
            this.userFirstName = "";
            this.userLastName = "";
            this.userEmail = "";
            this.userPlainPassword = "";
            this.newUserStatus = "Please enter your information below";
        },
        logOutButton: function(){
            deleteSessionFromServer().then((response)=>{
                if (response.status == 200){
                    this.displayMain = false;
                    this.displayLogIn = true;
                    this.displayCreateNewUser = false;
                }
            });
        },
        backToHomeButton: function(){
            this.displayMain = true;
            this.showMyTeam = false;
            this.showInGame = false;
            this.showAddToPlayerPage = false;
            this.showAddPlayerPage = false;
            this.showGameHistory = false;
        },
        backToInGameButton: function(){
            this.displayMain = false;
            this.showMyTeam = false;
            this.showInGame = true;
            this.showAddToPlayerPage = false;
            this.showAddPlayerPage = false;
        },
        backToMyTeamButton: function(){
            this.displayMain = false;
            this.showMyTeam = true;
            this.showInGame = false;
            this.showAddToPlayerPage = false;
            this.showAddPlayerPage = false;
            this.showEditPlayerPage = false;
            this.showGameHistory = false;
        },
        // PLAYER BUTTON FUNCTIONS
        SubmitPlayer: function(){
            updatePlayerFromServer(this.playerId).then((response)=>{
                if(response.status == 200){
                    this.showPlayers();
                }
            });
        },
        addPlayerButton: function(){
            this.showAddPlayerPage = true;
            this.showMyTeam = false;
        },

        // STAT BUTTON FUNCTIONS
        addScoreButton: function(){
            this.showInGame = false;
            this.showAddToPlayerPage = true;
        },
        addScoreToButton: function(newPlayerPpg){
            newPlayerPpg = this.newPlayerPpg;
            newPlayerRebounds = 0;
            newPlayerAssists = 0;
            newPlayerSteals = 0;
            newPlayerBlocks = 0;
            newPlayerTurnovers = 0;
            newPlayerFouls = 0;
            updatePlayerOnServer(this.playerId, this.newPlayerName, newPlayerPpg, newPlayerRebounds, newPlayerAssists, 
                newPlayerSteals, newPlayerBlocks, newPlayerTurnovers, newPlayerFouls).then((response)=>{
                if(response.status == 202){
                    this.showInGame = true;
                    this.showPlayers();
                    this.showAddToPlayerPage = false;
                }
            });
        },
        addRebButton: function(){
            this.showInGame = false;
            this.showAddToPlayerPage = true;
        },
        addAsstButton: function(){
            this.showInGame = false;
            this.showAddToPlayerPage = true;
        },
        addStlButton: function(){
            this.showInGame = false;
            this.showAddToPlayerPage = true;
        },
        addBlkButton: function(){
            this.showInGame = false;
            this.showAddToPlayerPage = true;
        },
        addTOButton: function(){
            this.showInGame = false;
            this.showAddToPlayerPage = true;
        },
        addFoulButton: function(){
            this.showInGame = false;
            this.showAddToPlayerPage = true;
        },

        // DATABASE PLAYER BUTTON FUNCTIONS
        validateAddUser: function(){
            this.errors = [];
            console.log("running errors");
            if (this.userFirstName == ""){
                this.errors.push("Please enter your first name");
            } if (this.userLastName == ""){
                this.errors.push("Please enter your last name");
            } if (this.userEmail == ""){
                this.errors.push("Please enter your email address");
            } if (this.userPlainPassword == ""){
                this.errors.push("Please enter a password");
            } if (this.errors.length > 0){
                return false;
            } else{
                return true;
            }
        },
        newUserSubmitButton: function(){
            if(this.validateAddUser()){
                console.log("pursuing to create user on server");
                createUserOnServer(this.userFirstName, this.userLastName, this.userEmail, this.userPlainPassword).then((response)=>{
                    console.log(response.status);
                    if(response.status == 201){
                        this.userFirstName = "";
                        this.userLastName = "";
                        this.userEmail = "";
                        this.userPlainPassword = "";
                        this.displayCreateNewUser = false;
                        this.displayLogIn = true;
                        this.newUserStatus = "Please enter your information below";
                    }else if (response.status == 422 || response.status == 500){
                        console.log("else statement working");
                        this.newUserStatus = "This email has already been registered. Try again";
                    }
                });
            }else{
                console.log("validate add user failed");
            }
        },
        validateAddPlayer: function(){
            this.errors = [];
            if (this.newPlayerName == ""){
                this.errors.push("Please enter a player name.");
            }
            if (this.errors.length > 0){
                return false;
            } else{
                return true;
            }
        },
        submitAddPlayer: function(){
            if(this.validateAddPlayer()){
                createPlayersOnServer(this.newPlayerName, this.newPlayerPpg, this.newPlayerRebounds, this.newPlayerAssists, this.newPlayerSteals,
                    this.newPlayerBlocks, this.newPlayerTurnovers, this.newPlayerFouls ).then((response)=>{
                    if(response.status == 201){
                        this.showPlayers();
                        this.newPlayerName = "";
                        this.newPlayerPpg = "";
                        this.newPlayerRebounds = "";
                        this.newPlayerAssists = "";
                        this.newPlayerSteals = "";
                        this.newPlayerBlocks = "";
                        this.newPlayerTurnovers = "";
                        this.newPlayerFouls = "";
                    }else if (response.status == 422){
                        //server validation error
                    }
                });
                this.showAddPlayerPage = false;
                this.showMyTeam = true;
            }
        },
        showPlayers: function(){
            getPlayersFromServer().then((response)=>{
                response.json().then((players)=>{
                    console.log("PLAYERS:", players);
                    this.players = players;
                });
            });
        },
        deletePlayer: function(){
            deletePlayerFromServer(this.playerId).then((response)=>{
                if(response.status == 200){
                    this.newPlayerName = "";
                }
                this.showPlayers();
            });
        },
        editPlayer: function () {
            this.showMyTeam = false;
            this.showEditPlayerPage = true;
            // 2. fill edit form (set variables to values in player)
        },
        editSaveButtonClicked: function(playerId, currentEditObject){
            if(this.validateAddPlayer()){
                this.showMyTeam = true;
                this.showEditPlayerPage = false;
                newPlayerPpg = 0;
                newPlayerRebounds = 0;
                newPlayerAssists = 0;
                newPlayerSteals = 0;
                newPlayerBlocks = 0;
                newPlayerTurnovers = 0;
                newPlayerFouls = 0;
                updatePlayerOnServer(playerId, currentEditObject, newPlayerPpg, newPlayerRebounds, newPlayerAssists, 
                    newPlayerSteals, newPlayerBlocks, newPlayerTurnovers, newPlayerFouls ).then((response)=>{
                    if(response.status == 202){
                        this.currentEditObject = "";
                        this.showPlayers();
                    }
                });
            }
        },
    },

    created: function(){
        console.log("vue loaded");
        getSessionFromServer().then((response)=>{
            if (response.status != 401){
                this.displayLogIn = false;
                this.displayMain = true;
                this.showPlayers();
            }
        });
    }
});


// fetch to post /users
// build out a form requiring email, pass, etc.