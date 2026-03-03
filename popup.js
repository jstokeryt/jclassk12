document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('studentName');
    const saveBtn = document.getElementById('saveName');
    const status = document.getElementById('statusMsg');

    // Load the existing name if it exists
    chrome.storage.local.get(['userName'], (data) => {
        if (data.userName) {
            nameInput.value = data.userName;
        }
    });

    // Save the name when button is clicked
    saveBtn.addEventListener('click', () => {
        const nameValue = nameInput.value.trim();
        
        if (nameValue) {
            // We use 'userName' to match the key in settings.html
            chrome.storage.local.set({ userName: nameValue }, () => {
                status.style.display = 'block';
                setTimeout(() => { status.style.display = 'none'; }, 2000);
            });
        } else {
            alert("Please enter a name.");
        }
    });
});