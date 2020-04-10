'use strict';
$( document ).ready(function() {
    $('#modelFilterResult').modal('show');
    $("#btnfilterResult").click(function(){
        $('#modelFilterResult').modal('hide');
        $('#modeFitlerScratch').modal('show');
    });
    $("#btnBackFilterHome").click(function(){
        $('#modelFilterResult').modal('hide');
        $('#myModal').modal('show');
    });

});