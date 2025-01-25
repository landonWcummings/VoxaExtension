// Update the status text based on the slider state
const updateStatusText = (isWorking) => {
  if (!isWorking) {
    statusText.textContent = "Voxa off";
    return;
  }

  // Check if the current tab is a Gmail tab and retrieve the user's email
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      statusText.textContent = "Voxa off";
      return;
    }

    const currentTab = tabs[0];
    const url = currentTab.url || "";

    if (url.includes("mail.google.com")) {
      chrome.scripting.executeScript(
        {
          target: { tabId: currentTab.id },
          func: () => {
            const accountElement = document.querySelector(
              'a[href*="SignOutOptions"], a[aria-label*="@gmail.com"]'
            );
            return accountElement
              ? accountElement.getAttribute("aria-label").match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0]
              : null;
          },
        },
        async (results) => {
          const email = results?.[0]?.result || null;
          if (email) {
            const isVerified = await checkEmailVerification(email);
            if (isVerified) {
              statusText.textContent = `Active on ${email}`;
            } else {
              statusText.innerHTML = `Email not signed up. <a href="https://voxa.com" target="_blank">Sign up at voxa.com</a>. On the free plan, you get 5 free drafts a day.`;
            }
          } else {
            statusText.textContent = "Voxa off";
          }
        }
      );
    } else {
      statusText.textContent = "Voxa off";
    }
  });
};

// Helper function to check email verification
const checkEmailVerification = async (email) => {
  try {
    const response = await fetch("https://immense-neatly-condor.ngrok-free.app/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        //ID: email,
        ID: "ericacummings@gmail.com",
        inference: false, // Change inference to false for verification
        text: "verify",
        subject: "verify",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.verified === true; // Assume the API responds with a `verified` field
    }
  } catch (error) {
    console.error("Error verifying email:", error);
  }
  return false;
};

// Add event listener for slider toggle
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("workingSlider");
  const statusText = document.getElementById("statusText");

  // Query the background script for the current state
  chrome.runtime.sendMessage({ type: "getWorkingState" }, (response) => {
    if (response && response.isWorking !== undefined) {
      slider.checked = response.isWorking;
      updateStatusText(response.isWorking);
    }
  });

  // Save the state when the slider is toggled
  slider.addEventListener("change", () => {
    const isWorking = slider.checked;
    chrome.storage.sync.set({ working: isWorking }, () => {
      console.log("State saved to chrome.storage:", isWorking);
      updateStatusText(isWorking);
    });
  });
});
