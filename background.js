chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed!");
});

let isWorking = false;

// Listen for changes to the `working` state
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.working) {
    isWorking = changes.working.newValue;
    console.log("Working state changed:", isWorking);

    if (isWorking) {
      startContentScriptExecution();
    } else {
      stopContentScriptExecution();
    }
  }
});

// Function to start content script execution
function startContentScriptExecution() {
  console.log("Starting content script execution...");
  chrome.tabs.onUpdated.addListener(executeContentScript);
  chrome.tabs.onActivated.addListener(handleTabActivation);
}

// Function to stop content script execution
function stopContentScriptExecution() {
  console.log("Stopping content script execution...");
  chrome.tabs.onUpdated.removeListener(executeContentScript);
  chrome.tabs.onActivated.removeListener(handleTabActivation);
}

// Function to execute content script on active tabs
function executeContentScript(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.active) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["content.js"],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error("Error executing content script:", chrome.runtime.lastError.message);
        } else {
          console.log("Content script executed.");
        }
      }
    );
  }
}

// Handle content script execution when a tab is activated
function handleTabActivation(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.status === "complete") {
      executeContentScript(tab.id, { status: "complete" }, tab);
    }
  });
}

// Initialize the state on extension startup
chrome.storage.sync.get({ working: false }, (data) => {
  isWorking = data.working;
  console.log("Initial working state:", isWorking);

  if (isWorking) {
    startContentScriptExecution();
  }
});
