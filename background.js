// Currently empty, can be used for future background tasks
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ techKeywords });
});