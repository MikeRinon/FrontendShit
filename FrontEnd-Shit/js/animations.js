// Animation Effects

export function initAnimations() {
    // Add keyframe animations to document
    injectAnimationStyles();

    // Initialize all animation observers
    initProgressBarAnimation();
    initCardAnimations();
    initHeroAnimation();
    initStatAnimation();
}

function injectAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
}

function initProgressBarAnimation() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = entry.target.querySelector('.progress-fill');
                if (progressFill) {
                    progressFill.style.transition = 'width 1s ease-out';
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cardMockup = document.querySelector('.card-mockup');
    if (cardMockup) {
        observer.observe(cardMockup);
    }
}

function initCardAnimations() {
    const featureCards = document.querySelectorAll('.feature-card, .step-card, .ai-feature-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`;
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    featureCards.forEach(card => {
        card.style.opacity = '0';
        cardObserver.observe(card);
    });
}

function initHeroAnimation() {
    window.addEventListener('load', () => {
        const heroText = document.querySelector('.hero-text');
        const heroImage = document.querySelector('.hero-image');
        
        if (heroText) {
            heroText.style.animation = 'slideInRight 0.8s ease-out';
        }
        if (heroImage) {
            heroImage.style.animation = 'fadeInUp 0.8s ease-out 0.2s forwards';
            heroImage.style.opacity = '0';
        }
    });
}

function initStatAnimation() {
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStat = document.querySelector('.hero-stat');
    if (heroStat) {
        statObserver.observe(heroStat);
    }
}

export function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
}
