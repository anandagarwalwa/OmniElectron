'use strict';
var { getUsersById } = require(__dirname + '\\server\\controllers\\user_controller.js');
var { getChannels } = require(__dirname + '\\server\\controllers\\channels_controller.js');
var { getDatasource } = require(__dirname + '\\server\\controllers\\datasource_controller.js');
var { getTeamsList } = require(__dirname + '\\server\\controllers\\teams_controller.js');
var { getDomainList } = require(__dirname + '\\server\\controllers\\workspace_controller.js');
var { getNodesByDataCategoryId } = require(__dirname + '\\server\\controllers\\nodes_controller.js');
var { getLinksByCreatedBy } = require(__dirname + '\\server\\controllers\\links_controller.js');

document.getElementById("loader").style.display = "none";
// Get User Login Data
getUsersById(parseInt(localStorage.getItem("UserId"))
).then(data => {
    if (data == undefined) {
        return false;
    }
    $("#usernameid").text(data[0].FirstName + " " + data[0].LastName)
    $("#userimage").attr('src', data[0].userimage);
}).catch(err => {
    console.error(err);
});

$(function () {
    $("#ddlBreakDown").change(function () {
        BindSearchPanel();
        //alert($('#ddlBreakDown option:selected').text());
    });
    GetNodes();
    GetLinks();
});

function BindSearchPanel() {
    var selectedVal = $('#ddlBreakDown').val();
    var html = '';
    switch (selectedVal) {
        case "1": {
            getChannels().then(data => {
                if (data) {
                    $.each(data, function (key, val) {
                        html += '<a href="#"> <i class="fas fa-circle" style="color:' + val.Color + '"></i> ' + val.Name + '</a>';
                    });
                    $('#divSearchPanel').html(html);
                }
            });
            break;
        }
        case "2": {
            getDomainList().then(data => {
                if (data) {
                    $.each(data, function (key, val) {
                        html += '<a href="#"> <i class="fas fa-circle" style="color:#f88317"></i> ' + val.Domain + '</a>';
                    });
                    $('#divSearchPanel').html(html);
                }
            });
            break;
        }
        case "3": {
            getTeamsList().then(data => {
                if (data) {
                    $.each(data, function (key, val) {
                        html += '<a href="#"> <i class="fas fa-circle" style="color:#f88317"></i> ' + val.TeamName + '</a>';
                    });
                    $('#divSearchPanel').html(html);
                }
            });
            break;
        }
        case "4": {
            getDatasource().then(data => {
                if (data) {
                    $.each(data, function (key, val) {
                        html += '<a href="#"> <i class="fas fa-circle" style="color:' + val.Color + '"></i> ' + val.Name + '</a>';
                    });
                    $('#divSearchPanel').html(html);
                }
            });
            break;
        }
        default: {
            $('#divSearchPanel').html('');
        }
    }
}
var nodes = [],links=[];
function GetNodes() {
    var userId = undefined;
    if (!SessionManager.IsAdmin)
        userId = SessionManager.UserId;
    // Get nodes with link option selected
    getNodesByDataCategoryId(1, userId).then(data => {
        if (data && data.length > 0) {
            for (var u = 0; u < data.length; u++) {
                nodes.push({
                    "id": data[u].Description,
                    "group": 1
                });
            }
        }
    }).catch(err => {
        console.error(err);
    });
}
function GetLinks() {

    var userId = undefined;
    if (!SessionManager.IsAdmin)
        userId = SessionManager.UserId;
    // Get links option selected
    getLinksByCreatedBy(userId).then(data => {
        if (data && data.length > 0) {
            for (var u = 0; u < data.length; u++) {
                links.push({
                    "id": data[u].Description,
                    "group": 1
                });
            }
        }
    }).catch(err => {
        console.error(err);
    });
}
