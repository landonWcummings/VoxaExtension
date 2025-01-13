(async function () {
  async function callApi(text) {
    const url = "https://aeed-64-149-153-183.ngrok-free.app/generate";
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
  
      console.log("API received: ", response);
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      // Read the response JSON only once
      const data = await response.json();
      console.log("API response body: ", data);
  
      // Return the specific text field if it exists
      return data.response || "Failed to get response.";
    } catch (error) {
      console.error("Error during API call:", error);
      throw error;
    }
  }
  

  const replyButton = document.querySelector('div[aria-label="Reply"]');
  if (replyButton) {
    replyButton.click();

    setTimeout(async () => {
      const replyBox = document.querySelector(
        'div.Am.aiL.aO9.Al.editable.LW-avf.tS-tW[contenteditable="true"]'
      );

      if (!replyBox) {
        console.log("Reply box not found.");
        return;
      }

      replyBox.innerHTML = "loading";
      const inputEvent = new Event("input", { bubbles: true, cancelable: true });
      replyBox.dispatchEvent(inputEvent);

      const originalMessage = document.querySelector('.a3s.aiL');
      let messageText = "Could not find the original message.";
      if (originalMessage) {
        messageText = originalMessage.innerText.trim().replace(/\s+/g, " ");
      }

      try {
        const apiResponse = await callApi(messageText);
        replyBox.innerHTML = apiResponse;
        replyBox.dispatchEvent(inputEvent);
      } catch {
        replyBox.innerHTML = "Error generating response.";
        replyBox.dispatchEvent(inputEvent);
      }
    }, 1000);
  } else {
    console.log("Reply button not found.");
  }
})();
