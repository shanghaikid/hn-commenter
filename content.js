chrome.storage.sync.get("apiKey", function (data) {
  const apiKey = data.apiKey;
  const buttonText = `Get reply from ChatGPT`;
  const model = `gpt-3.5-turbo`;
  const systemRole = `As a software engineer in Silicon Valley`;
  const instruction = ``;

  // filter
  function filterText(text) {
    return text.replaceAll(buttonText, "");
  }

  // Create a function to extract the comments and generate a response
  function generateResponse(button) {
    // Get the story title
    const title = document.querySelector(".title a").innerText;
    const top = { role: "system", content: title };

    // Get the top-level comment elements
    const rows = Array.from(
      document.querySelectorAll(".comment-tree .athing.comtr")
    );

    const messages = [];

    let started = false;

    for (let i = rows.length - 1; i >= 0; i--) {
      const row = rows[i];
      const indentLevel = row.querySelector(".ind").getAttribute("indent");
      const start = row.contains(button);
      started = started || start;

      if (started) {
        if (!row.querySelector(".commtext.c00")) continue;

        const comment = {
          role: "user",
          content: filterText(row.querySelector(".commtext.c00").innerText),
          level: Number(indentLevel),
        };

        if (messages.length === 0 || comment.level < messages[0].level) {
          messages.unshift(comment);
        }
      }
    }

    messages.forEach((m) => {
      delete m.level;
    });

    // add to top
    messages.unshift(top);

    // Combine the messages into a single string
    // let commentText = messages.map((comment) => comment.content).join("\n\n");
    console.log(messages);

    // start fetching
    button.innerText = `Generating reply ...`;
    // Generate a response using the ChatGPT API
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Display the response to the user
        const responseText = data.choices[0].message.content;
        // create a copy button
        const copyBtn = document.createElement("button");
        copyBtn.className = "copyButton";
        copyBtn.innerText = "Copy";
        copyBtn.setAttribute("data-reply", responseText);
        // put it beside the reply
        button.insertAdjacentElement("afterend", copyBtn);
        console.log(responseText);
      })
      .catch((error) => {
        console.error(error);
        alert("Error generating response. Please try again later.");
      })
      .finally(() => {
        button.innerText = buttonText;
      });
  }

  // Get the reply links and add a button next to each one
  let replyLinks = document.querySelectorAll(".reply a");
  replyLinks.forEach((link) => {
    let button = document.createElement("button");
    button.innerText = buttonText;
    button.style.marginLeft = "10px";
    button.addEventListener("click", () => generateResponse(button));
    link.parentNode.insertBefore(button, link.nextElementSibling);
  });

  // Listen for a click event on any of the buttons
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("copyButton")) {
      const postTitle = event.target.getAttribute("data-reply");
      navigator.clipboard.writeText(postTitle);
      alert("copied");
    }
  });
});
