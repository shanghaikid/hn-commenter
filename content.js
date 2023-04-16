// const
const buttonText = `Reply from ChatGPT`;

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
    // const author = row.querySelector(".hnuser").innerText;
    const start = row.contains(button);
    started = started || start;

    if (started) {
      if (!row.querySelector(".commtext.c00")) continue;

      const comment = {
        role: "user",
        content: `${filterText(row.querySelector(".commtext.c00").innerText)}`,
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
    content: `${
      data.systemRole || "As a software engineer in silicon valley"
    } `,
  };
  // https://community.openai.com/t/the-system-role-how-it-influences-the-chat-behavior/87353/2
  messages.push(system);

  // question
  messages.push({
    role: "user",
    content: data.finalQuestion || "How can I reply?",
  });

  return messages;
}

// Create a function to extract the comments and generate a response
function getReply({ data, button, link }) {
  const apiKey = data.apiKey;
  const model = data.modelName;
  const temp = data.temp;

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
      temperature: temp,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Display the response to the user
      const responseText = data.choices[0].message.content;
      localStorage.setItem("reply", responseText);

      console.log(responseText);
      window.location.href = link;
    })
    .catch((error) => {
      console.error(error);
      alert("Open AI is not working. Please try again later.");
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
      button.addEventListener("click", () =>
        getReply({ data, button, link: link.href })
      );
      link.parentNode.insertBefore(button, link.nextElementSibling);
    });
  }
);
