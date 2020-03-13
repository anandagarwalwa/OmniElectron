'use strict';
var { getUsers, addUser, userLogin, getUsersById } = require(__dirname + '\\server\\controllers\\user_controller.js');
var tinybind = require('../node_modules/tinybind/dist/tinybind.js');

// User Logout
$("#userlogout").click(function () {
    $("#sidebar").css("display", "none");
    $("#headerbar").css("display", "none");
    localStorage.clear();
});

// Get User Login Data
getUsersById(parseInt(localStorage.getItem("UserId"))
).then(data => {
    $("#usernameid").text(data[0].FirstName)
}).catch(err => {
    console.error(err);
});
