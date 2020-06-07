const { InstallProvider } = require('@slack/oauth');
const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/web-api');
const express = require('express');
const shell = require('electron').shell;

// Using Keyv as an interface to our database
// see https://github.com/lukechilds/keyv for more info
const Keyv = require('keyv');
const app = express();
const port = 3000;
const SLACK_SIGNING_SECRET = '3bc49f0a8a8f2ecd64406ea10ca22f92';
const SLACK_CLIENT_ID = '358222557168.1176390384369';
const SLACK_CLIENT_SECRET = '4b2b773ea9843c2e74b5de01c4e3b9c4';

var token = '';
var authCode = '';

// Initialize slack events adapter
const slackEvents = createEventAdapter(SLACK_SIGNING_SECRET, {
    includeBody: true,
});
// Set path to receive events
app.use('/slack/events', slackEvents.requestListener());
const keyv = new Keyv();
keyv.on('error', err => console.log('Connection Error', err));

const installer = new InstallProvider({
    clientId: SLACK_CLIENT_ID,
    clientSecret: SLACK_CLIENT_SECRET,
    authVersion: 'v2',
    stateSecret: 'state',
    installationStore: {
        storeInstallation: (installation) => {
            keyv.set(installation.team.id, installation);
            return;
        },
        fetchInstallation: (InstallQuery) => {
            return keyv.get(InstallQuery.teamId);
        },
    },
});

$("#btnSlack").click(function() {
    debugger
    SlackAuth();
});

async function SlackAuth() {
    const url = await installer.generateInstallUrl({
        scopes: ['channels:read', 'groups:read', 'channels:manage', 'chat:write', 'incoming-webhook'],
        metadata: '*',
    })
    shell.openExternal(url);
}

app.get('/', (req, res) => res.send('go to /slack/install'));
app.get('/slack/install', async(req, res, next) => {
    try {
        debugger
        // feel free to modify the scopes
        const url = await installer.generateInstallUrl({
            scopes: ['admin', 'channels:read', 'groups:read', 'channels:manage', 'chat:write', 'incoming-webhook'],
            metadata: '*',
        })
        res.send(`<a href=${url}><img alt=""Add to Slack"" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>`);
    } catch (error) {
        console.log(error)
    }
});

// use default success and failure handlers
app.get('/slack/oauth_redirect', async(req, res) => {
    debugger
    authCode = req.query.code
    if (authCode) {
        GetAuthToken();
    }
    // await installer.handleCallback(req, res);
});

app.listen(port, () => console.log(`Example app listening on port ${port}! Go to http://localhost:3000/slack/install to initiate oauth flow`))

async function GetAuthToken() {
    const web = new WebClient();
    const res = await web.oauth.v2.access({
        code: authCode,
        client_id: SLACK_CLIENT_ID,
        client_secret: SLACK_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000/slack/oauth_redirect',
        grant_type: "authorization_code"
    });
    debugger
    console.log('res', res);
    if (res) {
        token = res.access_token;
        var appID = res.app_id
        var appName = incoming_webhook.channel
        var userID = authed_user.id
        console.log('res', res);
        //GetData();
    }
}

// function GetData() {
//     console.log("⚡️ Bolt app is running!");
//     const web = new WebClient(token);
//     debugger
//         (async() => {
//             fetchUsers();
//             fetchChannels();
//         })();

//     async function fetchUsers() {
//         const res = await web.users.list({ token: token });
//         // `res` contains information about the posted message
//         console.log('Members: ', res);
//         if (res && res.members.length > 0) {
//             var users = res.members.filter(m => m.deleted == false);
//             if (users.length > 0) {
//                 $.each(users, function(i, user) {
//                     users = users.sort(function(a, b) {
//                         var textA = a.profile.real_name.toUpperCase();
//                         var textB = b.profile.real_name.toUpperCase();
//                         return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
//                     });
//                     $('#ListUser').append($('<option>', {
//                         value: user.id,
//                         text: user.profile.real_name
//                     }));
//                 });
//             }
//         }
//     }

//     async function fetchChannels() {
//         const res = await web.conversations.list({ token: token });
//         // `res` contains information about the posted message
//         console.log('Members: ', res);
//         if (res && res.channels.length > 0) {
//             var channels = res.channels;
//             if (channels.length > 0) {

//                 channels = channels.sort(function(a, b) {
//                     var textA = a.name.toUpperCase();
//                     var textB = b.name.toUpperCase();
//                     return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
//                 });

//                 $.each(channels, function(i, channel) {
//                     $('#ListChannel').append($('<option>', {
//                         value: channel.id,
//                         text: channel.name
//                     }));
//                 });
//             }
//         }
//     }
// };

// function sendMessage() {
//     const web = new WebClient(token);
//     // This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
//     var userID = $("#ListUser").val();
//     var channelID = $("#ListChannel").val();
//     if (!channelID) {
//         channelID = userID;
//     }
//     console.log('channel', channelID);
//     (async() => {
//         // See: https://api.slack.com/methods/chat.postMessage
//         const res = await web.chat.postMessage({
//             channel: channelID,
//             text: 'Slack testing',
//             as_user: true,
//             // attachments: [{ "pretext": "pre-hello", "text": "text-world" }],
//             // blocks: [{ "type": "section", "text": { "type": "plain_text", "text": "Hello world" } }],
//             // icon_emoji: ':chart_with_upwards_trend',
//             // icon_url: 'http://lorempixel.com/48/48',
//             // link_names: true
//         });
//         return res.ts;
//         console.log('Message sent: ', res.ts);
//     })();
// }

// $("#btnSlack").click(function() {
//     sendMessage();
// });