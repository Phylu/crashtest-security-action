const axios = require('axios')
const core = require('@actions/core');
const github = require('@actions/github');

try {

    // Setup general variables
    const apiEndpoint = 'https://api.crashtest.cloud/webhook';

    // Load Configuration
    const crashtestWebhook = core.getInput('crashtest-webhook');
    const pullRreport = core.getInput('pull-report');

    console.log(`Sending Webhook for ${crashtestWebhook}`);

    axios
        .post(`${apiEndpoint}/${crashtestWebhook}`, {})
        .then(res => {
            console.log(`scanId: ${res.data.scanID}`)
            console.log(res)
        })
        .catch(error => {
            console.error(error)
        })

    if (pullRreport == 'true') {
        console.log("Waiting for the scan to finish in order to download the report.")
    } else {
        console.log("Skipping the download of the scan report.");
    }

} catch (error) {
    core.setFailed(error.message);
}