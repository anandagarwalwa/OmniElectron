'use strict';
var xlsxFile = require('read-excel-file/node');
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

});
var selectedSheetValue;
var XLSX = require('xlsx');
var workbook = XLSX.readFile(alertLocation, { cellDates: true });
debugger
var sheet_name_list = [];
workbook.SheetNames.forEach(value => {
    sheet_name_list.push({ 'Sheet': value });
})
$("#sheetList").html("");
var html = '';
for (var i = 0; i < sheet_name_list.length; i++) {
    html += '<a class="dropdown-item" href="#">' + sheet_name_list[i].Sheet + '</a>';
}
$("#sheetList").html(html);
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
console.log(data);
// EXTRACT VALUE FOR HTML HEADER. 
// ('Book ID', 'Book Name', 'Category' and 'Price')
var col = [];
for (var i = 1; i < data.length; i++) {
    for (var key in data[i]) {
        if (col.indexOf(key) === -1) {
            col.push(key);
        }
    }
}
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
        tabCell.innerHTML = data[i][col[j]];
    }
}
// FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
var divContainer = document.getElementById("dtable");
divContainer.innerHTML = "";
divContainer.appendChild(table);
$(table).addClass('table table-striped');
$(document).on('click', 'a.dropdown-item', function () {
    debugger
    $('#oderDateChangeName').html($(this).text());
    selectedSheetValue = $(this).text();
    var excelData = [];
    var worksheet = workbook.Sheets[selectedSheetValue];
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
    console.log(data);
    // EXTRACT VALUE FOR HTML HEADER. 
    var col = [];
    for (var i = 1; i < data.length; i++) {
        for (var key in data[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }
    // CREATE DYNAMIC TABLE.
    table = document.createElement("table");
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
            tabCell.innerHTML = data[i][col[j]];
        }
    }
    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("dtable");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
    $(table).addClass('table table-striped');
});