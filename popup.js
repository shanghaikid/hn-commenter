// Get the input field elements
const apiKeyInput = document.getElementById("api_key");
const modelNameInput = document.getElementById("model_name");
const systemRoleInput = document.getElementById("system_role");
const finalQuestionInput = document.getElementById("final_question");

// Get the stored options and update the input fields
chrome.storage.sync.get(
  ["apiKey", "modelName", "systemRole", "finalQuestion"],
  function (items) {
    apiKeyInput.value = items.apiKey || "";
    modelNameInput.value = items.modelName || "";
    systemRoleInput.value =
      items.systemRole || "As a software engineer in silicon valley";
    finalQuestionInput.value =
      items.finalQuestion || "";
  }
);

// Get the save button element
const saveButton = document.getElementById("save_button");

// Add an event listener to the save button to save the options when it is clicked
saveButton.addEventListener("click", function () {
  // Get the values of the input fields
  const apiKey = apiKeyInput.value;
  const modelName = modelNameInput.value;
  const systemRole = systemRoleInput.value;
  const finalQuestion = finalQuestionInput.value;

  // Save the options to the Chrome storage
  chrome.storage.sync.set(
    {
      apiKey,
      modelName,
      systemRole,
      finalQuestion,
    },
    function () {
      // Notify the user that the options have been saved
      const status = document.getElementById("status");
      status.textContent = "Options saved.";
      setTimeout(function () {
        status.textContent = "";
      }, 2000);
    }
  );
});
