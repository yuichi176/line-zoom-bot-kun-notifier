# line-zoom-bot-kun-notifier
Notification Application for line-zoom-bot-kun.

## Requirements

* Node.js >= 22

## Getting Started
1. Clone the repository

```shell
$ git clone git@github.com:yuichi176/line-zoom-bot-kun-notifier.git
```

2. Install dependencies

```shell
$ npm install
```

3. Set up environment variables

Create `.env.local` file in the root directory and set the following environment variables.

| Name                               | Description                                      |
|------------------------------------|--------------------------------------------------|
| LINE_CHANNEL_ACCESS_TOKEN          | Access token for the LINE channel                |
| LINE_CHANNEL_SECRET                | Secret key for the LINE channel                  |
| GOOGLE_APPLICATION_CREDENTIAL_PATH | Path to Google application credentials JSON file |
| GCP_PROJECT_ID                     | Google Cloud Platform project ID                 |
| PORT                               | Port number for the server to listen on          |

4. Run the server
```shell
$ npm run start
```
