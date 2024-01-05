chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "submitFormData") {
        const { url, formData } = message.data;
        fetch("http://localhost:3100", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Data sent: ", data);
        })
        .catch(error => {
            console.error("There was an error sending the data: ", error);
        });
    }
});