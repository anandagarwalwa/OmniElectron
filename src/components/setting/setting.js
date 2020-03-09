'use strict';
var { getUsers } = require(__dirname + '\\server\\controllers\\user_controller.js');

getUsers().then(data => {
    $('#exampleInputEmail').val(data[0].EmailId);
    $('#exampleInputFirstName').val(data[0].FirstName);
    $('#userProfile').html(data[0].FirstName);
}).catch(err => {
    console.error(err);
});