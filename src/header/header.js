export const header = () => {
    // return '<header class="navigation"> <div class="wrapper"> <nav id="sidebar"> <div class="sidebar-header"> </div><ul class="list-unstyled components"> <li class="active"> <a href="#" id="hide-home"> <i class="fas fa-file-alt"></i> Explore </a><!--<ul class="collapse list-unstyled" id="homeSubmenu"> <li> <a href="#">Home 1</a> </li><li> <a href="#">Home 2</a> </li><li> <a href="#">Home 3</a> </li></ul>--> </li><li> <a href="#"> <i class="fas fa-plus-square"></i> Add </a><!-- <ul class="collapse list-unstyled" id="pageSubmenu"> <li> <a href="#">Page 1</a> </li><li> <a href="#">Page 2</a> </li><li> <a href="#">Page 3</a> </li></ul> --> </li><li> <a href="#"> <i class="fas fa-business-time"></i> Timeline </a> </li><li> <a href="#" id="hide-filter"> <i class="fas fa-filter"></i> Filter </a> </li><li> <a href="#"> <i class="fas fa-users-cog"></i> Activity </a> </li><li class="setting"> <a href="#"> <i class="fas fa-cog"></i> Setting </a> </li></ul> </nav> <div id="content"> <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top"> <div class="container-fluid"> <button type="button" id="sidebarCollapse" class="btn "> <i class="fas fa-align-left"></i> </button> <button class="btn btn-dark d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"> <i class="fas fa-align-justify"></i> </button> <div class="collapse navbar-collapse" id="navbarSupportedContent"> <ul class="nav navbar-nav ml-auto"> <div class="search-main-section"> <div id="myOverlay" class="overlay"> <span class="closebtn" onclick="closeSearch()" title="Close Overlay">×</span> <div class="overlay-content"> <form action="/action_page.php"> <input type="text" placeholder="Search.." name="search"> <button type="submit"><i class="fa fa-search"></i></button> </form> </div></div><button class="openBtn" onclick="openSearch()"><i class="fas fa-search"></i></button> </div><div class="bell-icon-main"> <div class="bell-icon"> <i class="fas fa-bell"></i> </div><div class="badge-section"> <span class="badge badge-danger">2</span> </div></div><div class="pic-font-section"> <div class="text-sention"> <h6>Robbie swaddle</h6> </div><div class="text-pic"> <img src="../src/images/40306.jpg" class="rounded-circle"> </div></div></ul> </div></div></nav> <div class="container-fluid"> <div class="row"> <div class="col-xl-2"> <div class="main-sidebar" id="main-side"> <div class="sidenav"> <div class="search-main"> <form> <input type="text" name="search" placeholder="Search.."> <i class="fas fa-search"></i> </form> </div><a href="#"> <i class="fas fa-circle co-org"></i> Search</a> <a href="#"> <i class="fas fa-circle co-pink"></i> Email</a> <a href="#"> <i class="fas fa-circle co-blue"></i> Display</a> <a href="#"> <i class="fas fa-circle co-green"></i> Tv</a> <a href="#"> <i class="fas fa-circle col-yellow"></i> Other office</a> </div></div></div></div></div></div></div></header>';
    return '<section class="navigation">' +
        '<nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">' +
        '    <div class="container-fluid">' +
        '        <button type="button" id="sidebarCollapse" class="btn ">' +
        '            <i class="fas fa-align-left"></i>' +
        '        </button>' +
        '        <div class="collapse navbar-collapse" id="navbarSupportedContent">' +
        '            <ul class="nav navbar-nav ml-auto">' +
        '                <!---Search-->' +
        '                <div class="search-main-section">' +
        '                    <div id="myOverlay" class="overlay">' +
        '                        <span class="closebtn" onclick="closeSearch()" title="Close Overlay">×</span>' +
        '                        <div class="overlay-content">' +
        '                          <form action="/action_page.php">' +
        '                            <input type="text" placeholder="Search.." name="search">' +
        '                            <button type="submit"><i class="fa fa-search"></i></button>' +
        '                          </form>' +
        '                        </div>' +
        '                      </div>' +
        '                      <button class="openBtn" onclick="openSearch()"><i class="fas fa-search"></i></button>' +
        '                </div>'+    
    '                <!----bell-icon-->'+
    '                <div class="bell-icon-main">'+
    '                    <div class="bell-icon">'+
    '                        <i class="fas fa-bell"></i>'+
    '                    </div>'+
    '                    <div class="badge-section">'+
    '                        <span class="badge badge-danger">2</span>'+
    '                    </div>'+
    '                </div>'+
    '                <!-----Pic-->'+
    '                <div class="pic-font-section">'+
    '                    <div class="text-sention">'+
    '                        <h6>Robbie swaddle</h6>'+
    '                    </div>'+
    '                    <div class="text-pic">'+
    '                        <img src="assets/images/40306.jpg" class="rounded-circle">'+
    '                    </div>'+
    '                </div>'+
    '                <!---Collapse-Btn-->'+
    '                <div class="collapse-btn-hide">'+
    '                    <button type="button" id="demo-one" class="btn">'+
    '                        <i class="fas fa-align-justify text-white"></i>'+
    '                    </button>'+
    '                </div>'+
    '            </ul>'+
    '        </div>'+
    '    </div>'+
    '</nav></section>';
};