'use strict';
var { addAlertDetail } = require(__dirname + '\\server\\controllers\\alertdetail_controller.js');

$(document).ready(function () {
    var $timeFrame = $(".js-range-slider");
    var $tFrom = $(".js-input-from"), $tTo = $(".js-input-to"),
        instance,
        min = 0,
        max = 100;
    $timeFrame.ionRangeSlider({
        skin: "modern",
        type: "double",
        from: 10,
        to: 100,
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


    $("#addFilterWeeklyReportForm").validate({
        ignore: [],
        rules: {
            orderDate: { valueNotEquals: "0" },
            granularity: { valueNotEquals: "0" },
            booking: { valueNotEquals: "0" },
            matricConditionList: { valueNotEquals: "0" },
            matricValue: { required: true },
            product: { valueNotEquals: "0" },
            filterConditionList: { valueNotEquals: "0" },
            filterValue: { required: true }
        },
        messages: {
            orderDate: {
                valueNotEquals: "Please select one orderDate"
            },
            granularity: {
                valueNotEquals: "Please select one granularity"
            },
            booking: {
                valueNotEquals: "Please select one booking"
            },
            matricConditionList: {
                valueNotEquals: "Please select one matricCondition"
            },
            matricValue: {
                required: "This field is required"
            },
            product: {
                valueNotEquals: "Please select one product"
            },
            filterConditionList: {
                valueNotEquals: "Please select one filtercondition"
            },
            filterValue: {
                required: "This field is required"
            }
        }
    });








    $("#btnFilterWeeklyReport").click(function () {
        var addFilterWeeklyReportDetails = $('form[id="addFilterWeeklyReportForm"]').valid();
        if (addFilterWeeklyReportDetails == true) {
            addAlertDetail(
                {
                    AlertTo: $("#orderDate").val(),
                    Granuality: $("#granularity").val(),
                    TimeFrameFrom: $("#tFrom").val(),
                    TimeFrameTo: $("#tTo").val(),
                    MetricTo: $("#booking").val(),
                    MetricCondition: $("#matricConditionList").val(),
                    MetricValue: $("#matricValue").val(),
                    FilterTo: $("#product").val(),
                    FilterCondition: $("#filterConditionList").val(),
                    FilterValue: $("#filterValue").val()
                }
            ).then(data => {
                $.toast({
                    text: "Add filter weeklyRepoort save Successfully.", // Text that is to be shown in the toast
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
                $("#orderDate").val("0");
                $("#granularity").val("0");
                $("#booking").val("0");
                $("#tFrom").val("0");
                $("#tTo").val("100");
                slider.reset();
                $("#matricConditionList").val("0");
                $("#matricValue").val("");
                $("#product").val("0");
                $("#filterConditionList").val("0");
                $("#filterValue").val("");
            }).catch(err => {
                console.error(err);
            });
        }
    });
});