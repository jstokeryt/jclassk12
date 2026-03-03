/**
 * JCF-EXPRESS Blocker Script v4.1
 */

(function() {
    const handleStateLogic = (data) => {
        const currentUrl = window.location.href;
        if (currentUrl.includes(chrome.runtime.id)) return;

        // 1. WHILE LOCKED: Freeze other tabs
        if (data.isLocked === true) {
            window.stop();
            document.documentElement.innerHTML = `<div style="background:black; height:100vh; width:100vw;"></div>`;
            return;
        }

        // 2. INITIALIZING
        if (data.isInitializing === true) {
            window.stop();
            window.location.replace(chrome.runtime.getURL(`jsload.html?jsurl=${encodeURIComponent(currentUrl)}`));
            return;
        }

        // 3. CONNECTION ERROR
        if (data.connectionError === true) {
            window.stop();
            window.location.replace(chrome.runtime.getURL(`jssettings.html?jsurl=${encodeURIComponent(currentUrl)}`));
            return;
        }

        // 4. WEB FILTER (Injected Block)
        const list = data.blocklist || [];
        if (list.some(domain => window.location.hostname.includes(domain))) {
            window.stop();
            injectBlockUI(data.userName || "Student");
            return;
        }
    };

    function injectBlockUI(userName) {
        document.documentElement.innerHTML = '';
        document.documentElement.style.backgroundColor = "#1a252f";
        const host = document.createElement('div');
        document.documentElement.appendChild(host);
        const shadow = host.attachShadow({mode: 'closed'});
        shadow.innerHTML = `
            <style>
                .wrapper { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #1a252f; color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: sans-serif; z-index: 2147483647; text-align: center; }
                h1 { font-size: 3.5rem; color: #f39c12; margin: 0; }
                .user { margin-top: 20px; color: #bdc3c7; }
            </style>
            <div class="wrapper">
                <h1>RESTRICTED</h1>
                <p>Website blocked by Classroom Administrator.</p>
                <div class="user">User: <b>${userName}</b></div>
            </div>`;
    }

    chrome.storage.onChanged.addListener(() => chrome.storage.local.get(null, handleStateLogic));
    chrome.storage.local.get(null, handleStateLogic);
})();