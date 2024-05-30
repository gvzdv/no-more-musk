document.addEventListener('DOMContentLoaded', function () {
  const toggleSwitch = document.getElementById('toggleSwitch');

  // Load the current state
  chrome.storage.sync.get('enabled', function (data) {
    toggleSwitch.checked = data.enabled || false; // Default to false if undefined
  });

  // Add event listener to the toggle switch
  toggleSwitch.addEventListener('change', function () {
    const isEnabled = toggleSwitch.checked;
    chrome.storage.sync.set({ enabled: isEnabled }, function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tabId = tabs[0].id;
        if (isEnabled) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
          }, () => {
            chrome.tabs.sendMessage(tabId, { action: 'enable' });
          });
        } else {
          chrome.tabs.sendMessage(tabId, { action: 'disable' });
        }
      });
    });
  });
});