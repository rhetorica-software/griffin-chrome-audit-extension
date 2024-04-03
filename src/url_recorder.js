const DELIMITER = "|";

export function setupUrlRecorderListener(settings) {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === "complete") {
            let logData = {
                title: tab.title.replace(/"/g, '\\"'), // Escaping quotation marks
                url: tab.url,
                timestamp: Date.now() * 1e6
            };

            const lokiUrl = settings['loki_url'] || "no_url_found_in_policy"; 
            const user = settings['user'] || "no_user_found";
            const workspace = settings['workspace'] || "no_workspace_found";
            const persona = settings['persona'] || "no_persona_found";
            const auth = 'Basic ' + btoa('admin' + ':' + 'admin'); // Encode credentials

            const payload = {
                streams: [
                    {
                        stream: { environment: settings['environment'] || "no_environment_found",
                                  organisation: settings['organisation'] || "no_organisation_found",},
                        // This is to produce a line like 'userId|workspaceId|personaId|"Some data that can include pipes | More data"|https://example.com'
                        values: [ [`${logData.timestamp}`, `${user}${DELIMITER}${workspace}${DELIMITER}${persona}${DELIMITER}"${logData.title}"${DELIMITER}${logData.url}`] ]
                    }
                ]
            };

            fetch(lokiUrl, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": auth
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                //return response.json();
            })
            //.then(data => console.log("Data sent: ", data))
            .catch(error => console.error("Error sending data: ", error));
        }
    });
}
