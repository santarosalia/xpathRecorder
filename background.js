let color = "";
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
});

chrome.runtime.onMessage.addListener(
  async (request, sender, sendResponse) => {}
);

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, "toggle");
});
