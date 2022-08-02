// Initialize butotn with users's prefered color
let recordButton = document.getElementById("record");
let xPath = document.getElementById("xPath");
// When the button is clicked, inject setPageBackgroundColor into current page
recordButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {},
  });
});

// The body of this function will be execuetd as a content script inside the
// current page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let d = document.createElement("p");
  d.textContent = request.xPath;
  xPath.appendChild(d);
  console.log("ok");
});
