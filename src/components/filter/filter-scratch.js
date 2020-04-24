'use strict';
var { addAlertMaster } = require(__dirname + '\\server\\controllers\\alertmaster_controller.js');



$(document).ready(function () {
    $('#modeFitlerScratch').modal('hide');
    $("#btnBackFilterResult").click(function () {
        $('#modeFitlerScratch').modal('hide');
        $('#modelFilterResult').modal('show');
    });
    var $timeFrame = $(".js-range-slider");
    var $tFrom = $(".js-input-from"), $tTo = $(".js-input-to"),
        instance,
        min = 0,
        max = 1000;

    $timeFrame.ionRangeSlider({
        skin: "modern",
        type: "double",
        min: 0,
        max: 1000,
        from: 200,
        to: 500,
        grid: false,
        onStart: function (data) {
            $tFrom.prop("value", data.from);
            $tTo.prop("value", data.to);
        },
        onChange: function (data) {
            $tFrom.prop("value", data.from);
            $tTo.prop("value", data.to);
        }

    });
    instance = $timeFrame.data("ionRangeSlider");

    $tFrom.on("change keyup", function () {
        var val = $(this).prop("value");

        // validate
        if (val < min) {
            val = min;
        } else if (val > max) {
            val = max;
        }

        instance.update({
            from: val
        });
    });


    $tTo.on("change keyup", function () {
        var val = $(this).prop("value");

        // validate
        if (val < min) {
            val = min;
        } else if (val > max) {
            val = max;
        }

        instance.update({
            to: val
        });
    });

    var slider = $(".js-range-slider").data("ionRangeSlider");

    $.validator.addMethod("valueNotEquals", function (value, element, arg) {
        return arg !== value;
    }, "Value must not equal arg.");


    $("#addFilterScratchForm").validate({
        ignore: [],
        rules: {
            //desc: { required: true },
            everylist: { valueNotEquals: "0" },
            weeklist: { valueNotEquals: "0" },
            starting: { valueNotEquals: "0" },
            recipients: { required: true },
            emailBody: { required: true },
            timeFrame: { required: true },
        },
        messages: {
            // desc: {
            //     required: "This field is required"
            // },
            everylist: {
                valueNotEquals: "Please select one every"
            },
            weeklist: {
                valueNotEquals: "Please select one week"
            },
            starting: {
                valueNotEquals: "Please select one starting"
            },
            recipients: {
                required: "This field is required"
            },
            emailBody: {
                required: "This field is required"
            },
            timeFrame: {
                required: "This field is required"
            }
        }
    });


    $("#btnFilterScratch").click(function () {
        var addFilterScratchDetails = $('form[id="addFilterScratchForm"]').valid();
        if (addFilterScratchDetails == true) {
            addAlertMaster(
                {
                    // Description: $("#").val(),
                    // NodeId: $("#").val(),
                    // DataSourceId:$("#").val() ,
                    //subDataSourceName:$("#").val(),
                    NotificationType: $("input[name='notificationOptRadio']:checked").val(),
                    Recipieants: $("#recipients").val(),
                    EmailBody: $("#emailBody").val(),
                    IsIncludeData: $('#isIncludeData').is(":checked") == 1 ? true : false,
                    NotifyTimeFrameFrom: $("#tFrom").val(),
                    NotifyTimeFrameTo: $("#tTo").val(),
                    CreatedBy: parseInt(localStorage.getItem("UserId")),
                    CreatedDate: new Date()
                }
            ).then(data => {
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
                $("#everylist").val("0");
                $("#weeklist").val("0");
                $("#starting").val("0");
                $("#recipients").val("");
                $("#emailBody").val("");
                $('#isIncludeData').prop('checked', false);
                $("#tFrom").val("200");
                $("#tTo").val("500")
                slider.reset();
            }).catch(err => {
                console.error(err);
            });

        }
    });
});