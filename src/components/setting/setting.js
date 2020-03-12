'use strict';
var { getUsers,addUser,userLogin  } = require(__dirname + '\\server\\controllers\\user_controller.js');
var tinybind = require('../node_modules/tinybind/dist/tinybind.js');

getUsers().then(data => {
    var model = {
        items: data
    }
    tinybind.binders.src = function (el, value) {
        // value = 'data:image/jpeg;base64,' + value;
        el.setAttribute('src', value);
    }
    tinybind.bind($('#userList'), model);
    $('#exampleInputEmail').val(data[0].EmailId);
    $('#exampleInputFirstName').val(data[0].FirstName);
    $('#userProfile').html(data[0].FirstName);
}).catch(err => {
    console.error(err);
});




$("#BtnAddMember").click(function () {
    addUser(
        {
            'FirstName': "admin",
            'LastName': "admin",
            'EmailId': "admin@gmail.com",
            'Photo': "",
            'CreatedBy': 1,
            'UpdatedBy': 1,
            'IsActive': "",
            'RoleId': 1
        }
    ).catch(err => {
        console.error(err);
    });

});

$("#btnAddMember").click(function(){
    userLogin({
        'EmailId':"admin@gmail.com",
        'Password':"Admin@123"   
    }).then(data=>{
        debugger;
        console.log(data)
    }).catch(err=>{
        console.error(err);
    });
});
