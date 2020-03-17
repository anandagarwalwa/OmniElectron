'use strict';
var {getUsers} = require(__dirname + '\\server\\controllers\\user_controller.js');
var {getDatacategory} = require(__dirname + '\\server\\controllers\\datacategory_controller.js');
var {addNodes,updateNodesbyid} = require(__dirname + '\\server\\controllers\\nodes_controller.js');
$(document).ready(function() {
    var ownerList='<option value="default">Select</option>';
    var datacategoryList='';
    getUsers().then(data => {
        debugger
        var model = {
            items: data
        }
        if (model.items && model.items.length > 0) {
            
            console.log(model);
            for(var i=0;i<model.items.length;i++)
            {
                ownerList+='<option value=' + model.items[i].UserId + '>' + model.items[i].FirstName + " " + model.items[i].LastName + '</option>';
            }
            $(".ownerId").html("");
            $(".ownerId").append(ownerList);
        }
        }).catch(err => {
        console.error(err);
    });

    getDatacategory().then(data => {
        debugger
        var model = {
            items: data
        }
        if (model.items && model.items.length > 0) {
            
            console.log(model);
            for(var i=0;i<model.items.length;i++)
            {
                datacategoryList+='<div class="form-check" >'+
                '<label class="form-check-label" >'+model.items[i].Name+
              '<input type="radio" class="form-check-input radioBtnClass"  name="rBtndatacategory"  value="'+model.items[i].Id+'"/>'+
            '</label><br/>'+
            '</div>';
            }
            $(".dataCategoryList").html("");
            $(".dataCategoryList").append(datacategoryList);
        }
        }).catch(err => {
        console.error(err);
    });

    $.validator.addMethod("valueNotEquals", function(value, element, arg){
        return arg !== value;
       }, "Value must not equal arg.");



    $("#addDataPoint").validate({
        ignore: [],
        rules: {
            description:'required',
            listOwner:{ valueNotEquals: "default" },
            rBtndatacategory: 'required'
        },
        messages: {
          
            emailId:  'This field is required' ,
            listOwner:{ valueNotEquals: "Please select an Owner!" } ,
            rBtndatacategory: 'This field is required'
        },
        errorPlacement: function(error, element) {
            if(element.attr("name") == "rBtndatacategory") {
                error.insertAfter(element.parent().parent().parent());
              }
            else
            error.insertAfter(element);
        }
    });


//Add Point data form in publish button click event 

    $("#btnPublish").click(function(){
      var addDataPointdetails = $('form[id="addDataPoint"]').valid();
      if (addDataPointdetails == true) {
        if ($("#hdnNodeId").val() != 0 || $("#hdnNodeId").val() != "") {
            updateNodesbyid($("#hdnNodeId").val(), {
                Description:$("#description").val(),
                    Owner:$("#selectOwner").val(),
                    DataCategoryId:$("input[type='radio'].radioBtnClass:checked").val(),
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
                if($("input[type='radio'].radioBtnClass").is(':checked')) {
                    var radioBtnClass_type = $("input[type='radio'].radioBtnClass:checked").val();
                    if(radioBtnClass_type == "1")
                    {
                        $('#addDataPointForm').addClass('d-none');
                        $('#dataLinkBlock').removeClass('d-none');
                    }
                    else if(radioBtnClass_type == "2")
                    {
                        $('#addDataPointForm').addClass('d-none');
                        $('#analysisBlock').removeClass('d-none');
                    }
                    else
                    {
                        $('#addDataPointForm').addClass('d-none');
                        $('#testBlock').removeClass('d-none');
                    }
                }
            })
                .catch(err => {
                    console.error(err);
                });
        }
        else
        {
            addNodes(
                {
                    Description:$("#description").val(),
                    Owner:$("#selectOwner").val(),
                    DataCategoryId:$("input[type='radio'].radioBtnClass:checked").val(),
                    CreatedBy: parseInt(localStorage.getItem("UserId")),
                    CreatedDate: new Date()
                }
            ).then(data => {
                localStorage.setItem("nodeId",data[0]);
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
                if($("input[type='radio'].radioBtnClass").is(':checked')) {
                    var radioBtnClass_type = $("input[type='radio'].radioBtnClass:checked").val();
                    if(radioBtnClass_type == "1")
                    {
                        $('#addDataPointForm').addClass('d-none');
                        $('#dataLinkBlock').removeClass('d-none');
                    }
                    else if(radioBtnClass_type == "2")
                    {
                        $('#addDataPointForm').addClass('d-none');
                        $('#analysisBlock').removeClass('d-none');
                    }
                    else
                    {
                        $('#addDataPointForm').addClass('d-none');
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
            beforeShow: function () { }, // will be triggered before the toast is shown
            afterShown: function () { }, // will be triggered after the toat has been shown
            beforeHide: function () { }, // will be triggered before the toast gets hidden
            afterHidden: function () { }  // will be triggered after the toast has been hidden
        });
    }
    }); 
});




//Add Link form in Previous button click event 
$("#btnPreviousDataLinkBlock").click(function(){

    $('#addDataPointForm').removeClass('d-none');
    $('#dataLinkBlock').addClass('d-none');
    $("#hdnNodeId").val(parseInt(localStorage.getItem("nodeId")));

});

//Add Analysis form in Previous button click event 
$("#btnPreviousAnalysisBlock").click(function(){

    $('#addDataPointForm').removeClass('d-none');
    $('#analysisBlock').addClass('d-none');
    $("#hdnNodeId").val(parseInt(localStorage.getItem("nodeId")));
});


//Add Test form in Previous button click event 
$("#btnPreviousTestBlock").click(function(){

    $('#addDataPointForm').removeClass('d-none');
    $('#testBlock').addClass('d-none');
    $("#hdnNodeId").val(parseInt(localStorage.getItem("nodeId")));
});
