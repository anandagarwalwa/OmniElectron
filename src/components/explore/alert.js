var { getAlerSchedulerList } = require(__dirname + '\\server\\controllers\\setalertschedule_controller.js');
var { addLogsDetails } = require(__dirname + '\\server\\controllers\\logsdetails_controller.js');
var { getConfigDataSourceDB } = require(__dirname + '\\server\\controllers\\datasourcedbconfig_controller.js');
//slack require
var { WebClient } = require('@slack/web-api');
var { getAllSlackList } = require(__dirname + '\\server\\controllers\\slack_controller.js');
var request = require('request');
var config = require("../config.json");
var csv = require('csv2json-convertor');
var googleshelper = require(__dirname + '\\server\\helpers\\googlesheet-helper.js');

var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
const { columns } = require('mssql');

var slackUserList = [];

getAllSlackList().then(data => {
    console.log('data', data);
    if (data && data.length > 0) {
        token = data[0].AuthToken;
        slackUserList = fetchUsers();
    }
});

//for sending email
var transporter = nodemailer.createTransport({
    host: config.EmailSettings.Host,
    port: config.EmailSettings.Port,
    secure: config.EmailSettings.Secure,
    requireTLS: config.EmailSettings.RequireTLS,
    auth: {
        user: config.EmailSettings.NotifyEmail.NotifyFromUserId,
        pass: config.EmailSettings.NotifyEmail.NotifyFromPassword
    }
});

function runScheduler() {
    schedule.scheduleJob('*/1 * * * *', function(fireDate) {
        getSchedulerList();
    });
}

function getSchedulerList() {
    debugger
    var userId = undefined;
    // if (!SessionManager.IsAdmin)
    userId = SessionManager.UserId;

    // Get links option selected
    getAlerSchedulerList(userId).then(data => {
        if (data && data.length > 0 && data[0] && data[0].length > 0) {
            console.log(data);
            var currentDate = new Date();
            var currTime = ("0" + currentDate.getHours()).slice(-2) + ':' + ("0" + currentDate.getMinutes()).slice(-2) + ':00'; //+ ("0" + currentDate.getSeconds()).slice(-2)
            data[0].forEach(element => {
                // getAlertLocationFileData = [];
                var selType = parseInt(element.ScheduleType);
                switch (selType) {
                    case ScheduleTypeEnum.Daily:
                        if (element.AtTime == currTime) {
                            checkFile(element);
                        }
                        break;
                    case ScheduleTypeEnum.Weekly:
                        if (element.StartingDate && element.StartingDate.getDay() == currentDate.getDay()) {
                            if (currTime == "19:02:00") {
                                checkFile(element);
                            }
                        }
                        break;
                    case ScheduleTypeEnum.Monthly:
                        if (element.StartingDate) {
                            var crdatetime = ("0" + currentDate.getMonth()).slice(-2) + '-' + ("0" + currentDate.getDate()).slice(-2) + '-' + currentDate.getFullYear();
                            var checkDate = ("0" + element.StartingDate.getMonth()).slice(-2) + '-' + ("0" + element.StartingDate.getDate()).slice(-2) + '-' + element.StartingDate.getFullYear();
                            if (crdatetime == checkDate && currTime == "19:02:00") {
                                // if (element.IsIncludeData) {
                                //     //GetData to send with attachment
                                // }
                                // if (element.NotificationType.toLowerCase() == "email") {
                                //     const mailOptions = {
                                //         from: config.EmailSettings.NotifyEmail.NotifyFromUserId, // sender address
                                //         to: element.Recipieants, // list of receivers
                                //         subject: element.EmailTitle, // Subject line
                                //         html: element.EmailBody // plain text body
                                //     };
                                //     SendMail(mailOptions);
                                // } else if (element.NotificationType.toLowerCase() == "slack") {

                                // }
                                checkFile(element);
                            }
                        }
                        break;
                }
            });
        }
    }).catch(err => {
        console.error(err);
    });
}




function SendMail(mailOptions) {
    transporter.sendMail(mailOptions, function(err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
}

function checkFile(element) {
    var fileExtention = element.Location.substr((element.Location.lastIndexOf('.') + 1));
    if (fileExtention == "csv") {
        var csvdataObj = csv.csvtojson(element.Location);
        debugger
        JSONToCSVConvertor(csvdataObj, element);
    } else if (fileExtention == "xlsx") {
        var selectedSheetValue;
        var XLSX = require('xlsx');
        var workbook = XLSX.readFile(element.Location, { cellDates: true });
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
        JSONToCSVConvertor(data, element);
    }
    // else if (element.DataSourceConfigId > 0 && element.DataSourceConfigId) {
    //     getConfigDataSourceDB(element.DataSourceConfigId).then(data => {
    //         console.log(data);
    //         var configData = data[0];
    //         dataSourceConfigData(configData[0]);
    //     });
    // } 
    else {
        // var listOfgoogleSheet = [];
        var googleSpreadsheetId = element.Location.substring(39, 83);
        googleshelper.spreadsheetToJson({
            spreadsheetId: googleSpreadsheetId,
            allWorksheets: true
        }).then(function(googleSheetObj) {
            googleSheetObj = googleSheetObj[0];
            JSONToCSVConvertor(googleSheetObj, element);
        });
    }
}

function JSONToCSVConvertor(JSONData, getdata) {
    debugger
    var setLessOrGreater, equalCondition, timeFrameCondition = false;
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';
    var row = "";
    if (arrData[0]) {
        for (var index in arrData[0]) {
            row += index + ',';
        }

        row = row.slice(0, -1);
        CSV += row + '\r\n';
        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            timeFrameCondition = false;
            equalCondition = false;
            setLessOrGreater = false;
            for (var key in arrData[0]) {
                if (getdata.SetAlertTo == key) {
                    {
                        if (getdata.Granularity == "day") {
                            var tffrom, tfto = '';
                            tffrom = new Date().setDate(new Date().getDate() + getdata.TimeframeFrom);
                            tfto = new Date().setDate(new Date().getDate() + getdata.TimeframeTo);
                            tffrom = new Date(tffrom);
                            tfto = new Date(tfto);
                            var fileRecords = new Date(arrData[i][key]);
                            tffrom.setHours(0, 0, 0, 0);
                            if ((fileRecords - tffrom) >= 0 && (tfto - fileRecords) >= 0) {
                                timeFrameCondition = true;
                                console.log('timeFrameCondition:', timeFrameCondition);
                            }
                        } else if (getdata.Granularity == "week") {
                            debugger
                            var today = new Date();
                            var dayOfWeek = today.getDay();
                            var weekend = new Date().setDate(new Date().getDate() + (7 - dayOfWeek))
                            tffrom = weekend;
                            tfto = weekend;
                            weekend = new Date(weekend);
                            tffrom = new Date(tffrom);
                            tfto = new Date(tfto);
                            tffrom = tffrom.setDate(weekend.getDate() + (getdata.TimeframeFrom * 7));
                            tfto = tfto.setDate(weekend.getDate() + (getdata.TimeframeTo * 7));
                            tffrom = new Date(tffrom);
                            tfto = new Date(tfto);
                            tffrom.setHours(0, 0, 0, 0);
                            var fileRecords = new Date(arrData[i][key]);
                            if ((fileRecords - tffrom) >= 0 && (tfto - fileRecords) >= 0) {
                                timeFrameCondition = true;
                                console.log('timeFrameCondition:', timeFrameCondition);
                            }
                        } else if (getdata.Granularity == "month") {
                            var tffrom, tfto = '';
                            tffrom = new Date().setMonth(new Date().getMonth() + getdata.TimeframeFrom);
                            tfto = new Date().setMonth(new Date().getMonth() + getdata.TimeframeTo);
                            tffrom = new Date(tffrom);
                            tfto = new Date(tfto);
                            tffrom.setHours(0, 0, 0, 0);
                            var fileRecords = new Date(arrData[i][key]);
                            if ((fileRecords - tffrom) >= 0 && (tfto - fileRecords) >= 0) {
                                timeFrameCondition = true;
                            }
                        } else if (getdata.Granularity == "quarter") {
                            var tffrom, tfto = '';
                            var today = new Date();
                            var currentQuarterDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                            tffrom = currentQuarterDate.getTime();
                            tfto = currentQuarterDate.getTime();
                            tffrom = new Date(tffrom);
                            tfto = new Date(tfto);
                            tffrom = tffrom.setMonth(tffrom.getMonth() + (getdata.TimeframeFrom * 3));
                            tfto = tfto.setMonth(tfto.getMonth() + (getdata.TimeframeTo * 3));
                            console.log(new Date(tffrom));
                            console.log(new Date(tfto));
                            tffrom.setHours(0, 0, 0, 0);
                            var fileRecords = new Date(arrData[i][key]);
                            if ((fileRecords - tffrom) >= 0 && (tfto - fileRecords) >= 0) {
                                timeFrameCondition = true;
                            }
                        } else if (getdata.Granularity == "year") {
                            var tffrom, tfto = '';
                            tffrom = new Date().setFullYear(new Date().getFullYear() + getdata.TimeframeFrom);
                            tfto = new Date().setFullYear(new Date().getFullYear() + getdata.TimeframeTo);
                            tffrom = new Date(tffrom);
                            tfto = new Date(tfto);
                            tffrom.setHours(0, 0, 0, 0);
                            fileRecords = new Date(arrData[i][key]);
                            if ((fileRecords - tffrom) >= 0 && (tfto - fileRecords) >= 0) {
                                timeFrameCondition = true;
                            }
                        }
                    }
                }
            }
            if (!timeFrameCondition) {
                continue;
            }
            for (var key in arrData[0]) {
                if (getdata.AlertFilter == key) {
                    if (getdata.FilterCriteria == "equals") {
                        equalCondition = arrData[i][key] == getdata.FilterValue;
                    } else if (getdata.FilterCriteria == "does not equal") {
                        equalCondition = arrData[i][key] != getdata.FilterValue;
                    } else if (getdata.FilterCriteria == "contains") {
                        equalCondition = arrData[i][key].includes(getdata.FilterValue);
                    } else if (getdata.FilterCriteria == "does not contain") {
                        equalCondition = !(arrData[i][key].includes(getdata.FilterValue));
                    }
                }
            }
            if (!equalCondition) {
                continue;
            }
            for (var key in arrData[0]) {
                if (getdata.AlertToMetric == key) {
                    if (getdata.MetricCriteria == "less than") {
                        setLessOrGreater = parseInt(arrData[i][key]) < getdata.MetricValue;
                    } else if (getdata.MetricCriteria == "greater than") {
                        setLessOrGreater = parseInt(arrData[i][key]) > getdata.MetricValue;
                    }
                }
            }

            if (timeFrameCondition && equalCondition && setLessOrGreater) {
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }
                row.slice(0, row.length - 1);
                CSV += row + '\r\n';
            }
            // if (i == 99) {
            //     break;
            // }
        }

        debugger
        var CSVsecond = '';
        var rowsecond = "";
        for (var index in arrData[0]) {
            rowsecond += index + ',';
        }

        rowsecond = rowsecond.slice(0, -1);
        CSVsecond += rowsecond + '\r\n';
        if (CSV == CSVsecond) {
            row = "";
            CSV = "";
        }

    } else {
        for (var index in arrData[1]) {
            row += index + ',';
        }

        row = row.slice(0, -1);
        CSV += row + '\r\n';
        for (var i = 1; i < arrData.length; i++) {
            var row = "";
            timeFrameCondition = false;
            equalCondition = false;
            setLessOrGreater = false;
            for (var key in arrData[1]) {
                if (getdata.SetAlertTo == key) {
                    {
                        if (getdata.Granularity == "day") {
                            var tffrom, tfto = '';
                            tffrom = new Date().setDate(new Date().getDate() + getdata.TimeframeFrom);
                            tfto = new Date().setDate(new Date().getDate() + getdata.TimeframeTo);
                            tffrom = new Date(tffrom);
                            tfto = new Date(tfto);
                            var fileRecords = new Date(arrData[i][key]);
                            tffrom.setHours(0, 0, 0, 0);
                            if ((fileRecords - tffrom) >= 0 && (tfto - fileRecords) >= 0) {
                                timeFrameCondition = true;
                                console.log('timeFrameCondition:', timeFrameCondition);
                            }
                        } else if (getdata.Granularity == "week") {
                            debugger
                            var today = new Date();
                            var dayOfWeek = today.getDay();
                            var weekend = new Date().setDate(new Date().getDate() + (7 - dayOfWeek))
                            tffrom = weekend;
                            tfto = weekend;
                            weekend = new Date(weekend);
                            tffrom = new Date(tffrom);
                            tfto = new Date(tfto);
                            tffrom = tffrom.setDate(weekend.getDate() + (getdata.TimeframeFrom * 7));
                            tfto = tfto.setDate(weekend.getDate() + (getdata.TimeframeTo * 7));
                            tffrom = new Date(tffrom);
                            tfto = new Date(tfto);
                            tffrom.setHours(0, 0, 0, 0);
                            var fileRecords = new Date(arrData[i][key]);
                            if ((fileRecords - tffrom) >= 0 && (tfto - fileRecords) >= 0) {
                                timeFrameCondition = true;
                                console.log('timeFrameCondition:', timeFrameCondition);
                            }
                        } else if (getdata.Granularity == "month") {
                            var tffrom, tfto = '';
                            tffrom = new Date().setMonth(new Date().getMonth() + getdata.TimeframeFrom);
                            tfto = new Date().setMonth(new Date().getMonth() + getdata.TimeframeTo);
                            tffrom = new Date(tffrom);
                            tfto = new Date(tfto);
                            tffrom.setHours(0, 0, 0, 0);
                            var fileRecords = new Date(arrData[i][key]);
                            if ((fileRecords - tffrom) >= 0 && (tfto - fileRecords) >= 0) {
                                timeFrameCondition = true;
                            }
                        } else if (getdata.Granularity == "quarter") {
                            var tffrom, tfto = '';
                            var today = new Date();
                            var currentQuarterDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                            tffrom = currentQuarterDate.getTime();
                            tfto = currentQuarterDate.getTime();
                            tffrom = new Date(tffrom);
                            tfto = new Date(tfto);
                            tffrom = tffrom.setMonth(tffrom.getMonth() + (getdata.TimeframeFrom * 3));
                            tfto = tfto.setMonth(tfto.getMonth() + (getdata.TimeframeTo * 3));
                            console.log(new Date(tffrom));
                            console.log(new Date(tfto));
                            tffrom.setHours(0, 0, 0, 0);
                            var fileRecords = new Date(arrData[i][key]);
                            if ((fileRecords - tffrom) >= 0 && (tfto - fileRecords) >= 0) {
                                timeFrameCondition = true;
                            }
                        } else if (getdata.Granularity == "year") {
                            var tffrom, tfto = '';
                            tffrom = new Date().setFullYear(new Date().getFullYear() + getdata.TimeframeFrom);
                            tfto = new Date().setFullYear(new Date().getFullYear() + getdata.TimeframeTo);
                            tffrom = new Date(tffrom);
                            tfto = new Date(tfto);
                            tffrom.setHours(0, 0, 0, 0);
                            fileRecords = new Date(arrData[i][key]);
                            if ((fileRecords - tffrom) >= 0 && (tfto - fileRecords) >= 0) {
                                timeFrameCondition = true;
                            }
                        }
                    }
                }
            }
            if (!timeFrameCondition) {
                continue;
            }
            for (var key in arrData[1]) {
                if (getdata.AlertFilter == key) {
                    if (getdata.FilterCriteria == "equals") {
                        equalCondition = arrData[i][key] == getdata.FilterValue;
                    } else if (getdata.FilterCriteria == "does not equal") {
                        equalCondition = arrData[i][key] != getdata.FilterValue;
                    } else if (getdata.FilterCriteria == "contains") {
                        equalCondition = arrData[i][key].includes(getdata.FilterValue);
                    } else if (getdata.FilterCriteria == "does not contain") {
                        equalCondition = !(arrData[i][key].includes(getdata.FilterValue));
                    }
                }
            }
            if (!equalCondition) {
                continue;
            }
            for (var key in arrData[1]) {
                if (getdata.AlertToMetric == key) {
                    if (getdata.MetricCriteria == "less than") {
                        setLessOrGreater = parseInt(arrData[i][key]) < getdata.MetricValue;
                    } else if (getdata.MetricCriteria == "greater than") {
                        setLessOrGreater = parseInt(arrData[i][key]) > getdata.MetricValue;
                    }
                }
            }

            if (equalCondition && setLessOrGreater) {
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }
                row.slice(0, row.length - 1);
                CSV += row + '\r\n';
            }
            // if (i == 99) {
            //     break;
            // }
        }
        debugger
        var CSVsecond = '';
        var rowsecond = "";
        for (var index in arrData[0]) {
            rowsecond += index + ',';
        }

        rowsecond = rowsecond.slice(0, -1);
        CSVsecond += rowsecond + '\r\n';
        if (CSV == CSVsecond) {
            row = "";
            CSV = "";
        }
    }
    if (getdata.NotificationType.toLowerCase() == "email") {
        if (getdata.IsIncludeData.readUIntLE() == 1) {
            //GetData to send with attachment
            //Generate a file name
            var fileName = "Filter-Report.csv";
            if (CSV.length == 0) {
                const mailOptions = {
                    from: config.EmailSettings.NotifyEmail.NotifyFromUserId, // sender address
                    to: getdata.Recipieants, // list of receivers
                    subject: getdata.EmailTitle, // Subject line
                    html: getdata.EmailBody // plain text body
                };
                SendMail(mailOptions);
            } else {
                const mailOptions = {
                    from: config.EmailSettings.NotifyEmail.NotifyFromUserId, // sender address
                    to: getdata.Recipieants, // list of receivers
                    subject: getdata.EmailTitle, // Subject line
                    html: getdata.EmailBody, // plain text body
                    attachments: [{
                            filename: fileName,
                            content: CSV
                                //path: link.download
                        }] // file attachment
                };
                SendMail(mailOptions);
            }

        } else {
            const mailOptions = {
                from: config.EmailSettings.NotifyEmail.NotifyFromUserId, // sender address
                to: getdata.Recipieants, // list of receivers
                subject: getdata.EmailTitle, // Subject line
                html: getdata.EmailBody // plain text body
            };
            SendMail(mailOptions);
        }
    } else if (getdata.NotificationType.toLowerCase() == "slack") {
        debugger
        setTimeout(() => {
            if (slackUserList && slackUserList.length > 0) {
                console.log('slackUserList', slackUserList);
                var user = slackUserList.filter(u => u.name == getdata.SlackRecipieants);
                if (user.length > 0) {
                    sendMessage(user[0].id, getdata.Message);
                    if (getdata.IsIncludeData.readUIntLE() == 1 && CSV.length != 0) {
                        sendFile(user[0].id, CSV);
                    }
                } else {
                    console.log("No user in slack workspace for ", getdata.SlackRecipieants);
                }
            }
        }, 500);
    }
}

function sendMessage(userID, msg) {
    debugger
    const web = new WebClient(token); // set static tokan id
    //fetch SlackId from Username of slack
    console.log('channel', userID);
    (async() => {

        const res = await web.chat.postMessage({
            token: token, //now set static tokan id
            channel: userID,
            text: msg,
            as_user: true,
            icon_emoji: ':chart_with_upwards_trend',
            icon_url: 'http://lorempixel.com/48/48',
        });
        console.log('Message sent: ', res);
        return res.ts;
    })();
}

function sendFile(userID, fileName) {
    debugger
    request.post({
        url: 'https://slack.com/api/files.upload',
        formData: {
            token: token, //now set static tokan id
            title: "File",
            filename: "Filter-Report.csv",
            filetype: "csv",
            channels: userID,
            content: fileName,
        },
    }, function(err, response) {
        //console.log(JSON.parse(response.body));
    });
}

async function fetchUsers() {
    var web = new WebClient(token);
    const res = await web.users.list({ token: token });
    if (slackUserList.length > 0) {
        return;
    }
    console.log('Members: ', res);
    if (res && res.members.length > 0) {
        var users = res.members.filter(m => m.deleted == false);
        console.log("users ", users);
        slackUserList = [];
        if (users.length > 0) {
            $.each(users, function(i, user) {
                var user = {
                    id: user.id,
                    name: user.name
                }
                slackUserList.push(user);
            });
            console.log('userList', slackUserList);
            return slackUserList;
        }
    }
}

// // get Excel file
// function getExcelFile(alertLocation, element) {
//     var selectedSheetValue;
//     var XLSX = require('xlsx');
//     var workbook = XLSX.readFile(alertLocation, { cellDates: true });
//     var sheet_name_list = [];
//     workbook.SheetNames.forEach(value => {
//         sheet_name_list.push({ 'Sheet': value });
//     })
//     for (var i = 0; i < sheet_name_list.length; i++) {
//         console.log(sheet_name_list[i].Sheet);
//     }
//     var excelData = [];
//     var worksheet = workbook.Sheets[sheet_name_list[0].Sheet];
//     var headers = {};
//     var data = [];
//     for (var z in worksheet) {
//         if (z[0] === '!') continue;
//         //parse out the column, row, and value
//         var tt = 0;
//         for (var i = 0; i < z.length; i++) {
//             if (!isNaN(z[i])) {
//                 tt = i;
//                 break;
//             }
//         };
//         var col = z.substring(0, tt);
//         var row = parseInt(z.substring(tt));
//         var value = worksheet[z].w;
//         //store header names
//         if (row == 1 && value) {
//             headers[col] = value;
//             continue;
//         }
//         if (!data[row]) data[row] = {};
//         data[row][headers[col]] = value;
//     }
//     //drop those first two rows which are empty
//     data.shift();
//     // data.shift();
//     excelData.push(data);
//     displaysheetdetails(data, element);
//     getAlertLocationFileData = data;
// }

// function displaysheetdetails(data, element) {
//     // EXTRACT VALUE FOR HTML HEADER. 
//     var col = [];
//     for (var i = 1; i < data.length; i++) {
//         for (var key in data[i]) {
//             if (col.indexOf(key) === -1) {
//                 col.push(key);
//             }
//         }
//     }

//     // CREATE DYNAMIC TABLE.
//     var table = document.createElement("table");

//     // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

//     var tr = table.insertRow(-1); // TABLE ROW.

//     for (var i = 0; i < col.length; i++) {
//         var th = document.createElement("th"); // TABLE HEADER.
//         th.innerHTML = col[i];
//         tr.appendChild(th);
//     }
//     // ADD JSON DATA TO THE TABLE AS ROWS.
//     for (var i = 1; i < data.length; i++) {

//         tr = table.insertRow(-1);

//         for (var j = 0; j < col.length; j++) {
//             var tabCell = tr.insertCell(-1);
//             // tabCell.innerHTML = data[i][col[j]];
//             if (data[i - 1] && data[i - 1][col[j]]) {
//                 tabCell.innerHTML = data[i - 1][col[j]];
//             } else
//                 tabCell.innerHTML = "";
//         }
//         if (i == 99) {
//             break;
//         }
//     }

//     // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
//     var divContainer = document.getElementById("dtable");
//     divContainer.innerHTML = "";
//     divContainer.appendChild(table);
//     $(table).addClass('table table-striped');


//     // Declare variables 
//     var table, tr, td, i;
//     table = document.getElementById("dtable");
//     tr = table.getElementsByTagName("tr");

//     // Loop through all table rows, and hide those who don't match the search query
//     for (i = 0; i < tr.length; i++) {
//         td = tr[i];
//         if (td) {
//             if (td.innerHTML.indexOf(element.FilterValue) > -1) {
//                 tr[i].style.display = "";
//             } else {
//                 tr[i].style.display = "none";
//             }
//         }
//     }
// }