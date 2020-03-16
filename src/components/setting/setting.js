'use strict';
var { getUsers, addUser, userLogin, getUsersById, updateUserById, deleteUser } = require(__dirname + '\\server\\controllers\\user_controller.js');
var { addWorkspace, getWorkspaceUsersById, updateWorkspaceById } = require(__dirname + '\\server\\controllers\\workspace_controller.js');
var { getRoles } = require(__dirname + '\\server\\controllers\\roles_controller.js');
var { addTeamUserMapping } = require(__dirname + '\\server\\controllers\\teamusermapping_controller.js');
var { addTeams, AddTeamusermapping, GetTeamsList, GetTeamsByID, GetTeamusermappingByID, UpdateTeamsbyid, UpdateTeamusermapping, deleteTeamsUserMapping, DeleteTeamsbyid } = require(__dirname + '\\server\\controllers\\teams_controller.js');


var tinybind = require('../node_modules/tinybind/dist/tinybind.js');
document.getElementById("loader").style.display = "none";
function BindUser() {
    debugger
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
        if (model.items && model.items.length > 0) {
            debugger
            $("#TeamsUserSelect").html("");
            var html = '<option value=' + 0 + '>Select User</option>';
            for (var u = 0; u < model.items.length; u++) {
                var UserData = model.items[u];
                var Name = UserData.FirstName + " " + UserData.LastName;
                if (html) {
                    html += '<option value=' + UserData.UserId + '>' + Name + '</option>';
                } else {
                    html = '<option value=' + UserData.UserId + '>' + Name + '</option>';
                }
            }
            $("#TeamsUserSelect").html(html);
        }
    }).catch(err => {
        console.error(err);
    });
}
BindUser();
//Roles Binding
getRoles().then(data => {
    $('#ddlRoles').empty();
    $('#ddlRoles').append($('<option>').attr('value', "").html("Select"));
    $.each(data, function (key, val) {
        debugger;
        var option = $('<option>').attr('value', val.RoleId).html(val.RoleName);
        $('#ddlRoles').append(option);
    });
}).catch(err => {
    console.error(err);
});
//End Roles Binding



var imagebase64 = "";

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        imagebase64 = reader.result;
        $("#addUserImage").attr('src', imagebase64);
        // $("#addUserImage").html("<img src="+imagebase64+" class='img-fluid rounded-circle'>");  
    }
    reader.readAsDataURL(file);
}


var isActive = "";
$('#isActive').on('change', function () {
    isActive = this.checked ? 1 : 0;
}).change();

/* from validation */

jQuery.validator.addMethod("lettersonly", function (value, element) {
    return this.optional(element) || /^[a-z\s]+$/i.test(value);
});
jQuery.validator.addMethod("emailValidation", function (value, element) {
    return this.optional(element) || /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
});
jQuery.validator.addMethod("domainValidation", function (value, element) {
    return this.optional(element) || /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(value);
});

$("#addMemberForm").validate({
    ignore: [],
    rules: {
        //uploadPhoto: 'required',
        firstName: { lettersonly: true, required: true },
        lastName: { lettersonly: true, required: true },
        emailId: { emailValidation: true, required: true },
        domain: { domainValidation: true, required: true },
        // ddlTeams: 'required',
        ddlRoles: 'required'
    },
    messages: {
        //uploadPhoto: 'this field is required',
        firstName: {
            lettersonly: "Please enter characters only.",
            required: "This field is required"
        },
        lastName: {
            lettersonly: "Please enter characters only.",
            required: "This field is required"
        },
        emailId: { emailValidation: "Please enter a valid email address.", required: 'This field is required' },
        domain: { domainValidation: "Please enter a valid domain.", required: 'This field is required' },
        // ddlTeams: 'This field is required',
        ddlRoles: 'This field is required'
    },
});

$("#btnAddMember").click(function () {
    var addMemberdetails = $('form[id="addMemberForm"]').valid();
    if (addMemberdetails == true) {
        if ($("#hdnUserId").val() != 0 || $("#hdnUserId").val() != "") {
            updateUserById($("#hdnUserId").val(), {
                'FirstName': $("#firstName").val(),
                'LastName': $("#lastName").val(),
                'EmailId': $("#emailId").val(),
                'Photo': imagebase64,
                'Domain': $("#domain").val(),
                'CreatedBy': 1,
                'RoleId': $("#ddlRoles").val(),
                'IsActive': isActive,
                'UserId': $("#hdnUserId").val()
                // $("#teamId").val()
            }).then(data => {
                // addTeamUserMapping({
                //     'TeamId': $("#ddlTeams").val(),
                //     'UserId':data[0],
                //     'CreatedBy': 1
                // });
                $("#userModal").modal('hide');
                BindUser();
                $.toast({
                    text: "Member details updated Successfully.", // Text that is to be shown in the toast
                    heading: 'Success Message', // Optional heading to be shown on the toast
                    icon: 'success', // Type of toast icon
                    showHideTransition: 'fade', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#9EC600',  // Background color of the toast loader
                    beforeShow: function () { }, // will be triggered before the toast is shown
                    afterShown: function () { }, // will be triggered after the toat has been shown
                    beforeHide: function () { }, // will be triggered before the toast gets hidden
                    afterHidden: function () { }  // will be triggered after the toast has been hidden
                });
                resetUserModel();
            })
                .catch(err => {
                    console.error(err);
                });
        }
        else {
            addUser(
                {
                    'FirstName': $("#firstName").val(),
                    'LastName': $("#lastName").val(),
                    'EmailId': $("#emailId").val(),
                    'Photo': imagebase64,
                    'Domain': $("#domain").val(),
                    'CreatedBy': 1,
                    'RoleId': $("#ddlRoles").val(),
                    'IsActive': isActive
                    // $("#teamId").val()

                }
            ).then(data => {
                // addTeamUserMapping({
                //     'TeamId': $("#ddlTeams").val(),
                //     'UserId':data[0],
                //     'CreatedBy': 1
                // });
                $("#userModal").modal('hide');
                BindUser();
                $.toast({
                    text: "Member details save Successfully.", // Text that is to be shown in the toast
                    heading: 'Success Message', // Optional heading to be shown on the toast
                    icon: 'success', // Type of toast icon
                    showHideTransition: 'fade', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#9EC600',  // Background color of the toast loader
                    beforeShow: function () { }, // will be triggered before the toast is shown
                    afterShown: function () { }, // will be triggered after the toat has been shown
                    beforeHide: function () { }, // will be triggered before the toast gets hidden
                    afterHidden: function () { }  // will be triggered after the toast has been hidden
                });
                resetUserModel();
            })
                .catch(err => {
                    debugger;
                    console.error(err);
                    resetUserModel();
                });
        }


    }
    else {
        $.toast({
            text: "Please Fillup all Details!", // Text that is to be shown in the toast
            heading: 'Error Message', // Optional heading to be shown on the toast
            icon: 'error', // Type of toast icon
            showHideTransition: 'fade', // fade, slide or plain
            allowToastClose: true, // Boolean value true or false
            hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
            stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
            position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
            textAlign: 'left',  // Text alignment i.e. left, right or center
            loader: false,  // Whether to show loader or not. True by default
            loaderBg: '#9EC600',  // Background color of the toast loader
            beforeShow: function () { }, // will be triggered before the toast is shown
            afterShown: function () { }, // will be triggered after the toat has been shown
            beforeHide: function () { }, // will be triggered before the toast gets hidden
            afterHidden: function () { }  // will be triggered after the toast has been hidden
        });
    }
});

function deleteUserClick(obj) {
    $.confirm({
        title: 'Delete Confirmation?',
        content: 'Are you sure you want to delete this user?',
        type: 'green',
        buttons: {
            ok: {
                text: "Yes",
                btnClass: 'btn-primary',
                keys: ['enter'],
                action: function () {
                    deleteUser(obj.dataset.categoryId).then(data => {
                        $.toast({
                            text: "Member deleted Successfully.", // Text that is to be shown in the toast
                            heading: 'Success Message', // Optional heading to be shown on the toast
                            icon: 'success', // Type of toast icon
                            showHideTransition: 'fade', // fade, slide or plain
                            allowToastClose: true, // Boolean value true or false
                            hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                            stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                            position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                            textAlign: 'left',  // Text alignment i.e. left, right or center
                            loader: false,  // Whether to show loader or not. True by default
                            loaderBg: '#9EC600',  // Background color of the toast loader
                            beforeShow: function () { }, // will be triggered before the toast is shown
                            afterShown: function () { }, // will be triggered after the toat has been shown
                            beforeHide: function () { }, // will be triggered before the toast gets hidden
                            afterHidden: function () { }  // will be triggered after the toast has been hidden
                        });
                    });
                    console.log('the user clicked confirm');
                }
            },
            cancel: function () {

            }
        }
    });
}

function editUser(obj) {
    //obj.dataset.categoryId
    getUsersById(parseInt(obj.dataset.categoryId)
    ).then(data => {
        if (data == undefined) {
            return false;
        }
        if (data[0].RoleId == 2) { $("#addmember").hide(); $("#addteams").hide() }
        $("#addUserImage").attr('src', data[0].Photo);
        $("#firstName").val(data[0].FirstName);
        $("#lastName").val(data[0].LastName);
        $("#emailId").val(data[0].EmailId);
        $("#domain").val(data[0].Domain);
        $("#ddlRoles").val(data[0].RoleId);
        $("#hdnUserId").val(data[0].UserId);
        imagebase64 = data[0].Photo.toString();
        if (IsActive.readUIntLE() == 1)
            $('#isActive').prop('checked', true);
        else
            $('#isActive').prop('checked', false);
        //$("#ddlTeams").val(data[0].RoleId);
        $("#userModal").modal('show');

    }).catch(err => {
        console.error(err);
    });
}

function resetUserModel() {
    imagebase64 = "";
    //control.val('')
    $("#uploadPhoto").replaceWith($("#uploadPhoto").val('').clone(true));
    $("#addUserImage").attr('src', 'assets/images/40306.jpg');
    $("#firstName").val('');
    $("#lastName").val('');
    $("#emailId").val('');
    $("#domain").val('');
    $("#ddlRoles").val('');
    $("#ddlTeams").val('');
    isActive = "";
}

// Get User Login Data

getUsersById(parseInt(localStorage.getItem("UserId"))
).then(data => {
    if (data == undefined) {
        return false;
    }
    if (data[0].RoleId == 2) { $("#addmember").hide(); $("#addteams").hide() }
    if (data.length > 0) {
        $("#exampleInputEmail").val(data[0].EmailId);
        $("#exampleInputFirstName").val(data[0].FirstName);
    }
}).catch(err => {
    console.error(err);
});

// Get Worekspace By logged User
getWorkspaceUsersById(parseInt(localStorage.getItem("UserId"))
).then(data => {
    if (data.length > 0) {
        $("#workspacename").val(data[0].Name);
        $("#workspacedomain").val(data[0].Domain);
    }
}).catch(err => {
    console.error(err);
});

// Update User
$("#updatebtn").click(function () {
    document.getElementById("mainsettingpage").style.display = "none";
    document.getElementById("loader").style.display = "block";
    updateUserById(parseInt(localStorage.getItem("UserId")),
        {
            'EmailId': $("#exampleInputEmail").val(),
            'FirstName': $("#exampleInputFirstName").val()
        }).then(data => {
            setTimeout(showPage, 500);
            document.getElementById("mainsettingpage").style.display = "block";

            if (data == 1) {
                $.toast({
                    text: "Member details update Successfully.", // Text that is to be shown in the toast
                    heading: 'Success Message', // Optional heading to be shown on the toast
                    icon: 'success', // Type of toast icon
                    showHideTransition: 'fade', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#9EC600',  // Background color of the toast loader
                    beforeShow: function () { }, // will be triggered before the toast is shown
                    afterShown: function () { }, // will be triggered after the toat has been shown
                    beforeHide: function () { }, // will be triggered before the toast gets hidden
                    afterHidden: function () { }  // will be triggered after the toast has been hidden
                });
                $("#usernameid").text($("#exampleInputFirstName").val())
            } else {
                $.toast({
                    text: "Please Fillup all Details!", // Text that is to be shown in the toast
                    heading: 'Error Message', // Optional heading to be shown on the toast
                    icon: 'error', // Type of toast icon
                    showHideTransition: 'fade', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#9EC600',  // Background color of the toast loader
                    beforeShow: function () { }, // will be triggered before the toast is shown
                    afterShown: function () { }, // will be triggered after the toat has been shown
                    beforeHide: function () { }, // will be triggered before the toast gets hidden
                    afterHidden: function () { }  // will be triggered after the toast has been hidden
                });
            }
        }).catch(err => {
            console.error(err);
        });
});

// Add/Update Workspace

$("#btnworkspace").click(function () {
    debugger;
    var workSpaceObj = {
        Name: $("#workspacename").val(),
        Domain: $("#workspacedomain").val(),
        CreatedBy: parseInt(localStorage.getItem("UserId")),
        CreatedDate: new Date()
    }

    if ($("#workspacename").val() == '' || $("#workspacedomain").val() == '') {
        $.toast({
            text: "Please Fillup all Details!", // Text that is to be shown in the toast
            heading: 'Error Message', // Optional heading to be shown on the toast
            icon: 'error', // Type of toast icon
            showHideTransition: 'fade', // fade, slide or plain
            allowToastClose: true, // Boolean value true or false
            hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
            stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
            position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
            textAlign: 'left',  // Text alignment i.e. left, right or center
            loader: false,  // Whether to show loader or not. True by default
            loaderBg: '#9EC600',  // Background color of the toast loader
            beforeShow: function () { }, // will be triggered before the toast is shown
            afterShown: function () { }, // will be triggered after the toat has been shown
            beforeHide: function () { }, // will be triggered before the toast gets hidden
            afterHidden: function () { }  // will be triggered after the toast has been hidden
        });
        return;
    }
    document.getElementById("mainsettingpage").style.display = "none";
    document.getElementById("loader").style.display = "block";

    // Get Worekspace By logged User
    getWorkspaceUsersById(parseInt(localStorage.getItem("UserId"))
    ).then(data => {
        setTimeout(showPage, 500);
        document.getElementById("mainsettingpage").style.display = "block";
        if (data.length > 0) {
            // Update Workspace by id
            updateWorkspaceById(data[0].Id,
                {
                    'Name': $("#workspacename").val(),
                    'Domain': $("#workspacedomain").val()
                }).then(data => {
                    setTimeout(showPage, 500);
                    document.getElementById("mainsettingpage").style.display = "block";

                    if (data == 1) {
                        $.toast({
                            text: "Workspace update Successfully.", // Text that is to be shown in the toast
                            heading: 'Success Message', // Optional heading to be shown on the toast
                            icon: 'success', // Type of toast icon
                            showHideTransition: 'fade', // fade, slide or plain
                            allowToastClose: true, // Boolean value true or false
                            hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                            stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                            position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                            textAlign: 'left',  // Text alignment i.e. left, right or center
                            loader: false,  // Whether to show loader or not. True by default
                            loaderBg: '#9EC600',  // Background color of the toast loader
                            beforeShow: function () { }, // will be triggered before the toast is shown
                            afterShown: function () { }, // will be triggered after the toat has been shown
                            beforeHide: function () { }, // will be triggered before the toast gets hidden
                            afterHidden: function () { }  // will be triggered after the toast has been hidden
                        });
                        $("#workspacename").val(workSpaceObj.Name);
                        $("#workspacedomain").val(workSpaceObj.Domain);
                    } else {
                        $.toast({
                            text: "Please Fillup all Details!", // Text that is to be shown in the toast
                            heading: 'Error Message', // Optional heading to be shown on the toast
                            icon: 'error', // Type of toast icon
                            showHideTransition: 'fade', // fade, slide or plain
                            allowToastClose: true, // Boolean value true or false
                            hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                            stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                            position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                            textAlign: 'left',  // Text alignment i.e. left, right or center
                            loader: false,  // Whether to show loader or not. True by default
                            loaderBg: '#9EC600',  // Background color of the toast loader
                            beforeShow: function () { }, // will be triggered before the toast is shown
                            afterShown: function () { }, // will be triggered after the toat has been shown
                            beforeHide: function () { }, // will be triggered before the toast gets hidden
                            afterHidden: function () { }  // will be triggered after the toast has been hidden
                        });
                    }
                }).catch(err => {
                    console.error(err);
                });

        } else {
            // Add New workspace
            addWorkspace(workSpaceObj).then(data => {
                setTimeout(showPage, 500);
                document.getElementById("mainsettingpage").style.display = "block";
                if (data[0]) {
                    $("#workspacename").val(workSpaceObj.Name);
                    $("#workspacedomain").val(workSpaceObj.Domain);
                    $.toast({
                        text: "Workspace add Successfully.", // Text that is to be shown in the toast
                        heading: 'Success Message', // Optional heading to be shown on the toast
                        icon: 'success', // Type of toast icon
                        showHideTransition: 'fade', // fade, slide or plain
                        allowToastClose: true, // Boolean value true or false
                        hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                        stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                        position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                        textAlign: 'left',  // Text alignment i.e. left, right or center
                        loader: false,  // Whether to show loader or not. True by default
                        loaderBg: '#9EC600',  // Background color of the toast loader
                        beforeShow: function () { }, // will be triggered before the toast is shown
                        afterShown: function () { }, // will be triggered after the toat has been shown
                        beforeHide: function () { }, // will be triggered before the toast gets hidden
                        afterHidden: function () { }  // will be triggered after the toast has been hidden
                    });
                } else {
                    $.toast({
                        text: "Please Fillup all Details!", // Text that is to be shown in the toast
                        heading: 'Error Message', // Optional heading to be shown on the toast
                        icon: 'error', // Type of toast icon
                        showHideTransition: 'fade', // fade, slide or plain
                        allowToastClose: true, // Boolean value true or false
                        hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                        stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                        position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                        textAlign: 'left',  // Text alignment i.e. left, right or center
                        loader: false,  // Whether to show loader or not. True by default
                        loaderBg: '#9EC600',  // Background color of the toast loader
                        beforeShow: function () { }, // will be triggered before the toast is shown
                        afterShown: function () { }, // will be triggered after the toat has been shown
                        beforeHide: function () { }, // will be triggered before the toast gets hidden
                        afterHidden: function () { }  // will be triggered after the toast has been hidden
                    });
                }
            }).catch(err => {
                console.error(err);
            });
        }
    }).catch(err => {
        console.error(err);
    });

});

// Loader
function showPage() {
    document.getElementById("loader").style.display = "none";
}

// Team Section
$("#IdAddteams").click(function () {

    // document.getElementById("mainsettingpage").style.display = "none";
    // document.getElementById("loader").style.display = "block";
    var Temansobj = {
        TeamId: $("#TeamID").val(),
        TeamName: $("#Teamname").val(),
        Description: $("#TeamDescription").val(),
        IsActive: $("#TeamsIsActive").prop("checked")
    }
    if (Temansobj.TeamId > 0) {
        UpdateTeamsbyid(Temansobj).then(data => {

            var SelectedUserList = [];
            var SelectedTeamUser = $("#TeamsUserSelect option:selected").val();
            if (SelectedTeamUser != 0) {
                SelectedUserList.push({
                    TeamId: $("#TeamID").val(),
                    UserId: SelectedTeamUser,
                    CreatedBy: 1,
                    CreatedDate: new Date(),
                });
            }
            if (SelectedUserList && SelectedUserList.length > 0) {
                // for (var tu = 0; tu < SelectedUserList.length; tu++) {
                //     SelectedUserList[tu].TeamId = data[0];
                // }
                UpdateTeamusermapping(SelectedUserList[0].TeamId, SelectedUserList).then(TeamUserMappingResponseData => {

                    AddTeamusermapping(SelectedUserList).then(TeamUserMappingResponseData => {

                        if (TeamUserMappingResponseData && TeamUserMappingResponseData.length) {
                            Showtoast_Message(true);
                            RebindTeamList();
                        } else {
                            Showtoast_Message(false);
                        }
                    }).catch(err => {
                        console.error(err);
                        Showtoast_Message(false);
                    });
                }).catch(err => {
                    console.error(err);
                    Showtoast_Message(false);
                });
                RebindTeamList();
            } else {
                if (data && data > 0) {
                    Showtoast_Message(true);

                } else {
                    Showtoast_Message(false);
                }
                RebindTeamList();
            }
        }).catch(err => {
            console.error(err);
            Showtoast_Message(false);
        });
    } else {
        Temansobj.CreatedBy = 1;
        Temansobj.CreatedDate = new Date();
        addTeams(Temansobj).then(data => {
            var SelectedUserList = [];
            var SelectedTeamUser = $("#TeamsUserSelect option:selected").val();
            if (SelectedTeamUser != 0) {
                SelectedUserList.push({
                    TeamId: 0,
                    UserId: SelectedTeamUser,
                    CreatedBy: 1,
                    CreatedDate: new Date(),
                });
            }
            if (SelectedUserList && SelectedUserList.length > 0) {
                for (var tu = 0; tu < SelectedUserList.length; tu++) {
                    SelectedUserList[tu].TeamId = data[0];
                }
                AddTeamusermapping(SelectedUserList).then(TeamUserMappingResponseData => {

                    if (TeamUserMappingResponseData && TeamUserMappingResponseData.length) {
                        Showtoast_Message(true);
                    } else {
                        Showtoast_Message(false);
                    }
                }).catch(err => {
                    console.error(err);
                    Showtoast_Message(false);
                });
                RebindTeamList();
            } else {
                if (data && data.length > 0) {
                    Showtoast_Message(true);

                } else {
                    Showtoast_Message(false);
                }
                RebindTeamList();
            }
        }).catch(err => {
            console.error(err);
            Showtoast_Message(false);
        });
    }

});


function AddTeams(Teamsobj) {
    $("#TeamID").val(0);
    $("#Teamname").val("");
    $('#TeamsIsActive').prop('checked', false);
    $("#TeamDescription").val();

}
function EditTeams(Teamsobj) {
    debugger
    $('#TeamsModals').modal('show');
    //var id = Teamsobj.dataset.categoryTeamid;
    var id = $(Teamsobj).attr("data-teamid");
    GetTeamsByID(id).then(ResponseTeams => {
        GetTeamusermappingByID(id).then(ResponseTeamsUserMapping => {

            SetTeamsValue(ResponseTeams, ResponseTeamsUserMapping);
        }).catch(error => {
            console.log(error);
        })
    }).catch(error => {
        console.log(error);
    });

}

function SetTeamsValue(TeamData, TeamUserMapping) {

    var TeamData = TeamData[0];
    if (TeamUserMapping && TeamUserMapping.length > 0) {
        for (var tu = 0; tu < TeamUserMapping.length; tu++) {
            var teamsUsermapping = TeamUserMapping[tu];
            $("#TeamsUserSelect selected").val(teamsUsermapping.UserId);
        }
    }
    $("#TeamID").val(TeamData.TeamId);
    $("#Teamname").val(TeamData.TeamName);
    if (TeamData.IsActive.readUIntLE() == 1) {
        $('#TeamsIsActive').prop('checked', true);
    } else {
        $('#TeamsIsActive').prop('checked', false);
    }
    $("#TeamDescription").val(TeamData.Description);
}
function RebindTeamList() {
    debugger
    GetTeamsList().then(ResponseTeamList => {
        var html = "";
        $("#TeamList").html("");
        for (var t = 0; t < ResponseTeamList.length; t++) {
            var Items = ResponseTeamList[t];
            var value = ResponseTeamList[t].IsActive.readUIntLE();
            if (value == 1) {
                ResponseTeamList[t].IsActiveStatus = 'Active';
            } else {
                ResponseTeamList[t].IsActiveStatus = 'In Active';
            }
            html += '<li>'
                + '<div class="col-md-12 pt-2">'
                + ' <div class="row">'
                + ' <div class="col-md-4">'
                + ' <h6>' + Items.TeamName + '</h6>'
                + ' </div>'
                + '  <div class="col-md-4">'
                + ' <h6>' + Items.IsActiveStatus + '</h6>'
                + ' </div>'
                + ' <div class="col-md-4">'
                + ' <a  data-teamid=' + Items.TeamId + ' rv-data-category-TeamId=' + Items.TeamId
                + ' class="btn-add-member-action btn-primary" id="EditTeams"'
                + ' onclick="EditTeams(this)">Edit</a>'
                + ' <a href="javascript:void(0)" data-teamid=' + Items.TeamId + ' rv-data-category-TeamId=' + Items.TeamId
                + ' class="btn-add-member-action btn-primary"'
                + ' onclick="deleteTeamsClick(this)">Delete</a>'
                + ' </div>'
                + ' </div>'
                + ' </div>'
                + ' </li>'
        }
        $("#TeamList").html(html);
        // var model = {
        //     items: ResponseTeamList
        // }
        // // tinybind.binders.src = function (el, value) {
        // //     // value = 'data:image/jpeg;base64,' + value;
        // //     
        // //     el.setAttribute('src', value);
        // // }        
        // tinybind.bind($('#TeamList'), model);

    }).catch(error => {

    });
}
RebindTeamList();

function deleteTeamsClick(obj) {
    var id = $(obj).attr("data-teamid");;
    $.confirm({
        title: 'Delete Confirmation?',
        content: 'Are you sure you want to delete this Team?',
        type: 'green',
        buttons: {
            ok: {
                text: "Yes",
                btnClass: 'btn-primary',
                keys: ['enter'],
                action: function () {
                    deleteTeamsUserMapping(id).then(teamsResponse => {
                        debugger
                        DeleteTeamsbyid(id).then(data => {
                            if (data && teamsResponse && data > 0 && teamsResponse > 0) {
                                Showtoast_Message(true, "Member deleted Successfully.");
                                RebindTeamList();
                            } else if (data && !teamsResponse && data > 0 && teamsResponse <= 0) {
                                Showtoast_Message(true, "Member deleted Successfully.");
                                RebindTeamList();
                            } else {
                                Showtoast_Message(false, "Teams is not deleted please try again!");
                            }


                        }).catch(error => {
                            Showtoast_Message(false, "Teams is not deleted please try again!");
                        });

                    });
                    //  console.log('the user clicked confirm');
                }
            },
            cancel: function () {

            }
        }
    });
}

function Showtoast_Message(IsSuccess, Textmessage = "") {
    if (IsSuccess) {
        var text = "Member details update Successfully.";
        if (Textmessage)
            text = Textmessage
        $.toast({
            text: "", // Text that is to be shown in the toast
            heading: 'Success Message', // Optional heading to be shown on the toast
            icon: 'success', // Type of toast icon
            showHideTransition: 'fade', // fade, slide or plain
            allowToastClose: true, // Boolean value true or false
            hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
            stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
            position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
            textAlign: 'left',  // Text alignment i.e. left, right or center
            loader: false,  // Whether to show loader or not. True by default
            loaderBg: '#9EC600',  // Background color of the toast loader
            beforeShow: function () { }, // will be triggered before the toast is shown
            afterShown: function () { }, // will be triggered after the toat has been shown
            beforeHide: function () { }, // will be triggered before the toast gets hidden
            afterHidden: function () { }  // will be triggered after the toast has been hidden
        });
    } else {
        var errortext = "Please Fillup all Details!";
        if (Textmessage)
            errortext = Textmessage
        $.toast({
            text: errortext, // Text that is to be shown in the toast
            heading: 'Error Message', // Optional heading to be shown on the toast
            icon: 'error', // Type of toast icon
            showHideTransition: 'fade', // fade, slide or plain
            allowToastClose: true, // Boolean value true or false
            hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
            stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
            position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
            textAlign: 'left',  // Text alignment i.e. left, right or center
            loader: false,  // Whether to show loader or not. True by default
            loaderBg: '#9EC600',  // Background color of the toast loader
            beforeShow: function () { }, // will be triggered before the toast is shown
            afterShown: function () { }, // will be triggered after the toat has been shown
            beforeHide: function () { }, // will be triggered before the toast gets hidden
            afterHidden: function () { }  // will be triggered after the toast has been hidden
        });
    }
}