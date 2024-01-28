console.log("form_recorder.js");

export function setupFormRecorderListener(settings) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "submitFormData") {
        const { url, formData } = message.data;
        const payload = {
            streams: [
                {
                    stream: {
                        foo: "bar"
                    },
                    values: [
                        [ `${Date.now() * 1e6}`, `[${url}]: ${JSON.stringify(formData)}` ]
                    ]
                }
            ]
        };

        // console.log("Inside the onMessage listener: ", payload);
        
        fetch("https://dev-loki.griffin-web.com:7443/loki/api/v1/push", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Data sent: ", data);
            sendResponse("Data sent: " + JSON.stringify(data));
        })
        .catch(error => {
            console.error("There was an error sending the data: ", error);
            sendResponse("There was an error sending the data: " + JSON.stringify(error));
        });
    }

    return true;
})};