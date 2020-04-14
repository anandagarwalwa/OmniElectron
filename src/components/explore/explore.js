'use strict';
var { getUsersById } = require(__dirname + '\\server\\controllers\\user_controller.js');
var { getChannels } = require(__dirname + '\\server\\controllers\\channels_controller.js');
var { getDatasource } = require(__dirname + '\\server\\controllers\\datasource_controller.js');
var { getTeamsList } = require(__dirname + '\\server\\controllers\\teams_controller.js');
var { getDomainList } = require(__dirname + '\\server\\controllers\\workspace_controller.js');
var { getNodesByDataCategoryId, getNodeFilterData } = require(__dirname + '\\server\\controllers\\nodes_controller.js');
var { getLinksForExplor } = require(__dirname + '\\server\\controllers\\links_controller.js');
//var ForceGraph3D = require('3d-force-graph'); //Enable for 3D graph
var ForceGraph = require('force-graph');
var codeLink = '';
var reportLink = '';
document.getElementById("loader").style.display = "none";
var isNodeFilter = false;
$("#divFilterBlock").hide();
// Get User Login Data
getUsersById(parseInt(localStorage.getItem("UserId"))
).then(data => {
    if (data == undefined) {
        return false;
    }
    $("#usernameid").text(data[0].FirstName + " " + data[0].LastName)
    $("#userimage").attr('src', data[0].Photo);
}).catch(err => {
    console.error(err);
});

$(function () {
    BindSearchPanel();
    $("#ddlBreakDown").change(function () {
        BindSearchPanel(true);
        // breakDownNodeFilter();
    });
    $('#txtSearch').keyup(function (e) {
        if (e.keyCode != 13) {
            serchExplore();
        }
        else {
            $("#filterBlockContainer").append(getFilterTag($('#txtSearch').val()));
            FilterGraphBySearchPanel(null, $('#txtSearch').val());
            // if (isNodeFilter) {
            //     //NodeFilterGraphData(null, $('#txtSearch').val());
            //     updateFilteredNode(filteredLinkColor);
            // }
            // else {
            //     FilterGraphBySearchPanel(null, $('#txtSearch').val());
            // }
        }
    });
    var isClearClick = false, filterId = '';
    $('body').on('click', 'a.dynamic-box', function () {
      //  debugger;
        $("#divSearchPanel").find(".active").removeClass("active");
        if (isClearClick && filterId == $(this).attr("data-val")) {
            // Bind2DForceGraph();
            isClearClick = false;
            // For Deselecting Breakdown
            // Graph
            //     .nodeColor(node => {
            //         return hex2rgb(node.nodeColor, 1);
            //     })
            //     .linkColor(link => hex2rgb(link.linkColor, 1));
            var templinks = links;
            var tempnodes = nodes;
            //    graphData.nodes = nodes;
            //    graphData.nodes = nodes;

            Graph
                // .graphData(graphData)
                .nodeColor(d => {
                    return hex2rgb(tempnodes.find(x => x.nodeId == d.nodeId).nodeColor, 1);
                })
                .linkColor(link => {
                    return hex2rgb(templinks.find(x => x.nodeId == link.nodeId).linkColor, 1);
                })
        }
        else {
            if (isNodeFilter && !$("#filterBlockContainer")[0].innerText.includes($(this).text().trim())) {
                $("#filterBlockContainer span").remove();
                $("#filterBlockContainer").append(getFilterTag($(this).text())); //We can use this later
                $("#divFilterBlock").show();
            }
            $(this).addClass("active");
            isClearClick = true;
            filterId = $(this).attr("data-val");
            FilterGraphBySearchPanel(filterId, null);
            // if (isNodeFilter) {
            //     NodeFilterGraphData(filterId, null);
            // }
            // else {
            //     FilterGraphBySearchPanel(filterId, null);
            // }
        }
    });
    $("#explorenode").click(function () {
        //Bind2DForceGraph();
        // removeNodeFilterBreakdown();
        $("#divSearchPanel").find(".active").removeClass("active");
        updateHighlight(filteredLinkColor);
        isNodeFilter = false;
        isClearClick = true;
    });
    $("#fildernode").click(function () {
        isNodeFilter = true;
        //NodeFilterGraphData();
        // removeNodeFilterBreakdown();
        isClearClick = true;
        updateFilteredNode(filteredLinkColor);
        $("#divFilterBlock").show();
    });
});

function removeNodeFilterBreakdown() {
    $("#divSearchPanel").find(".active").removeClass("active");
    // For Deselecting Breakdown
    Graph
        .nodeColor(node => {
            return hex2rgb(node.nodeColor, 1);
        })
        .linkColor(link => hex2rgb(link.linkColor, 1))
        // .centerAt(node.x, node.y, 1000)
        ;
    // remove all filter nodes & links
    highlightNodes = [];
    highlightLink = [];
    filteredLinkColor = '';
}

function getFilterTag(tagtext) {
    return '<span class="tag label label-info">' + tagtext.trim() + '<span data-role="remove" onclick="removeTag(this)"></span></span>';
}

function removeTag(obj) {
    obj.closest(".tag").remove();
    removeNodeFilterBreakdown();
    $("#divFilterBlock").hide();
}

function serchExplore() {
    var value = $('#txtSearch').val().toLowerCase();
    $("#divSearchPanel .dynamic-box").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
}
function BindSearchPanel(isFromBreakDown) {
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
    InitGraphData(isFromBreakDown);
}
var graphData = {};
var nodes = [], tempnodes = [], links = [];

function InitGraphData(isFromBreakDown) {
    nodes = [], links = [];
    GetLinks(isFromBreakDown);
}
function GetLinks(isFromBreakDown) {
    var userId = undefined;
    if (!SessionManager.IsAdmin)
        userId = SessionManager.UserId;
    // Get links option selected
    getLinksForExplor(userId).then(data => {
       // debugger;
        if (data && data.length > 0) {
            var linkData = data[0];
            var linkColor = '';
            var fromLinkColor = '';
            var selectedVal = parseInt($('#ddlBreakDown').val());
            for (var u = 0; u < linkData.length; u++) {
                linkColor = '';
                switch (selectedVal) {
                    case BreakdownEnum.Channel:
                        linkColor = linkData[u].ChannelColor;
                        // fromLinkColor = linkData[u].LinksFrom ? linkData.find(x => x.NodeId == linkData[u].LinksFrom).ChannelColor : linkColor;
                        break;
                    case BreakdownEnum.Team:
                        linkColor = linkData[u].TeamColor;
                        // fromLinkColor = linkData[u].LinksFrom ? linkData.find(x => x.NodeId == linkData[u].LinksFrom).TeamColor : linkColor;
                        break;
                    case BreakdownEnum.DataTool:
                        linkColor = linkData[u].DataToolColor;
                        // fromLinkColor = linkData[u].LinksFrom ? linkData.find(x => x.NodeId == linkData[u].LinksFrom).DataToolColor : linkColor;
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
        GetNodes(isFromBreakDown);
    }).catch(err => {
        console.error(err);
    });
}
function GetNodes(isFromBreakDown) {
    var userId = undefined;
    if (!SessionManager.IsAdmin)
        userId = SessionManager.UserId;
    getNodesByDataCategoryId(1, userId).then(data => {
        if (data && data.length > 0) {
            var objNode;
            for (var u = 0; u < data.length; u++) {
               // debugger;
                objNode = getNodeLinkObject(data[u].Id);
                nodes.push({
                    "id": data[u].Description,
                    "nodeId": data[u].Id,
                    "nodeColor": objNode.Color,
                    "nodeSize": objNode.NodeSize,
                });
            }
        }
        if (isFromBreakDown) {
            BreakDownNodeFilter();
        }
        else {
            Bind2DForceGraph();
        }
    }).catch(err => {
        console.error(err);
    });
}

function getNodeLinkObject(nodeId) {
    var colors = '#cccccc';
    var objNode = {};
    var len = 3;
    var nodeObj = $.grep(links, function (v) {
        return v.nodeId == nodeId;
    });
    if (nodeObj && nodeObj.length > 0) {
        colors = nodeObj[0].linkColor;
    }
    var nodeSizeObj = $.grep(links, function (v) {
        return v.linksFrom == nodeId || v.linksTo == nodeId;
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
        .height(window.innerHeight - 150)
        .graphData(graphData)
        .nodeLabel('id')
        .nodeColor(d => d.nodeColor)
        .nodeVal(d => d.nodeSize)
        .linkColor(link => link.linkColor)
        .nodeCanvasObjectMode(node => 'after')
        .nodeCanvasObject((node, ctx, globalScale) => {
            const label = node.id;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Arial`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = node.color;
            ctx.fillStyle = '#54545f';
            ctx.fillText(label, node.x, node.y + bckgDimensions[1] + 1);
        })
        .onNodeHover(node => {
            elem.style.cursor = node ? 'pointer' : null
        })
        .onNodeClick(node => {
            if (isNodeFilter) {
            $('#myModal').modal('show');
            getNodeFilterData(node.nodeId).then(data => {
                var filterData = data[0];
                $("#filterusername").text(filterData[0].uFirstname + " " + filterData[0].uLastName);
                $("#nodeDescription").text(filterData[0].nDescription);
                $("#filterDescription").text(filterData[0].lLinkDescription);
                $("#filterTags").text(filterData[0].lTags);
                codeLink = filterData[0].lCodeLink;
                reportLink = filterData[0].lReportLink;
            })
             }
            // Center/zoom on node
            Graph.centerAt(node.x, node.y, 1000);
            Graph.zoom(8, 2000);
        });
}

function updateHighlight(filterColor) {
    if (highlightNodes && highlightNodes.length > 0) {
        // var node = highlightNodes[0];
        // Center/zoom on node
        Graph
            .nodeColor(node => {
                var resultNode = $.grep(highlightNodes, function (v) {
                    return v.nodeId === node.nodeId;
                });
                if (resultNode.length <= 0) {
                    return hex2rgb(node.nodeColor, 0.2);
                }
                else {
                    return filterColor;
                }
                //return highlightNodes.indexOf(node) === -1 ? hex2rgb(node.nodeColor, 0.2) : filterColor
            })
            .linkColor(link => {
                var resultLink = $.grep(highlightLink, function (v) {
                    return v.nodeId === link.nodeId;
                });
                if (resultLink.length <= 0) {
                    return hex2rgb(link.linkColor, 0.2);
                }
                else {
                    return filterColor;
                }
                //return highlightLink.indexOf(link) === -1 ? hex2rgb(link.linkColor, 0.2) : filterColor;
            })

            // .centerAt(node.x, node.y, 1000)
            ;
        Graph.zoom(2, 2000);
    }
}

function updateFilteredNode(filterColor) {
    if (highlightNodes && highlightNodes.length > 0) {
        // var node = highlightNodes[0];
        // Center/zoom on node
        Graph
            .nodeColor(node => {
                var resultNode = $.grep(highlightNodes, function (v) {
                    return v.nodeId === node.nodeId;
                });
                if (resultNode.length <= 0) {
                    return hex2rgb(node.nodeColor, 0);
                }
                else {
                    return filterColor;
                }
                // return highlightNodes.indexOf(node) === -1 ? hex2rgb(node.nodeColor, 0) : filterColor
            })
            .linkColor(link => {
                var resultLink = $.grep(highlightLink, function (v) {
                    return v.nodeId === link.nodeId;
                });
                if (resultLink.length <= 0) {
                    return hex2rgb(link.linkColor, 0);
                }
                else {
                    return filterColor;
                }
                //highlightLink.indexOf(link) === -1 ? hex2rgb(link.linkColor, 0) : filterColor
            })
            .nodeCanvasObjectMode(node => 'after')
            .nodeCanvasObject((node, ctx, globalScale) => {
                const label = '';
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px Arial`;
                const textWidth = ctx.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = node.color;
                ctx.fillStyle = '#54545f';
                ctx.fillText(label, node.x, node.y + bckgDimensions[1] + 1);
            })
            // .centerAt(node.x, node.y, 1000)
            ;
        Graph.zoom(2, 2000);
    }
}

var filteredLinkColor = '';

function FilterGraphBySearchPanel(selId) {
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
    var filteredLinks = $.grep(links, function (v) {
        return v[prop] === selId;
    });
    // var tempLinks = Graph.graphData().links;
    // var filteredLinks = $.grep(Graph.graphData().links, function (v) {
    //     debugger;
    //     var sourceChannel = tempLinks.find(x => x.nodeId == v.source.nodeId);
    //     if (sourceChannel)
    //         return sourceChannel[prop] === selId;
    //     else
    //         return v[prop] === selId;

    // });
    highlightNodes = [], highlightLink = [];
    if (filteredLinks) {
        var linkColor = '';
        filteredLinks.forEach(element => {
            var filteredLNode = $.grep(nodes, function (v) {
                return v.nodeId === element.nodeId;
            });

            highlightNodes.push(filteredLNode[0]);
            highlightLink.push(element);
            linkColor = element.linkColor;
        });
        filteredLinkColor = linkColor;
        if (isNodeFilter) {
            updateFilteredNode(linkColor);
        }
        else {
            updateHighlight(linkColor);
        }
    }
}

// Code link path
$("#codelink").click(function () {
    const { shell } = require('electron') // deconstructing assignment
    shell.showItemInFolder(codeLink)
});

// Report link path
$("#reportlink").click(function () {
    const { shell } = require('electron') // deconstructing assignment
    shell.showItemInFolder(reportLink)
});

$("#addAlert").click(function () {
    $('#myModal').modal('hide');
    $('#filterResult').load('../src/components/filter/filter-result.html');
    $('#filterScratch').load('../src/components/filter/filter-scratch.html');
});

function NodeFilterGraphData(selId, searchText) {
    //var searchText = $('#txtSearch').val();   
    if (searchText) {
        highlightNodes = $.grep(nodes, function (n, i) {
            return (n.id.indexOf(searchText) > -1);
        });
        highlightLink = $.grep(links, function (n, i) {
            return (n.value.indexOf(searchText) > -1);
        });
    }
    else if (selId) {
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
        var filteredLinks = $.grep(links, function (v) {
            return v[prop] === selId;
        });
        highlightNodes = [], highlightLink = [];
        if (filteredLinks) {
            var linkColor = '';
            filteredLinks.forEach(element => {
                var filteredLNode = $.grep(nodes, function (v) {
                    return v.nodeId === element.nodeId;
                });
                highlightNodes.push(filteredLNode[0]);
                highlightLink.push(element);
                linkColor = element.linkColor;
            });
        }
    }
    else {
        highlightNodes = nodes;
        highlightLink = links;
    }

    graphData.nodes = highlightNodes;
    graphData.links = highlightLink;
    const elem = document.getElementById('graph');
    Graph = ForceGraph()
        (elem)
        .width($("#graph").width())
        .height(window.innerHeight - 150)
        // .backgroundColor("#000011")
        .graphData(graphData)
        .nodeLabel('id')
        .nodeColor(d => d.nodeColor)
        .nodeVal(d => d.nodeSize)
        .linkColor(link => link.linkColor)
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
            ctx.fillText(label, node.x, node.y + bckgDimensions[1] + 1);
            // ctx.fillText(label, node.x, node.y + (fontSize * 0.8));
        })
        .onNodeHover(node => {
            elem.style.cursor = node ? 'pointer' : null
        })
        .onNodeClick(node => {
            if (isNodeFilter) {
                $('#myModal').modal('show');
                getNodeFilterData(node.nodeId).then(data => {
                    var filterData = data[0];
                    $("#filterusername").text(filterData[0].uFirstname + " " + filterData[0].uLastName);
                    $("#nodeDescription").text(filterData[0].nDescription);
                    $("#filterDescription").text(filterData[0].lLinkDescription);
                    $("#filterTags").text(filterData[0].lTags);
                    codeLink = filterData[0].lCodeLink;
                    reportLink = filterData[0].lReportLink;
                })
            }
            Graph.centerAt(node.x, node.y, 1000);
            Graph.zoom(8, 2000);
        });
}

// breakdown filter nodes
function BreakDownNodeFilter() {
    debugger;
    var templinks = links;
    var tempnodes = nodes;
    //    graphData.nodes = nodes;
    //    graphData.nodes = nodes;

    Graph
        // .graphData(graphData)
        .nodeColor(d => {
            return tempnodes.find(x => x.nodeId == d.nodeId).nodeColor;
        })
        .linkColor(link => {
            return templinks.find(x => x.nodeId == link.nodeId).linkColor;
        })
}