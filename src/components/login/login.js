'use strict';
var { getUsers, addUser, userLogin } = require(__dirname + '\\server\\controllers\\user_controller.js');
var tinybind = require('../node_modules/tinybind/dist/tinybind.js');

$("#sidebar").css("display", "none");
$("#headerbar").css("display", "none");

// User Login
$("#userlogin").click(function () {
    var EmailId = $("#usr").val();
    var Password = $("#pwd").val();
    userLogin({
        'EmailId': EmailId,
        'Password': Password
    }).then(data => {
        if (data) {
            localStorage.setItem("UserId", data.UserId);
            $("#sidebar").css("display", "block");
            $("#headerbar").css("display", "flex");
            window.location.href = "app.html";
        }
    }).catch(err => {
        console.error(err);
    });
});