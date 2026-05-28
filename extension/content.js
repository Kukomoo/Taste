window.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    chrome.runtime.sendMessage({
      type: "KUKOMO_COMMAND_HINT",
      payload: {
        title: document.title,
        url: location.href
      }
    });
  }
});
