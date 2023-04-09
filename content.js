// const
const buttonText = `Get reply from ChatGPT`;
const copyButtonText = `Copy reply`;

// filter
function filterText(text) {
  return text.replaceAll(buttonText, "");
}
// get messages from thread
function getMessages(button, data) {
  // Get the story title or
  const linkElm = document.querySelector(".titleline a");
  const linkText = linkElm.innerText;
  const topicLink = linkElm.href;
  const topicTextElm = document.querySelector(".toptext");
  const topicText = (topicTextElm && topicTextElm.innerText) || "";
  const topicAuthor = document
    .querySelector(".fatitem")
    .querySelector(".hnuser").innerText;
  const topic = (linkText + " " + topicText).replace(/[\n\t]+/g, " ");

  // Get the top-level comment elements
  const rows = Array.from(
    document.querySelectorAll(".comment-tree .athing.comtr")
  );

  const messages = [];

  let started = false;

  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i];
    const indentLevel = row.querySelector(".ind").getAttribute("indent");
    const author = row.querySelector(".hnuser").innerText;
    const start = row.contains(button);
    started = started || start;

    if (started) {
      if (!row.querySelector(".commtext.c00")) continue;

      const comment = {
        role: "user",
        content: `${author} replied: ${filterText(
          row.querySelector(".commtext.c00").innerText
        )}`,
        level: Number(indentLevel),
      };

      if (messages.length === 0 || comment.level < messages[0].level) {
        messages.unshift(comment);
      }
    }
  }

  // clean
  messages.forEach((m) => {
    delete m.level;
  });

  // build top info
  const topInfo = {
    role: "user",
    content: `${topicAuthor} posted a link in HN: ${topicLink}, and said: ${
      topicText ? topic : linkText
    }`,
  };
  messages.unshift(topInfo);

  // build system
  const system = {
    role: "system",
    content: data.systemRole || "As a software engineer in silicon valley",
  };
  messages.unshift(system);

  // question
  if (data.finalQuestion) {
    messages.push({
      role: "user",
      content: data.finalQuestion,
    });
  }

  return messages;
}

// Create a function to extract the comments and generate a response
function getReply(data, button) {
  const apiKey = data.apiKey;
  const model = data.modelName;

  const messages = getMessages(button, data);
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
      copyBtn.innerText =  copyButtonText;
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

chrome.storage.sync.get(
  ["apiKey", "modelName", "systemRole", "finalQuestion"],
  function (data) {
    // Get the reply links and add a button next to each one
    let replyLinks = document.querySelectorAll(".reply a");
    replyLinks.forEach((link) => {
      let button = document.createElement("button");
      button.innerText = buttonText;
      button.style.marginLeft = "10px";
      button.addEventListener("click", () => getReply(data, button));
      link.parentNode.insertBefore(button, link.nextElementSibling);
    });

    // Listen for a click event on any of the buttons
    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("copyButton")) {
        const postTitle = event.target.getAttribute("data-reply");
        navigator.clipboard.writeText(postTitle);
        event.target.innerText = 'Copied';
        setTimeout(() => {
          event.target.innerText = copyButtonText;
        }, 1000)
      }
    });
  }
);
