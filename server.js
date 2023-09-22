require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');
const Firestore = require('@google-cloud/firestore');

// LINE Secret
const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
};
// Create a LINE Messaging API client
const client = new line.Client(config);

// GCP Secret
const GoogleApplicationCredentialPath = process.env.GOOGLE_APPLICATION_CREDENTIAL_PATH
const GCPProjectId = process.env.GCP_PROJECT_ID
// Create a firestore client
const db = new Firestore({
    projectId: GCPProjectId,
    keyFilename: GoogleApplicationCredentialPath,
});

const app = express();

// Middleware
app.use('/message', express.json())
app.use('/message', express.urlencoded({ extended: true }));

// Routing
app.post('/message', (req, res) => {
    handlePushMessage(req.body.to, req.body.messages)
        .then((result) => res.json(result));
});

// Handler
async function handlePushMessage(to, messages) {
    console.log(`Push message to ${to}: ${messages}`)
    try {
        // Send push message
        // API Reference: https://developers.line.biz/ja/reference/messaging-api/#send-push-message
        return client.pushMessage(to, messages)
    } catch (error) {
        return Promise.resolve(null);
    }
}

app.listen(process.env.PORT, () => {
    console.log(`express server listening on port ${process.env.PORT}`);
});
