'use strict';

function Route(settings) {
    //Init view Element
    var hashtag = getHashTag();
    this.viewElements = '';
    this.linkClicked = false;
    this.views = settings || {};
    if (settings!==undefined){
        this.currentState = this.defaultState = settings.defaultView.view;
        if (!!hashtag){
            this.currentState = hashtag;
        }
        this.init(settings);
    }
};

Route.prototype.init = function(views) {
    if (!views) {
        console.error("Route Init function views parameter is undefined");
    }
    else if (window.jQuery) {
        // replaces the existing and adds the new
        this.views = $.extend(true, this.views, views);
        this.compile(document.body); // adds Route-views attr
        this.watch();
        this.loadPage();
        this.watchHashChange();
    }
    else {
        console.error("RouteJS Requires jQuery");
    }
};

Route.prototype.compile = function(element) {
    this.viewElements = $("[route-views]");
};

Route.prototype.clear = function(element) {
    this.viewElements.each(function(){
        $(this).html("");
    });
};

Route.prototype.watch = function() {
    var that = this;

    //Checking if an a element is clicked
    $("body").delegate("a[route-href]", "click", function() {
        //setting url hashtag
        window.location.hash = $(this).attr("route-href");
        var newState = getHashTag();
        if (that.currentState === newState){
            return;
        }

        that.linkClicked = true;

        var newSettings = that.views[newState];
        if (!!newSettings){
            that.currentState = newState;
        }

        if (!("onhashchange" in window)) {
            that.loadPage();
        }

        return false;
    });
};

Route.prototype.watchHashChange = function(){
  var that = this;

  if (!("onhashchange" in window)) {
    console.warn("This browser does not support the hashchange event!")
  }
  else {
    window.onhashchange = function(){
      if(!that.linkClicked){
        that.currentState = location.hash.substring(1);
        that.loadPage();
      }
      else{
        that.loadPage();
      }
      that.linkClicked = false;
    }
  }

}


Route.prototype.loadPage = function() {
    // this.clear();
    var settings = this.views[this.currentState];
    if (!settings){
        settings = this.views[this.defaultState];
    }
    settings.forEach(loadPiece);
};

var getHashTag = function(){
    return window.location.hash.substring(1);
};
var loadPiece = function(data) {
    var element = $(data.selector)
    if (!element.length) {
        console.warn("selector not found:", data.selector);
        return;
    }
    if (!!data.hidden){
        element.css("display", "none");
        return;
    } else {
        element.css("display", "block");
        if (!data.templateUrl){
            return;
        }
    }

    if (element.attr("content") === data.templateUrl){
        console.log("content already preasent:",data.templateUrl);
        data.callback && data.callback();
        data.components && data.components.forEach(loadPiece);
        return;
    }
    element.attr("content",data.templateUrl);
    element.load(data.templateUrl, "", function(){
        data.callback && data.callback();
        data.components && data.components.forEach(loadPiece);
    });
};
