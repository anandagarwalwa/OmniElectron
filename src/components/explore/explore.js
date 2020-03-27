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
    BindSearchPanel();
    $("#ddlBreakDown").change(function () {
        BindSearchPanel();
    });
    $('#txtSearch').keyup(function (e) {
        if (e.keyCode != 13) {
            serchExplore();
        }
    });
    $('body').on('click', 'a.dynamic-box', function () {
        FilterGraph($(this).attr("data-val"))
    });
});
function serchExplore() {
    var value = $('#txtSearch').val().toLowerCase();
    $("#divSearchPanel .dynamic-box").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
}
function BindSearchPanel() {
    $('#txtSearch').val('');
    var selectedVal = parseInt($('#ddlBreakDown').val());
    var html = '';
    switch (selectedVal) {
        case BreakdownEnum.Channel: {
            getChannels().then(data => {
                if (data) {
                    $.each(data, function (key, val) {
                        html += '<a href="#" class="dynamic-box" data-val="' + val.Id + '"> <i class="fas fa-circle" style="color:' + val.Color + '"></i> ' + val.Name + '</a>';
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
                        html += '<a href="#" class="dynamic-box" data-val="' + val.Id + '"> <i class="fas fa-circle" style="color:#f88317"></i> ' + val.Domain + '</a>';
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
                        html += '<a href="#" class="dynamic-box" data-val="' + val.TeamId + '"> <i class="fas fa-circle" style="color:#f88317"></i> ' + val.TeamName + '</a>';
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
                        html += '<a href="#" class="dynamic-box" data-val="' + val.Id + '"> <i class="fas fa-circle" style="color:' + val.Color + '"></i> ' + val.Name + '</a>';
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
    InitGraphData();
}
var graphData = {};
var nodes = [], links = [];

function InitGraphData() {
    nodes = [], links = [];
    GetLinks();
}
function GetLinks() {
    var userId = undefined;
    if (!SessionManager.IsAdmin)
        userId = SessionManager.UserId;
    // Get links option selected
    getLinksForExplor(userId).then(data => {
        if (data && data.length > 0) {
            var linkData = data[0];
            var linkColor = '';
            var selectedVal = parseInt($('#ddlBreakDown').val());
            for (var u = 0; u < linkData.length; u++) {
                linkColor = '';
                switch (selectedVal) {
                    case BreakdownEnum.Channel:
                        linkColor = linkData[u].ChannelColor
                        break;
                    case BreakdownEnum.Team:
                        linkColor = linkData[u].TeamColor
                        break;
                    case BreakdownEnum.DataTool:
                        linkColor = linkData[u].DataToolColor
                        break;
                }
                links.push({
                    "source": linkData[u].LinksFromDesc == null ? "None" : linkData[u].LinksFromDesc,
                    "target": linkData[u].LinksToDesc == null ? "None" : linkData[u].LinksToDesc,
                    "value": linkData[u].Description,
                    "linkColor": linkColor,
                    "nodeId": linkData[u].NodeId,
                    "linksFrom": linkData[u].LinksFrom,
                    "linksTo": linkData[u].LinksTo,
                    "teamId": linkData[u].TeamId,
                    "channelId": linkData[u].ChannelId,
                    "dataToolId": linkData[u].DataSourceId
                });
            }
        }
        GetNodes();
    }).catch(err => {
        console.error(err);
    });
}
function GetNodes() {
    var userId = undefined;
    if (!SessionManager.IsAdmin)
        userId = SessionManager.UserId;
    // Get nodes with link option selected
    nodes.push({
        "id": "None",
        "nodeId": 0,
        "nodeColor": "#ccc"
    });
    getNodesByDataCategoryId(1, userId).then(data => {
        if (data && data.length > 0) {
            var objNode;
            for (var u = 0; u < data.length; u++) {
                objNode = getNodeLinkObject(data[u].Id);
                nodes.push({
                    "id": data[u].Description,
                    "nodeId": data[u].Id,
                    "nodeColor": objNode.Color,
                    "nodeSize": objNode.NodeSize,
                });
            }
        }
        BindExplorGraph();
        //GetLinks();
    }).catch(err => {
        console.error(err);
    });
}

function getNodeLinkObject(nodeId) {
    var colors = '#ccc';
    var objNode = {};
    var len = 1;
    var nodeObj = $.grep(links, function (v) {
        return v.nodeId === nodeId;
    });
    if (nodeObj && nodeObj.length > 0) {
        colors = nodeObj[0].linkColor;
    }
    var nodeSizeObj = $.grep(links, function (v) {
        return v.linksFrom === nodeId || v.linksTo === nodeId;
    });
    if (nodeSizeObj && nodeSizeObj.length > 0) {
        len = nodeSizeObj.length;
    }
    objNode.Color = colors;
    objNode.NodeSize = len;
    return objNode;
}


let highlightNodes = [];
let highlightLink = null;
var Graph;
function BindExplorGraph() {
    graphData.nodes = nodes;
    graphData.links = links;
    const elem = document.getElementById('graph');
    Graph = ForceGraph3D()
        (elem)
        .showNavInfo(false)
        .width($("#graph").width())
        .height(window.innerHeight - 185)
        .graphData(graphData)
        .nodeLabel('id')
        .nodeColor(d => highlightNodes.indexOf(d) === -1 ? d.nodeColor : 'red')
        .nodeVal(d => d.nodeSize)
        .nodeOpacity(1)
        .linkColor(link => link.linkColor)
        .linkOpacity(1)
        .linkWidth(link => link === highlightLink ? 4 : 1)
        .linkDirectionalParticles(link => link === highlightLink ? 4 : 0)
        .linkDirectionalParticleWidth(4)
        // .onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
        .onNodeHover(node => {
            // no state change
            if ((!node && !highlightNodes.length) || (highlightNodes.length === 1 && highlightNodes[0] === node)) return;

            highlightNodes = node ? [node] : [];

            updateHighlight();
        })
        .onNodeClick(node => {
            // Aim at node from outside it
            const distance = 40;
            const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

            Graph.cameraPosition(
                { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
                node, // lookAt ({ x, y, z })
                3000  // ms transition duration
            );
        }).onLinkHover(link => {
            // no state change
            if (highlightLink === link) return;

            highlightLink = link;
            highlightNodes = link ? [link.source, link.target] : [];

            updateHighlight();
        });
}
function updateHighlight() {
    // trigger update of highlighted objects in scene
    Graph
        .nodeColor(Graph.nodeColor())
        .linkWidth(Graph.linkWidth())
        .linkDirectionalParticles(Graph.linkDirectionalParticles());
}

function FilterGraph(selId) {
    var selectedBreakDownVal = parseInt($('#ddlBreakDown').val());
    var prop = "";
    selId = parseInt(selId) ;
    switch (selectedBreakDownVal) {
        case BreakdownEnum.Channel:
            prop = "channelId";
            break;
        case BreakdownEnum.Team:
            prop = "teamId";
            break;
        case BreakdownEnum.DataTool:
            prop = "dataToolId";
            break;
    }
    var filteredLinks = $.grep(Graph.graphData().links, function (v) {
        return v[prop] === selId;
    });
    if (filteredLinks) {
debugger;
    }
}

// function set_highlight(d)
// {
// 	svg.style("cursor","pointer");
// 	if (focus_node!==null) d = focus_node;
// 	highlight_node = d;

// 	if (highlight_color!="white")
// 	{
// 		  circle.style(towhite, function(o) {
//                 return isConnected(d, o) ? highlight_color : "white";});
// 			text.style("font-weight", function(o) {
//                 return isConnected(d, o) ? "bold" : "normal";});
//             link.style("stroke", function(o) {
// 		      return o.source.index == d.index || o.target.index == d.index ? highlight_color : ((isNumber(o.score) && o.score>=0)?color(o.score):default_link_color);

//             });
// 	}
// }