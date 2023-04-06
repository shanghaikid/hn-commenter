chrome.storage.sync.get("apiKey", function (data) {
  let apiKey = data.apiKey;
  // Create a function to extract the comments and generate a response
  function generateResponse(button) {
    // Get the story title
    let title = document.querySelector(".title a").innerText;

    // Get the top-level comment elements
    let rows = Array.from(
      document.querySelectorAll(".comment-tree .athing.comtr")
    );

    const comments = [];

    let started = false;

    for (let i = rows.length - 1; i >= 0; i--) {
      const row = rows[i];
      const indentLevel = row.querySelector(".ind").getAttribute("indent");
      const start = row.contains(button);
      started = started || start;

      if (started) {
        if (!row.querySelector(".commtext.c00")) continue;

        const comment = {
          content: row.querySelector(".commtext.c00").innerText,
          level: Number(indentLevel),
        };

        if (comments.length === 0 || comment.level < comments[0].level) {
          comments.unshift(comment);
        }
      }
    }

    // Combine the comments into a single string
    let commentText = comments.map((comment) => comment.content).join("\n\n");
    console.log(commentText);
    // Generate a response using the ChatGPT API
    fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: `Topic: ${title}\n\nComments: ${commentText}`,
        max_tokens: 1024,
        temperature: 0.5,
        n: 1,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Display the response to the user
        let responseText = data.choices[0].text;
        alert(responseText);
      })
      .catch((error) => {
        console.error(error);
        alert("Error generating response. Please try again later.");
      });
  }

  // Get the reply links and add a button next to each one
  let replyLinks = document.querySelectorAll(".reply a");
  replyLinks.forEach((link) => {
    let button = document.createElement("button");
    button.innerText = "ChatGPT Reply";
    button.style.marginLeft = "10px";
    button.addEventListener("click", () => generateResponse(button));
    link.parentNode.insertBefore(button, link.nextElementSibling);
  });
});
