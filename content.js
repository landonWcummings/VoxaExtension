(async function () {
  let userEmail;
  async function callApi(text, subject) {
    // Updated ngrok URL as per the curl command
    const url = "https://immense-neatly-condor.ngrok-free.app/generate";
    try {
      const accountElement = document.querySelector('a[href*="SignOutOptions"], a[aria-label*="@gmail.com"]');
      if (accountElement) {
        userEmail = accountElement.getAttribute("aria-label").match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (userEmail) {
          console.log("User's Gmail address:", userEmail[0]);
        } else {
          console.log("Email not found in aria-label.");
        }
      } else {
        console.log("Account element not found.");
      }
    } catch (error) {
      console.error("Error fetching user's email:", error);
    }

    try {
      console.log("Sending message: ", text);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Updated body to include ID and inference
        body: JSON.stringify({
          text: text,
          ID: userEmail,
          //ID: "ericacummings@gmail.com",
          inference: true,
          subject: subject
        }),
      });
  
      console.log("API received response status:", response.status);
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      // Read the response JSON only once
      const data = await response.json();
      console.log("API response body:", data);
  
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

      // Extract the original email message
      const originalMessage = document.querySelector('.a3s.aiL');
      let messageText = "Could not find the original message.";
      if (originalMessage) {
        messageText = originalMessage.innerText.trim().replace(/\s+/g, " ");
      }

      // Extract the email subject
      const subjectElement = document.querySelector('.hP'); // 'hP' is the class used by Gmail for the subject
      let subjectText = "Subject not found.";
      if (subjectElement) {
        subjectText = subjectElement.innerText.trim();
      }

      // Output the extracted data
      console.log("Subject:", subjectText);
      console.log("Message:", messageText);

      try {
        const apiResponse = await callApi(messageText,subjectText);
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
