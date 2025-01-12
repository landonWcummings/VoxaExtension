document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("workingSlider");

  // Load the saved state
  chrome.storage.sync.get({ working: true }, (data) => {
    slider.checked = data.working;
  });

  // Save the state when the slider is toggled
  slider.addEventListener("change", () => {
    const isWorking = slider.checked;
    chrome.storage.sync.set({ working: isWorking }, () => {
      console.log("State saved to chrome.storage:", isWorking);
    });
  });
});
