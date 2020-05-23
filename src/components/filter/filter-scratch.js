'use strict';
var { addAlertMaster } = require(__dirname + '\\server\\controllers\\alertmaster_controller.js');
var { addLogsDetails }=require(__dirname + '\\server\\controllers\\logsdetails_controller.js');
$(document).ready(function () {
    $('#modeFitlerScratch').modal('hide');
    $("#btnBackFilterResult").click(function () {
        $('#modeFitlerScratch').modal('hide');
        $('#modelFilterResult').modal('show');
    });
    //schedule select view dropdown
    $("#startingList").html("");
    $("#startingList").removeAttr("style");
    $("#daliyList").css("width", "50%");
    $("#daliyList").html('at <input  type="text" id="timepicker" name="timepicker"  class="form-control" />');
    $(function () {
        $('#timepicker').datetimepicker({
            format: 'H:i',
            datepicker: false
        });
    });

    $('#everylist').change(function () {
        var everylist = $("#everylist").val();
        if (everylist == 1) {
            $("#startingList").html("");
            $("#startingList").removeAttr("style");
            $("#daliyList").css("width", "50%");
            $("#daliyList").html('at <input  type="text" id="timepicker" name="timepicker"  class="form-control" />');
            $(function () {
                $('#timepicker').datetimepicker({
                    format: 'H:i',
                    datepicker: false
                });
            });
        }
        else {
            $("#daliyList").html("");
            $("#daliyList").removeAttr("style");
            $("#startingList").css("width", "50%");
            $("#startingList").html('Starting  at <input  type="text" id="datepicker"  name="datepicker" class="form-control" />');
            $(function () {
                $('#datepicker').datetimepicker({
                    format: 'd-m-Y',
                    timepicker: false
                });
            });
        }

    });


    //End  

    //selected radio button view 
    $("#radioSelectedTxtView").html('<div class="form-group">' +
        '<label class="float-left" for="emailTitle">Email Title</label>' +
        '<input type="text" class="form-control form-ip-one col-sm-6 col-md-7 col-lg-7 col-xl-7" id="emailTitle" name="emailTitle">' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="float-left" for="email">Recipients</label>' +
        '<input type="text" class="form-control form-ip-one col-sm-6 col-md-7 col-lg-7 col-xl-7" id="recipients" name="recipients">' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="float-left" for="pwd">EmailBody</label>' +
        '<input type="text" class="form-control form-ip-Two col-sm-6 col-md-7 col-lg-7 col-xl-7" id="emailBody" name="emailBody">' +
        '</div>');
    $('input[type=radio]').on('change', function () {
        var radioBtnValue = $('input[name=notificationOptRadio]:checked').val();
        if (radioBtnValue == "Email") {
            $("#radioSelectedTxtView").html("");
            $("#radioSelectedTxtView").html('<div class="form-group">' +
                '<label class="float-left" for="emailTitle">Email Title</label>' +
                '<input type="text" class="form-control form-ip-one col-sm-6 col-md-7 col-lg-7 col-xl-7" id="emailTitle" name="emailTitle">' +
                '</div>' +
                '<div class="form-group">' +
                '<label class="float-left" for="email">Recipients</label>' +
                '<input type="text" class="form-control form-ip-one col-sm-6 col-md-7 col-lg-7 col-xl-7" id="recipients" name="recipients">' +
                '</div>' +
                '<div class="form-group">' +
                '<label class="float-left" for="pwd">EmailBody</label>' +
                '<input type="text" class="form-control form-ip-Two col-sm-6 col-md-7 col-lg-7 col-xl-7" id="emailBody" name="emailBody">' +
                '</div>');
        }
        else {
            $("#radioSelectedTxtView").html("");
            $("#radioSelectedTxtView").html('<div class="form-group">' +
                '<label class="float-left" for="email">Recipients</label>' +
                '<input type="text" class="form-control form-ip-one col-sm-6 col-md-7 col-lg-7 col-xl-7" id="slackRecipients" name="slackRecipients">' +
                '</div>' +
                '<div class="form-group">' +
                '<label class="float-left" for="emailTitle">Channels</label>' +
                '<input type="text" class="form-control form-ip-one col-sm-6 col-md-7 col-lg-7 col-xl-7" id="channels" name="channels">' +
                '</div>' +
                '<div class="form-group">' +
                '<label class="float-left" for="pwd">Message</label>' +
                '<input type="text" class="form-control form-ip-Two col-sm-6 col-md-7 col-lg-7 col-xl-7" id="message" name="message">' +
                '</div>');
        }
    });


    //End

    // var $timeFrame = $(".js-range-slider");
    // var $tFrom = $(".js-input-from"), $tTo = $(".js-input-to"),
    //     instance,
    //     min = 0,
    //     max = 1000;

    // $timeFrame.ionRangeSlider({
    //     skin: "modern",
    //     type: "double",
    //     min: 0,
    //     max: 1000,
    //     from: 200,
    //     to: 500,
    //     grid: false,
    //     onStart: function (data) {
    //         $tFrom.prop("value", data.from);
    //         $tTo.prop("value", data.to);
    //     },
    //     onChange: function (data) {
    //         $tFrom.prop("value", data.from);
    //         $tTo.prop("value", data.to);
    //     }

    // });
    // instance = $timeFrame.data("ionRangeSlider");

    // $tFrom.on("change keyup", function () {
    //     var val = $(this).prop("value");

    //     // validate
    //     if (val < min) {
    //         val = min;
    //     } else if (val > max) {
    //         val = max;
    //     }

    //     instance.update({
    //         from: val
    //     });
    // });


    // $tTo.on("change keyup", function () {
    //     var val = $(this).prop("value");

    //     // validate
    //     if (val < min) {
    //         val = min;
    //     } else if (val > max) {
    //         val = max;
    //     }

    //     instance.update({
    //         to: val
    //     });
    // });

    // var slider = $(".js-range-slider").data("ionRangeSlider");



    //validation 
    $.validator.addMethod("valueNotEquals", function (value, element, arg) {
        return arg !== value;
    }, "Value must not equal arg.");


    $("#addFilterScratchForm").validate({
        ignore: [],
        rules: {
            //desc: { required: true },
            everylist: { valueNotEquals: "0" },
            timepicker: { required: true },
            datepicker: { required: true },
            emailTitle: { required: true },
            recipients: { required: true },
            emailBody: { required: true },
            slackRecipients: { required: true },
            channels: { required: true },
            message: { required: true }

        },
        messages: {
            // desc: {
            //     required: "This field is required"
            // },
            everylist: {
                valueNotEquals: "Please select one every"
            },
            timepicker: {
                required: "Please select Time"
            },
            datepicker: {
                required: "Please select Date"
            },
            emailTitle: {
                required: "This field is required"
            },
            recipients: {
                required: "This field is required"
            },
            emailBody: {
                required: "This field is required"
            },
            slackRecipients: {
                required: "This field is required"
            },
            message: {
                required: "This field is required"
            }

        }
    });

    function resetScheduleAndNotification() {
        //reset Schedule
        $("#startingList").html("");
        $("#startingList").removeAttr("style");
        $("#daliyList").css("width", "50%");
        $("#daliyList").html('at <input  type="text" id="timepicker"  class="form-control" />');
        $(function () {
            $('#timepicker').datetimepicker({
                format: 'H:i',
                datepicker: false
            });
        });
        //reset notification 
        $("#Email").prop("checked", true);
        $("#radioSelectedTxtView").html('<div class="form-group">' +
            '<label class="float-left" for="emailTitle">Email Title</label>' +
            '<input type="text" class="form-control form-ip-one col-sm-6 col-md-7 col-lg-7 col-xl-7" id="emailTitle" name="emailTitle">' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="float-left" for="email">Recipients</label>' +
            '<input type="text" class="form-control form-ip-one col-sm-6 col-md-7 col-lg-7 col-xl-7" id="recipients" name="recipients">' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="float-left" for="pwd">EmailBody</label>' +
            '<input type="text" class="form-control form-ip-Two col-sm-6 col-md-7 col-lg-7 col-xl-7" id="emailBody" name="emailBody">' +
            '</div>');
    }

    $("#btnFilterScratch").click(function () {
        var addFilterScratchDetails = $('form[id="addFilterScratchForm"]').valid();
        var startingDate = "";
        if ($("#datepicker").val() == undefined) {
            var startingDate = null;
        }
        else {
            startingDate = new Date($("#datepicker").val().replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))
        }
        if (addFilterScratchDetails == true) {
            addAlertMaster(
                {
                    alertId: parseInt(localStorage.getItem("alertId")),
                    ScheduleType: $("#everylist").val(),
                    AtTime: $("#timepicker").val(),
                    StartingDate: startingDate,//new Date($("#datepicker").val().replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))
                    NotificationType: $("input[name='notificationOptRadio']:checked").val(),
                    Recipieants: $("#recipients").val(),
                    EmailTitle: $("#emailTitle").val(),
                    EmailBody: $("#emailBody").val(),
                    SlackRecipieants: $("#slackRecipients").val(),
                    Channels: $("#channels").val(),
                    Message: $("#message").val(),
                    IsIncludeData: $('#isIncludeData').is(":checked") == 1 ? true : false,
                    // NotifyTimeFrameFrom: $("#tFrom").val(),
                    // NotifyTimeFrameTo: $("#tTo").val(),
                    CreatedBy: parseInt(localStorage.getItem("UserId")),
                    CreatedDate: new Date()
                }
            ).then(data => {
                addLogsDetails({
                    'LogsMessage':"Add AlertScratch details",
                    'CreatedBy':parseInt(localStorage.getItem("UserId")),
                    'CreatedDate':new Date()
                }).then(data => {
                //console.log(data);
                }).catch(err => {
                console.error(err);
                });
                $.toast({
                    text: "AlertScratch save Successfully.", // Text that is to be shown in the toast
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
                $("#everylist").val("1");
                resetScheduleAndNotification();
                $("#timepicker").val("");
                $("#datepicker").val("");
                $("#recipients").val("");
                $("#emailTitle").val("");
                $("#emailBody").val("");
                $("#slackRecipients").val("");
                $("#channels").val("");
                $("#message").val("");
                $('#isIncludeData').prop('checked', false);
                // $("#tFrom").val("200");
                // $("#tTo").val("500");
                //slider.reset();
            }).catch(err => {
                console.error(err);
            });

        }
    });
});