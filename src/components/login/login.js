'use strict';
var { getUsers, addUser, userLogin } = require(__dirname + '\\server\\controllers\\user_controller.js');
var tinybind = require('../node_modules/tinybind/dist/tinybind.js');

$("#sidebar").css("display", "none");
$("#headerbar").css("display", "none");

// User Login
$("#userlogin").click(function () {
    var EmailId = $("#usr").val();
    var Password = $("#pwd").val();
    userLogin({
        'EmailId': EmailId,
        'Password': Password
    }).then(data => {
        if (data) {
            localStorage.setItem("UserId", data.UserId);
            $("#sidebar").css("display", "block");
            $("#headerbar").css("display", "flex");
            window.location.href = "app.html";
            $.toast({
                text: "Login Successfully.", // Text that is to be shown in the toast
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
        } else {
            $.toast({
                text: "Please Enter valid credentials!", // Text that is to be shown in the toast
                heading: 'Error Message', // Optional heading to be shown on the toast
                icon: 'error', // Type of toast icon
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
        }
    }).catch(err => {
        console.error(err);
    });
});