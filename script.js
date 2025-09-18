// DOM Elements - Updated for current structure
// Note: Header and navigation were removed, so these elements don't exist anymore
// const hamburger = document.querySelector('.hamburger');
// const navMenu = document.querySelector('.nav-menu');
// const navLinks = document.querySelectorAll('.nav-link');
// const header = document.querySelector('.header');

// Mobile Navigation Toggle - Disabled since nav was removed
// hamburger.addEventListener('click', () => {
//     hamburger.classList.toggle('active');
//     navMenu.classList.toggle('active');
// });

// Close mobile menu when clicking on a link - Disabled
// navLinks.forEach(link => {
//     link.addEventListener('click', () => {
//         hamburger.classList.remove('active');
//         navMenu.classList.remove('active');
//     });
// });

// Header Background on Scroll - Disabled since header was removed
// window.addEventListener('scroll', () => {
//     if (window.scrollY > 100) {
//         header.style.background = 'rgba(10, 10, 10, 0.98)';
//         header.style.boxShadow = '0 2px 20px rgba(102, 126, 234, 0.3)';
//     } else {
//         header.style.background = 'rgba(10, 10, 10, 0.95)';
//         header.style.boxShadow = 'none';
//     }
// });

// Smooth Scrolling for Navigation Links - Updated for current structure
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // No header offset needed since header was removed
            const targetPosition = target.offsetTop;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Statistics Counter Animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number based on target value
        if (target === 4.9) {
            element.textContent = current.toFixed(1);
        } else if (target >= 1000) {
            element.textContent = Math.floor(current).toLocaleString() + '+';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            
            // Trigger counter animation for statistics
            if (entry.target.classList.contains('stats')) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseFloat(stat.getAttribute('data-target'));
                    animateCounter(stat, target);
                });
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-item, .contact-item, .stats, .download-content');
    animateElements.forEach(el => observer.observe(el));
});

// Download Button Click Handlers
const downloadButtons = document.querySelectorAll('.download-btn, .mini-download-btn');
downloadButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const platform = button.getAttribute('data-platform') || 
                        (button.href.includes('play') || button.textContent.includes('Play') ? 'android' : 'ios');
        
        // Show download notification
        showDownloadNotification(platform);
        
        // Analytics tracking (replace with your actual analytics)
        trackDownload(platform);
        
        // In a real app, you would redirect to the actual store links
        setTimeout(() => {
            if (platform === 'android') {
                // window.open('https://play.google.com/store/apps/details?id=com.kaamlify.app', '_blank');
                console.log('Redirecting to Google Play Store...');
            } else {
                // window.open('https://apps.apple.com/app/kaamlify/id123456789', '_blank');
                console.log('Redirecting to Apple App Store...');
            }
        }, 1000);
    });
});

// APK Download Functionality - Enhanced and Fixed
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, setting up download functionality...');
    
    // Test if APK file is accessible
    fetch('Kaamlify.apk', { method: 'HEAD' })
        .then(response => {
            console.log(`📁 APK file test: ${response.status} - ${response.ok ? 'File accessible' : 'File not accessible'}`);
            if (response.ok) {
                console.log('✅ File size from server:', response.headers.get('content-length'), 'bytes');
            }
        })
        .catch(error => {
            console.error('❌ APK file test failed:', error);
        });
    
    const downloadBtn = document.getElementById('downloadBtn');
    
    if (downloadBtn) {
        console.log('✅ Download button found successfully!');
        
        // Remove any existing event listeners
        downloadBtn.replaceWith(downloadBtn.cloneNode(true));
        const newDownloadBtn = document.getElementById('downloadBtn');
        
        newDownloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🔥 Download button clicked!');
            
            // Show immediate feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Show download notification
            showAPKDownloadNotification();
            
            // Trigger APK download after a short delay
            setTimeout(() => {
                downloadAPK();
            }, 800);
            
            // Analytics tracking
            trackAPKDownload();
        });
        
        // Add visual feedback on hover
        newDownloadBtn.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 35px rgba(240, 147, 251, 0.4)';
        });
        
        newDownloadBtn.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
        
    } else {
        console.error('❌ Download button not found! Check if ID is correct.');
    }
});

// Enhanced APK Download Function - Single method to prevent duplicates
function downloadAPK() {
    console.log('🚀 Starting APK download...');
    
    try {
        // Only use Method 1: Direct download link (most reliable)
        const link = document.createElement('a');
        link.href = 'Kaamlify.apk';
        link.download = 'Kaamlify.apk';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        console.log('✅ Download initiated successfully!');
        
        // Cleanup
        setTimeout(() => {
            if (document.body.contains(link)) {
                document.body.removeChild(link);
            }
        }, 2000);
        
        // Show success message
        setTimeout(() => {
            showSuccessNotification();
        }, 1500);
        
    } catch (error) {
        console.error('❌ Download failed:', error);
        showErrorNotification('Download failed: ' + error.message);
    }
}

// Multiple download methods
function attemptDownload() {
    console.log('💾 Attempting download with Method 1: Direct link...');
    
    try {
        // Method 1: Standard download link
        const link = document.createElement('a');
        link.href = 'Kaamlify.apk';
        link.download = 'Kaamlify.apk';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        console.log('✅ Method 1 executed');
        
        // Method 2: Fetch and blob download (fallback)
        setTimeout(() => {
            console.log('💾 Trying Method 2: Fetch and Blob...');
            downloadWithFetch();
        }, 1000);
        
        // Method 3: Window.open (fallback)
        setTimeout(() => {
            console.log('💾 Trying Method 3: Window.open...');
            window.open('Kaamlify.apk', '_blank');
        }, 2000);
        
        // Cleanup
        setTimeout(() => {
            if (document.body.contains(link)) {
                document.body.removeChild(link);
            }
        }, 3000);
        
        // Show success message
        setTimeout(() => {
            showSuccessNotification();
        }, 1500);
        
    } catch (error) {
        console.error('❌ All download methods failed:', error);
        showErrorNotification('Download failed: ' + error.message);
    }
}

// Fetch-based download method
function downloadWithFetch() {
    fetch('Kaamlify.apk')
        .then(response => {
            console.log('📥 Fetch response status:', response.status);
            if (!response.ok) throw new Error('Network response was not ok');
            return response.blob();
        })
        .then(blob => {
            console.log('📦 Blob created, size:', blob.size, 'bytes');
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Kaamlify.apk';
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                if (document.body.contains(link)) {
                    document.body.removeChild(link);
                }
            }, 1000);
            
            console.log('✅ Fetch method completed');
        })
        .catch(error => {
            console.error('❌ Fetch method failed:', error);
        });
}

// Success Notification
function showSuccessNotification() {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <div class="notification-text">
                <strong>Download Started!</strong>
                <span>Check your downloads folder for Kaamlify.apk</span>
            </div>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        color: white;
        padding: 1.2rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(76, 175, 80, 0.4);
        z-index: 10001;
        animation: slideInRight 0.4s ease-out;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        max-width: 320px;
        border: 1px solid rgba(255,255,255,0.1);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }, 5000);
}

// Error Notification
function showErrorNotification(errorMsg = '') {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-exclamation-triangle"></i>
            <div class="notification-text">
                <strong>Download Failed!</strong>
                <span>Please try again or contact support.</span>
                ${errorMsg ? `<small>Error: ${errorMsg}</small>` : ''}
            </div>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
        color: white;
        padding: 1.2rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(244, 67, 54, 0.4);
        z-index: 10001;
        animation: slideInRight 0.4s ease-out;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        max-width: 320px;
        border: 1px solid rgba(255,255,255,0.1);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }, 6000);
}

// APK Download Notification
function showAPKDownloadNotification() {
    const notification = document.createElement('div');
    notification.className = 'apk-download-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fab fa-android"></i>
            <span>Downloading Kaamlify.apk...</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #3ddc84 0%, #2b8f3d 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(61, 220, 132, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-family: 'Poppins', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Track APK Download
function trackAPKDownload() {
    console.log('APK download tracked: Kaamlify.apk');
    
    // Example: Google Analytics tracking
    // gtag('event', 'download', {
    //     'file_name': 'Kaamlify.apk',
    //     'file_type': 'apk',
    //     'platform': 'android'
    // });
}

// Download Notification
function showDownloadNotification(platform) {
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-download"></i>
            <span>Redirecting to ${platform === 'android' ? 'Google Play Store' : 'Apple App Store'}...</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-family: 'Poppins', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add notification animations to CSS dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(notificationStyles);

// Analytics Tracking Function
function trackDownload(platform) {
    // Replace with your actual analytics implementation
    console.log(`Download initiated for platform: ${platform}`);
    
    // Example: Google Analytics tracking
    // gtag('event', 'download', {
    //     'platform': platform,
    //     'app_name': 'Kaamlify'
    // });
    
    // Example: Facebook Pixel tracking
    // fbq('track', 'InitiateCheckout', {
    //     content_name: 'Kaamlify App',
    //     content_category: 'Mobile App',
    //     platform: platform
    // });
}

// Contact Form Handler
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const formEntries = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            showContactNotification('success', 'Message sent successfully! We\'ll get back to you soon.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
        
        // In a real application, you would send this data to your server
        console.log('Contact form submitted:', formEntries);
    });
}

// Contact Form Notification
function showContactNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `contact-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)' : 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-family: 'Poppins', sans-serif;
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero::before');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Feature Cards Hover Effect
document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05) translateY(-5px)';
            card.style.boxShadow = '0 15px 30px rgba(240, 147, 251, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1) translateY(0)';
            card.style.boxShadow = 'none';
        });
    });
});

// Lazy Loading for Images (if you add images later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Theme Toggle (Optional Feature)
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
}

// Keyboard Navigation - Updated since navigation was removed
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals or notifications
        const notifications = document.querySelectorAll('.apk-download-notification, .success-notification, .error-notification');
        notifications.forEach(notification => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }
});

// Performance Optimization: Debounce Scroll Events
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

// Apply debouncing to scroll events - Updated since header was removed
const debouncedScrollHandler = debounce(() => {
    // Scroll-based animations and effects
    const scrolled = window.pageYOffset;
    
    // Header background update removed since header doesn't exist
    // Just keep this for any future scroll-based effects
    console.log('Scroll position:', scrolled);
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
    initThemeToggle();
    
    // Add loading complete class for any final animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Unhandled Promise Rejection
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Image Loading Error Handling
document.addEventListener('DOMContentLoaded', () => {
    const phoneScreenshots = document.querySelectorAll('.phone-screenshot');
    
    phoneScreenshots.forEach(img => {
        img.addEventListener('error', function() {
            console.log('Failed to load image:', this.src);
            this.style.background = 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.innerHTML = '<div style="color: white; text-align: center; font-size: 1rem;"><i class="fas fa-exclamation-triangle"></i><br>Image not found</div>';
        });
        
        img.addEventListener('load', function() {
            console.log('Successfully loaded image:', this.src);
        });
    });
    
    // Check if images exist
    console.log('Checking for images...');
    phoneScreenshots.forEach(img => {
        console.log('Image src:', img.src);
        console.log('Image complete:', img.complete);
        console.log('Image naturalWidth:', img.naturalWidth);
    });
});