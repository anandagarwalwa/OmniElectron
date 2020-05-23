'use strict';
var xlsxFile = require('read-excel-file/node');
// var gsjson = require('google-spreadsheet-to-json');
var gshelper = require(__dirname + '\\server\\helpers\\googlesheet-helper.js');
var { getConfigDataSourceDB } = require(__dirname + '\\server\\controllers\\datasourcedbconfig_controller.js');
var { addAlertschedule } = require(__dirname + '\\server\\controllers\\setalertschedule_controller.js');
var { addLogsDetails }=require(__dirname + '\\server\\controllers\\logsdetails_controller.js');
// var csv = require('csvtojson');
var csv = require('csv2json-convertor');
// var nodemailer = require('nodemailer');
// var schedule = require('node-schedule');
var getAlertLocationFileData = [];
var columnList = [];
$(document).ready(function () {
    $('#modelFilterResult').modal('show');
    $("#btnFilterWeeklyReport").click(function () {
        $('#modelFilterResult').modal('hide');
        $('#modeFitlerScratch').modal('show');
    });
    $("#btnBackFilterHome").click(function () {
        $('#modelFilterResult').modal('hide');
        $('#myModal').modal('show');

    });
    $("#setalertid").hide();
    $("#setmetricid").hide();
    $("#addAlerticid").hide();

    // Timeframe slider
    var $timeFrame = $(".js-range");
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

    var slider = $(".js-range").data("ionRangeSlider");

    // read location file
    var fileExtention = alertLocation.substr((alertLocation.lastIndexOf('.') + 1));
    var listOfgoogleSheet = [];
    var googleSpreadsheetId = alertLocation.substring(39, 83);
    if (fileExtention == "csv") {
        getCSVFile();
    }
    else if (fileExtention == "xlsx") {
        getExcelFile();
    }
    else if (dataConfigId > 0 && dataConfigId) {
        getConfigDataSourceDB(dataConfigId).then(data => {
            var configData = data[0];
            dataSourceConfigData(configData[0]);
        });
    }
    else {
        getGoogleSheet();
    }
    // get Excel file
    function getExcelFile() {
        var selectedSheetValue;
        var XLSX = require('xlsx');
        var workbook = XLSX.readFile(alertLocation, { cellDates: true });
        var sheet_name_list = [];
        workbook.SheetNames.forEach(value => {
            sheet_name_list.push({ 'Sheet': value });
        })
        $("#tablist").html("");
        var html = '';
        for (var i = 0; i < sheet_name_list.length; i++) {
            html += '<option value="' + sheet_name_list[i].Sheet + '">' + sheet_name_list[i].Sheet + '</option>';
        }
        $("#tablist").html(html);
        var excelData = [];
        var worksheet = workbook.Sheets[sheet_name_list[0].Sheet];
        var headers = {};
        var data = [];
        for (var z in worksheet) {
            if (z[0] === '!') continue;
            //parse out the column, row, and value
            var tt = 0;
            for (var i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i;
                    break;
                }
            };
            var col = z.substring(0, tt);
            var row = parseInt(z.substring(tt));
            var value = worksheet[z].w;
            //store header names
            if (row == 1 && value) {
                headers[col] = value;
                continue;
            }
            if (!data[row]) data[row] = {};
            data[row][headers[col]] = value;
        }
        //drop those first two rows which are empty
        data.shift();
        // data.shift();
        excelData.push(data);
        displaysheetdetails(data);
        getAlertLocationFileData = data;
        selectedHeaderValueDisplay();
        $('#tablist').on('change', function (e) {
            $("#tablist").val()
            //selectedSheetValue=$(this).text();
            var excelData = [];
            var worksheet = workbook.Sheets[$("#tablist").val()];
            var headers = {};
            var data = [];
            for (var z in worksheet) {
                if (z[0] === '!') continue;
                //parse out the column, row, and value
                var tt = 0;
                for (var i = 0; i < z.length; i++) {
                    if (!isNaN(z[i])) {
                        tt = i;
                        break;
                    }
                };
                var col = z.substring(0, tt);
                var row = parseInt(z.substring(tt));
                var value = worksheet[z].w;
                //store header names
                if (row == 1 && value) {
                    headers[col] = value;
                    continue;
                }
                if (!data[row]) data[row] = {};
                data[row][headers[col]] = value;
            }
            //drop those first two rows which are empty
            data.shift();
            // data.shift();
            excelData.push(data);
            //console.log(data);
            displaysheetdetails(data);
            getAlertLocationFileData = data;
        });
    }

    // get CSV file
    function getCSVFile() {
        var csvObj = csv.csvtojson(alertLocation);
        $("#tablist").html("");
        var path = require('path');
        var sheetname = path.parse(alertLocation).name;
        var html = '<option value=' + 0 + '>' + sheetname + '</option>';
        $("#tablist").html(html);
        displaysheetdetails(csvObj);
        getAlertLocationFileData = csvObj;
        selectedHeaderValueDisplay();
    }

    // get Googlesheet
    function getGoogleSheet() {
        gshelper.getWorksheets({
            spreadsheetId: googleSpreadsheetId,
        })
            .then(function (res) {
                res.forEach(value => {
                    listOfgoogleSheet.push(value.title);
                });
                $("#tablist").html("");
                var html = '';
                for (var i = 0; i < listOfgoogleSheet.length; i++) {
                    html += '<option value="' + i + '">' + listOfgoogleSheet[i] + '</option>';
                }
                $("#tablist").html(html);
            })
            .catch(function (err) {
                console.log(err.stack)
            });

        gshelper.spreadsheetToJson({
            spreadsheetId: googleSpreadsheetId,
            allWorksheets: true
        }).then(function (googleSheetObj) {
            googleSheetObj = googleSheetObj[0];
            displaysheetdetails(googleSheetObj);
            getAlertLocationFileData = googleSheetObj;
        });
        selectedHeaderValueDisplay();
        $('#tablist').on('change', function (e) {
            $("#tablist").val()
            gshelper.spreadsheetToJson({
                spreadsheetId: googleSpreadsheetId,
                allWorksheets: true
            }).then(function (googleSheetObj) {
                googleSheetObj = googleSheetObj[parseInt($("#tablist").val())];
                displaysheetdetails(googleSheetObj);
                getAlertLocationFileData = googleSheetObj;
            });
        });
    }

    // get Json Result from from excel/csv & google sheet
    function displaysheetdetails(data) {
        // EXTRACT VALUE FOR HTML HEADER. 
        var col = [];
        for (var i = 1; i < data.length; i++) {
            for (var key in data[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        getHeaderList(col);
        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");

        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);                   // TABLE ROW.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }
        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 1; i < data.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                // tabCell.innerHTML = data[i][col[j]];
                if (data[i - 1] && data[i - 1][col[j]]) {
                    tabCell.innerHTML = data[i - 1][col[j]];
                }
                else
                    tabCell.innerHTML = "";
            }
            if (i == 99) {
                break;
            }
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("dtable");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
        $(table).addClass('table table-striped');
    }

    // get header from excel/csv & google sheet
    function getHeaderList(headerList) {
        // $('#orderDateChangeName').html(headerList[0]);
        // $('#bookingsChangeName').html(headerList[0]);
        $("#orderDatesheetList").html("");
        $("#bookingsSheetList").html("");
        $("#addAlertSheetList").html("");
        var orderDataHeaderList = '';
        var bookingsHeaderList = '';
        var addAlertHeaderList = '';

        for (var i = 0; i < headerList.length; i++) {
            orderDataHeaderList += '<a class="dropdown-item orderDataList" href="#">' + headerList[i] + '</a>';
            bookingsHeaderList += '<a class="dropdown-item bookingsList" href="#">' + headerList[i] + '</a>';
            addAlertHeaderList += '<a class="dropdown-item addAlertList" href="#">' + headerList[i] + '</a>';
        }
        $("#orderDatesheetList").html(orderDataHeaderList);
        $("#bookingsSheetList").html(bookingsHeaderList);
        $("#addAlertSheetList").html(addAlertHeaderList);
    }

    // set dropdown value for excel/csv & google sheet
    function selectedHeaderValueDisplay() {
        $(document).on('click', 'a.dropdown-item.bookingsList', function () {
            $('#bookingsChangeName').html($(this).text());
            $("#setmetricid").show();
            $("#errorbookings").html("");
        });

        $(document).on('click', 'a.dropdown-item.orderDataList', function () {
            $('#orderDateChangeName').html($(this).text());
            $("#setalertid").show();
            $("#errororderDate").html("");

        });

        $(document).on('click', 'a.dropdown-item.addAlertList', function () {
            $('#addAlertName').html($(this).text());
            $("#addAlerticid").show();
            var html = '<option value="0">select</option>';
            for (var i = 1; i < getAlertLocationFileData.length; i++) {
                if (html.toLowerCase().indexOf(getAlertLocationFileData[i][$(this).text()]) == -1)
                    html += '<option value="' + getAlertLocationFileData[i][$(this).text()] + '">' + getAlertLocationFileData[i][$(this).text()] + '</option>';
            }
            $("#selectcoloumnId").html(html);
            $("#erroraddAlertName").html("");
        });
    }

    // get Data from Datasource Config
    function dataSourceConfigData(configData) {
        if (configData.DataSourceName.toLowerCase().indexOf("sql") != -1) {
            const options = {
                client: configData.DataSourceName.toLowerCase(),
                connection: {
                    host: configData.Host,
                    port: configData.Port,
                    user: configData.UserName,
                    password: configData.Password,
                    database: configData.DatabaseName
                }
            }
            const knex = require('knex')(options);
            knex.raw(alertLocation).then(data => {
                if (data && data.length > 0) {
                    var dbData = data[0];
                    displaysheetdetails(dbData);
                    getAlertLocationFileData = dbData;
                    selectedHeaderValueDisplay();
                }
            }).catch(err => {
                console.error(err);
            });
            var html = '<option value=' + 0 + '>' + configData.DatabaseName + '</option>';
            $("#tablist").html(html);
        } else if (configData.Location.substr((configData.Location.lastIndexOf('.') + 1)) == "xlsx") {
            alertLocation = configData.Location
            getExcelFile();
        } else if (configData.Location.substr((configData.Location.lastIndexOf('.') + 1)) == "csv") {
            alertLocation = configData.Location
            getCSVFile();
        } else {
            googleSpreadsheetId = configData.Location.substring(39, 83);
            getGoogleSheet();
        }
    }

    // Set Alert schedular
    $.validator.addMethod("valueNotEquals", function (value, element, arg) {
        return arg !== value;
    }, "Value must not equal arg.");

    $("#addFilterResultForm").validate({
        ignore: [],
        rules: {
            // orderDatesheetList: { required: true },
            granularity: { valueNotEquals: "0" },
            // my_range:{
            //     required:true
            // },
            matricConditionList: {
                valueNotEquals: "0"
            },
            matricValue: {
                required: true
            },
            filterConditionList:
            {
                valueNotEquals: "0"
            },
            selectcoloumnId:
            {
                valueNotEquals: "0"
            }
        },
        messages: {
            // orderDatesheetList: {
            //     required: "This field is required"
            // },
            granularity: { valueNotEquals: "Please select" },
            // my_range:{
            //     required:"This field is required"
            // },
            matricConditionList: {
                valueNotEquals: "Please select"
            },
            matricValue: {
                required: "This field is required"
            },
            filterConditionList:
            {
                valueNotEquals: "Please select"
            },
            selectcoloumnId:
            {
                valueNotEquals: "Please select"
            }
        }
    });


    // for sending email
    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'manojn.wa@gmail.com',
    //         pass: 'Manoj&webashlar'
    //     }
    // });

    // const mailOptions = {
    //     from: 'manojn.wa@gmail.com', // sender address
    //     to: 'nipanemanoj342@gmail.com', // list of receivers
    //     subject: 'test mail', // Subject line
    //     html: '<h1>this is a test mail.</h1>'// plain text body
    // };

    // $("#btnFilterWeeklyReport").click(function () {
    //     debugger;
    //     transporter.sendMail(mailOptions, function (err, info) {
    //         if (err)
    //             console.log(err)
    //         else
    //             console.log(info);
    //     })
    // });


    // for set schedul
    // debugger;
    // var schedule = require('schedulejs'),
    //     tasks = [
    //         { id: 1, duration: 1, resources: ['A'] }
    //     ],
    //     resources = [
    //         { id: 'A' }
    //     ];

    // schedule.create(tasks, resources, null, new Date());

    // var j = schedule.scheduleJob('*/1 * * * *', function (fireDate) {
    //     debugger;
    //     console.log('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
    //     transporter.sendMail(mailOptions, function (err, info) {
    //         if (err)
    //             console.log(err)
    //         else
    //             console.log(info);
    //     })
    // });


    $("#btnFilterResultReport").click(function () {

        if ($("#orderDateChangeName").text() == "Click here to add") {
            $("#errororderDate").removeAttr("style");
            $("#errororderDate").html("Please click here to add");
        }
        else if ($("#bookingsChangeName").text() == "Click here to add") {
            $("#errorbookings").removeAttr("style");
            $("#errorbookings").html("Please click here to add");
        }
        else if ($("#addAlertName").text() == "Click here to add") {
            $("#erroraddAlertName").removeAttr("style");
            $("#erroraddAlertName").html("Please click here to add");
        }
        else {
            var addFilterResultDetails = $('form[id="addFilterResultForm"]').valid();
            if (addFilterResultDetails == true) {
                addAlertschedule(
                    {
                        UserId: parseInt(localStorage.getItem("UserId")),
                        NodeId: alertNodeId,
                        SetAlertTo: $("#orderDateChangeName").text(),
                        Granularity: $("#granularity").val(),
                        TimeframeFrom: parseInt($("#tFrom").val()),
                        TimeframeTo: parseInt($("#tTo").val()),
                        AlertToMetric: $("#bookingsChangeName").text(),
                        MetricCriteria: $("#matricConditionList").val(),
                        MetricValue: parseInt($("#matricValue").val()),
                        AlertFilter: $("#addAlertName").text(),
                        FilterCriteria: $("#filterConditionList").val(),
                        FilterValue: $("#selectcoloumnId").val(),
                        CreatedDate: new Date(),
                        DateRun: new Date(),
                        AlertFailure: 0
                    }
                ).then(data => {
                    addLogsDetails({
                        'LogsMessage':"Add filter weeklyReport details",
                        'CreatedBy':parseInt(localStorage.getItem("UserId")),
                        'CreatedDate':new Date()
                    }).then(data => {
                    //console.log(data);
                    }).catch(err => {
                    console.error(err);
                    });
                    localStorage.setItem("alertId", data[0]);
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
                    $("#matricConditionList").val("0");
                    $("#matricValue").val("");
                    $("#product").val("0");
                    slider.reset();
                    $("#filterConditionList").val("0");
                    $("#selectcoloumnId").val("0");
                    $("#filterValue").val("");
                    $('#modelFilterResult').modal('hide');
                    $('#modeFitlerScratch').modal('show');
                }).catch(err => {
                    console.error(err);
                });
            }
        }
    });
});
