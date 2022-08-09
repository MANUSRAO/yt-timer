let storageArr;
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {"newArr":storageArr});  
    });
chrome.runtime.onMessage.addListner(
    function(message, sender, sendResponse){
        storageArr = message.newArr;
        chrome.storage.local.set({"newArr": storageArr});
    }
)