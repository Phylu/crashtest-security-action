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
        const pullRreport = core.getInput('pull-report');

        console.log(`Sending Webhook for ${crashtestWebhook}`);

        axios
            .post(`${apiEndpoint}/${crashtestWebhook}`)
            .then(res => {
                const scanId = res.data.data.scanId
                console.log(`scanId: ${res.data.data.scanId}`)
            })
            .catch(error => {
                core.setFailed(error.message);
                return
            })

        if (scanId != undefined) {
            console.log(`Started Scan for Webhook ${crashtestWebhook}. Scan ID is ${scanId}.`)
        } else {
            core.setFailed(`Could not start Scan for Webhook ${crashtestWebhook}.`);
            return
        }

        if (pullRreport == 'false') {
            console.log("Skipping the download of the scan report.");
            return
        }

        while (status <= 101) {
            console.log(`Scan Status currently is ${status} (101 = Running)`);

            // Only poll every minute
            await wait(60000);

            // Refresh status
            axios
                .get(`${apiEndpoint}/${crashtestWebhook}/scans/${scanId}/status`)
                .then(res => {
                    const status = res.data.data.status.status_code
                    console.log(`status: ${res.data.data.status.status_code}`)
                })
                .catch(error => {
                    core.setFailed(error.message);
                    return
                })
        }

        console.log(`Scan finished with status ${status}.`)

    } catch (error) {
        core.setFailed(error.message);
        return
    }
}

run();