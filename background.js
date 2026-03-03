/**
 * JCF-EXPRESS Background Service Worker v4.1
 */

const STARTUP_DURATION = 15000;

function performStartup() {
    chrome.storage.local.set({ isInitializing: true, connectionError: false });
    chrome.storage.local.get(['userName', 'lockMessage'], (data) => {
        if (!data.userName) chrome.storage.local.set({ userName: "Student" });
        if (!data.lockMessage) chrome.storage.local.set({ lockMessage: "EYES ON THE TEACHER" });
    });
    setTimeout(() => {
        chrome.storage.local.set({ isInitializing: false });
    }, STARTUP_DURATION);
}

chrome.runtime.onInstalled.addListener(() => {
    performStartup();
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: "lockToggle",
            title: "🔒 Lock Student Screen",
            contexts: ["action"] 
        });
    });
});

chrome.runtime.onStartup.addListener(performStartup);

// Handle Right-Click Clicks
chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "lockToggle") {
        chrome.storage.local.get(['isLocked'], (data) => {
            const newState = !data.isLocked;
            
            if (newState === true) {
                // LOCKING: Create the new lock tab
                chrome.tabs.create({ 
                    url: chrome.runtime.getURL("lockscreen.html"),
                    active: true 
                });
            } else {
                // UNLOCKING: Find the lock tab and close it
                chrome.tabs.query({ url: chrome.runtime.getURL("lockscreen.html") }, (tabs) => {
                    tabs.forEach(tab => chrome.tabs.remove(tab.id));
                });
            }

            chrome.storage.local.set({ isLocked: newState }, () => {
                chrome.contextMenus.update("lockToggle", {
                    title: newState ? "🔓 Unlock Student Screen" : "🔒 Lock Student Screen"
                });
            });
        });
    }
});

// WordPress Connection Heartbeat
async function checkConnection() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    try {
        await fetch(`https://jstokeryt.wordpress.com/?t=${Date.now()}`, { 
            mode: 'no-cors', cache: 'no-store', signal: controller.signal 
        });
        clearTimeout(timeoutId);
        chrome.storage.local.set({ connectionError: false });
    } catch (e) {
        chrome.storage.local.set({ connectionError: true });
    }
}
setInterval(checkConnection, 15000);

// Network Error Interception (Redirects to jssettings.html)
chrome.webNavigation.onErrorOccurred.addListener((details) => {
    if (details.frameId !== 0) return;
    const networkErrors = ["net::ERR_NAME_NOT_RESOLVED", "net::ERR_INTERNET_DISCONNECTED", "net::ERR_CONNECTION_TIMED_OUT"];
    if (networkErrors.includes(details.error)) {
        const target = encodeURIComponent(details.url);
        chrome.tabs.update(details.tabId, { 
            url: chrome.runtime.getURL(`jssettings.html?jsurl=${target}`) 
        });
    }
});