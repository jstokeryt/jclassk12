// settings.js (For your Website Block Screen)
document.addEventListener('DOMContentLoaded', () => {
    // Lock the tab title
    const finalTitle = "Jstoker Content Filtering";
    document.title = finalTitle;

    // Block right-click
    document.addEventListener('contextmenu', e => e.preventDefault());

    // Stop any auto-redirects - this page is a dead end for blocked sites
    console.log("Access Restricted to this domain.");
});