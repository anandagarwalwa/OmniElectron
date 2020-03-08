
/*======height======*/





$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
    $("#hide-home").click(function(){
      $("#main-side").toggle(350);
    });
    
    $("#hide-filter").click(function(){
      $("#main-side").toggle(350);
    });
    // $("#demo-one").click(function(){
    //   $(".main-sidebar").toggle();
    // });

    $('#demo-one').on('click', function () {
      //$(".main-sidebar").toggle();
      //$(".main-sidebar").attr("style","display:block !important");
      if($(".main-sidebar").hasClass("displayBlock")){
        $(".main-sidebar").removeClass("displayBlock");
        $(".main-sidebar").addClass("displayNone");
      }
      else{
        $(".main-sidebar").removeClass("displayNone");
        $(".main-sidebar").addClass("displayBlock");       
      }
  });

});



function openSearch() {
    document.getElementById("myOverlay").style.display = "block";
  }
  
  function closeSearch() {
    document.getElementById("myOverlay").style.display = "none";
  }
