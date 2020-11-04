const axios = require('axios')
const core = require('@actions/core');

const wait = function (milliseconds) {
    return new Promise((resolve) => {
        if (typeof milliseconds !== 'number') {
            throw new Error('milliseconds not a number');
        }
        setTimeout(() => resolve("done!"), milliseconds)
    });
};

async function run() {
    try {

        // Setup general variables
        const apiEndpoint = 'https://api.crashtest.cloud/webhook';
        const status = 100; // 100 = Queued

        // Load Configuration
        const crashtestWebhook = core.getInput('crashtest-webhook');
        const pullReport = core.getInput('pull-report');

        console.log(`Sending Webhook for ${crashtestWebhook}`);

        try {
            const response = await axios.post(`${apiEndpoint}/${crashtestWebhook}`);
            const scanId = response.data.data.scanId;
        } catch(error) {
            errorMsg = error.response.data.message
            core.setFailed(`Could not start Scan for Webhook ${crashtestWebhook}. Reason: ${errorMgs}.`);
            return
        }

        if (!scanID) {
            core.setFailed(`Could not start Scan for Webhook ${crashtestWebhook}.`);
            return
        }

        console.log(`Started Scan for Webhook ${crashtestWebhook}. Scan ID is ${scanId}.`)

        if (pullReport == 'false') {
            console.log("Skipping the download of the scan report.");
            return
        }

        while (status <= 101) {
            console.log(`Scan Status currently is ${status} (101 = Running)`);

            // Only poll every minute
            await wait(60000);

            // Refresh status
            try {
                response = await axios.get(`${apiEndpoint}/${crashtestWebhook}/scans/${scanId}/status`);
                status = response.data.data.status.status_code;
            } catch(error) {
                errorMsg = error.response.data.message
                core.setFailed(`Retreiving Scan Status failed for Webhook ${crashtestWebhook}. Reason: ${errorMgs}.`);
                return
            }

        }

        console.log(`Scan finished with status ${status}.`)

    } catch (error) {
        core.setFailed(error.message);
        return
    }
}

run();