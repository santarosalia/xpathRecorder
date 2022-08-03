let color = "";
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
});

chrome.runtime.onMessage.addListener(
  async (request, sender, sendResponse) => {}
);
