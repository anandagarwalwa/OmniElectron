const { WebClient } = require('@slack/web-api');
const token = 'xoxb-358222557168-1162192725522-jOAnJBdZch2UYxjIlctaV0MZ';
var userList = [];
console.log("⚡️ Bolt app is running!");
const web = new WebClient(token);

fetchUsers();
async function fetchUsers() {

    const res = await web.users.list({ token: token });
    // `res` contains information about the posted message

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

(async() => {
    (async() => {
        fetchUsers();
        // fetchChannels();
    })();
    async function fetchChannels() {
        const res = await web.conversations.list({ token: token });
        // `res` contains information about the posted message
        console.log('Members: ', res);
        if (res && res.channels.length > 0) {
            var channels = res.channels;
            if (channels.length > 0) {

                channels = channels.sort(function(a, b) {
                    var textA = a.name.toUpperCase();
                    var textB = b.name.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });

                $.each(channels, function(i, channel) {
                    $('#ListChannel').append($('<option>', {
                        value: channel.id,
                        text: channel.name
                    }));
                });
            }
        }
    }
})();

function sendMessage(userID, msg) {
    const web = new WebClient(token);
    // var userID = $("#ListUser").val();
    // var channelID = $("#ListChannel").val();
    // if (!channelID) {
    //     channelID = userID;
    // }
    console.log('channel', userID);
    (async() => {
        const res = await web.chat.postMessage({
            channel: userID,
            text: msg,
            as_user: true,
            // attachments: [{ "pretext": "pre-hello", "text": "text-world" }],
            // blocks: [{ "type": "section", "text": { "type": "plain_text", "text": "Hello world" } }],
            icon_emoji: ':chart_with_upwards_trend',
            icon_url: 'http://lorempixel.com/48/48',
            // link_names: true
        });
        return res.ts;
        console.log('Message sent: ', res.ts);
    })();
}

$("#btnSlack").click(function() {
    debugger
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
        var user = userList.filter(m => m.name.toUpperCase() == receipient.toUpperCase());
        if (user.length > 0) {
            sendMessage(user[0].id, msg);
        } else {
            alert("'" + receipient + "'" + " not registered in your workspace , please try another one");
        }
    }
});