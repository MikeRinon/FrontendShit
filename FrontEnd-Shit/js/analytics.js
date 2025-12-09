// Analytics and Event Tracking

export function initAnalytics() {
    trackButtonClicks();
    trackNavigationClicks();
}

function trackEvent(eventName, eventData = {}) {
    console.log(`Event: ${eventName}`, eventData);
    // You can replace this with actual analytics tracking
    // Example: gtag('event', eventName, eventData);
}

function trackButtonClicks() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const buttonText = btn.textContent.trim();
            trackEvent('button_click', { button: buttonText });
        });
    });
}

function trackNavigationClicks() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const linkText = link.textContent.trim();
            trackEvent('nav_click', { link: linkText });
        });
    });
}

export { trackEvent };
