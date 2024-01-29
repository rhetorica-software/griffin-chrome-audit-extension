// document.addEventListener("submit", event => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     console.log(formData);
//     chrome.runtime.sendMessage({
//         action: "submitFormData",
//         data: {
//             url: window.location.href,
//             formData: Object.fromEntries(formData.entries())
//         }
//     })
//     .then(response => console.log(response));
// });