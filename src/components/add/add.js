'use strict';
var { getUsers } = require(__dirname + '\\server\\controllers\\user_controller.js');
var { getTeamsList } = require(__dirname + '\\server\\controllers\\teams_controller.js');
var { getDatasource } = require(__dirname + '\\server\\controllers\\datasource_controller.js');
var { getChannels } = require(__dirname + '\\server\\controllers\\channels_controller.js');
var { getLinks, updateLinksbyid, addLinks } = require(__dirname + '\\server\\controllers\\links_controller.js');
var { getDatacategory } = require(__dirname + '\\server\\controllers\\datacategory_controller.js');
var { addNodes, updateNodesbyid, getNodes } = require(__dirname + '\\server\\controllers\\nodes_controller.js');
var { addAnalysis, updateAnalysisbyid } = require(__dirname + '\\server\\controllers\\analysis_controller.js');
var { getLocales } = require(__dirname + '\\server\\controllers\\locales_controller.js');
var { addTests, updateTestsbyid } = require(__dirname + '\\server\\controllers\\tests_controller.js');
document.getElementById("loader").style.display = "none";

function allPageRefresh() {
    //add data point all value null
    $("#description").val("");
    $("#selectOwner").val("0");
    $('input[name="rBtndatacategory"]').prop('checked', false);
   
    //add Data Link all value null
    $("#linkdesc").val("");
    $("#DataLinkUserSelect").val("0");
    $("#DataLinkTeamSelect").val("0");
    $("#DataLinkDatasourceSelect").val("0");
    $("#datalinkLocation").val("");
    $("#DataLinkChannelsSelect").val("0");
    $("#DataLinkToSelect").val("0");
    $("#DataLinkFromSelect").val("0");
    $('input[name="ConfluenceNo"]').prop('checked', false);
    $("#ConfluenceNo").attr('checked', 'checked');
    //add Analysis all value null
    $("#analysisDescription").val("");
    $("#analysisUserSelect").val("0");
    $("#analysisTeamSelectt").val("0");
    $("#analysisChannelsSelect").val("0");
    $("#analysisLocalesSelect").val("0");
    $("#analysisDate").val("");
    $('input[name="rBtnConfluence"]').prop('checked', false);
    $("#rBtnConfluenceNO").attr('checked', 'checked');
    //add Test all value null
    $("#testDescription").val("");
    $('input[name="didTestWin"]').prop('checked', false);
    $("#didTestWinNO").attr('checked', 'checked');
    $("#testUserSelect").val("0");
    $("#testTeamSelect").val("0");
    $("#testChannelsSelect").val("0");
    $("#testLocalesSelect").val("0");
    $("#testDate").val("");
    $('input[name="testConfluence"]').prop('checked', false);
    $("#testConfluenceNO").attr('checked', 'checked');
    //remove nodeId in localstorage
    localStorage.removeItem("nodeId");


    $('#addDataPointdiv').removeClass('d-none');
    $('#dataLinkBlock').addClass('d-none');
    $('#analysisBlock').addClass('d-none');
    $('#testBlock').addClass('d-none');
}



// Get Users List
getUsers().then(data => {
    var model = {
        items: data
    }
    if (model.items && model.items.length > 0) {
        $("#DataLinkUserSelect").html("");
        $("#analysisUserSelect").html("");
        $("#testUserSelect").html("");
        var html = '<option value=' + 0 + '>Select Owner</option>';
        for (var u = 0; u < model.items.length; u++) {
            var UserData = model.items[u];
            var Name = UserData.FirstName + " " + UserData.LastName;
            if (html) {
                html += '<option value=' + UserData.UserId + '>' + Name + '</option>';
            } else {
                html = '<option value=' + UserData.UserId + '>' + Name + '</option>';
            }
        }
        $("#DataLinkUserSelect").html(html);
        $("#analysisUserSelect").html(html);
        $("#testUserSelect").html(html);
        $(".ownerId").html("");
        $(".ownerId").append(html);
    }
}).catch(err => {
    console.error(err);
});

// Get Team List
getTeamsList().then(data => {
    var model = {
        items: data
    }
    if (model.items && model.items.length > 0) {
        $("#DataLinkTeamSelect").html("");
        $("#analysisTeamSelect").html("");
        $("#testTeamSelect").html("");
        var html = '<option value=' + 0 + '>Select Teams</option>';
        for (var u = 0; u < model.items.length; u++) {
            var TeamData = model.items[u];
            var Name = TeamData.TeamName;
            if (html) {
                html += '<option value=' + TeamData.TeamId + '>' + Name + '</option>';
            } else {
                html = '<option value=' + TeamData.TeamId + '>' + Name + '</option>';
            }
        }
        $("#DataLinkTeamSelect").html(html);
        $("#analysisTeamSelect").html(html);
        $("#testTeamSelect").html(html);
    }
}).catch(err => {
    console.error(err);
});

// Get Datasource List
getDatasource().then(data => {
    var model = {
        items: data
    }
    if (model.items && model.items.length > 0) {
        $("#DataLinkDatasourceSelect").html("");
        var html = '<option value=' + 0 + '>Select Data Source</option>';
        for (var u = 0; u < model.items.length; u++) {
            var Datasource = model.items[u];
            var Name = Datasource.Name;
            if (html) {
                html += '<option value=' + Datasource.Id + '>' + Name + '</option>';
            } else {
                html = '<option value=' + Datasource.Id + '>' + Name + '</option>';
            }
        }
        $("#DataLinkDatasourceSelect").html(html);
    }
}).catch(err => {
    console.error(err);
});

// Get Channels List
getChannels().then(data => {
    var model = {
        items: data
    }
    if (model.items && model.items.length > 0) {
        $("#DataLinkChannelsSelect").html("");
        $("#analysisChannelsSelect").html("");
        $("#testChannelsSelect").html("");
        var html = '<option value=' + 0 + '>Select Channels</option>';
        for (var u = 0; u < model.items.length; u++) {
            var Channels = model.items[u];
            var Name = Channels.Name;
            if (html) {
                html += '<option value=' + Channels.Id + '>' + Name + '</option>';
            } else {
                html = '<option value=' + Channels.Id + '>' + Name + '</option>';
            }
        }
        $("#DataLinkChannelsSelect").html(html);
        $("#analysisChannelsSelect").html(html);
        $("#testChannelsSelect").html(html);
    }
}).catch(err => {
    console.error(err);
});

// Get Links To List
getNodes().then(data => {
    var model = {
        items: data
    }
    if (model.items && model.items.length > 0) {
        $("#DataLinkToSelect").html("");
        $("#DataLinkFromSelect").html("");
        var html = '<option value=' + 0 + '>None</option>';
        for (var u = 0; u < model.items.length; u++) {
            var LinksTo = model.items[u];
            var Name = LinksTo.Description;
            if (html) {
                html += '<option value=' + LinksTo.Id + '>' + Name + '</option>';
            } else {
                html = '<option value=' + LinksTo.Id + '>' + Name + '</option>';
            }
        }
        $("#DataLinkToSelect").html(html);
        $("#DataLinkFromSelect").html(html);
    }
}).catch(err => {
    console.error(err);
});

getLocales().then(data => {
    var model = {
        items: data
    }
    if (model.items && model.items.length > 0) {
        $("#analysisLocalesSelect").html("");
        $("#testLocalesSelect").html("");
        var html = '<option value=' + 0 + '>Select Locale</option>';
        for (var u = 0; u < model.items.length; u++) {
            var Locales = model.items[u];
            var Name = Locales.Name;
            if (html) {
                html += '<option value=' + Locales.Id + '>' + Name + '</option>';
            } else {
                html = '<option value=' + Locales.Id + '>' + Name + '</option>';
            }
        }
        $("#analysisLocalesSelect").html(html);
        $("#testLocalesSelect").html(html);
    }
}).catch(err => {
    console.error(err);
});




getDatacategory().then(data => {
    var datacategoryList = "";
    var model = {
        items: data
    }
    if (model.items && model.items.length > 0) {
        for (var i = 0; i < model.items.length; i++) {
            datacategoryList += '<div class="form-check" >' +
                '<label class="form-check-label" >' + model.items[i].Name +
                '<input type="radio" class="form-check-input radioBtnClass"  name="rBtndatacategory"  value="' + model.items[i].Id + '"/>' +
                '</label><br/>' +
                '</div>';
        }
        $(".dataCategoryList").html("");
        $(".dataCategoryList").append(datacategoryList);
    }


}).catch(err => {
    console.error(err);
});

$.validator.addMethod("valueNotEquals", function (value, element, arg) {
    return arg !== value;
}, "Value must not equal arg.");

$("#addDataPoint").validate({
    ignore: [],
    rules: {
        description: 'required',
        listOwner: { valueNotEquals: "0" },
        rBtndatacategory: 'required'
    },
    messages: {

        emailId: 'This field is required',
        listOwner: { valueNotEquals: "Please select an Owner!" },
        rBtndatacategory: 'This field is required'
    },
    errorPlacement: function (error, element) {
        if (element.attr("name") == "rBtndatacategory") {
            error.insertAfter(element.parent().parent().parent());
        }
        else
            error.insertAfter(element);

    }

});


//Add Point data form in publish button click event 

$("#btnPublish").click(function () {
    var addDataPointdetails = $('form[id="addDataPoint"]').valid();
    if (addDataPointdetails == true) {
        if ($("#hdnNodeId").val() != 0 || $("#hdnNodeId").val() != "") {
            updateNodesbyid($("#hdnNodeId").val(), {
                Description: $("#description").val(),
                Owner: $("#selectOwner").val(),
                DataCategoryId: $("input[type='radio'].radioBtnClass:checked").val(),
                CreatedBy: parseInt(localStorage.getItem("UserId")),
                CreatedDate: new Date()
            }).then(data => {
                $.toast({
                    text: "Data Point details updated Successfully.", // Text that is to be shown in the toast
                    heading: 'Success Message', // Optional heading to be shown on the toast
                    icon: 'success', // Type of toast icon
                    showHideTransition: 'fade', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#9EC600',  // Background color of the toast loader
                    beforeShow: function () { }, // will be triggered before the toast is shown
                    afterShown: function () { }, // will be triggered after the toat has been shown
                    beforeHide: function () { }, // will be triggered before the toast gets hidden
                    afterHidden: function () { }  // will be triggered after the toast has been hidden
                });
                if ($("input[type='radio'].radioBtnClass").is(':checked')) {
                    var radioBtnClass_type = $("input[type='radio'].radioBtnClass:checked").val();
                    if (radioBtnClass_type == "1") {
                        $('#addDataPointdiv').addClass('d-none');
                        $('#dataLinkBlock').removeClass('d-none');
                    }
                    else if (radioBtnClass_type == "2") {
                        $('#addDataPointdiv').addClass('d-none');
                        $('#analysisBlock').removeClass('d-none');
                    }
                    else {
                        $('#addDataPointdiv').addClass('d-none');
                        $('#testBlock').removeClass('d-none');
                    }
                }
            })
                .catch(err => {
                    console.error(err);
                });
        }
        else {
            addNodes(
                {
                    Description: $("#description").val(),
                    Owner: $("#selectOwner").val(),
                    DataCategoryId: $("input[type='radio'].radioBtnClass:checked").val(),
                    CreatedBy: parseInt(localStorage.getItem("UserId")),
                    CreatedDate: new Date()
                }
            ).then(data => {
                localStorage.setItem("nodeId", data[0]);
                $.toast({
                    text: "Data Point details save Successfully.", // Text that is to be shown in the toast
                    heading: 'Success Message', // Optional heading to be shown on the toast
                    icon: 'success', // Type of toast icon
                    showHideTransition: 'fade', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#9EC600',  // Background color of the toast loader
                    beforeShow: function () { }, // will be triggered before the toast is shown
                    afterShown: function () { }, // will be triggered after the toat has been shown
                    beforeHide: function () { }, // will be triggered before the toast gets hidden
                    afterHidden: function () { }  // will be triggered after the toast has been hidden
                });
                if ($("input[type='radio'].radioBtnClass").is(':checked')) {
                    var radioBtnClass_type = $("input[type='radio'].radioBtnClass:checked").val();
                    if (radioBtnClass_type == "1") {
                        $('#addDataPointdiv').addClass('d-none');
                        $('#dataLinkBlock').removeClass('d-none');
                    }
                    else if (radioBtnClass_type == "2") {
                        $('#addDataPointdiv').addClass('d-none');
                        $('#analysisBlock').removeClass('d-none');
                    }
                    else {
                        $('#addDataPointdiv').addClass('d-none');
                        $('#testBlock').removeClass('d-none');
                    }
                }
                // $("#description").val("");
                // $("#selectOwner").val("default");
                // $('input[name="rBtndatacategory"]').prop('checked', false);
            }).catch(err => {
                console.error(err);
            });
        }
    }
});

//Add Link form in Previous button click event 
$("#btnPreviousDataLinkBlock").click(function () {

    $('#addDataPointdiv').removeClass('d-none');
    $('#dataLinkBlock').addClass('d-none');
    $("#hdnNodeId").val(parseInt(localStorage.getItem("nodeId")));

});

//Add Analysis form in Previous button click event 
$("#btnPreviousAnalysisBlock").click(function () {

    $('#addDataPointdiv').removeClass('d-none');
    $('#analysisBlock').addClass('d-none');
    $("#hdnNodeId").val(parseInt(localStorage.getItem("nodeId")));
});


//Add Test form in Previous button click event 
$("#btnPreviousTestBlock").click(function () {

    $('#addDataPointdiv').removeClass('d-none');
    $('#testBlock').addClass('d-none');
    $("#hdnNodeId").val(parseInt(localStorage.getItem("nodeId")));
});

// Data Link Form
$("#addDataLinkForm").validate({
    ignore: [],
    rules: {
        linkdesc: { required: true },
        DataLinkUserSelect: { valueNotEquals: "0" },
        DataLinkTeamSelect: { valueNotEquals: "0" },
        DataLinkDatasourceSelect: { valueNotEquals: "0" },
        datalinkLocation: { required: true },
        DataLinkChannelsSelect: { valueNotEquals: "0" },
    },
    messages: {
        linkdesc: {
            required: "This field is required"
        },
        DataLinkUserSelect: {
            valueNotEquals: "Please select one owner"
        },
        DataLinkTeamSelect: {
            valueNotEquals: "Please select one Team"
        },
        DataLinkDatasourceSelect: {
            valueNotEquals: "Please select one data source"
        },
        datalinkLocation: {
            required: "This field is required"
        },
        DataLinkChannelsSelect: {
            valueNotEquals: "Please select one chanels"
        }
    },
});

$("#btnDataLink").click(function () {
    document.getElementById("loader").style.display = "block";
    var addDataLinkdetails = $('form[id="addDataLinkForm"]').valid();
    setTimeout(showPage, 500);
    if (addDataLinkdetails == true) {
        if ($("#hdnDataLinkId").val() != 0 || $("#hdnDataLinkId").val() != "") {
            updateLinksbyid($("#hdnDataLinkId").val(), {
                'Description': $("#linkdesc").val(),
                'Owner': parseInt($("#DataLinkUserSelect").val()),
                'TeamId': parseInt($("#DataLinkTeamSelect").val()),
                'DataSourceId': parseInt($("#DataLinkDatasourceSelect").val()),
                'Location': $("#datalinkLocation").val(),
                'ChannelId': parseInt($("#DataLinkChannelsSelect").val()),
                'LinksTo': parseInt($("#DataLinkToSelect").val()),
                'LinksFrom': parseInt($("#DataLinkFromSelect").val()),
                'IsConfluencePage': $("input[name='Confluence']:checked").val() == 1 ? true : false,
                'NodeId': parseInt(localStorage.getItem("nodeId")),
                'CreatedBy': parseInt(localStorage.getItem("UserId")),
                'CreatedDate': new Date()
            }).then(data => {
                $.toast({
                    text: "Data Link updated Successfully.", // Text that is to be shown in the toast
                    heading: 'Success Message', // Optional heading to be shown on the toast
                    icon: 'success', // Type of toast icon
                    showHideTransition: 'fade', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#9EC600',  // Background color of the toast loader
                    beforeShow: function () { }, // will be triggered before the toast is shown
                    afterShown: function () { }, // will be triggered after the toat has been shown
                    beforeHide: function () { }, // will be triggered before the toast gets hidden
                    afterHidden: function () { }  // will be triggered after the toast has been hidden
                });
            }).catch(err => {
                console.error(err);
            });
        }
        else {
            addLinks(
                {
                    'Description': $("#linkdesc").val(),
                    'Owner': parseInt($("#DataLinkUserSelect").val()),
                    'TeamId': parseInt($("#DataLinkTeamSelect").val()),
                    'DataSourceId': parseInt($("#DataLinkDatasourceSelect").val()),
                    'Location': $("#datalinkLocation").val(),
                    'ChannelId': parseInt($("#DataLinkChannelsSelect").val()),
                    'LinksTo': parseInt($("#DataLinkToSelect").val()),
                    'LinksFrom': parseInt($("#DataLinkFromSelect").val()),
                    'IsConfluencePage': $("input[name='Confluence']:checked").val() == 1 ? true : false,
                    'NodeId': parseInt(localStorage.getItem("nodeId")),
                    'CreatedBy': parseInt(localStorage.getItem("UserId")),
                    'CreatedDate': new Date()
                }
            ).then(data => {
                $.toast({
                    text: "Data Link save Successfully.", // Text that is to be shown in the toast
                    heading: 'Success Message', // Optional heading to be shown on the toast
                    icon: 'success', // Type of toast icon
                    showHideTransition: 'fade', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#9EC600',  // Background color of the toast loader
                    beforeShow: function () { }, // will be triggered before the toast is shown
                    afterShown: function () { }, // will be triggered after the toat has been shown
                    beforeHide: function () { }, // will be triggered before the toast gets hidden
                    afterHidden: function () { }  // will be triggered after the toast has been hidden
                });
                allPageRefresh();
            }).catch(err => {
                console.error(err);
            });
        }
    };
});

// Loader
function showPage() {
    document.getElementById("loader").style.display = "none";
}

// Analysis Form

$("#addAnalysisForm").validate({
    ignore: [],
    rules: {
        analysisDescription: { required: true },
        analysisUserSelect: { valueNotEquals: "0" },
        analysisTeamSelect: { valueNotEquals: "0" },
        analysisChannelsSelect: { valueNotEquals: "0" },
        analysisLocalesSelect: { valueNotEquals: "0" },
        analysisDate: { required: true }
    },
    messages: {
        analysisDescription: {
            required: "This field is required"
        },
        analysisUserSelect: {
            valueNotEquals: "Please select one owner"
        },
        analysisTeamSelect: {
            valueNotEquals: "Please select one Team"
        },
        analysisChannelsSelect: {
            valueNotEquals: "Please select one Channel"
        },
        analysisLocalesSelect: {
            valueNotEquals: "Please select one Locale"
        },
        analysisDate: {
            required: "This field is required"
        }
    },
});


$("#btnAnalysis").click(function () {
    document.getElementById("loader").style.display = "block";
    var addAnalysisFormDetails = $('form[id="addAnalysisForm"]').valid();
    setTimeout(showPage, 500);
    if (addAnalysisFormDetails == true) {
        if ($("#hdnAnalysisId").val() != 0 || $("#hdnAnalysisId").val() != "") {
            updateAnalysisbyid($("#hdnAnalysisId").val(), {
                'Owener': parseInt($("#analysisUserSelect").val()),
                'TeamId': parseInt($("#analysisTeamSelect").val()),
                'ChannelId': parseInt($("#analysisChannelsSelect").val()),
                'LocaleId': parseInt($("#analysisLocalesSelect").val()),
                'AnalysisDate': $("#analysisDate").val(),
                'IsConfluencePage': $("input[name='rBtnConfluence']:checked").val() == 1 ? true : false,
                'CreatedBy': parseInt(localStorage.getItem("UserId")),
                'CreateDate': new Date(),
                'NodeId': parseInt(localStorage.getItem("nodeId")),
                'Description': $("#analysisDescription").val()
            }).then(data => {
                $.toast({
                    text: "Analysis updated Successfully.", // Text that is to be shown in the toast
                    heading: 'Success Message', // Optional heading to be shown on the toast
                    icon: 'success', // Type of toast icon
                    showHideTransition: 'fade', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#9EC600',  // Background color of the toast loader
                    beforeShow: function () { }, // will be triggered before the toast is shown
                    afterShown: function () { }, // will be triggered after the toat has been shown
                    beforeHide: function () { }, // will be triggered before the toast gets hidden
                    afterHidden: function () { }  // will be triggered after the toast has been hidden
                });
            }).catch(err => {
                console.error(err);
            });
        }
        else {
            addAnalysis(
                {
                    'Owener': parseInt($("#analysisUserSelect").val()),
                    'TeamId': parseInt($("#analysisTeamSelect").val()),
                    'ChannelId': parseInt($("#analysisChannelsSelect").val()),
                    'LocaleId': parseInt($("#analysisLocalesSelect").val()),
                    'AnalysisDate': $("#analysisDate").val(),
                    'IsConfluencePage': $("input[name='rBtnConfluence']:checked").val() == 1 ? true : false,
                    'CreatedBy': parseInt(localStorage.getItem("UserId")),
                    'CreateDate': new Date(),
                    'NodeId': parseInt(localStorage.getItem("nodeId")),
                    'Description': $("#analysisDescription").val()
                }
            ).then(data => {
                $.toast({
                    text: "Analysis save Successfully.", // Text that is to be shown in the toast
                    heading: 'Success Message', // Optional heading to be shown on the toast
                    icon: 'success', // Type of toast icon
                    showHideTransition: 'fade', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#9EC600',  // Background color of the toast loader
                    beforeShow: function () { }, // will be triggered before the toast is shown
                    afterShown: function () { }, // will be triggered after the toat has been shown
                    beforeHide: function () { }, // will be triggered before the toast gets hidden
                    afterHidden: function () { }  // will be triggered after the toast has been hidden
                });
                allPageRefresh();
            }).catch(err => {
                console.error(err);
            });
        }
    }
});


// Test Form


$("#addTestForm").validate({
    ignore: [],
    rules: {
        testDescription: { required: true },
        testUserSelect: { valueNotEquals: "0" },
        testTeamSelect: { valueNotEquals: "0" },
        testChannelsSelect: { valueNotEquals: "0" },
        testLocalesSelect: { valueNotEquals: "0" },
        testDate: { required: true }
    },
    messages: {
        analysisDescription: {
            required: "This field is required"
        },
        testUserSelect: {
            valueNotEquals: "Please select one owner"
        },
        testTeamSelect: {
            valueNotEquals: "Please select one Team"
        },
        testChannelsSelect: {
            valueNotEquals: "Please select one Channel"
        },
        testLocalesSelect: {
            valueNotEquals: "Please select one Locale"
        },
        testDate: {
            required: "This field is required"
        },

    },
});


$("#btnTest").click(function () {
    document.getElementById("loader").style.display = "block";
    var addTestFormDetails = $('form[id="addTestForm"]').valid();
    setTimeout(showPage, 500);
    if (addTestFormDetails == true) {
        if ($("#hdnTestId").val() != 0 || $("#hdnTestId").val() != "") {
            updateTestsbyid($("#hdnAnalysisId").val(), {
                'Description': $("#testDescription").val(),
                'IsDidTestWin': $("input[name='didTestWin']:checked").val() == 1 ? true : false,
                'Owner': parseInt($("#testUserSelect").val()),
                'TeamId': parseInt($("#testTeamSelect").val()),
                'ChannelId': parseInt($("#testChannelsSelect").val()),
                'LocaleId': parseInt($("#testLocalesSelect").val()),
                'TestsDate': $("#testDate").val(),
                'IsConfluencePage': $("input[name='testConfluence']:checked").val() == 1 ? true : false,
                'CreatedBy': parseInt(localStorage.getItem("UserId")),
                'CreatedDate': new Date(),
                'NodeId': parseInt(localStorage.getItem("nodeId")),

            }).then(data => {
                $.toast({
                    text: "Test updated Successfully.", // Text that is to be shown in the toast
                    heading: 'Success Message', // Optional heading to be shown on the toast
                    icon: 'success', // Type of toast icon
                    showHideTransition: 'fade', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#9EC600',  // Background color of the toast loader
                    beforeShow: function () { }, // will be triggered before the toast is shown
                    afterShown: function () { }, // will be triggered after the toat has been shown
                    beforeHide: function () { }, // will be triggered before the toast gets hidden
                    afterHidden: function () { }  // will be triggered after the toast has been hidden
                });
            }).catch(err => {
                console.error(err);
            });
        }
        else {
            debugger
            addTests(
                {
                    'Description': $("#testDescription").val(),
                    'IsDidTestWin': $("input[name='didTestWin']:checked").val() == 1 ? true : false,
                    'Owner': parseInt($("#testUserSelect").val()),
                    'TeamId': parseInt($("#testTeamSelect").val()),
                    'ChannelId': parseInt($("#testChannelsSelect").val()),
                    'LocaleId': parseInt($("#testLocalesSelect").val()),
                    'TestsDate': $("#testDate").val(),
                    'IsConfluencePage': $("input[name='testConfluence']:checked").val() == 1 ? true : false,
                    'CreatedBy': parseInt(localStorage.getItem("UserId")),
                    'CreatedDate': new Date(),
                    'NodeId': parseInt(localStorage.getItem("nodeId"))
                }
            ).then(data => {
                $.toast({
                    text: "Test save Successfully.", // Text that is to be shown in the toast
                    heading: 'Success Message', // Optional heading to be shown on the toast
                    icon: 'success', // Type of toast icon
                    showHideTransition: 'fade', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left',  // Text alignment i.e. left, right or center
                    loader: false,  // Whether to show loader or not. True by default
                    loaderBg: '#9EC600',  // Background color of the toast loader
                    beforeShow: function () { }, // will be triggered before the toast is shown
                    afterShown: function () { }, // will be triggered after the toat has been shown
                    beforeHide: function () { }, // will be triggered before the toast gets hidden
                    afterHidden: function () { }  // will be triggered after the toast has been hidden
                });
                allPageRefresh();
            }).catch(err => {
                console.error(err);
            });
        }
    }
});