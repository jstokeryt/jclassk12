document.addEventListener('DOMContentLoaded', () => {
    const userNameInput = document.getElementById('userName');
    const lockMsgInput = document.getElementById('lockMessage');
    const blocklistInput = document.getElementById('blocklist');
    const saveBtn = document.getElementById('saveBtn');
    const statusMsg = document.getElementById('status');

    chrome.storage.local.get(['userName', 'lockMessage', 'blocklist'], (data) => {
        if (data.userName) userNameInput.value = data.userName;
        if (data.lockMessage) lockMsgInput.value = data.lockMessage;
        if (data.blocklist) blocklistInput.value = data.blocklist.join(', ');
    });

    saveBtn.addEventListener('click', () => {
        const listValue = blocklistInput.value.split(',').map(i => i.trim().toLowerCase()).filter(i => i !== "");
        chrome.storage.local.set({
            userName: userNameInput.value || "Student",
            lockMessage: lockMsgInput.value || "EYES ON THE TEACHER",
            blocklist: listValue
        }, () => {
            statusMsg.style.display = 'block';
            setTimeout(() => { statusMsg.style.display = 'none'; }, 2000);
        });
    });
});