document.getElementById("capture").addEventListener("click", async () => {
  const response = await chrome.runtime.sendMessage({ type: "KUKOMO_GET_ACTIVE_TAB" });
  document.getElementById("result").textContent = `${response.title}\n${response.url}`;
});
