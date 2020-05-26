var d3 = require('d3v3');
//  var TimelineChart = require('timeline-chart');
var { getTimelineChartData } = require(__dirname + '\\server\\controllers\\tests_controller.js');
document.getElementById("loader").style.display = "none";

var minRange;
var maxRange;
var from;
var to;

var dbDataObject = [];
var timelineListObj = [];
var teamListObject = [];
var localCodeListObject = [];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
var filteredList = [];
var timeLineFilterCriteria = [];
var isTimeLineFilterEnabled = true;
$('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
});
$("#hide-home").click(function () {
    $("#main-side").toggle(350);
});

$("#hide-filter").click(function () {
    $("#main-side").toggle(350);
});

var selector = "#sidebar li";
$(selector).on("click", function () {
    $(selector).removeClass("active");
    $(this).addClass("active");
});

var lang = "en-US";
var year = 2020;

function dateToTS(date) {
    return date.valueOf();
}

function tsToDate(ts) {
    var d = new Date(ts);

    return d.toLocaleDateString(lang, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function openSearch() {
    document.getElementById("myOverlay").style.display = "block";
}

function closeSearch() {
    document.getElementById("myOverlay").style.display = "none";
}



/*=======Modal-Popop=====*/
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// // When the user clicks the button, open the modal 
// btn.onclick = function() {
//   modal.style.display = "block";
// }

// When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// }

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

getTimelineDetails();

function getTimelineDetails() {
    timelineListObj = [];
    teamListObject = [];
    localCodeListObject = [];

    var userId = undefined;
    if (!SessionManager.IsAdmin)
        userId = SessionManager.UserId;

    getTimelineChartData(userId, from, to).then(data => {
        timelineListObj = [];
        var dataObj = data[0];
        dbDataObject = dataObj;
        if (!dataObj || dataObj.length == 0) {
            alert("no data available");
            return;
        }

        var imgpath = "";
        var imageType = "";
        for (var i = 0; i < dataObj.length; i++) {
            if (dataObj[i].IsAnalysis == 1) {
                imgpath = __dirname + "\\assets\\images\\analysis_2.png";
                imageType = "analysis";
            }
            if (dataObj[i].IsAnalysis == 0) {
                if (dataObj[i].IsDidTestWin.toString() == "1") {
                    imgpath = __dirname + "\\assets\\images\\test_win_2.png";
                    imageType = "win";
                } else {
                    imgpath = __dirname + "\\assets\\images\\test_loss_2.png";
                    imageType = "loss";
                }
            }
            timelineListObj.push({
                label: dataObj[i].ChannelName,
                data: [{
                    type: TimelineChart.TYPE.POINT,
                    at: dataObj[i].Date,
                    image: imgpath,
                    color: dataObj[i].Color,
                    imageType: imageType,
                    data: JSON.stringify(dataObj[i]),
                    Id: dataObj[i].Id,
                    TeamId: dataObj[i].TeamId,
                    ChannelId: dataObj[i].ChannelId,
                    LocaleId: dataObj[i].LocaleId
                }]
            })

            teamListObject.push({
                label: dataObj[i].TeamName,
                data: [{
                    type: TimelineChart.TYPE.POINT,
                    at: dataObj[i].Date,
                    image: imgpath,
                    color: dataObj[i].Color,
                    imageType: imageType,
                    data: JSON.stringify(dataObj[i]),
                    Id: dataObj[i].Id,
                    TeamId: dataObj[i].TeamId,
                    ChannelId: dataObj[i].ChannelId,
                    LocaleId: dataObj[i].LocaleId
                }]
            })

            localCodeListObject.push({
                label: dataObj[i].LocaleCode,
                data: [{
                    type: TimelineChart.TYPE.POINT,
                    at: dataObj[i].Date,
                    image: imgpath,
                    color: dataObj[i].Color,
                    imageType: imageType,
                    data: JSON.stringify(dataObj[i]),
                    Id: dataObj[i].Id,
                    TeamId: dataObj[i].TeamId,
                    ChannelId: dataObj[i].ChannelId,
                    LocaleId: dataObj[i].LocaleId
                }]
            })
        }

        var formattedData = FormatDataByBreakDown();
        SetSliderRange(timelineListObj);

    }).catch(err => {
        console.error(err);
    });
}

function FormatTimeLineData(timelineList) {
    var data = [];
    if (timelineList.length > 0) {
        for (var i = 0; i < timelineList.length; i++) {
            var dataObj = {
                type: TimelineChart.TYPE.POINT,
                at: timelineList[i].data[0].at,
                image: timelineList[i].data[0].image,
                color: timelineList[i].data[0].color,
                imageType: timelineList[i].data[0].imageType,
                data: timelineList[i].data[0].data,
                Id: timelineList[i].data[0].Id,
                TeamId: timelineList[i].data[0].TeamId,
                ChannelId: timelineList[i].data[0].ChannelId,
                LocaleId: timelineList[i].data[0].LocaleId
            }
            var selected = data.filter(m => m.label == timelineList[i].label);
            if (selected.length > 0) {
                var dt = selected[0].data;
                dt.push(dataObj);
            } else {
                var obj = {
                    "label": timelineList[i].label,
                    "data": [dataObj]
                }
                data.push(obj);
            }
        }
    }

    data.sort(function (a, b) {
        return a.label.toUpperCase().localeCompare(b.label.toUpperCase());
    })

    return data;
}

function SetSliderRange(timelineList) {
    var dateList = timelineList.map(function (v, i) {
        return v.data[0].at;
    })
    var sortedDateList = dateList.sort((a, b) => a - b);

    if (sortedDateList.length > 0) {
        if (!maxRange || !minRange) {
            minRange = sortedDateList[0];
            maxRange = sortedDateList[sortedDateList.length - 1];
        }

        $("#demo_1").ionRangeSlider({
            skin: "flat",
            type: "double",
            grid: true,
            min: dateToTS(minRange),
            max: dateToTS(maxRange),
            from: dateToTS(minRange),
            to: dateToTS(maxRange),
            prettify: tsToDate,
            // onChange: changeResult,
            onFinish: changeResult
        });
    }
}


function bindChartData(data) {
    $("#timeline6").html('');

    var range = {};
    if (maxRange && minRange) {
        range.min = minRange;
        range.max = maxRange;
    }
    var element = document.getElementById('timeline6');
    var timeline = new TimelineChart(element, data, {
        enableLiveTimer: true
        // tip: function (d) {
        //   return d.at || `${d.from}<br>${d.to}`;
        // }
    }, range).onVizChange(e => console.log('e', e));
}

var changeResult = function (data) {
    var fromDate = new Date(data.from);
    var toDate = new Date(data.to);
    from = FormatDate(fromDate);
    to = FormatDate(toDate);

    maxRange = toDate;
    minRange = fromDate;

    getTimelineDetails();
};

function FormatDate(dt) {
    var y = dt.getFullYear()
    var m = dt.getMonth() + 1;
    var d = dt.getDate()

    var formattedDate = y + "-" + m + "-" + d;
    formattedDate = "'" + formattedDate + "'";
    return formattedDate;
}


function FormatDataByBreakDown(isChangeHtml = true) {
    var formattedData;
    var html = '';
    var breakdownValue = $("#ddlBreakDown").val();
    if (breakdownValue == "1") {
        formattedData = FormatTimeLineData(timelineListObj);
        if (formattedData) {
            $.each(formattedData, function (key, val) {
                html += '<a href="javascript:void" class="drop-box" data-val="' + val.label + '" data-id="' + val.data[0].ChannelId + '"> <i class="fas fa-circle" style="color:' + val.data[0].color + '"></i> ' + val.label + '</a>';
            });
        }
    } else if (breakdownValue == "2") {
        formattedData = FormatTimeLineData(teamListObject);
        if (formattedData) {
            $.each(formattedData, function (key, val) {
                //val.data[0].color = "#f88317";
                html += '<a href="javascript:void" class="drop-box" data-val="' + val.label + '" data-id="' + val.data[0].TeamId + '"> <i class="fas fa-circle" style="color:' + val.data[0].color + '"></i> ' + val.label + '</a>';
            });
        }
    } else if (breakdownValue == "3") {
        formattedData = FormatTimeLineData(localCodeListObject);
        if (formattedData) {
            $.each(formattedData, function (key, val) {
                //val.data[0].color = "#f88317";
                html += '<a href="javascript:void" class="drop-box" data-val="' + val.label + '" data-id="' + val.data[0].LocaleId + '"> <i class="fas fa-circle" style="color:' + val.data[0].color + '"></i> ' + val.label + '</a>';
            });
        }
    } else {
        formattedData = FormatTimeLineData(timelineListObj);
        if (formattedData) {
            $.each(formattedData, function (key, val) {
                html += '<a href="javascript:void" class="drop-box" data-val="' + val.label + '" data-id="' + val.data[0].ChannelId + '"> <i class="fas fa-circle" style="color:' + val.color + '"></i> ' + val.label + '</a>';
            });
        }
    }
    var result = [];
    if (isTimeLineFilterEnabled && timeLineFilterCriteria.length > 0) {
        debugger;
        for (var i = 0; i < timeLineFilterCriteria.length; i++) {
            var element = timeLineFilterCriteria[i];
            if (element.ChannelId) {
                // formattedData = formattedData.filter(f => f.data[0].ChannelId == element.ChannelId);
                formattedData = formattedData.filter(f => f.data.some(c=>c.ChannelId == element.ChannelId));
            }
            if (element.TeamId) {
                // formattedData = formattedData.filter(f => f.data[0].TeamId == element.TeamId);                
                formattedData = formattedData.filter(f => f.data.some(c=>c.TeamId == element.TeamId));
            }
            if (element.LocaleId) {
                // formattedData = formattedData.filter(f => f.data[0].LocaleId == element.LocaleId);                
                formattedData = formattedData.filter(f => f.data.some(c=>c.LocaleId == element.LocaleId));
            }
        }
        //formattedData = result;
    }
    if (isChangeHtml) {
        $('#divSearchPanel').html(html);
        isImgClick = false;
        imgFilterId = '';
        $("#iconList").find(".active").removeClass("active");

        if (filteredList.length > 0 && formattedData.length > 0) {
            for (var i = 0; i < formattedData.length; i++) {
                var data = formattedData[i].data.filter(m => filteredList.includes(m.Id));
                formattedData[i].data = data;
            }
        }
        bindChartData(formattedData);
    }
    return formattedData;
}

var isClearClick = false;
var filterId = '';
$('body').on('click', 'a.drop-box', function () {
    $("#divSearchPanel").find(".active").removeClass("active");
    if (isClearClick && filterId == $(this).attr("data-val")) {
        isClearClick = false;
        var formattedData = FormatDataByBreakDown(false);
        bindChartData(formattedData);
        // $("#lblFilter").text("");
        // $("#breakFilterBlock").css('display', 'none');
        $("#filterTMContainer").html('');
    } else {
        isClearClick = true;
        filterId = $(this).attr("data-val");
        var filterDataId = $(this).attr("data-id");
        var breakdownKey ="";
        $(this).addClass("active");
        if (isTimeLineFilterEnabled) {
            var breakdownValue = $("#ddlBreakDown").val();
            var exist = false;
            if (breakdownValue == "1") {
                breakdownKey = "ChannelId";
                if (!jsonHasKeyVal(timeLineFilterCriteria, "ChannelId", filterDataId)) {
                    timeLineFilterCriteria.push({ "ChannelId": filterDataId });
                }
            }
            else if (breakdownValue == "2") {
                breakdownKey = "TeamId";
                if (!jsonHasKeyVal(timeLineFilterCriteria, "TeamId", filterDataId)) {
                    timeLineFilterCriteria.push({ "TeamId": filterDataId });
                }
            }
            else {
                breakdownKey = "LocaleId";
                if (!jsonHasKeyVal(timeLineFilterCriteria, "LocaleId", filterDataId)) {
                    timeLineFilterCriteria.push({ "LocaleId": filterDataId });
                }
            }
        }
        var formattedData = FormatDataByBreakDown(false);
        bindChartData(formattedData);
        //$("#lblFilter").text(filterId);
        //$("#filterTMContainer span").remove();
        $("#filterTMContainer").append(getTimeLineFilterTag(filterId, filterDataId,breakdownKey));
        $("#breakFilterBlock").css('display', 'block');
        if (formattedData.length > 0) {
            filteredList = formattedData[0].data.map(function (val, index) {
                return val.Id;
            })
        } else {
            filteredList = [];
        }
    }
    isImgClick = false;
    imgFilterId = '';
    $("#iconList").find(".active").removeClass("active");
});

var isImgClick = false;
var imgFilterId = '';
$('body').on('click', 'a.icon-box', function () {

    var filteredData = [];

    $("#iconList").find(".active").removeClass("active");
    if (isImgClick && imgFilterId == $(this).attr("data-val")) {
        isImgClick = false;
        filteredData = FormatDataByBreakDown(false);
    } else {
        isImgClick = true;
        imgFilterId = $(this).attr("data-val");
        $(this).addClass("active");

        var formattedData = FormatDataByBreakDown(false);
        filteredData = formattedData;
        filteredData = JSON.stringify(filteredData);
        filteredData = JSON.parse(filteredData);
        for (var i = 0; i < formattedData.length; i++) {
            filteredData[i].data = [];
            for (var j = 0; j < formattedData[i].data.length; j++) {
                var dt = formattedData[i].data[j];
                if (dt.imageType === imgFilterId) {
                    filteredData[i].data.push(dt);
                }
            }

            // if (filteredData[i].data.length == 0) {
            //     filteredData.splice(i, 1);
            // }
        }
    }

    // if (filteredList.length > 0 && filteredData.length > 0) {
    //     for (var i = 0; i < filteredData.length; i++) {
    //         var data = filteredData[i].data.filter(m => filteredList.includes(m.Id));
    //         filteredData[i].data = data;
    //     }
    // }
    bindChartData(filteredData);

    // isClearClick = false;
    // filterId = '';
    // $("#divSearchPanel").find(".active").removeClass("active");
    // $("#breakFilterBlock").css('display', 'none');
});


function getTimeLineFilterTag(tagtext, tagId,breakdown) {
    return '<span class="tag label label-info">' + tagtext.trim() + '<span data-role="remove" data-val="' + breakdown + '" data-id="' + tagId + '" onclick="removeTimeLineTag(this)"></span></span>';
}

function removeTimeLineTag(obj) {
    filterId = '';
    isClearClick = false;
    filteredList = [];
    var filterDataId = $(obj).attr("data-id");
    var filterDataKey = $(obj).attr("data-val");
    timeLineFilterCriteria.forEach(function(e, index){
        if(filterDataKey == "ChannelId"){
            if(filterDataId == e.ChannelId){
                timeLineFilterCriteria.splice(index, 1);
            }
        }      
        if(filterDataKey == "TeamId"){
            if(filterDataId == e.TeamId){
                timeLineFilterCriteria.splice(index, 1);
            }
        }  
        if(filterDataKey == "LocaleId"){
            if(filterDataId == e.LocaleId){
                timeLineFilterCriteria.splice(index, 1);
            }
        }    
      })
    var formattedData = FormatDataByBreakDown(false);
    bindChartData(formattedData);
    $("#divSearchPanel").find(".active").removeClass("active");
    obj.closest(".tag").remove();
}

function serchExplore() {
    var value = $('#txtSearch').val().toLowerCase();
    $("#divSearchPanel .drop-box").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
}
$('#txtSearch').keyup(function (e) {
    if (e.keyCode != 13) {
        serchExplore();
    }
});

$('body').on('click', 'image.dot', function (e) {
    var data = $(e.currentTarget).attr('dataVal');
    if (data) {
        var dataVal = JSON.parse(data);
        console.log(dataVal);
        $('#timeLineModal').modal('show');
        if (data) {
            $("#descValue").text(dataVal.Description);
            $("#channelName").text(dataVal.ChannelName);
            $("#teamName").text(dataVal.TeamName);
            $("#localCode").text(dataVal.LocaleCode);

            var dt = new Date(dataVal.Date);
            var formattedDate = dt.getDate() + " " + months[dt.getMonth()] + " " + dt.getFullYear();
            $("#createdDate").text(formattedDate);
        }

    }
});