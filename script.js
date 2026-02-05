/**
 * Simple Tort - Interactive JavaScript
 * Handles smooth scrolling, scroll-triggered animations, and user interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initSmoothScroll();
    initScrollAnimations();
    initButtonInteractions();
    initHeaderScroll();
});

/**
 * Smooth Scroll Navigation
 * Enables smooth scrolling when clicking navigation links
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll-Triggered Animations
 * Uses Intersection Observer to animate elements as they enter the viewport
 */
function initScrollAnimations() {
    // Elements to animate
    const animatedElements = [
        ...document.querySelectorAll('.workflow-card'),
        ...document.querySelectorAll('.config-item'),
        ...document.querySelectorAll('.feature-item')
    ];
    
    // Intersection Observer configuration
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get delay from data attribute
                const delay = entry.target.dataset.delay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay * 100);
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Section headers animation
    const sectionHeaders = document.querySelectorAll('.section-header');
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                headerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    sectionHeaders.forEach(header => {
        header.style.opacity = '0';
        header.style.transform = 'translateY(30px)';
        header.style.transition = 'all 0.6s ease';
        headerObserver.observe(header);
    });
}

/**
 * Button Interactions
 * Handles click events on CTA buttons
 */
function initButtonInteractions() {
    const heroCta = document.getElementById('heroCta');
    const ctaButton = document.getElementById('ctaButton');
    const headerCta = document.querySelector('.header-cta');
    
    const ctaButtons = [heroCta, ctaButton, headerCta];
    
    ctaButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', (e) => {
                // Create ripple effect
                createRipple(e, button);
                
                // Show demo modal (placeholder)
                setTimeout(() => {
                    showDemoModal();
                }, 300);
            });
        }
    });
    
    // Video button interaction
    const videoBtn = document.querySelector('.btn-secondary');
    if (videoBtn) {
        videoBtn.addEventListener('click', () => {
            showVideoModal();
        });
    }
}

/**
 * Create Ripple Effect
 * Adds a visual ripple effect on button click
 */
function createRipple(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    // Add animation keyframes if not already added
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

/**
 * Show Demo Modal
 * Displays a modal for scheduling a demo
 */
function showDemoModal() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    overlay.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-icon">📅</div>
            <h3 class="modal-title">Request monday.com Talent</h3>
            <p class="modal-text">Thank you for your interest! <br>You can contact us by emailing your needs to - <b>contact@mondaystaffings.com</b><br>
Our team will contact you within 24 hours to discuss your monday.com staffing needs and match you with the right experts.</p>
          
        </div>
    `;
    
    // Add modal styles
    addModalStyles();
    
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    
    // Animate in
    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });
    
    // Close handlers
    overlay.querySelector('.modal-close').addEventListener('click', () => closeModal(overlay));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay);
    });
    
    // Form submission
    overlay.querySelector('#demoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        showSuccessMessage(overlay);
    });
}

/**
 * Show Video Modal
 * Displays a placeholder for video content
 */
function showVideoModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    overlay.innerHTML = `
        <div class="modal-content video-modal">
            <button class="modal-close">&times;</button>
            <div class="video-placeholder">
                <div class="play-icon">▶</div>
                <p>Product Demo Video</p>
            </div>
        </div>
    `;
    
    addModalStyles();
    
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    
    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });
    
    overlay.querySelector('.modal-close').addEventListener('click', () => closeModal(overlay));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay);
    });
}

/**
 * Close Modal
 * Handles modal closing animation and cleanup
 */
function closeModal(overlay) {
    overlay.classList.remove('active');
    
    setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
    }, 300);
}

/**
 * Show Success Message
 * Displays success feedback after form submission
 */
function showSuccessMessage(overlay) {
    const content = overlay.querySelector('.modal-content');
    
    content.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✓</div>
            <h3 class="modal-title">Thank You!</h3>
            <p class="modal-text">We've received your request. Our team will reach out within 24 hours to discuss your monday.com expert needs and next steps.</p>
            <button class="modal-submit" onclick="this.closest('.modal-overlay').querySelector('.modal-close')?.click() || closeModal(this.closest('.modal-overlay'))">Close</button>
        </div>
    `;
    
    // Add close button back
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => closeModal(overlay));
    content.insertBefore(closeBtn, content.firstChild);
}

/**
 * Add Modal Styles
 * Injects modal styles into the document
 */
function addModalStyles() {
    if (document.getElementById('modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 52, 96, 0.8);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
            padding: 1rem;
        }
        
        .modal-overlay.active {
            opacity: 1;
        }
        
        .modal-content {
            background: white;
            border-radius: 16px;
            padding: 3rem 2.5rem;
            max-width: 440px;
            width: 100%;
            position: relative;
            transform: translateY(20px) scale(0.95);
            transition: transform 0.3s ease;
            text-align: center;
        }
        
        .modal-overlay.active .modal-content {
            transform: translateY(0) scale(1);
        }
        
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 36px;
            height: 36px;
            border: none;
            background: #f5f7fa;
            border-radius: 50%;
            font-size: 1.5rem;
            color: #5a5a7a;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }
        
        .modal-close:hover {
            background: #e0e6ed;
            color: #1a1a2e;
        }
        
        .modal-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .modal-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.75rem;
            font-weight: 700;
            color: #1a1a2e;
            margin-bottom: 0.75rem;
        }
        
        .modal-text {
            color: #5a5a7a;
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }
        
        .modal-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .modal-input {
            width: 100%;
            padding: 1rem 1.25rem;
            border: 2px solid #e0e6ed;
            border-radius: 8px;
            font-family: inherit;
            font-size: 1rem;
            transition: all 0.2s ease;
        }
        
        .modal-input:focus {
            outline: none;
            border-color: #6B63B5;
            box-shadow: 0 0 0 4px rgba(107, 99, 181, 0.1);
        }
        
        .modal-submit {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #6B63B5 0%, #4A4073 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-family: inherit;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-top: 0.5rem;
        }
        
        .modal-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(107, 99, 181, 0.4);
        }
        
        .success-content {
            padding: 1rem 0;
        }
        
        .success-icon {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
            margin: 0 auto 1.5rem;
            animation: scaleIn 0.4s ease;
        }
        
        @keyframes scaleIn {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .video-modal {
            max-width: 700px;
            padding: 2rem;
        }
        
        .video-placeholder {
            aspect-ratio: 16/9;
            background: linear-gradient(135deg, #0f3460 0%, #1a2a4a 100%);
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
        }
        
        .play-icon {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            margin-bottom: 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .play-icon:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }
        
        @media (max-width: 480px) {
            .modal-content {
                padding: 2rem 1.5rem;
            }
            
            .modal-title {
                font-size: 1.5rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Header Scroll Effect
 * Changes header appearance on scroll
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow on scroll
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

/**
 * Utility: Debounce Function
 * Limits the rate at which a function can fire
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Keyboard Navigation
 * Allows closing modals with Escape key
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) {
            closeModal(overlay);
        }
    }
});
