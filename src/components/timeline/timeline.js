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

$('#sidebarCollapse').on('click', function() {
    $('#sidebar').toggleClass('active');
});
$("#hide-home").click(function() {
    $("#main-side").toggle(350);
});

$("#hide-filter").click(function() {
    $("#main-side").toggle(350);
});

$('#demo-one').on('click', function() {
    //$(".main-sidebar").toggle();
    //$(".main-sidebar").attr("style","display:block !important");
    if ($(".main-sidebar").hasClass("displayBlock")) {
        $(".main-sidebar").removeClass("displayBlock");
        $(".main-sidebar").addClass("displayNone");
    } else {
        $(".main-sidebar").removeClass("displayNone");
        $(".main-sidebar").addClass("displayBlock");
    }
});
var selector = "#sidebar li";
$(selector).on("click", function() {
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

// $("#demo_1").ionRangeSlider({
//   skin: "flat",
//   type: "double",
//   grid: true,
//   min: dateToTS(new Date(year, 10, 1)),
//   max: dateToTS(new Date(year, 11, 1)),
//   from: dateToTS(new Date(year, 10, 8)),
//   to: dateToTS(new Date(year, 10, 23)),
//   prettify: tsToDate
// });

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
window.onclick = function(event) {
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
        console.log('data', data);
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
                    data: JSON.stringify(dataObj[i])
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
                    data: JSON.stringify(dataObj[i])
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
                    data: JSON.stringify(dataObj[i])
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
                data: timelineList[i].data[0].data
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

    console.log('data', data);
    data.sort(function(a, b) {
        return a.label.toUpperCase().localeCompare(b.label.toUpperCase());
    })

    console.log('f_data', data);

    return data;
}

function SetSliderRange(timelineList) {
    var dateList = timelineList.map(function(v, i) {
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

var changeResult = function(data) {
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
            $.each(formattedData, function(key, val) {
                html += '<a href="javascript:void" class="drop-box" data-val="' + val.label + '"> <i class="fas fa-circle" style="color:' + val.data[0].color + '"></i> ' + val.label + '</a>';
            });
        }
    } else if (breakdownValue == "2") {
        formattedData = FormatTimeLineData(teamListObject);
        if (formattedData) {
            $.each(formattedData, function(key, val) {
                val.data[0].color = "#f88317";
                html += '<a href="javascript:void" class="drop-box" data-val="' + val.label + '"> <i class="fas fa-circle" style="color:#f88317"></i> ' + val.label + '</a>';
            });
        }
    } else if (breakdownValue == "3") {
        formattedData = FormatTimeLineData(localCodeListObject);
        if (formattedData) {
            $.each(formattedData, function(key, val) {
                val.data[0].color = "#f88317";
                html += '<a href="javascript:void" class="drop-box" data-val="' + val.label + '"> <i class="fas fa-circle" style="color:#f88317"></i> ' + val.label + '</a>';
            });
        }
    } else {
        formattedData = FormatTimeLineData(timelineListObj);
        if (formattedData) {
            $.each(formattedData, function(key, val) {
                html += '<a href="javascript:void" class="drop-box" data-val="' + val.label + '"> <i class="fas fa-circle" style="color:' + val.color + '"></i> ' + val.label + '</a>';
            });
        }
    }

    if (isChangeHtml) {
        $('#divSearchPanel').html(html);
        isImgClick = false;
        imgFilterId = '';
        $("#iconList").find(".active").removeClass("active");
    }

    bindChartData(formattedData);
    return formattedData;
}

var isClearClick = false;
var filterId = '';
$('body').on('click', 'a.drop-box', function() {
    $("#divSearchPanel").find(".active").removeClass("active");
    if (isClearClick && filterId == $(this).attr("data-val")) {
        isClearClick = false;
        var formattedData = FormatDataByBreakDown(false);
        bindChartData(formattedData);
        $("#lblFilter").text("");
    } else {
        isClearClick = true;
        filterId = $(this).attr("data-val");
        $(this).addClass("active");

        var formattedData = FormatDataByBreakDown(false);
        formattedData = formattedData.filter(f => f.label === filterId);
        bindChartData(formattedData);
        $("#lblFilter").text(filterId);
    }
    isImgClick = false;
    imgFilterId = '';
    $("#iconList").find(".active").removeClass("active");
});


var isImgClick = false;
var imgFilterId = '';
$('body').on('click', 'a.icon-box', function() {
    $("#iconList").find(".active").removeClass("active");
    if (isImgClick && imgFilterId == $(this).attr("data-val")) {
        isImgClick = false;
        var formattedData = FormatDataByBreakDown(false);
        bindChartData(formattedData);
    } else {
        isImgClick = true;
        imgFilterId = $(this).attr("data-val");
        $(this).addClass("active");

        var formattedData = FormatDataByBreakDown(false);
        debugger
        var filteredData = formattedData;
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
        }
        // formattedData = formattedData.filter(f => f.label === imgFilterId);
        bindChartData(filteredData);
    }

    isClearClick = false;
    filterId = '';
    $("#divSearchPanel").find(".active").removeClass("active");
});

function serchExplore() {
    var value = $('#txtSearch').val().toLowerCase();
    $("#divSearchPanel .drop-box").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
}
$('#txtSearch').keyup(function(e) {
    if (e.keyCode != 13) {
        serchExplore();
    }
});

$('body').on('click', 'image.dot', function(e) {
    debugger
    var data = $(e.currentTarget).attr('dataVal');
    if (data) {
        var data = JSON.parse(data);
        var dataVal = data.data;
        dataVal = JSON.parse(dataVal);
        console.log(dataVal);

        $('#timeLineModal').modal('show');

        if (data) {
            $("#img-Icon").attr("src", data.image);
            $("#channelName").text(dataVal.ChannelName);
            $("#teamName").text(dataVal.TeamName);
            $("#localCode").text(dataVal.LocaleCode);
            $("#typeValue").text(data.imageType);
        }

    }
});