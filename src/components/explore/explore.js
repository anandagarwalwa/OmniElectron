'use strict';
var { getUsersById } = require(__dirname + '\\server\\controllers\\user_controller.js');
var { getChannels } = require(__dirname + '\\server\\controllers\\channels_controller.js');
var { getDatasource } = require(__dirname + '\\server\\controllers\\datasource_controller.js');
var { getTeamsList } = require(__dirname + '\\server\\controllers\\teams_controller.js');
var { getDomainList } = require(__dirname + '\\server\\controllers\\workspace_controller.js');
var { getNodesByDataCategoryId } = require(__dirname + '\\server\\controllers\\nodes_controller.js');
var { getLinksForExplor } = require(__dirname + '\\server\\controllers\\links_controller.js');
var ForceGraph3D = require('3d-force-graph');
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
    GetLinks();
});

function BindSearchPanel() {
    var selectedVal = parseInt($('#ddlBreakDown').val());
    var html = '';
    switch (selectedVal) {
        case BreakdownEnum.Channel: {
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
        case BreakdownEnum.Domain: {
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
        case BreakdownEnum.Team: {
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
        case BreakdownEnum.DataTool: {
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
var graphData = {};
var nodes = [], links = [];
function GetNodes() {
    var userId = undefined;
    if (!SessionManager.IsAdmin)
        userId = SessionManager.UserId;
    // Get nodes with link option selected
    nodes.push({
        "id": "None",
        "nodeId": 0,
        "nodeColor":"#ccc"
    });
    getNodesByDataCategoryId(1, userId).then(data => {
        if (data && data.length > 0) {
            for (var u = 0; u < data.length; u++) {
                nodes.push({
                    "id": data[u].Description,
                    "nodeId": data[u].Id,
                    "nodeColor": getNodeColor(data[u].Id)
                });
            }
        }
        BindExplorGraph();
        //GetLinks();
    }).catch(err => {
        console.error(err);
    });
}
function GetLinks() {
    var userId = undefined;
    if (!SessionManager.IsAdmin)
        userId = SessionManager.UserId;
    // Get links option selected
    getLinksForExplor(userId).then(data => {
        if (data && data.length > 0) {
            var linkData = data[0];
            for (var u = 0; u < linkData.length; u++) {
                links.push({
                    "source": linkData[u].LinksFromDesc == null ? "None" : linkData[u].LinksFromDesc,
                    "target": linkData[u].LinksToDesc == null ? "None" : linkData[u].LinksToDesc,
                    "value": linkData[u].Description,
                    "linkColor": linkData[u].ChannelColor,
                    "nodeId": linkData[u].NodeId
                });
            }
        }
        GetNodes();
    }).catch(err => {
        console.error(err);
    });
}

function BindExplorGraph() {
    graphData.nodes = nodes;
    graphData.links = links;
    const elem = document.getElementById('graph');
    const Graph = ForceGraph3D()
        (elem)
        .graphData(graphData)
        .nodeLabel('id')
        .nodeAutoColorBy('nodeColor')
        .onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
        .onNodeClick(node => {
            // Aim at node from outside it
            const distance = 40;
            const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

            Graph.cameraPosition(
                { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
                node, // lookAt ({ x, y, z })
                3000  // ms transition duration
            );
        });
}

function getNodeColor(nodeId) {
    var colors = '#ccc';
    var nodeObj = $.grep(links, function (v) {
        return v.nodeId === nodeId;
    });
    if (nodeObj && nodeObj.length > 0) {
        colors = nodeObj[0].linkColor;
    }
    return colors;
}