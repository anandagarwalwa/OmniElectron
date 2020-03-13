'use strict';
var { getUsers,addUser,userLogin  } = require(__dirname + '\\server\\controllers\\user_controller.js');
var tinybind = require('../node_modules/tinybind/dist/tinybind.js');


getUsers().then(data => {
    var model = {
        items: data
    }
    tinybind.binders.src = function (el, value) {
        // value = 'data:image/jpeg;base64,' + value;
        el.setAttribute('src', value);
    }
    tinybind.bind($('#userList'), model);
    $('#exampleInputEmail').val(data[0].EmailId);
    $('#exampleInputFirstName').val(data[0].FirstName);
    $('#userProfile').html(data[0].FirstName);
}).catch(err => {
    console.error(err);
});


var imagebase64 = "";  
  
function encodeImageFileAsURL(element) {  
    var file = element.files[0];  
    var reader = new FileReader();  
    reader.onloadend = function() {  
        imagebase64 = reader.result;
        $("#addUserImage").attr('src',imagebase64);
        // $("#addUserImage").html("<img src="+imagebase64+" class='img-fluid rounded-circle'>");  
    }  
    reader.readAsDataURL(file);  
    
}  


var isActive="";
$('#isActive').on('change', function(){
    isActive = this.checked ? 1 : 0;
 }).change();

 /* from validation */
 
    jQuery.validator.addMethod("lettersonly", function(value, element) {
         return this.optional(element) || /^[a-z\s]+$/i.test(value);
      });
      jQuery.validator.addMethod("emailValidation", function(value, element) {
        return this.optional(element) || /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
     });
     jQuery.validator.addMethod("domainValidation", function(value, element) {
        return this.optional(element) ||/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(value);
     });
     
     $("#addMemberForm").validate({
        ignore: [],
        rules: {
            uploadPhoto:'required',
            firstName: { lettersonly: true, required:true},
            lastName:  { lettersonly: true, required:true},
            emailId:{emailValidation:true,required:true},
            domain:{domainValidation:true,required:true},
            teamId:'required',
            roleId:'required'
        },
        messages: {
            uploadPhoto:'this field is required',
            firstName: {lettersonly: "Please enter characters only.",
            required: "This field is required"},
            lastName:  {lettersonly: "Please enter characters only.",
            required: "This field is required"},
            emailId:{emailValidation:"Please enter a valid email address.",required:'This field is required'},
            domain:{domainValidation:"Please enter a valid domain.",required:'This field is required'},
            teamId:'This field is required',
            roleId:'This field is required'
        },
      });



     

$("#btnAddMember").click(function () {
    var addMemberdetails=$('form[id="addMemberForm"]').valid();
   
    if(addMemberdetails == true)
    {
     addUser(
        {
            'FirstName':  $("#firstName").val(),
            'LastName': $("#lastName").val(),
            'EmailId': $("#emailId").val(),
            'Photo': imagebase64,
            'Domain':$("#domain").val(),
            'CreatedBy': 1,
            'UpdatedBy': 1,
            'RoleId': $("#roleId").val(),
            'IsActive':isActive
            // $("#teamId").val()

        }
    ).catch(err => {
        console.error(err);
       
       
    });

    $.toast({
        text: "Member details save Successfully.", // Text that is to be shown in the toast
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
        beforeShow: function () {}, // will be triggered before the toast is shown
        afterShown: function () {}, // will be triggered after the toat has been shown
        beforeHide: function () {}, // will be triggered before the toast gets hidden
        afterHidden: function () {}  // will be triggered after the toast has been hidden
    });




    imagebase64="";
    control.val('')
    $("#uploadPhoto").replaceWith($("#uploadPhoto").val('').clone( true ));
    $("#addUserImage").attr('src','assets/images/40306.jpg');
    $("#firstName").val('');
    $("#lastName").val('');
    $("#emailId").val('');
    $("#domain").val('');
    $("#roleId").val('');
    $("#teamId").val('');
    isActive="";


    }
    else
    {
        $.toast({
            text: "Please Fillup all Details!", // Text that is to be shown in the toast
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
            beforeShow: function () {}, // will be triggered before the toast is shown
            afterShown: function () {}, // will be triggered after the toat has been shown
            beforeHide: function () {}, // will be triggered before the toast gets hidden
            afterHidden: function () {}  // will be triggered after the toast has been hidden
        });
    }
   
    

});

// $("#btnAddMember").click(function(){
//     userLogin({
//         'EmailId':"admin@gmail.com",
//         'Password':"Admin@123"   
//     }).then(data=>{
//         debugger;
//         console.log(data)
//     }).catch(err=>{
//         console.error(err);
//     });
// });
