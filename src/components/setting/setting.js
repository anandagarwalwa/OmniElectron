'use strict';
var { getUsers, addUser, getUsersById, updateUserById, deleteUser, getUsersByEmailId } = require(__dirname + '\\server\\controllers\\user_controller.js');
var { addWorkspace, getWorkspaceUsersById, updateWorkspaceById } = require(__dirname + '\\server\\controllers\\workspace_controller.js');
var { getRoles } = require(__dirname + '\\server\\controllers\\roles_controller.js');
var { getTeamUserMappingByID, addBulkTeamUserMapping, deleteTeamsUserMapping } = require(__dirname + '\\server\\controllers\\teamusermapping_controller.js');
var { addTeams, getTeamsList, getTeamsByID, updateTeamsById, deleteTeamsbyId } = require(__dirname + '\\server\\controllers\\teams_controller.js');
var { getDatasource } = require(__dirname + '\\server\\controllers\\datasource_controller.js');
var { addDatasourceDBConfig, updateDatasourceDBConfigUserById, getDatasourceDBConfig, getDatabaseDBConfigUsersById, deleteDatabaseDBConfigUser } = require(__dirname + '\\server\\controllers\\datasourcedbconfig_controller.js');
var { addLogsDetails } = require(__dirname + '\\server\\controllers\\logsdetails_controller.js');
var defaultImgUrl = "assets/images/40306.jpg";


document.getElementById("loader").style.display = "none";

function BindUser() {
    getUsers().then(data => {
        var model = {
            items: data
        }
        $('#exampleInputEmail').val(data[0].EmailId);
        $('#exampleInputFirstName').val(data[0].FirstName + " " + data[0].LastName);
        $('#userProfile').html(data[0].FirstName);
        if (model.items && model.items.length > 0) {
            $("#TeamsUserSelect").html("");
            $("#userList").html("");
            var htmlUserList = "";
            var html = ''; //'<option value=' + 0 + '>Select User</option>';
            for (var u = 0; u < model.items.length; u++) {
                var UserData = model.items[u];
                var Name = UserData.FirstName + " " + UserData.LastName;
                if (html) {
                    html += '<option value=' + UserData.UserId + '>' + Name + '</option>';
                } else {
                    html = '<option value=' + UserData.UserId + '>' + Name + '</option>';
                }
                //Start Preparing User List
                htmlUserList += getUserListHtml(UserData);
            }
            $("#TeamsUserSelect").html(html);
            $("#userList").html(htmlUserList);
            $('.SlectBox').SumoSelect({
                // triggerChangeCombined: true,
                // okCancelInMulti: true,
                placeholder: "Select here"
            });
        }
    }).catch(err => {
        console.error(err);
    });
}

function getUserListHtml(objUserData) {

    var html = '<li>'
    html += '    <div class="col-md-12 pt-2">'
    html += '        <div class="row">'
    html += '            <div class="col-md-2 col-lg-2 col-xl-1 col-sm-2">'
    html += '                <div class="tab-profile tab-pic">'
    html += '                    <img src="' + objUserData.Photo + '" class="img-fluid rounded-circle" onerror="this.onerror=null;this.src=\'' + defaultImgUrl + '\';">'
    html += '                </div>'
    html += '            </div>'
    html += '            <div class="col-md-5 col-xl-6 col-lg-5 col-sm-5">'
    html += '                <h6 class="username">' + objUserData.FirstName + ' ' + objUserData.LastName + ' </h6>'
    html += '            </div>'
    html += '            <div class="col-md-5 col-xl-5 col-lg-5 col-sm-5">'
    html += '                <a href="javascript:void(0)" category-id=' + objUserData.UserId
    html += '                    class="btn-add-member-action btn-primary" id="addmember"'
    html += '                    data-toggle="modal" data-target="#userModal"'
    html += '                    onclick="editUser(this)">Edit</a>'
    html += '                <a href="javascript:void(0)" category-id=' + objUserData.UserId
    html += '                    class="btn-add-member-action btn-primary"'
    html += '                    onclick="deleteUserClick(this)">Delete</a>'
    html += '            </div>'
    html += '        </div>'
    html += '    </div>'
    html += '</li>';
    return html;
}
BindUser();
//Roles Binding
getRoles().then(data => {
    $('#ddlRoles').empty();
    $('#ddlRoles').append($('<option>').attr('value', "").html("Select"));
    $.each(data, function(key, val) {
        var option = $('<option>').attr('value', val.RoleId).html(val.RoleName);
        $('#ddlRoles').append(option);
    });
}).catch(err => {
    console.error(err);
});
//End Roles Binding



var imagebase64 = "";

function encodeImageFileAsURL(element) {
    var fileSize = element.files[0].size / 1000;
    $('#fileError').html("");
    if (fileSize > 300) {
        $('#fileError').html("Image size maximum 300kb");
        $('#uploadPhoto').val("");
    } else {
        var file = element.files[0];
        var reader = new FileReader();
        reader.onloadend = function() {
            imagebase64 = reader.result;
            $("#addUserImage").attr('src', imagebase64);
            // $("#addUserImage").html("<img src="+imagebase64+" class='img-fluid rounded-circle'>");  
        }
        reader.readAsDataURL(file);
    }
}


var isActive = "";
$('#isActive').on('change', function() {
    isActive = this.checked ? 1 : 0;
}).change();

/* from validation */

jQuery.validator.addMethod("lettersonly", function(value, element) {
    return this.optional(element) || /^[a-z\s]+$/i.test(value);
});
jQuery.validator.addMethod("emailValidation", function(value, element) {
    return this.optional(element) || /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
});
jQuery.validator.addMethod("domainValidation", function(value, element) {
    return this.optional(element) || /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(value);
});

jQuery.validator.addMethod("checkUserExist", function(value, element) {
    debugger
    var result = false
    if (slackUserList && slackUserList.length > 0) {
        var user = slackUserList.filter(s => s.name.toLowerCase() == value.toLowerCase());
        if (user && user.length > 0) {
            result = true;
        }
    } else {
        initAuth();
    }
    return result;
}, "Slack name not exist in workspace");


$("#addMemberForm").validate({
    ignore: [],
    rules: {
        //uploadPhoto: 'required',
        firstName: { lettersonly: true, required: true },
        lastName: { lettersonly: true, required: true },
        emailId: { emailValidation: true, required: true }, //, isEmailIdExist: true
        domain: { domainValidation: true, required: true },
        // ddlTeams: 'required',
        ddlRoles: 'required',
        slackId: { checkUserExist: true, required: true },
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
        emailId: {
            emailValidation: "Please enter a valid email address.",
            required: 'This field is required',
            //isEmailIdExist: 'This emailid already exist. Please try another one'
        },
        domain: { domainValidation: "Please enter a valid domain.", required: 'This field is required' },
        // ddlTeams: 'This field is required',
        ddlRoles: 'This field is required',
        slackId: { checkUser: "Please enter a valid slack name.", required: 'This field is required' },
    },
});

$("#addnewmember").click(function() {
    resetUserModel();
});

$("#btnAddMember").click(function() {
    var addMemberdetails = $('form[id="addMemberForm"]').valid();
    if (addMemberdetails == true) {
        // getUsersByEmailId($("#emailId").val()).then(data => {
        //     if (data == undefined || data.length <= 0) {
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
                    'UserId': $("#hdnUserId").val(),
                    'SlackId': $("#slackId").val()
                        // $("#teamId").val()
                }).then(data => {
                    // addTeamUserMapping({
                    //     'TeamId': $("#ddlTeams").val(),
                    //     'UserId':data[0],
                    //     'CreatedBy': 1
                    // });
                    addLogsDetails({
                        'LogsMessage': "Update Member details",
                        'CreatedBy': parseInt(localStorage.getItem("UserId")),
                        'CreatedDate': new Date()
                    }).then(data => {
                        //console.log(data);
                    }).catch(err => {
                        console.error(err);
                    });
                    $("#userModal").modal('hide');
                    BindUser();
                    getUserDetails();
                    $.toast({
                        text: "Member details updated Successfully.", // Text that is to be shown in the toast
                        heading: 'Success Message', // Optional heading to be shown on the toast
                        icon: 'success', // Type of toast icon
                        showHideTransition: 'fade', // fade, slide or plain
                        allowToastClose: true, // Boolean value true or false
                        hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                        stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                        position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                        textAlign: 'left', // Text alignment i.e. left, right or center
                        loader: false, // Whether to show loader or not. True by default
                        loaderBg: '#9EC600', // Background color of the toast loader
                        beforeShow: function() {}, // will be triggered before the toast is shown
                        afterShown: function() {}, // will be triggered after the toat has been shown
                        beforeHide: function() {}, // will be triggered before the toast gets hidden
                        afterHidden: function() {} // will be triggered after the toast has been hidden
                    });
                    resetUserModel();
                })
                .catch(err => {
                    console.error(err);
                });
        } else {
            addUser({
                    'FirstName': $("#firstName").val(),
                    'LastName': $("#lastName").val(),
                    'EmailId': $("#emailId").val(),
                    'Photo': imagebase64,
                    'Domain': $("#domain").val(),
                    'CreatedBy': 1,
                    'RoleId': $("#ddlRoles").val(),
                    'IsActive': isActive,
                    'SlackId': $("#slackId").val()
                        // $("#teamId").val()

                }).then(data => {
                    // addTeamUserMapping({
                    //     'TeamId': $("#ddlTeams").val(),
                    //     'UserId':data[0],
                    //     'CreatedBy': 1
                    // });
                    addLogsDetails({
                        'LogsMessage': "Add Member details",
                        'CreatedBy': parseInt(localStorage.getItem("UserId")),
                        'CreatedDate': new Date()
                    }).then(data => {
                        //console.log(data);
                    }).catch(err => {
                        console.error(err);
                    });
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
                        textAlign: 'left', // Text alignment i.e. left, right or center
                        loader: false, // Whether to show loader or not. True by default
                        loaderBg: '#9EC600', // Background color of the toast loader
                        beforeShow: function() {}, // will be triggered before the toast is shown
                        afterShown: function() {}, // will be triggered after the toat has been shown
                        beforeHide: function() {}, // will be triggered before the toast gets hidden
                        afterHidden: function() {} // will be triggered after the toast has been hidden
                    });
                    resetUserModel();
                })
                .catch(err => {
                    console.error(err);
                    resetUserModel();
                });
        }
        //}

        //});




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
            textAlign: 'left', // Text alignment i.e. left, right or center
            loader: false, // Whether to show loader or not. True by default
            loaderBg: '#9EC600', // Background color of the toast loader
            beforeShow: function() {}, // will be triggered before the toast is shown
            afterShown: function() {}, // will be triggered after the toat has been shown
            beforeHide: function() {}, // will be triggered before the toast gets hidden
            afterHidden: function() {} // will be triggered after the toast has been hidden
        });
    }
});

function deleteUserClick(obj) {
    $.confirm({
        title: 'Delete Confirmation?',
        content: 'Are you sure you want to delete ' + $(obj.parentElement.parentElement).find(".username").html() + ' user?',
        type: 'green',
        buttons: {
            ok: {
                text: "Yes",
                btnClass: 'btn-primary',
                keys: ['enter'],
                action: function() {
                    deleteUser(obj.getAttribute("category-id")).then(data => {
                        BindUser();
                        addLogsDetails({
                            'LogsMessage': "Member Deleted",
                            'CreatedBy': parseInt(localStorage.getItem("UserId")),
                            'CreatedDate': new Date()
                        }).then(data => {
                            //console.log(data);
                        }).catch(err => {
                            console.error(err);
                        });
                        $.toast({
                            text: "Member deleted Successfully.", // Text that is to be shown in the toast
                            heading: 'Success Message', // Optional heading to be shown on the toast
                            icon: 'success', // Type of toast icon
                            showHideTransition: 'fade', // fade, slide or plain
                            allowToastClose: true, // Boolean value true or false
                            hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                            stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                            position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                            textAlign: 'left', // Text alignment i.e. left, right or center
                            loader: false, // Whether to show loader or not. True by default
                            loaderBg: '#9EC600', // Background color of the toast loader
                            beforeShow: function() {}, // will be triggered before the toast is shown
                            afterShown: function() {}, // will be triggered after the toat has been shown
                            beforeHide: function() {}, // will be triggered before the toast gets hidden
                            afterHidden: function() {} // will be triggered after the toast has been hidden
                        });
                    });
                    console.log('the user clicked confirm');
                }
            },
            cancel: function() {

            }
        }
    });
}

function editUser(obj) {
    getUsersById(parseInt(obj.getAttribute("category-id"))).then(data => {
        if (data == undefined) {
            return false;
        }
        $("#addUserImage").attr('src', data[0].Photo);
        $("#addUserImage").attr('onerror', "this.onerror=null;this.src='" + defaultImgUrl + "';");
        $("#firstName").val(data[0].FirstName);
        $("#lastName").val(data[0].LastName);
        $("#emailId").val(data[0].EmailId);
        $("#domain").val(data[0].Domain);
        $("#ddlRoles").val(data[0].RoleId);
        $("#hdnUserId").val(data[0].UserId);
        $("#slackId").val(data[0].SlackId);
        imagebase64 = data[0].Photo.toString();
        if (data[0].IsActive.readUIntLE() == 1)
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
    $("#hdnUserId").val("");
    isActive = "";
}

// Get User Login Data
function getUserDetails() {
    getUsersById(parseInt(localStorage.getItem("UserId"))).then(data => {
        if (data == undefined) {
            return false;
        }
        if (data[0].RoleId == 2) {
            $("#addnewmember").hide();
            $("#addteams").hide()
        }
        if (data.length > 0) {
            $("#exampleInputEmail").val(data[0].EmailId);
            $("#exampleInputFirstName").val(data[0].FirstName + " " + data[0].LastName);
            $("#userImage").attr('src', data[0].Photo);
        }
    }).catch(err => {
        console.error(err);
    });
}
getUserDetails();
// Get Worekspace By logged User
getWorkspaceUsersById(parseInt(localStorage.getItem("UserId"))).then(data => {
    if (data.length > 0) {
        $("#workspacename").val(data[0].Name);
        $("#workspacedomain").val(data[0].Domain);

    }
}).catch(err => {
    console.error(err);
});

// Update User
$("#updatebtn").click(function() {
    document.getElementById("mainsettingpage").style.display = "none";
    document.getElementById("loader").style.display = "block";
    var splitValue = $("#exampleInputFirstName").val();
    var memberName = splitValue.split(" ");
    updateUserById(parseInt(localStorage.getItem("UserId")), {
        'EmailId': $("#exampleInputEmail").val(),
        'FirstName': memberName[0],
        'LastName': memberName[1] == undefined ? '' : memberName[1]
    }).then(data => {
        setTimeout(showPage, 500);
        document.getElementById("mainsettingpage").style.display = "block";

        if (data == 1) {
            BindUser();
            getUserDetails();
            addLogsDetails({
                'LogsMessage': "Update Member details",
                'CreatedBy': parseInt(localStorage.getItem("UserId")),
                'CreatedDate': new Date()
            }).then(data => {
                //console.log(data);
            }).catch(err => {
                console.error(err);
            });
            $.toast({
                text: "Member details update Successfully.", // Text that is to be shown in the toast
                heading: 'Success Message', // Optional heading to be shown on the toast
                icon: 'success', // Type of toast icon
                showHideTransition: 'fade', // fade, slide or plain
                allowToastClose: true, // Boolean value true or false
                hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                textAlign: 'left', // Text alignment i.e. left, right or center
                loader: false, // Whether to show loader or not. True by default
                loaderBg: '#9EC600', // Background color of the toast loader
                beforeShow: function() {}, // will be triggered before the toast is shown
                afterShown: function() {}, // will be triggered after the toat has been shown
                beforeHide: function() {}, // will be triggered before the toast gets hidden
                afterHidden: function() {} // will be triggered after the toast has been hidden
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
                textAlign: 'left', // Text alignment i.e. left, right or center
                loader: false, // Whether to show loader or not. True by default
                loaderBg: '#9EC600', // Background color of the toast loader
                beforeShow: function() {}, // will be triggered before the toast is shown
                afterShown: function() {}, // will be triggered after the toat has been shown
                beforeHide: function() {}, // will be triggered before the toast gets hidden
                afterHidden: function() {} // will be triggered after the toast has been hidden
            });
        }
    }).catch(err => {
        console.error(err);
    });
});

// Add/Update Workspace

$("#btnworkspace").click(function() {
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
            textAlign: 'left', // Text alignment i.e. left, right or center
            loader: false, // Whether to show loader or not. True by default
            loaderBg: '#9EC600', // Background color of the toast loader
            beforeShow: function() {}, // will be triggered before the toast is shown
            afterShown: function() {}, // will be triggered after the toat has been shown
            beforeHide: function() {}, // will be triggered before the toast gets hidden
            afterHidden: function() {} // will be triggered after the toast has been hidden
        });
        return;
    }
    document.getElementById("mainsettingpage").style.display = "none";
    document.getElementById("loader").style.display = "block";

    // Get Worekspace By logged User
    getWorkspaceUsersById(parseInt(localStorage.getItem("UserId"))).then(data => {
        setTimeout(showPage, 500);
        document.getElementById("mainsettingpage").style.display = "block";
        if (data.length > 0) {
            // Update Workspace by id
            updateWorkspaceById(data[0].Id, {
                'Name': $("#workspacename").val(),
                'Domain': $("#workspacedomain").val()
            }).then(data => {
                setTimeout(showPage, 500);
                document.getElementById("mainsettingpage").style.display = "block";
                addLogsDetails({
                    'LogsMessage': "Update Workspace details",
                    'CreatedBy': parseInt(localStorage.getItem("UserId")),
                    'CreatedDate': new Date()
                }).then(data => {
                    //console.log(data);
                }).catch(err => {
                    console.error(err);
                });
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
                        textAlign: 'left', // Text alignment i.e. left, right or center
                        loader: false, // Whether to show loader or not. True by default
                        loaderBg: '#9EC600', // Background color of the toast loader
                        beforeShow: function() {}, // will be triggered before the toast is shown
                        afterShown: function() {}, // will be triggered after the toat has been shown
                        beforeHide: function() {}, // will be triggered before the toast gets hidden
                        afterHidden: function() {} // will be triggered after the toast has been hidden
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
                        textAlign: 'left', // Text alignment i.e. left, right or center
                        loader: false, // Whether to show loader or not. True by default
                        loaderBg: '#9EC600', // Background color of the toast loader
                        beforeShow: function() {}, // will be triggered before the toast is shown
                        afterShown: function() {}, // will be triggered after the toat has been shown
                        beforeHide: function() {}, // will be triggered before the toast gets hidden
                        afterHidden: function() {} // will be triggered after the toast has been hidden
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
                    addLogsDetails({
                        'LogsMessage': "Add Workspace details",
                        'CreatedBy': parseInt(localStorage.getItem("UserId")),
                        'CreatedDate': new Date()
                    }).then(data => {
                        //console.log(data);
                    }).catch(err => {
                        console.error(err);
                    });
                    $.toast({
                        text: "Workspace add Successfully.", // Text that is to be shown in the toast
                        heading: 'Success Message', // Optional heading to be shown on the toast
                        icon: 'success', // Type of toast icon
                        showHideTransition: 'fade', // fade, slide or plain
                        allowToastClose: true, // Boolean value true or false
                        hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                        stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                        position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                        textAlign: 'left', // Text alignment i.e. left, right or center
                        loader: false, // Whether to show loader or not. True by default
                        loaderBg: '#9EC600', // Background color of the toast loader
                        beforeShow: function() {}, // will be triggered before the toast is shown
                        afterShown: function() {}, // will be triggered after the toat has been shown
                        beforeHide: function() {}, // will be triggered before the toast gets hidden
                        afterHidden: function() {} // will be triggered after the toast has been hidden
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
                        textAlign: 'left', // Text alignment i.e. left, right or center
                        loader: false, // Whether to show loader or not. True by default
                        loaderBg: '#9EC600', // Background color of the toast loader
                        beforeShow: function() {}, // will be triggered before the toast is shown
                        afterShown: function() {}, // will be triggered after the toat has been shown
                        beforeHide: function() {}, // will be triggered before the toast gets hidden
                        afterHidden: function() {} // will be triggered after the toast has been hidden
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

//validation in teams form

$("#addTeamsForm").validate({
    ignore: [],
    rules: {
        //uploadPhoto: 'required',
        Teamname: { required: true },
    },
    messages: {
        //uploadPhoto: 'this field is required',
        Teamname: {
            required: "This field is required"
        },
    },
});

// Team Section
$("#IdAddteams").click(function() {

    var addTeamsdetails = $('form[id="addTeamsForm"]').valid();
    if (addTeamsdetails == true) {
        // document.getElementById("mainsettingpage").style.display = "none";
        // document.getElementById("loader").style.display = "block";
        var Temansobj = {
            TeamId: $("#TeamID").val(),
            TeamName: $("#Teamname").val(),
            Description: $("#TeamDescription").val(),
            IsActive: $("#TeamsIsActive").prop("checked")
        }
        if (Temansobj.TeamId > 0) {
            updateTeamsById(Temansobj).then(data => {
                var SelectedUserList = [];
                var SelectedTeamUser = $("#TeamsUserSelect").val();
                if (SelectedTeamUser && SelectedTeamUser.length > 0) {
                    for (var tu = 0; tu < SelectedTeamUser.length; tu++) {
                        SelectedUserList.push({
                            TeamId: $("#TeamID").val(),
                            UserId: SelectedTeamUser[tu],
                            CreatedBy: 1,
                            CreatedDate: new Date(),
                        });
                    }
                    deleteTeamsUserMapping($("#TeamID").val()).then(TeamUserMappingResponseData => {
                        addBulkTeamUserMapping(SelectedUserList).then(TeamUserMappingResponseData => {

                            if (TeamUserMappingResponseData && TeamUserMappingResponseData.length) {
                                Showtoast_Message(true);
                                RebindTeamList();
                                $('#TeamsModals').modal('hide');
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
                        $('#TeamsModals').modal('hide');
                    } else {
                        Showtoast_Message(false);
                    }
                    RebindTeamList();
                }
                addLogsDetails({
                    'LogsMessage': "Update Teams details",
                    'CreatedBy': parseInt(localStorage.getItem("UserId")),
                    'CreatedDate': new Date()
                }).then(data => {
                    //console.log(data);
                }).catch(err => {
                    console.error(err);
                });
            }).catch(err => {
                console.error(err);
                Showtoast_Message(false);
            });
        } else {
            Temansobj.CreatedBy = 1;
            Temansobj.CreatedDate = new Date();
            addTeams(Temansobj).then(data => {
                var SelectedUserList = [];

                var SelectedTeamUser = $("#TeamsUserSelect").val(); // $("#TeamsUserSelect option:selected").val();
                if (SelectedTeamUser && SelectedTeamUser.length > 0) {
                    for (var tu = 0; tu < SelectedTeamUser.length; tu++) {
                        SelectedUserList.push({
                            TeamId: data[0],
                            UserId: SelectedTeamUser[tu],
                            CreatedBy: 1,
                            CreatedDate: new Date(),
                        });
                    }
                    addBulkTeamUserMapping(SelectedUserList).then(TeamUserMappingResponseData => {

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
                    $('#TeamsModals').modal('hide');
                } else {
                    if (data && data.length > 0) {
                        Showtoast_Message(true);

                    } else {
                        Showtoast_Message(false);
                    }
                    RebindTeamList();
                    $('#TeamsModals').modal('hide');
                }
                addLogsDetails({
                    'LogsMessage': "Add Teams details",
                    'CreatedBy': parseInt(localStorage.getItem("UserId")),
                    'CreatedDate': new Date()
                }).then(data => {
                    //console.log(data);
                }).catch(err => {
                    console.error(err);
                });
            }).catch(err => {
                console.error(err);
                Showtoast_Message(false);
            });
        }
    }


});


function AddTeams(Teamsobj) {
    $("#TeamID").val(0);
    $("#Teamname").val("");
    $('#TeamsIsActive').prop('checked', false);
    $("#TeamDescription").val("");
    $('.SlectBox option:selected').each(function() {
        $('.SlectBox')[0].sumo.unSelectItem($(this).index());
    });
}

function EditTeams(Teamsobj) {
    $('#TeamsModals').modal('show');
    var id = $(Teamsobj).attr("data-teamid");
    getTeamsByID(id).then(ResponseTeams => {
        getTeamUserMappingByID(id).then(ResponseTeamsUserMapping => {
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
        $('.SlectBox option:selected').each(function() {
            $('.SlectBox')[0].sumo.unSelectItem($(this).index());
        });
        for (var tu = 0; tu < TeamUserMapping.length; tu++) {
            $(".SlectBox")[0].sumo.selectItem("" + TeamUserMapping[tu].UserId + "");
        }
        $('.SlectBox')[0].sumo.reload();
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
    getTeamsList().then(ResponseTeamList => {
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
            html += '<li>' +
                '<div class="col-md-12 pt-2">' +
                ' <div class="row">' +
                ' <div class="col-md-3 col-xl-4 col-lg-3 col-sm-3">' +
                ' <h6>' + Items.TeamName + '</h6>' +
                ' </div>' +
                '  <div class="col-md-3 col-xl-4 col-lg-4 col-sm-3">' +
                ' <h6>' + Items.IsActiveStatus + '</h6>' +
                ' </div>' +
                ' <div class="col-md-6 col-xl-4 col-lg-5 col-sm-6">' +
                ' <a  data-teamid=' + Items.TeamId + ' rv-data-category-TeamId=' + Items.TeamId +
                ' class="btn-add-member-action btn-primary" id="EditTeams"' +
                ' onclick="EditTeams(this)" style=color:white;cursor: pointer;>Edit</a>' +
                ' <a href="javascript:void(0)" data-teamid=' + Items.TeamId + ' rv-data-category-TeamId=' + Items.TeamId +
                ' class="btn-add-member-action btn-primary"' +
                ' onclick="deleteTeamsClick(this)">Delete</a>' +
                ' </div>' +
                ' </div>' +
                ' </div>' +
                ' </li>'
        }
        $("#TeamList").html(html);
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
                action: function() {
                    deleteTeamsUserMapping(id).then(teamsResponse => {
                        deleteTeamsbyId(id).then(data => {
                            if (data && teamsResponse && data > 0 && teamsResponse > 0) {
                                Showtoast_Message(true, "Member deleted Successfully.");
                                RebindTeamList();
                                deletedTeamslogs();
                            } else if (data && !teamsResponse && data > 0 && teamsResponse <= 0) {
                                Showtoast_Message(true, "Member deleted Successfully.");
                                RebindTeamList();
                                deletedTeamslogs();
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
            cancel: function() {

            }
        }
    });
}

function deletedTeamslogs() {
    addLogsDetails({
        'LogsMessage': "Teams Deleted",
        'CreatedBy': parseInt(localStorage.getItem("UserId")),
        'CreatedDate': new Date()
    }).then(data => {
        //console.log(data);
    }).catch(err => {
        console.error(err);
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
            textAlign: 'left', // Text alignment i.e. left, right or center
            loader: false, // Whether to show loader or not. True by default
            loaderBg: '#9EC600', // Background color of the toast loader
            beforeShow: function() {}, // will be triggered before the toast is shown
            afterShown: function() {}, // will be triggered after the toat has been shown
            beforeHide: function() {}, // will be triggered before the toast gets hidden
            afterHidden: function() {} // will be triggered after the toast has been hidden
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
            textAlign: 'left', // Text alignment i.e. left, right or center
            loader: false, // Whether to show loader or not. True by default
            loaderBg: '#9EC600', // Background color of the toast loader
            beforeShow: function() {}, // will be triggered before the toast is shown
            afterShown: function() {}, // will be triggered after the toat has been shown
            beforeHide: function() {}, // will be triggered before the toast gets hidden
            afterHidden: function() {} // will be triggered after the toast has been hidden
        });
    }
}

// search from member list
$("#seaechmember").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#userList li").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

// search from team list
$("#searchteam").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#TeamList li").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

//search from database list
$("#searchDatabase").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#databaseList li").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

//------- Database Block Start --------------
RebindDatabaseList();

function RebindDatabaseList() {

    getDatasourceDBConfig().then(ResponseDatabaseList => {
        var html = "";
        $("#databaseList").html("");
        for (var d = 0; d < ResponseDatabaseList.length; d++) {
            var Items = ResponseDatabaseList[d];
            var value = ResponseDatabaseList[d].IsActive.readUIntLE();
            if (value == 1) {
                ResponseDatabaseList[d].IsActiveStatus = 'Active';
            } else {
                ResponseDatabaseList[d].IsActiveStatus = 'In Active';
            }
            html += '<li>' +
                '<div class="col-md-12 pt-2">' +
                ' <div class="row">' +
                ' <div class="col-md-3 col-xl-4 col-lg-3 col-sm-3">' +
                ' <h6>' + Items.ConfigName + '</h6>' +
                ' </div>' +
                '  <div class="col-md-3 col-xl-4 col-lg-4 col-sm-3">' +
                ' <h6>' + Items.IsActiveStatus + '</h6>' +
                ' </div>' +
                ' <div class="col-md-6 col-xl-4 col-lg-5 col-sm-6">' +
                ' <a  data-databaseUserid=' + Items.Id + ' rv-data-category-TeamId=' + Items.Id +
                ' class="btn-add-member-action btn-primary" id="EditDatabase"' +
                ' onclick="EditDatebase(this)" style=color:white;cursor: pointer;>Edit</a>' +
                ' <a href="javascript:void(0)" data-databaseUserid=' + Items.Id + ' rv-data-category-TeamId=' + Items.Id +
                ' class="btn-add-member-action btn-primary"' +
                ' onclick="deleteDatabadeClick(this)">Delete</a>' +
                ' </div>' +
                ' </div>' +
                ' </div>' +
                ' </li>'
        }
        $("#databaseList").html(html);
    }).catch(error => {

    });
}

function deleteDatabadeClick(databaseobj) {

    var id = $(databaseobj).attr("data-databaseUserid");;
    $.confirm({
        title: 'Delete Confirmation?',
        content: 'Are you sure you want to delete this Database?',
        type: 'green',
        buttons: {
            ok: {
                text: "Yes",
                btnClass: 'btn-primary',
                keys: ['enter'],
                action: function() {
                    deleteDatabaseDBConfigUser(id).then(data => {
                        RebindDatabaseList();
                        addLogsDetails({
                            'LogsMessage': "Database Deleted",
                            'CreatedBy': parseInt(localStorage.getItem("UserId")),
                            'CreatedDate': new Date()
                        }).then(data => {
                            //console.log(data);
                        }).catch(err => {
                            console.error(err);
                        });
                        $.toast({
                            text: "Database deleted Successfully.", // Text that is to be shown in the toast
                            heading: 'Success Message', // Optional heading to be shown on the toast
                            icon: 'success', // Type of toast icon
                            showHideTransition: 'fade', // fade, slide or plain
                            allowToastClose: true, // Boolean value true or false
                            hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                            stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                            position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                            textAlign: 'left', // Text alignment i.e. left, right or center
                            loader: false, // Whether to show loader or not. True by default
                            loaderBg: '#9EC600', // Background color of the toast loader
                            beforeShow: function() {}, // will be triggered before the toast is shown
                            afterShown: function() {}, // will be triggered after the toat has been shown
                            beforeHide: function() {}, // will be triggered before the toast gets hidden
                            afterHidden: function() {} // will be triggered after the toast has been hidden
                        });
                    });
                }
            },
            cancel: function() {

            }
        }
    });

}




function EditDatebase(databaseobj) {
    validator.resetForm();
    $('#DatabaseModals').modal('show');
    var id = $(databaseobj).attr("data-databaseUserid");
    getDatabaseDBConfigUsersById(id).then(data => {
        //console.log(data);
        $("#txtConfigName").val(data[0].ConfigName);
        $("#DatabaseID").val(data[0].Id);
        $("#ddlDatasourceType").val(data[0].DataSourceId);
        $("#txtHost").val(data[0].Host);
        $("#txtPort").val(data[0].Port);
        $("#txtUser").val(data[0].UserName);
        $("#txtPassword").val(data[0].Password);
        //$("#ddlDatabaseList").val(data[0].DatabaseName);
        $("#txtLocation").val(data[0].Location);
        if (data[0].IsActive.readUIntLE() == 1) {
            isActive = data[0].IsActive.readUIntLE();
            $('#DatabaseIsActive').prop('checked', true);
        } else {
            isActive = 0;
            $('#DatabaseIsActive').prop('checked', false);
        }
        if (data[0].DataSourceId == 4 || data[0].DataSourceId == 3) {
            $('#txtHost').rules('add', {
                required: false
            });
            $('#txtPort').rules('add', {
                required: false
            });
            $('#txtUser').rules('add', {
                required: false
            });
            $('#ddlDatabaseList').rules('add', {
                required: false
            });
            $('#txtLocation').rules('add', {
                required: true
            });
            $("#fileBlock").show();
            $("#dbBlock").hide();
        } else {
            $('#txtLocation').rules('add', {
                required: false
            });
            $('#txtHost').rules('add', {
                required: true
            });
            $('#txtPort').rules('add', {
                required: true
            });
            $('#txtUser').rules('add', {
                required: true
            });
            $('#ddlDatabaseList').rules('add', {
                required: true
            });
            $("#fileBlock").hide();
            $("#dbBlock").show();
        }
    }).catch(error => {
        console.log(error);
    });
}


BindDataSources();

function BindDataSources() {
    getDatasource().then(data => {
        var html = '<option value="0"> Select </option>';
        if (data) {
            $.each(data, function(key, val) {
                html += '<option value=' + val.Id + '>' + val.Name + '</option>';
            });
            $('#ddlDatasourceType').html(html);
        }
    });
}
$("#ddlDatasourceType").change(function() {
    validator.resetForm();
    var selectedVal = $("#ddlDatasourceType option:selected").text();
    if ($("#ddlDatasourceType").val() == "0") {
        $("#dbBlock").hide();
        $("#fileBlock").hide();
    } else if (selectedVal.toLowerCase().indexOf("sql") != -1) {
        validator.resetForm();
        $("#fileBlock").hide();
        $("#dbBlock").show();
        $('#txtLocation').rules('add', {
            required: false
        });
        $('#txtHost').rules('add', {
            required: true
        });
        $('#txtPort').rules('add', {
            required: true
        });
        $('#txtUser').rules('add', {
            required: true
        });
        $('ddlDatabaseList').rules('add', {
            required: true
        });
        //$("#txtLocation").val("");
    } else {
        validator.resetForm();
        $("#dbBlock").hide();
        $("#fileBlock").show();
        $('#txtHost').rules('add', {
            required: false
        });
        $('#txtPort').rules('add', {
            required: false
        });
        $('#txtUser').rules('add', {
            required: false
        });
        $('#ddlDatabaseList').rules('add', {
            required: false
        });
        $('#txtLocation').rules('add', {
            required: true
        });
        // $("#txtHost").val("");
        // $("#txtPort").val("");
        // $("#txtUser").val("");
        // $("#txtPassword").val("");
        // $("#ddlDatabaseList").val(0);
    }
});
$("#btnTestDBConnection").click(function() {
    //Check if Selected option is MySQL
    //Check if Selected option is MSSQL
    //Check if Selected option is PostgreSQL

    var dbType = $("#ddlDatasourceType option:selected").text();
    if (dbType == "MySql") {
        const options = {
            client: 'mysql',
            connection: {
                host: $("#txtHost").val(),
                port: $("#txtPort").val(),
                user: $("#txtUser").val(),
                password: $("#txtPassword").val()
            }
        }
        const knex = require('knex')(options);
        knex.raw('SHOW DATABASES').then(data => {

            if (data && data.length > 0) {
                var dbData = data[0];
                var html = '<option value="">select</option>';
                for (var u = 0; u < dbData.length; u++) {
                    html += '<option value="' + dbData[u].Database + '">' + dbData[u].Database + '</option>';
                }
                $("#ddlDatabaseList").html(html);
            }
        }).catch(err => {
            console.error(err);
        });
    } else if (dbType == "MSSql") {
        const options = {
            client: 'mssql',
            connection: {
                user: $("#txtUser").val(),
                password: $("#txtPassword").val(),
                server: $("#txtHost").val(),
                options: {
                    port: 1433
                }
            }
        }
        const knex = require('knex')(options);
        knex.raw('SELECT name as [Database] FROM master.dbo.sysdatabases').then(data => {
            if (data && data.length > 0) {
                var html = '<option value="">select</option>';
                for (var u = 0; u < data.length; u++) {
                    html += '<option value="' + data[u].Database + '">' + data[u].Database + '</option>';
                }
                $("#ddlDatabaseList").html(html);
            }
        }).catch(err => {
            console.error(err);
        });
    } else if (dbType == "PostgreSQL") {
        const options = {
            client: 'postgresql',
            connection: {
                user: $("#txtUser").val(),
                password: $("#txtPassword").val(),
                host: $("#txtHost").val()
            }
        }

        const knex = require('knex')(options);
        knex.raw('SELECT datname FROM pg_database WHERE datistemplate = false').then(data => {
            if (data && data.length > 0) {

                var html = '<option value="">select</option>';
                for (var u = 0; u < data.length; u++) {
                    html += '<option value="' + data[u].Database + '">' + data[u].Database + '</option>';
                }
                $("#ddlDatabaseList").html(html);
            }
        }).catch(err => {

            console.error(err);
        });

    }
});


var isActive = "";
$('#DatabaseIsActive').on('change', function() {
    isActive = this.checked ? 1 : 0;
}).change();

function resetDatabaseModel() {
    $("#DatabaseID").val("");
    $("#txtConfigName").val("");
    $("#ddlDatasourceType").val(0);
    $("#txtHost").val("");
    $("#txtPort").val("");
    $("#txtUser").val("");
    $("#txtPassword").val("");
    $("#ddlDatabaseList").val("");
    $("#txtLocation").val("");
    isActive = "";
}

$("#addDatabase").click(function() {
    $("#dbBlock").hide();
    $("#fileBlock").hide();
    resetDatabaseModel();
    $("DatabaseID").val("");
    validator.resetForm();
});

$.validator.addMethod("valueNotEquals", function(value, element, arg) {
    return arg !== value;
}, "Value must not equal arg.");

var validator = $("#addDatabaseForm").validate({
    ignore: [],
    rules: {
        ConfigName: { required: true },
        ddlDatasourceType: { valueNotEquals: "0" },
        Location: {
            required: true
        },
        txtHost: {
            required: true
        },
        txtPort: {
            required: true
        },
        txtUser: {
            required: true
        },
        // txtPassword: {
        //     required:true
        // },
        ddlDatabaseList: {
            required: true
        },

    },
    messages: {
        ConfigName: {
            required: "This field is required"
        },
        ddlDatasourceType: {
            valueNotEquals: "Please select a Datasource!"
        },
        Location: {
            required: "This field is required"
        },
        txtHost: {
            required: "This field is required"
        },
        txtPort: {
            required: "This field is required"
        },
        txtUser: {
            required: "This field is required"
        },
        ddlDatabaseList: {
            required: "please select a Database"
        },
    },
});

$("#btnSaveDBConfig").click(function() {

    var addDatabasedetails = $('form[id="addDatabaseForm"]').valid();

    if (addDatabasedetails == true) {
        if ($("#DatabaseID").val() != 0 || $("#DatabaseID").val() != "") {
            if ($("#ddlDatasourceType").val() == 4 || $("#ddlDatasourceType").val() == 3) {
                $("#txtHost").val("");
                $("#txtPort").val("");
                $("#txtUser").val("");
                $("#txtPassword").val("");
                $("#ddlDatabaseList").val("");
            } else {
                $("#txtLocation").val("");
            }
            updateDatasourceDBConfigUserById($("#DatabaseID").val(), {
                    'ConfigName': $("#txtConfigName").val(),
                    'DatasourceId': $("#ddlDatasourceType").val(),
                    'Host': $("#txtHost").val(),
                    'Port': $("#txtPort").val(),
                    'UserName': $("#txtUser").val(),
                    'Password': $("#txtPassword").val(),
                    'DatabaseName': $("#ddlDatabaseList").val(),
                    'Location': $("#txtLocation").val(),
                    'CreatedBy': parseInt(localStorage.getItem("UserId")),
                    'CreatedDate': new Date(),
                    'IsActive': isActive
                }).then(data => {
                    $("#DatabaseModals").modal('hide');
                    RebindDatabaseList();
                    addLogsDetails({
                        'LogsMessage': "Update Database details",
                        'CreatedBy': parseInt(localStorage.getItem("UserId")),
                        'CreatedDate': new Date()
                    }).then(data => {
                        //console.log(data);
                    }).catch(err => {
                        console.error(err);
                    });
                    $.toast({
                        text: "Database details updated Successfully.", // Text that is to be shown in the toast
                        heading: 'Success Message', // Optional heading to be shown on the toast
                        icon: 'success', // Type of toast icon
                        showHideTransition: 'fade', // fade, slide or plain
                        allowToastClose: true, // Boolean value true or false
                        hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                        stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                        position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                        textAlign: 'left', // Text alignment i.e. left, right or center
                        loader: false, // Whether to show loader or not. True by default
                        loaderBg: '#9EC600', // Background color of the toast loader
                        beforeShow: function() {}, // will be triggered before the toast is shown
                        afterShown: function() {}, // will be triggered after the toat has been shown
                        beforeHide: function() {}, // will be triggered before the toast gets hidden
                        afterHidden: function() {} // will be triggered after the toast has been hidden
                    });
                    resetDatabaseModel();
                })
                .catch(err => {
                    console.error(err);
                });
        } else {
            if ($("#ddlDatasourceType").val() == 4 || $("#ddlDatasourceType").val() == 3) {
                $("#txtHost").val("");
                $("#txtPort").val("");
                $("#txtUser").val("");
                $("#txtPassword").val("");
                $("#ddlDatabaseList").val("");
            } else {
                $("#txtLocation").val("");
            }
            addDatasourceDBConfig({
                    'ConfigName': $("#txtConfigName").val(),
                    'DatasourceId': $("#ddlDatasourceType").val(),
                    'Host': $("#txtHost").val(),
                    'Port': $("#txtPort").val(),
                    'UserName': $("#txtUser").val(),
                    'Password': $("#txtPassword").val(),
                    'DatabaseName': $("#ddlDatabaseList").val(),
                    'Location': $("#txtLocation").val(),
                    'CreatedBy': parseInt(localStorage.getItem("UserId")),
                    'CreatedDate': new Date(),
                    'IsActive': isActive
                }).then(data => {
                    $("#DatabaseModals").modal('hide');
                    RebindDatabaseList();
                    addLogsDetails({
                        'LogsMessage': "Add Database details",
                        'CreatedBy': parseInt(localStorage.getItem("UserId")),
                        'CreatedDate': new Date()
                    }).then(data => {
                        //console.log(data);
                    }).catch(err => {
                        console.error(err);
                    });
                    $.toast({
                        text: "Database details save Successfully.", // Text that is to be shown in the toast
                        heading: 'Success Message', // Optional heading to be shown on the toast
                        icon: 'success', // Type of toast icon
                        showHideTransition: 'fade', // fade, slide or plain
                        allowToastClose: true, // Boolean value true or false
                        hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                        stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                        position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                        textAlign: 'left', // Text alignment i.e. left, right or center
                        loader: false, // Whether to show loader or not. True by default
                        loaderBg: '#9EC600', // Background color of the toast loader
                        beforeShow: function() {}, // will be triggered before the toast is shown
                        afterShown: function() {}, // will be triggered after the toat has been shown
                        beforeHide: function() {}, // will be triggered before the toast gets hidden
                        afterHidden: function() {} // will be triggered after the toast has been hidden
                    });
                    resetDatabaseModel();
                })
                .catch(err => {
                    console.error(err);
                    resetDatabaseModel();
                });
        }
    } else {
        console.log("not working");
    }
});

//
//------- Database Block End --------------