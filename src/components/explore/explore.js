'use strict';
var { getUsers, addUser, userLogin, getUsersById } = require(__dirname + '\\server\\controllers\\user_controller.js');
var tinybind = require('../node_modules/tinybind/dist/tinybind.js');
document.getElementById("loader").style.display = "none";
// Get User Login Data
getUsersById(parseInt(localStorage.getItem("UserId"))
).then(data => {
    if(data == undefined){
        return false;
    }   
    $("#usernameid").text(data[0].FirstName)
    $("#userimage").attr('src',data[0].userimage);
}).catch(err => {
    console.error(err);
});
