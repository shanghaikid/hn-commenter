chrome.storage.sync.get("apiKey", function (data) {
  let apiKey = data.apiKey;
  // Create a function to extract the comments and generate a response
  function generateResponse() {
    // Get the story title
    let title = document.querySelector(".title a").innerText;

    // Get the top-level comment elements
    let comments = Array.from(
      document.querySelectorAll(".comment-tree .athing.comtr")
    );

    // Create an array to hold the extracted data
    let commentData = [];

    // Loop through each top-level comment element
    comments.forEach((comment) => {
      // Extract the comment's text
      let text = comment.querySelector(".comment").innerText.trim();

      // Extract the comment's author and points
      let author = comment.querySelector(".hnuser").innerText;
      // let points = comment.querySelector(".score").innerText;

      // Extract the comment's sub-comments
      let subComments = [];
      let subCommentElements = Array.from(
        comment.nextElementSibling.querySelectorAll(".athing.comtr")
      );

      // Loop through each sub-comment element and extract its text, author, and points
      subCommentElements.forEach((subComment) => {
        console.log("subComment", subComment);
        let subText = subComment.querySelector(".comment").innerText.trim();
        let subAuthor = subComment.querySelector(".hnuser").innerText;
        // let subPoints = subComment.querySelector(".score").innerText;
        subComments.push({
          text: subText,
          author: subAuthor,
          // points: subPoints,
        });
      });

      // Add the extracted data to the commentData array
      commentData.push({
        text: text,
        author: author,
        // points: points,
        subComments: subComments,
      });
    });

    // Combine the comments into a single string
    let commentText = commentData.map((comment) => comment.text).join("\n\n");
    console.log(commentText);
    // // Generate a response using the ChatGPT API
    // fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${apiKey}`,
    //   },
    //   body: JSON.stringify({
    //     prompt: `Topic: ${title}\n\nComments: ${commentText}`,
    //     max_tokens: 1024,
    //     temperature: 0.5,
    //     n: 1,
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     // Display the response to the user
    //     let responseText = data.choices[0].text;
    //     alert(responseText);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     alert("Error generating response. Please try again later.");
    //   });
  }

  // Get the reply links and add a button next to each one
  let replyLinks = document.querySelectorAll(".reply a");
  replyLinks.forEach((link) => {
    let button = document.createElement("button");
    button.innerText = "Generate Response";
    button.style.marginLeft = "10px";
    button.addEventListener("click", generateResponse);
    link.parentNode.insertBefore(button, link.nextElementSibling);
  });
});


// const table = document.getElementById("commentsTable");
// const rows = table.getElementsByTagName("tr");
// const comments = [];

// for (let i = 0; i < rows.length; i++) {
//   const row = rows[i];
//   const indentLevel = row.getAttribute("indent");
//   if (indentLevel === "0") {
//     const comment = { content: row.querySelector(".comment-content").innerText, subComments: [] };
//     let nextRow = row.nextElementSibling;
//     while (nextRow && nextRow.getAttribute("indent") > indentLevel) {
//       comment.subComments.push(nextRow.querySelector(".comment-content").innerText);
//       nextRow = nextRow.nextElementSibling;
//     }
//     comments.push(comment);
//   }
// }

// console.log(comments);