var { getUsersById } = require(__dirname + '\\server\\controllers\\user_controller.js');
/*======height======*/




$(document).ready(function () {
  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
  });
  $("#hide-home").click(function () {
    $("#main-side").toggle(350);
  });

  $("#hide-filter").click(function () {
    $("#main-side").toggle(350);
  });
  // $("#demo-one").click(function(){
  //   $(".main-sidebar").toggle();
  // });

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


const SessionManager = {
  'UserId': '',
  'FirstName': '',
  'LastName': '',
  'EmailId': '',
  'Photo': '',
  'Domain': '',
  'CreatedBy': '',
  'CreatedDate': '',
  'UpdatedBy': '',
  'UpdatedDate': '',
  'IsActive': '',
  'RoleId': '',
  'IsAdmin': false
}
getUsersById(parseInt(localStorage.getItem("UserId"))
).then(data => {
  if (data == undefined) {
    return false;
  }
  SessionManager.UserId = data[0].UserId;
  SessionManager.RoleId = data[0].RoleId;
  SessionManager.EmailId = data[0].EmailId;
  SessionManager.FirstName = data[0].FirstName;
  SessionManager.LastName = data[0].LastName;
  if (SessionManager.RoleId == 1) {
    SessionManager.IsAdmin = true;
  }
}).catch(err => {
  console.error(err);
});
