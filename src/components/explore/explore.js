'use strict';
var { getUsersById } = require(__dirname + '\\server\\controllers\\user_controller.js');
var { getChannels } = require(__dirname + '\\server\\controllers\\channels_controller.js');
var { getDatasource } = require(__dirname + '\\server\\controllers\\datasource_controller.js');
var { getTeamsList } = require(__dirname + '\\server\\controllers\\teams_controller.js');
var { getDomainList } = require(__dirname + '\\server\\controllers\\workspace_controller.js');
var { getNodesByDataCategoryId } = require(__dirname + '\\server\\controllers\\nodes_controller.js');
var { getLinksForExplor } = require(__dirname + '\\server\\controllers\\links_controller.js');
//var ForceGraph3D = require('3d-force-graph'); //Enable for 3D graph
var ForceGraph = require('force-graph');
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
    var isClearClick = false, filterId = '';
    $('body').on('click', 'a.dynamic-box', function () {
        $("#divSearchPanel").find(".active").removeClass("active");
        if (isClearClick && filterId == $(this).attr("data-val")) {
            Bind2DForceGraph();
            isClearClick = false;
        }
        else {
            $(this).addClass("active");
            isClearClick = true;
            filterId = $(this).attr("data-val");
            FilterGraph($(this).attr("data-val"));
        }
    });
    // $('body').on('click', '.coman-drop-down', function () {
    //     highlightNodes = [],highlightLink = [];
    //     updateHighlight();
    // });
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
                //NodeSourceDesc
                if (linkData[u].LinksFromDesc != null) {
                    links.push({
                        "source": linkData[u].LinksFromDesc,
                        "target": linkData[u].NodeSourceDesc,
                        "value": linkData[u].Description,
                        "linkColor": linkColor,
                        "nodeId": linkData[u].NodeId,
                        "linksFrom": linkData[u].LinksFrom,
                        "linksTo": linkData[u].NodeId,
                        "teamId": linkData[u].TeamId,
                        "channelId": linkData[u].ChannelId,
                        "dataToolId": linkData[u].DataSourceId
                    });
                }
                if (linkData[u].LinksToDesc != null) {
                    links.push({
                        "source": linkData[u].NodeSourceDesc,
                        "target": linkData[u].LinksToDesc,
                        "value": linkData[u].Description,
                        "linkColor": linkColor,
                        "nodeId": linkData[u].NodeId,
                        "linksFrom": linkData[u].NodeId,
                        "linksTo": linkData[u].LinksTo,
                        "teamId": linkData[u].TeamId,
                        "channelId": linkData[u].ChannelId,
                        "dataToolId": linkData[u].DataSourceId
                    });
                }
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
    // nodes.push({
    //     "id": "None",
    //     "nodeId": 0,
    //     "nodeColor": "#ccc",
    //     "nodeSize": 1
    // });
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
        //Bind3DForceGraph();
        Bind2DForceGraph();
        //GetLinks();
    }).catch(err => {
        console.error(err);
    });
}

function getNodeLinkObject(nodeId) {
    var colors = '#cccccc';
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


var highlightNodes = [];
var highlightLink = [];
var Graph;

function Bind2DForceGraph() {
    highlightNodes = [], highlightLink = [];
    graphData.nodes = nodes;
    graphData.links = links;
    const elem = document.getElementById('graph');
    Graph = ForceGraph()
        (elem)
        .width($("#graph").width())
        .height(window.innerHeight - 100)
        // .backgroundColor("#000011")
        .graphData(graphData)
        .nodeLabel('id')
        .nodeColor(d => d.nodeColor)
        .nodeVal(d => d.nodeSize)
        .linkColor(link => link.linkColor)
        //.linkWidth(link => highlightLink.indexOf(link) === -1 ? 1 : 2)
        // .nodeCanvasObjectMode(() => 'after')
        // .nodeCanvasObjectMode(node => highlightNodes.indexOf(node) !== -1 ? 'after' : 'after')
        .nodeCanvasObjectMode(node => 'after')
        .nodeCanvasObject((node, ctx, globalScale) => {
            const label = node.id;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Arial`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
            //ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            //ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = node.color;
            ctx.fillStyle = '#54545f';
            //   ctx.fillText(label, node.x, node.y);
            ctx.fillText(label, node.x , node.y + bckgDimensions[1] + 1);
            // ctx.fillText(label, node.x, node.y + (fontSize * 0.8));
        })
        .onNodeHover(node => {
            elem.style.cursor = node ? 'pointer' : null
        })
        .onNodeClick(node => {
            // Center/zoom on node
            Graph.centerAt(node.x, node.y, 1000);
            Graph.zoom(8, 2000);
        });
}
let hex2rgb = c => `rgb(${c.substr(1).match(/../g).map(x => +`0x${x}`)},0.2)`;
let rgb2hex = c => '#' + c.match(/\d+/g).map(x => (+x).toString(16).padStart(2, 0)).join``

function updateHighlight(filterColor) {
    if (highlightNodes && highlightNodes.length > 0) {
        var node = highlightNodes[0];
        // Center/zoom on node
        Graph
            .nodeColor(node => {                              
               return highlightNodes.indexOf(node) === -1 ? hex2rgb(node.nodeColor) : filterColor
            })
            .linkColor(link => highlightLink.indexOf(link) === -1 ? hex2rgb(link.linkColor) : filterColor)
            .centerAt(node.x, node.y, 1000)            
            ;
        Graph.zoom(7, 2000);
    }
}

function FilterGraph(selId) {
    var selectedBreakDownVal = parseInt($('#ddlBreakDown').val());
    var prop = "";
    selId = parseInt(selId);
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
    highlightNodes = [], highlightLink = [];
    if (filteredLinks) {
        var linkColor = '';
        filteredLinks.forEach(element => {
            var filteredLNode = $.grep(Graph.graphData().nodes, function (v) {
                return v.nodeId === element.nodeId;
            });
            highlightNodes.push(filteredLNode[0]);
            // highlightNodes.push(element.source);
            // highlightNodes.push(element.target);
            highlightLink.push(element);
            linkColor = element.linkColor;
        });
        updateHighlight(linkColor);
    }
}