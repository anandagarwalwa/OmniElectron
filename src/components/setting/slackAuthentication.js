var { InstallProvider } = require('@slack/oauth');
const { createEventAdapter } = require('@slack/events-api');
const express = require('express');
const shell = require('electron').shell;
const { getSlackByUserID, addSlackApp, updateSlackMasterbyID } = require(__dirname + '\\server\\controllers\\slack_controller.js');

var config = require("../config.json");
var { WebClient } = require('@slack/web-api');

// Using Keyv as an interface to our database
const Keyv = require('keyv');
const app = express();
const port = 3000;
const SLACK_SIGNING_SECRET = config.SlackSetting.SLACK_SIGNING_SECRET;
const SLACK_CLIENT_ID = config.SlackSetting.SLACK_CLIENT_ID;
const SLACK_CLIENT_SECRET = config.SlackSetting.SLACK_CLIENT_SECRET;

var token = '';
var authCode = '';
var slackUserList = [];

// Initialize slack events adapter
const slackEvents = createEventAdapter(SLACK_SIGNING_SECRET, {
    includeBody: true,
});
// Set path to receive events
app.use('/slack/events', slackEvents.requestListener());
const keyv = new Keyv();
keyv.on('error', err => console.log('Connection Error', err));

var userId;
var appData;

initAuth();

function initAuth() {
    if (SessionManager.IsAdmin) {
        debugger
        $("#btnSlack").show();
        userId = SessionManager.UserId;
        console.log('userId', userId);
        if (userId) {
            SlackDataByUserID(userId);
        }
    }
}


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
    if (userId) {
        SlackAuth();
    } else {
        initAuth();
    }

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
            // res.send(`<a href=${url}><img alt=""Add to Slack"" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>`);
    } catch (error) {
        console.log(error)
    }
});

// use default success and failure handlers
app.get('/slack/oauth_redirect', async(req, res) => {
    authCode = req.query.code
    if (authCode) {
        GetAuthToken();
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}! Go to http://localhost:3000/slack/install to initiate oauth flow`))

async function GetAuthToken() {
    debugger
    const web = new WebClient();
    const res = await web.oauth.v2.access({
        code: authCode,
        client_id: SLACK_CLIENT_ID,
        client_secret: SLACK_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000/slack/oauth_redirect',
        // grant_type: "authorization_code"
    });
    debugger
    console.log('res', res);
    if (res) {
        token = res.access_token;
        console.log('res', res);
        if (appData) {
            UpdateSlackApp(res);
        } else {
            AddNewSlackApp(res);
        }
    }
}

function SlackDataByUserID(userId) {
    getSlackByUserID(userId).then(data => {
        debugger
        console.log('appData ', data);
        if (data.length > 0) {
            appData = data[0];
            token = appData.AuthToken;
            fetchUsers();
        }
    });
}

function AddNewSlackApp(res) {
    debugger
    addSlackApp({
        'AppID': res.app_id,
        'AuthToken': res.access_token,
        'AppName': res.incoming_webhook.channel.replace('@', ''),
        'CreatedBy': userId,
        'CreatedDate': new Date(),
        'UpdatedDate': new Date(),
    }).then(data => {
        console.log(data);
    }).catch(err => {
        console.error(err);
    });
}

function UpdateSlackApp(res) {
    debugger
    updateSlackMasterbyID(appData.Id, {
        'AppID': res.app_id,
        'AuthToken': res.access_token,
        'AppName': res.incoming_webhook.channel.replace('@', ''),
        'CreatedBy': 1,
        'UpdatedDate': new Date(),
    }).then(data => {
        console.log(data);
    }).catch(err => {
        console.error(err);
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