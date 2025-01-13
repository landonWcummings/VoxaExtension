export async function callApi(text) {
    const url = "https://aeed-64-149-153-183.ngrok-free.app/generate";
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      console.log("API response:", data);
      return data.text; // Adjust if the API response structure differs
    } catch (error) {
      console.error("Error during API call:", error);
      throw error;
    }
  }
  