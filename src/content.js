chrome.runtime.sendMessage(
    {
        message: "Hi message from content script"
    },
    (response) => {
        console.log(response.message);
    }
);