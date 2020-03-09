'use strict';
var { getUsers,addUser } = require(__dirname + '\\server\\controllers\\user_controller.js');

getUsers().then(data => {
    $('#exampleInputEmail').val(data[0].EmailId);
    $('#exampleInputFirstName').val(data[0].FirstName);
    $('#userProfile').html(data[0].FirstName);
}).catch(err => {
    console.error(err);
});


$("#btnAddMember").click(function () {
    addUser(
        {
            'FirstName':"admin",
            'LastName':"admin",
            'EmailId':"admin@gmail.com",
            'Photo':"",
            'CreatedBy':1,
            'UpdatedBy':1,
            'IsActive':"",
            'RoleId':1
             }
    ).catch(err=>{
        console.error(err);
    });

});