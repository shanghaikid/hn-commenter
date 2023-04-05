// Get the apiKeyInput and saveButton elements
let apiKeyInput = document.getElementById('apiKeyInput');
let saveButton = document.getElementById('saveButton');

// Load the user's API key from storage and set it as the default value for apiKeyInput
chrome.storage.sync.get('apiKey', function(data) {
  if (data.apiKey) {
    apiKeyInput.value = data.apiKey;
  }
});

// Add an event listener to the saveButton
saveButton.addEventListener('click', function() {
  // Save the user's API key to storage
  let apiKey = apiKeyInput.value;
  chrome.storage.sync.set({apiKey: apiKey}, function() {
    alert('API key saved!');
  });
});
