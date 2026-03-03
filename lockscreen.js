/**
 * JCF-EXPRESS Lockscreen Logic v4.1
 */

document.addEventListener('DOMContentLoaded', () => {
    const msgElement = document.getElementById('msg');

    // 1. Get custom message
    chrome.storage.local.get(['lockMessage'], (data) => {
        if (data.lockMessage) msgElement.textContent = data.lockMessage;
    });

    // 2. Force Fullscreen on any interaction
    const enterFS = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    };
    
    document.addEventListener('click', enterFS);
    document.addEventListener('keydown', enterFS);

    // 3. Auto-close if unlocked via context menu
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.isLocked && changes.isLocked.newValue === false) {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
            window.close();
        }
    });
});