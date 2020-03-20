'use strict';
var { getUsers, addUser, getUsersById, updateUserById, deleteUser, getUsersByEmailId } = require(__dirname + '\\server\\controllers\\user_controller.js');
var { addWorkspace, getWorkspaceUsersById, updateWorkspaceById } = require(__dirname + '\\server\\controllers\\workspace_controller.js');
var { getRoles } = require(__dirname + '\\server\\controllers\\roles_controller.js');
var { getTeamUserMappingByID, addBulkTeamUserMapping, deleteTeamsUserMapping } = require(__dirname + '\\server\\controllers\\teamusermapping_controller.js');
var { addTeams, getTeamsList, getTeamsByID, updateTeamsById, deleteTeamsbyId } = require(__dirname + '\\server\\controllers\\teams_controller.js');
var defaultImgUrl = "assets/images/40306.jpg";




document.getElementById("loader").style.display = "none";
function BindUser() {
    getUsers().then(data => {
        var model = {
            items: data
        }
        $('#exampleInputEmail').val(data[0].EmailId);
        $('#exampleInputFirstName').val(data[0].FirstName);
        $('#userProfile').html(data[0].FirstName);
        if (model.items && model.items.length > 0) {
            $("#TeamsUserSelect").html("");
            $("#userList").html("");
            var htmlUserList = "";
            var html = '';//'<option value=' + 0 + '>Select User</option>';
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
    $.each(data, function (key, val) {
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
// jQuery.validator.addMethod("isEmailIdExist", function (value, element) {
//    getUsersByEmailId(value).then(data => {
//         if (data == undefined || data.length <= 0) {
//             return false;
//         }
//         else {
//             return true;
//         }
//     });

//     debugger;
//     // var res = getUsersByEmailId(value);
//     // return res;
// });

$("#addMemberForm").validate({
    ignore: [],
    rules: {
        //uploadPhoto: 'required',
        firstName: { lettersonly: true, required: true },
        lastName: { lettersonly: true, required: true },
        emailId: { emailValidation: true, required: true },//, isEmailIdExist: true
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
        emailId: {
            emailValidation: "Please enter a valid email address.",
            required: 'This field is required',
            //isEmailIdExist: 'This emailid already exist. Please try another one'
        },
        domain: { domainValidation: "Please enter a valid domain.", required: 'This field is required' },
        // ddlTeams: 'This field is required',
        ddlRoles: 'This field is required'
    },
});

$("#addnewmember").click(function () {
    resetUserModel();
});

$("#btnAddMember").click(function () {
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
                    console.error(err);
                    resetUserModel();
                });
        }
        //}

        //});
        debugger;



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
        content: 'Are you sure you want to delete ' + $(obj.parentElement.parentElement).find(".username").html() + ' user?',
        type: 'green',
        buttons: {
            ok: {
                text: "Yes",
                btnClass: 'btn-primary',
                keys: ['enter'],
                action: function () {
                    deleteUser(obj.getAttribute("category-id")).then(data => {
                        BindUser();
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
    getUsersById(parseInt(obj.getAttribute("category-id"))
    ).then(data => {
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
          
            var SelectedTeamUser = $("#TeamsUserSelect").val();// $("#TeamsUserSelect option:selected").val();
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
    $("#TeamDescription").val("");
    $('.SlectBox option:selected').each(function () {        
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
        $('.SlectBox option:selected').each(function () {        
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
            html += '<li>'
                + '<div class="col-md-12 pt-2">'
                + ' <div class="row">'
                + ' <div class="col-md-3 col-xl-4 col-lg-3 col-sm-3">'
                + ' <h6>' + Items.TeamName + '</h6>'
                + ' </div>'
                + '  <div class="col-md-3 col-xl-4 col-lg-4 col-sm-3">'
                + ' <h6>' + Items.IsActiveStatus + '</h6>'
                + ' </div>'
                + ' <div class="col-md-6 col-xl-4 col-lg-5 col-sm-6">'
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
                        deleteTeamsbyId(id).then(data => {
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