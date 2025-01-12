(function () {
  // Step 1: Find the reply button and click it
  const replyButton = document.querySelector('div[aria-label="Reply"]');
  if (replyButton) {
    replyButton.click();

    // Step 2: Wait for the reply box to appear and input text
    setTimeout(() => {
      // Use a more direct selector to find the contenteditable reply div
      const replyBox = document.querySelector(
        'div.Am.aiL.aO9.Al.editable.LW-avf.tS-tW[contenteditable="true"]'
      );

      if (!replyBox) {
        console.log("Reply box not found.");
        return;
      }

      // Focus on the reply box
      replyBox.focus();

      // Step 3: Extract the text of the message being replied to
      const originalMessage = document.querySelector('.a3s.aiL'); // Adjust selector as needed
      let messageText = "Could not find the original message.";
      if (originalMessage) {
        // Extract the text while maintaining line breaks
        const messageHTML = originalMessage.innerHTML.trim();
        messageText = messageHTML
          .replace(/(?:\r\n|\r|\n)/g, "<br>") // Ensure any text-based line breaks are converted to <br>
          .replace(/\s+/g, " "); // Clean up excessive whitespace
      }

      // Step 4: Replace or set the innerHTML to the message text
      if (messageText !== replyBox.innerHTML.trim()) {
        replyBox.innerHTML = messageText;

        // Dispatch an input event so Gmail recognizes the new content
        const inputEvent = new Event("input", {
          bubbles: true,
          cancelable: true,
        });
        replyBox.dispatchEvent(inputEvent);

        console.log("Reply written successfully!");
      } else {
        console.log("Text already there: sleeping");
        sleep(1000);
      }
    }, 1000); // Delay to allow the reply box to load
  } else {
    console.log("Reply button not found.");
  }
})();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
