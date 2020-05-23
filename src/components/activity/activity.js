'use strict';
var { getLogsDetails, addLogsDetails, deleteLogsDetails } = require(__dirname + '\\server\\controllers\\logsdetails_controller.js');

var current = new Date();
function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return 'Update ' + Math.round(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return 'Update ' + Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
        return 'Update ' + Math.round(elapsed / msPerYear) + ' years ago';
    }
}



Viewlogsdetails();
function Viewlogsdetails() {
    getLogsDetails().then(data => {
        console.log(data);
        var logsdetails = data[0]
        $("#logsDetails").html("");
        var html = "";
        for (var i = 0; i < logsdetails.length; i++) {
            debugger;
            var Name = logsdetails[i].FirstName + " " + logsdetails[i].LastName;
            var splitDate = logsdetails[i].CreatedDate.toDateString().split(' ');
            var splitTime = logsdetails[i].CreatedDate.toLocaleTimeString();
            //var splitUserCreatedDate = logsdetails[i].userCreatedDate.toLocaleDateString().split(' ');
            //var userCreatedDate = splitUserCreatedDate[0];
            //console.log(userCreatedDate);
            var createdDate = splitDate[1] + ' ' + splitDate[2] + ', ' + splitDate[3];
            var createdTime = splitTime;
            //console.log(splitDate[1]+' '+splitDate[2]+', '+splitDate[3]);
            //console.log(splitTime);
            html += '<tr>' +
                '<td class="red">' +
                '<div class="table-pic-coman-section">' +
                '<div class="table-pic">' +
                '<img src=' + logsdetails[i].Photo + ' class="rounded-circle img-fluid">' +
                '</div>' +
                '<div class="table-title">' +
                '<h6>' + logsdetails[i].LogsMessage + '</h6>' +
                '<p>' + timeDifference(current, logsdetails[i].CreatedDate) + '</p>' +
                '</div>' +
                '</div>' +
                '</td>' +
                '<td class="red">' +
                '<div class="Onear-section">' +
                '<h6>' + Name + '</h6>' +
                '<p>on </p>' +
                '</div>' +
                '</td>' +
                '<td class="red">' +
                '<div class="coman-table-tag-section">' +
                '<div class="Onear-section Date-section">' +
                '<h6>' + createdDate + '</h6>' +
                '<p>' + createdTime + '</p>' +
                '</div>' +
                '<div class="drop-down-table">' +
                '<div class="dropdown">' +
                '<button type="button" class="btn  dropdown-toggle" data-toggle="dropdown">' +
                '<i class="fas fa-ellipsis-v"></i>' +
                '</button>' +
                '<div class="dropdown-menu">' +
                '<a class="dropdown-item" href="javascript:void(0)" data-LogUserid=' + logsdetails[i].Id + ' rv-data-category-TeamId=' + logsdetails[i].Id + ' onclick="deleteLogClick(this)"><i class="fas fa-trash-alt"></i>  Delete</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</td>' +
                '</tr>';
        }
        $("#logsDetails").html(html);
        $('#logstable').DataTable({
            "pageLength": 5,
            "bLengthChange": false,
            "bAutoWidth": false,
            "searching": true,
            "ordering": true,    
            "info": true,
            "destroy": true,
            
        });
    }).catch(err => {
        console.error(err);
    });

}

function deleteLogClick(logobj) {
    var id = $(logobj).attr("data-LogUserid");;
    $.confirm({
        title: 'Delete Confirmation?',
        content: 'Are you sure you want to delete this log?',
        type: 'green',
        buttons: {
            ok: {
                text: "Yes",
                btnClass: 'btn-primary',
                keys: ['enter'],
                action: function () {
                    deleteLogsDetails(id).then(data => {
                        var logTable = $('#logstable').DataTable();
                        var removingRow = $(logobj).closest('tr');
                        logTable.row(removingRow).remove().draw();
                        Viewlogsdetails();
                        // addLogsDetails({
                        //     'LogsMessage':"log Deleted",
                        //     'CreatedBy':parseInt(localStorage.getItem("UserId")),
                        //     'CreatedDate':new Date()
                        // }).then(data => {
                        //   //console.log(data);
                        // }).catch(err => {
                        //   console.error(err);
                        // });	
                        $.toast({
                            text: "log deleted Successfully.", // Text that is to be shown in the toast
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
                    });
                }
            },
            cancel: function () {

            }
        }
    });

}

