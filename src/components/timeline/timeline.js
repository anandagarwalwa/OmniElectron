var d3 = require('d3v3');
//  var TimelineChart = require('timeline-chart');
var { getTimelineChartData } = require(__dirname + '\\server\\controllers\\tests_controller.js');
document.getElementById("loader").style.display = "none";

$('#sidebarCollapse').on('click', function () {
  $('#sidebar').toggleClass('active');
});
$("#hide-home").click(function () {
  $("#main-side").toggle(350);
});

$("#hide-filter").click(function () {
  $("#main-side").toggle(350);
});

$('#demo-one').on('click', function () {
  //$(".main-sidebar").toggle();
  //$(".main-sidebar").attr("style","display:block !important");
  if ($(".main-sidebar").hasClass("displayBlock")) {
    $(".main-sidebar").removeClass("displayBlock");
    $(".main-sidebar").addClass("displayNone");
  }
  else {
    $(".main-sidebar").removeClass("displayNone");
    $(".main-sidebar").addClass("displayBlock");
  }
});
var selector = "#sidebar li";
$(selector).on("click", function () {
  $(selector).removeClass("active");
  $(this).addClass("active");
});

var lang = "en-US";
var year = 2018;

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

$("#demo_1").ionRangeSlider({
  skin: "flat",
  type: "double",
  grid: true,
  min: dateToTS(new Date(year, 10, 1)),
  max: dateToTS(new Date(year, 11, 1)),
  from: dateToTS(new Date(year, 10, 8)),
  to: dateToTS(new Date(year, 10, 23)),
  prettify: tsToDate
});




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

//newChart();
getTimelineDetails();

var timelineListObj = [];
function getTimelineDetails() {
  var userId = undefined;
    if (!SessionManager.IsAdmin)
        userId = SessionManager.UserId;
  getTimelineChartData(userId).then(data => {
    var dataObj = data[0];
    var imgpath = "";
    for (var i = 0; i < dataObj.length; i++) {
      if (dataObj[i].IsAnalysis == 1) {
        imgpath = __dirname + "\\assets\\images\\analysis_2.png";
      }
      if (dataObj[i].IsAnalysis == 0) {
        if (dataObj[i].IsAnalysis.IsDidTestWin) {
          imgpath = __dirname + "\\assets\\images\\test_win_2.png";
        } else {
          imgpath = __dirname + "\\assets\\images\\test_loss_2.png";
        }
      }
      timelineListObj.push({
        label: dataObj[i].ChannelName,
        data: [{
          type: TimelineChart.TYPE.POINT,
          at: dataObj[i].Date,
          image: imgpath
        }]
      })
    }
  }).catch(err => {
    console.error(err);
  });
}

function bindChartData(data) {
  var element = document.getElementById('timeline6');
  // var data = [
  //   {
  //     label: 'Email',
  //     data: [{
  //       type: TimelineChart.TYPE.POINT,
  //       at: new Date([2016, 5, 1]),
  //       image: __dirname + "\\assets\\images\\analysis_2.png"
  //     }, {
  //       type: TimelineChart.TYPE.POINT,
  //       at: new Date([2016, 6, 1]),
  //       image: __dirname + "\\assets\\images\\test_win_2.png"
  //     }, {
  //       type: TimelineChart.TYPE.POINT,
  //       at: new Date([2016, 7, 1]),
  //       image: __dirname + "\\assets\\images\\test_loss_2.png"
  //     }, {
  //       type: TimelineChart.TYPE.POINT,
  //       at: new Date([2016, 8, 1]),
  //       image: __dirname + "\\assets\\images\\test_win_2.png"
  //     }]
  //   },
  //   {
  //     label: 'Search',
  //     data: [{
  //       type: TimelineChart.TYPE.POINT,
  //       at: new Date([2016, 5, 11]),
  //       image: __dirname + "\\assets\\images\\test_loss_2.png"
  //     }, {
  //       type: TimelineChart.TYPE.POINT,
  //       at: new Date([2016, 6, 15]),
  //       image: __dirname + "\\assets\\images\\test_win_2.png"
  //     }, {
  //       type: TimelineChart.TYPE.POINT,
  //       at: new Date([2016, 7, 10]),
  //       image: __dirname + "\\assets\\images\\analysis_2.png"
  //     }]
  //   },
  //   {
  //     label: 'Display',
  //     data: [{
  //       type: TimelineChart.TYPE.POINT,
  //       at: new Date([2016, 5, 1]),
  //       image: __dirname + "\\assets\\images\\analysis_2.png"
  //     }, {
  //       type: TimelineChart.TYPE.POINT,
  //       at: new Date([2016, 6, 1]),
  //       image: __dirname + "\\assets\\images\\test_loss_2.png"
  //     }, {
  //       type: TimelineChart.TYPE.POINT,
  //       at: new Date([2016, 7, 1]),
  //       image: __dirname + "\\assets\\images\\test_win_2.png"
  //     }, {
  //       type: TimelineChart.TYPE.POINT,
  //       at: new Date([2016, 8, 1]),
  //       image: __dirname + "\\assets\\images\\analysis_2.png"
  //     }]
  //   }
  // ];
  var timeline = new TimelineChart(element, data, {
    enableLiveTimer: true,
    tip: function (d) {
      return d.at || `${d.from}<br>${d.to}`;
    }
  }).onVizChange(e => console.log(e));
}
