console.log("url_recorder.js");

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // console.log("Inside the onUpdated listener");
    // console.log(tabId);
    // console.log(changeInfo);
    // console.log(tab);
    // Check if the tab is updated with a new URL
    if (changeInfo.url && tab.active) {
        let logData = {
            url: changeInfo.url,
            timestamp: Date.now() * 1e6
        };
        // console.log("Inside the changeInfo.url && tab.active conditional: ", logData);

        const payload = {
            streams: [
                {
                    stream: { // Labels + values
                        environment: "dev"
                    },
                    values: [
                        [`${logData.timestamp}`, logData.url]
                    ]
                }
            ]
        };

        // console.log("Payload being sent: ", JSON.stringify(payload));

        fetch("https://dev-loki.griffin-web.com:7443/loki/api/v1/push", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                // console.log(response);
                throw new Error("Network response was not ok");
            }
            // console.log("response here: ", response);
            // console.log(response);
            return response.json();
        })
        .then(data => {
            console.log("Data sent: ", data);
            //sendResponse("Data sent: " + JSON.stringify(data));
        })
        .catch(error => {
            console.error("There was an error sending the data: ", error);
            //sendResponse("There was an error sending the data: " + JSON.stringify(error));
        });
    }
});