document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("workingSlider");
  let intervalId = null;

  // Load the saved state and set default to true if not present
  console.log("Loading state from chrome.storage...");
  chrome.storage.sync.get({ working: true }, (data) => {
    console.log("Loaded state:", data);
    slider.checked = data.working;
    if (slider.checked) {
      console.log("Slider is checked. Starting task execution.");
      intervalId = setInterval(executeTask, 500);
    }
  });

  // Save the state whenever the slider is toggled
  slider.addEventListener("change", () => {
    const isWorking = slider.checked;
    console.log("Slider toggled. New state:", isWorking);
    chrome.storage.sync.set({ working: isWorking }, () => {
      console.log("State saved to chrome.storage:", isWorking);
    });

    if (isWorking) {
      console.log("Starting task execution.");
      intervalId = setInterval(executeTask, 200);
    } else {
      console.log("Stopping task execution.");
      clearInterval(intervalId);
      intervalId = null;
    }
  });

  // Function to execute every 0.2 seconds
  function executeTask() {
    console.log("Executing task...");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ["content.js"],
        }, () => {
          if (chrome.runtime.lastError) {
            console.error("Error executing script:", chrome.runtime.lastError.message);
          } else {
            console.log("Script executed successfully.");
          }
        });
      } else {
        console.error("No active tab found.");
      }
    });
  }
});
