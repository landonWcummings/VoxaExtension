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

      // Replace or set the innerHTML to your desired text
      const text = "Test reply from script!";

      if (text !== replyBox.innerHTML.trim()){
        replyBox.innerHTML = text;

        // Dispatch an input event so Gmail recognizes the new content
        const inputEvent = new Event("input", {
          bubbles: true,
          cancelable: true,
        });
        replyBox.dispatchEvent(inputEvent);

        console.log("Reply written successfully!");
      } else {
        console.log("Text already there: sleeping")
        sleep(1000)
      }
      

    }, 1000); // Delay to allow the reply box to load
  } else {
    console.log("Reply button not found.");
  }
})();


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
