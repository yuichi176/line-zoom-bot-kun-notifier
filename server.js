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
    handlePushMessage(req.body)
        .then((result) => res.json(result))
        .catch((error) => {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: 'Not Found', message: error.message });
            } else {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        })
});

// Handler
async function handlePushMessage(reqBody) {
    const destination = reqBody.destination
    const datetime = reqBody.datetime
    const zoomUrl = reqBody.zoomUrl
    try {
        const docRef = db.collection('destinations').doc(destination).collection('meetings').doc(datetime)
        const doc = await docRef.get()
        if (doc.exists === false) {
            console.error(`${destination}:${datetime} is not exist`)
            throw new NotFoundError('Meeting not found');
        } else if (doc.data().isCancelled === true) {
            console.error(`${destination}:${datetime} is cancelled`)
            throw new NotFoundError('Meeting is cancelled');
        }
        // update isNotified true
        await docRef.set({
            startDatetime: doc.data().startDatetime,
            zoomUrl: doc.data().zoomUrl,
            isCancelled: doc.data().isCancelled,
            isNotified: true,
        })

        // Send push message
        // API Reference: https://developers.line.biz/ja/reference/messaging-api/#send-push-message
        console.log(`Push message to ${destination}: ${datetime}`)
        return client.pushMessage(destination, [
            {
                "type": "text",
                "text": `ミーティングの時間だよ\n\n${zoomUrl}`
            }
        ])
    } catch (error) {
        console.error(error)
        throw error
    }
}

app.listen(process.env.PORT, () => {
    console.log(`express server listening on port ${process.env.PORT}`);
});

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}
