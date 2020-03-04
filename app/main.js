$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});



function openSearch() {
    document.getElementById("myOverlay").style.display = "block";
  }
  
  function closeSearch() {
    document.getElementById("myOverlay").style.display = "none";
  }




  $(document).ready(function(){
    $("#hide-home").click(function(){
      $("#main-side").toggle(350);
    });
  });


  $(document).ready(function(){
    $("#hide-filter").click(function(){
      $("#main-side").toggle(350);
    });
  });