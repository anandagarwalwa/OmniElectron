'use strict';
var xlsxFile = require('read-excel-file/node');
// var gsjson = require('google-spreadsheet-to-json');
var gshelper = require(__dirname + '\\server\\helpers\\googlesheet-helper.js');
var csv = require('csvtojson');

$(document).ready(function () {
    $('#modelFilterResult').modal('show');
    $("#btnfilterResult").click(function () {
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
});

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
        debugger;
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
    });
}

// get CSV file
function getCSVFile() {
    csv()
        .fromFile(alertLocation)
        .then((csvObj) => {
            console.log(csvObj);
            $("#tablist").html("");
            var path = require('path');
            var sheetname = path.parse(alertLocation).name;
            var html = '<option value=' + 0 + '>' + sheetname + '</option>';
            $("#tablist").html(html);
            displaysheetdetails(csvObj);
        });
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
                debugger;
                html += '<option value="' + i + '">' + listOfgoogleSheet[i] + '</option>';
            }
            $("#tablist").html(html);
            console.log(listOfgoogleSheet);
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
    debugger;
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
        debugger
        $('#bookingsChangeName').html($(this).text());
        $("#setmetricid").show();
    });

    $(document).on('click', 'a.dropdown-item.orderDataList', function () {
        debugger
        $('#orderDateChangeName').html($(this).text());
        $("#setalertid").show();
    });

    $(document).on('click', 'a.dropdown-item.addAlertList', function () {
        debugger
        $('#addAlertName').html($(this).text());
        $("#addAlerticid").show();
    });
}

