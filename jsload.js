/**
 * JCF-EXPRESS Initialization Handler
 * Watches for the 15s startup timer to end
 */

(function() {
    // 1. Get the original URL the user wanted to visit from the query string
    const params = new URLSearchParams(window.location.search);
    const encodedUrl = params.get('jsurl');
    const targetUrl = encodedUrl ? decodeURIComponent(encodedUrl) : "https://www.google.com";

    const doRedirect = () => {
        window.location.replace(targetUrl);
    };

    // 2. Initial Check: If the 15s timer finished before the page loaded
    chrome.storage.local.get(['isInitializing'], (data) => {
        if (data.isInitializing === false) {
            doRedirect();
        }
    });

    // 3. Live Listener: Fires the moment background.js sets isInitializing to false
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.isInitializing && changes.isInitializing.newValue === false) {
            console.log("Initialization complete. Redirecting...");
            doRedirect();
        }
    });

    // 4. Hard Fail-safe: If something glitches, redirect anyway after 20s
    setTimeout(() => {
        console.log("Safety timeout reached. Forcing redirect.");
        doRedirect();
    }, 20000);
})();