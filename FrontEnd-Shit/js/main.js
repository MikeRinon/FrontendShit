// Main entry point - imports and initializes all modules

import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initInteractions } from './interactions.js';
import { initAnalytics } from './analytics.js';

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAnimations();
    initInteractions();
    initAnalytics();
});
