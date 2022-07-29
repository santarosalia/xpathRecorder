let color = "#3aa757";
const browser = this.browser;
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
});
chrome.webNavigation.onCompleted.addListener((e) => {
  let frame = chrome.webNavigation.getFrame({
    tabId: e.tabId,
    frameId: e.frameId,
  });
});

// chrome.runtime.onMessage.addListener(
//   async (request, sender, sendResponse) => {}
// );
