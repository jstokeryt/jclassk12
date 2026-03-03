/**
 * JCF-EXPRESS Connection Recovery Logic v4.1
 */

function checkRecovery() {
    chrome.storage.local.get(['connectionError'], (data) => {
        // If the background script has flipped this to false, the internet is back
        if (data.connectionError === false) {
            const params = new URLSearchParams(window.location.search);
            const originalUrl = params.get('jsurl');
            
            // Redirect back to the site they were trying to visit, or Google
            window.location.replace(originalUrl ? decodeURIComponent(originalUrl) : "https://www.google.com");
        }
    });
}

// Check every 3 seconds to see if we are back online
setInterval(checkRecovery, 3000);

// Also display the username so they know who is logged in
chrome.storage.local.get(['userName'], (data) => {
    const userSpan = document.getElementById('user-display');
    if (userSpan && data.userName) {
        userSpan.textContent = data.userName;
    }
});