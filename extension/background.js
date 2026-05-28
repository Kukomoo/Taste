chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "KUKOMO_GET_ACTIVE_TAB") {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      sendResponse({
        title: tab?.title ?? "Untitled tab",
        url: tab?.url ?? ""
      });
    });
    return true;
  }
  return false;
});
