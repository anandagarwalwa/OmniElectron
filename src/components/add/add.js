'use strict';
var { getUsers } = require(__dirname + '\\server\\controllers\\user_controller.js');
var { GetTeamsList } = require(__dirname + '\\server\\controllers\\teams_controller.js');
var { getDatasource } = require(__dirname + '\\server\\controllers\\datasource_controller.js');
var { getChannels } = require(__dirname + '\\server\\controllers\\channels_controller.js');
var { getLinks, updateLinksbyid, addLinks } = require(__dirname + '\\server\\controllers\\links_controller.js');

$(document).ready(function () {
    $("#btnPublish").click(function () {
        if ($("input[type='radio'].radioBtnClass").is(':checked')) {
            var radioBtnClass_type = $("input[type='radio'].radioBtnClass:checked").val();
            if (radioBtnClass_type == "dataLink") {
                $('#addDataPointForm').addClass('d-none');
                $('#dataLinkBlock').removeClass('d-none');
            }
            else if (radioBtnClass_type == "analysis") {
                $('#addDataPointForm').addClass('d-none');
                $('#analysisBlock').removeClass('d-none');
            }
            else {
                $('#addDataPointForm').addClass('d-none');
                $('#testBlock').removeClass('d-none');
            }
        }
    });
});

document.getElementById("loader").style.display = "none";

// Get Users List
getUsers().then(data => {
    var model = {
        items: data
    }
    if (model.items && model.items.length > 0) {
        $("#DataLinkUserSelect").html("");
        var html = '<option value=' + 0 + '>Select Owner</option>';
        for (var u = 0; u < model.items.length; u++) {
            var UserData = model.items[u];
            var Name = UserData.FirstName + " " + UserData.LastName;
            if (html) {
                html += '<option value=' + UserData.UserId + '>' + Name + '</option>';
            } else {
                html = '<option value=' + UserData.UserId + '>' + Name + '</option>';
            }
        }
        $("#DataLinkUserSelect").html(html);
    }
}).catch(err => {
    console.error(err);
});

// Get Team List
GetTeamsList().then(data => {
    var model = {
        items: data
    }
    if (model.items && model.items.length > 0) {
        $("#DataLinkTeamSelect").html("");
        var html = '<option value=' + 0 + '>Select Teams</option>';
        for (var u = 0; u < model.items.length; u++) {
            var TeamData = model.items[u];
            var Name = TeamData.TeamName;
            if (html) {
                html += '<option value=' + TeamData.TeamId + '>' + Name + '</option>';
            } else {
                html = '<option value=' + TeamData.TeamId + '>' + Name + '</option>';
            }
        }
        $("#DataLinkTeamSelect").html(html);
    }
}).catch(err => {
    console.error(err);
});

// Get Datasource List
getDatasource().then(data => {
    var model = {
        items: data
    }
    if (model.items && model.items.length > 0) {
        $("#DataLinkDatasourceSelect").html("");
        var html = '<option value=' + 0 + '>Select Data Source</option>';
        for (var u = 0; u < model.items.length; u++) {
            var Datasource = model.items[u];
            var Name = Datasource.Name;
            if (html) {
                html += '<option value=' + Datasource.Id + '>' + Name + '</option>';
            } else {
                html = '<option value=' + Datasource.Id + '>' + Name + '</option>';
            }
        }
        $("#DataLinkDatasourceSelect").html(html);
    }
}).catch(err => {
    console.error(err);
});

// Get Channels List
getChannels().then(data => {
    var model = {
        items: data
    }
    if (model.items && model.items.length > 0) {
        $("#DataLinkChannelsSelect").html("");
        var html = '<option value=' + 0 + '>Select Channels</option>';
        for (var u = 0; u < model.items.length; u++) {
            var Channels = model.items[u];
            var Name = Channels.Name;
            if (html) {
                html += '<option value=' + Channels.Id + '>' + Name + '</option>';
            } else {
                html = '<option value=' + Channels.Id + '>' + Name + '</option>';
            }
        }
        $("#DataLinkChannelsSelect").html(html);
    }
}).catch(err => {
    console.error(err);
});

// Get Links To List
getLinks().then(data => {
    var model = {
        items: data
    }
    if (model.items && model.items.length > 0) {
        $("#DataLinkToSelect").html("");
        var html = '<option value=' + 0 + '>Select Links To</option>';
        for (var u = 0; u < model.items.length; u++) {
            var LinksTo = model.items[u];
            var Name = LinksTo.Description;
            if (html) {
                html += '<option value=' + LinksTo.Id + '>' + Name + '</option>';
            } else {
                html = '<option value=' + LinksTo.Id + '>' + Name + '</option>';
            }
        }
        $("#DataLinkToSelect").html(html);
    }
}).catch(err => {
    console.error(err);
});

// Get Links From List
getLinks().then(data => {
    var model = {
        items: data
    }
    if (model.items && model.items.length > 0) {
        $("#DataLinkFromSelect").html("");
        var html = '<option value=' + 0 + '>Select Links To</option>';
        for (var u = 0; u < model.items.length; u++) {
            var LinksTo = model.items[u];
            var Name = LinksTo.Description;
            if (html) {
                html += '<option value=' + LinksTo.Id + '>' + Name + '</option>';
            } else {
                html = '<option value=' + LinksTo.Id + '>' + Name + '</option>';
            }
        }
        $("#DataLinkFromSelect").html(html);
    }
}).catch(err => {
    console.error(err);
});

// Data Link Form
$("#addDataLinkForm").validate({
    ignore: [],
    rules: {
        linkdesc: { required: true },
        DataLinkUserSelect: { required: true },
        DataLinkTeamSelect: { required: true },
        DataLinkDatasourceSelect: { required: true },
        datalinkLocation: { required: true },
        DataLinkChannelsSelect: { required: true },
    },
    messages: {
        linkdesc: {
            required: "This field is required"
        },
        DataLinkUserSelect: {
            required: "Please select one owner"
        },
        DataLinkTeamSelect: {
            required: "Please select one Team"
        },
        DataLinkDatasourceSelect: {
            required: "Please select one data source"
        },
        datalinkLocation: {
            required: "This field is required"
        },
        DataLinkChannelsSelect: {
            required: "Please select one chanels"
        }
    },
});

$("#btnDataLink").click(function () {
    document.getElementById("loader").style.display = "block";
    var addDataLinkdetails = $('form[id="addDataLinkForm"]').valid();
    setTimeout(showPage, 500);
    if (addDataLinkdetails == true) {
        if ($("#hdnDataLinkId").val() != 0 || $("#hdnDataLinkId").val() != "") {
            updateLinksbyid($("#hdnDataLinkId").val(), {
                'Description': $("#linkdesc").val(),
                'Owner': parseInt($("#DataLinkUserSelect").val()),
                'TeamId': parseInt($("#DataLinkTeamSelect").val()),
                'DataSourceId': parseInt($("#DataLinkDatasourceSelect").val()),
                'Location': $("#datalinkLocation").val(),
                'ChannelId': parseInt($("#DataLinkChannelsSelect").val()),
                'LinksTo': parseInt($("#DataLinkToSelect").val()),
                'LinksFrom': parseInt($("#DataLinkFromSelect").val()),
                'IsConfluencePage': $("input[name='Confluence']:checked").val() == 1 ? true : false,
                'NodeId': 1,
                'CreatedBy': parseInt(localStorage.getItem("UserId")),
                'CreatedDate': new Date()
            }).then(data => {
                $.toast({
                    text: "Data Link updated Successfully.", // Text that is to be shown in the toast
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
            }).catch(err => {
                console.error(err);
            });
        }
        else {
            addLinks(
                {
                    'Description': $("#linkdesc").val(),
                    'Owner': parseInt($("#DataLinkUserSelect").val()),
                    'TeamId': parseInt($("#DataLinkTeamSelect").val()),
                    'DataSourceId': parseInt($("#DataLinkDatasourceSelect").val()),
                    'Location': $("#datalinkLocation").val(),
                    'ChannelId': parseInt($("#DataLinkChannelsSelect").val()),
                    'LinksTo': parseInt($("#DataLinkToSelect").val()),
                    'LinksFrom': parseInt($("#DataLinkFromSelect").val()),
                    'IsConfluencePage': $("input[name='Confluence']:checked").val() == 1 ? true : false,
                    'NodeId': 1,
                    'CreatedBy': parseInt(localStorage.getItem("UserId")),
                    'CreatedDate': new Date()
                }
            ).then(data => {
                $.toast({
                    text: "Data Link save Successfully.", // Text that is to be shown in the toast
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
            }).catch(err => {
                console.error(err);
            });
        }
    };
});

// Loader
function showPage() {
    document.getElementById("loader").style.display = "none";
}
