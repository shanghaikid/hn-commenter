 // Get the input field elements
 const apiKeyInput = document.getElementById("api_key");
 const modelNameInput = document.getElementById("model_name");
 const userRoleInput = document.getElementById("user_role");
 const userActionInput = document.getElementById("user_action");

 // Get the stored options and update the input fields
 chrome.storage.sync.get(
   ["openaiApiKey", "openaiModelName", "userRole", "userAction"],
   function (items) {
     apiKeyInput.value = items.openaiApiKey;
     modelNameInput.value = items.openaiModelName;
     userRoleInput.value = items.userRole;
     userActionInput.value = items.userAction;
   }
 );

 // Get the save button element
 const saveButton = document.getElementById("save_button");

 // Add an event listener to the save button to save the options when it is clicked
 saveButton.addEventListener("click", function () {
   // Get the values of the input fields
   const apiKey = apiKeyInput.value;
   const modelName = modelNameInput.value;
   const userRole = userRoleInput.value;
   const userAction = userActionInput.value;

   console.log('xxx')

   // Save the options to the Chrome storage
   chrome.storage.sync.set(
     {
       openaiApiKey: apiKey,
       openaiModelName: modelName,
       userRole: userRole,
       userAction: userAction,
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