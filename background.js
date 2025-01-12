chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed!");
});

// Listen for messages from the popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "greet") {
    const url = "https://www.voxa.com"; // Replace with your website's URL
    chrome.tabs.create({ url });

  }
});
