const { WebClient } = require('@slack/web-api');
const { createReadStream } = require('fs');
const { getAllSlackList } = require(__dirname + '\\server\\controllers\\slack_controller.js');
var request = require('request');

var token = '';
var userList = [];
var web = new WebClient();

GetSlackAuthToken();

function GetSlackAuthToken() {
    debugger
    getAllSlackList().then(data => {
        console.log('data', data);
        if (data && data.length > 0) {
            token = data[0].AuthToken;
            web = new WebClient(token);
            if (token) {
                fetchUsers();
            }
        }
    });
}

async function fetchUsers() {
    const res = await web.users.list({ token: token });
    if (userList.length > 0) {
        return;
    }
    console.log('Members: ', res);
    if (res && res.members.length > 0) {
        var users = res.members.filter(m => m.deleted == false);
        if (users.length > 0) {
            $.each(users, function(i, user) {
                var user = {
                    id: user.id,
                    name: user.profile.real_name
                }
                userList.push(user);
            });
            console.log('userList', userList);
        }
    }
}

function sendMessage(userID, msg) {
    const web = new WebClient(token);
    console.log('channel', userID);
    (async() => {
        const res = await web.chat.postMessage({
            token: token,
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
    const web = new WebClient(token);
    request.post({
        url: 'https://slack.com/api/files.upload',
        formData: {
            token: token,
            title: "File",
            filename: fileName,
            filetype: "auto",
            channels: userID,
            file: createReadStream(fileName),
        },
    }, function(err, response) {
        console.log(JSON.parse(response.body));
    });
}

$("#btnSlack").click(function() {
    debugger
    if (userList.length == 0) {
        alert("no member exist in slack workspace");
        return
    }
    var receipient = $("#slackRecipients").val();
    var msg = $("#message").val();
    if (!receipient) {
        alert("receipent is required");
        return;
    }
    if (!msg) {
        alert("Message is required");
        return;
    }

    if (receipient) {
        var user = userList.filter(m => m.id == receipient);
        if (user.length > 0) {
            sendMessage(user[0].id, msg);

            if ($('#isIncludeData').prop('checked')) {
                sendFile(user[0].id, 'E:\Geo.json');
            }
        } else {
            alert("'" + receipient + "'" + " not registered in your workspace , please try another one");
        }
    }
});

// async function fetchChannels() {
//     const res = await web.conversations.list({ token: token });
//     // `res` contains information about the posted message
//     console.log('Members: ', res);
//     if (res && res.channels.length > 0) {
//         var channels = res.channels;
//         if (channels.length > 0) {

//             channels = channels.sort(function(a, b) {
//                 var textA = a.name.toUpperCase();
//                 var textB = b.name.toUpperCase();
//                 return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
//             });

//             $.each(channels, function(i, channel) {
//                 $('#ListChannel').append($('<option>', {
//                     value: channel.id,
//                     text: channel.name
//                 }));
//             });
//         }
//     }
// }