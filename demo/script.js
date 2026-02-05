// Lead Capture Form JavaScript - Enhanced

// Load webhook URL from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedUrl = localStorage.getItem('webhookUrl');
    if (savedUrl) {
        document.getElementById('webhookUrl').value = savedUrl;
        updateWebhookStatus(true);
    }

    // Add input animations and validation
    initializeFormEnhancements();
});

// Initialize form enhancements
function initializeFormEnhancements() {
    const inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
        // Add focus/blur effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });

        // Add filled state
        input.addEventListener('input', function() {
            if (this.value) {
                this.parentElement.classList.add('filled');
            } else {
                this.parentElement.classList.remove('filled');
            }
        });

        // Initialize filled state
        if (input.value) {
            input.parentElement.classList.add('filled');
        }
    });

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Save webhook URL to localStorage
function saveWebhookUrl() {
    const webhookUrl = document.getElementById('webhookUrl').value.trim();

    if (!webhookUrl) {
        showNotification('Please enter a webhook URL', 'error');
        return;
    }

    // Basic URL validation
    try {
        new URL(webhookUrl);
        localStorage.setItem('webhookUrl', webhookUrl);
        updateWebhookStatus(true);
        showNotification('Webhook URL saved successfully!', 'success');

        // Add success animation to button
        const saveBtn = event.target;
        saveBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            saveBtn.style.transform = '';
        }, 150);
    } catch (e) {
        showNotification('Please enter a valid URL', 'error');
    }
}

// Update webhook status display
function updateWebhookStatus(configured) {
    const statusEl = document.getElementById('webhookStatus');
    const icon = statusEl.querySelector('svg');
    const text = statusEl.querySelector('span');

    if (configured) {
        text.textContent = 'Webhook URL configured and ready';
        statusEl.classList.add('configured');

        // Update icon to checkmark
        icon.innerHTML = `
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="8 12 11 15 16 9"></polyline>
        `;
    } else {
        text.textContent = 'Webhook URL not configured';
        statusEl.classList.remove('configured');

        // Update icon to info
        icon.innerHTML = `
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
        `;
    }
}

// Show temporary notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const icon = type === 'success'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';

    notification.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 600;
        max-width: 400px;
    `;

    notification.innerHTML = `${icon}<span>${message}</span>`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Handle form submission
document.getElementById('leadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get webhook URL
    const webhookUrl = localStorage.getItem('webhookUrl');

    if (!webhookUrl) {
        showNotification('Please configure the webhook URL first', 'error');
        document.getElementById('webhookUrl').focus();

        // Scroll to config panel with highlight
        const configPanel = document.querySelector('.config-panel');
        configPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        configPanel.style.animation = 'none';
        setTimeout(() => {
            configPanel.style.animation = 'shake 0.5s ease';
        }, 10);

        return;
    }

    // Get form elements
    const submitBtn = document.getElementById('submitBtn');
    const btnContent = submitBtn.querySelector('.btn-content');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Hide previous messages
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    // Show loading state
    submitBtn.disabled = true;
    btnContent.style.display = 'none';
    btnLoader.style.display = 'flex';

    // Collect form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        company: document.getElementById('company').value.trim(),
        source: document.getElementById('source').value,
        message: document.getElementById('message').value.trim(),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };

    try {
        // Send data to n8n webhook
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const rawText = await response.text();
        let result;
        try {
            result = rawText ? JSON.parse(rawText) : {};
        } catch {
            result = { message: rawText || `Request failed with status ${response.status}` };
        }

        if (response.ok) {
            // Success
            const leadId = result.leadId || generateLeadId();
            document.getElementById('leadIdDisplay').textContent = leadId;

            // Show success message with animation
            successMessage.style.display = 'flex';
            successMessage.style.animation = 'slideInScale 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

            // Reset form with stagger animation
            const formGroups = document.querySelectorAll('.form-group');
            formGroups.forEach((group, index) => {
                setTimeout(() => {
                    group.style.opacity = '0.5';
                    setTimeout(() => {
                        group.style.opacity = '1';
                    }, 100);
                }, index * 50);
            });

            document.getElementById('leadForm').reset();

            // Remove filled states
            document.querySelectorAll('.input-wrapper').forEach(wrapper => {
                wrapper.classList.remove('filled', 'focused');
            });

            // Scroll to success message
            setTimeout(() => {
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 200);

            // Show notification
            showNotification('Lead captured successfully!', 'success');

            // Trigger confetti effect
            createConfetti();
        } else {
            // Error from n8n
            document.getElementById('errorText').textContent =
                result.message || result.error || 'Validation failed. Please check your input.';
            errorMessage.style.display = 'flex';
            errorMessage.style.animation = 'slideInScale 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            showNotification('Failed to capture lead', 'error');
        }
    } catch (error) {
        // Network or other error
        console.error('Error:', error);
        document.getElementById('errorText').textContent =
            error.message || 'Failed to connect to the webhook. Please check your webhook URL and try again.';
        errorMessage.style.display = 'flex';
        errorMessage.style.animation = 'slideInScale 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showNotification('Connection failed', 'error');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnContent.style.display = 'flex';
        btnLoader.style.display = 'none';
    }
});

// Generate a random lead ID
function generateLeadId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 7);
    return `LEAD-${timestamp}-${randomStr}`.toUpperCase();
}

// Real-time email validation with visual feedback
document.getElementById('email').addEventListener('input', function() {
    const email = this.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email) {
        if (emailRegex.test(email)) {
            this.classList.remove('invalid');
            this.classList.add('valid');
        } else {
            this.classList.remove('valid');
            this.classList.add('invalid');
        }
    } else {
        this.classList.remove('valid', 'invalid');
    }
});

document.getElementById('email').addEventListener('blur', function() {
    const email = this.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
        this.style.borderColor = '#ef4444';
        setTimeout(() => {
            this.style.borderColor = '';
        }, 2000);
    }
});

// Enhanced phone number formatting
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 10) {
        value = value.slice(0, 10);
    }

    let formatted = '';
    if (value.length >= 1) {
        formatted = '(' + value.substring(0, 3);
        if (value.length >= 3) {
            formatted += ') ' + value.substring(3, 6);
            if (value.length >= 6) {
                formatted += '-' + value.substring(6, 10);
            }
        }
    }

    e.target.value = formatted;
});

// Character counter for message field
const messageField = document.getElementById('message');
const messageLabel = document.querySelector('label[for="message"]');

messageField.addEventListener('input', function() {
    const length = this.value.length;
    const maxLength = 500;

    // Update or create character counter
    let counter = messageLabel.querySelector('.char-counter');
    if (!counter) {
        counter = document.createElement('span');
        counter.className = 'char-counter';
        counter.style.cssText = `
            margin-left: auto;
            font-size: 0.85rem;
            color: var(--text-light);
            font-weight: 400;
        `;
        messageLabel.appendChild(counter);
    }

    counter.textContent = `${length}/${maxLength}`;

    if (length > maxLength * 0.9) {
        counter.style.color = 'var(--warning)';
    } else {
        counter.style.color = 'var(--text-light)';
    }

    // Limit length
    if (length > maxLength) {
        this.value = this.value.substring(0, maxLength);
    }
});

// Confetti effect for successful submission
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#10b981', '#f59e0b'];
    const confettiCount = 30;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const animationDuration = 2 + Math.random() * 2;
            const size = 8 + Math.random() * 6;

            confetti.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                left: ${left}%;
                top: -10px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                pointer-events: none;
                z-index: 9999;
                animation: confettiFall ${animationDuration}s ease-out forwards;
                opacity: 0.8;
            `;

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), animationDuration * 1000);
        }, i * 50);
    }
}

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    @keyframes shake {
        0%, 100% {
            transform: translateX(0);
        }
        10%, 30%, 50%, 70%, 90% {
            transform: translateX(-10px);
        }
        20%, 40%, 60%, 80% {
            transform: translateX(10px);
        }
    }

    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }

    .input-wrapper.focused input,
    .input-wrapper.focused textarea,
    .input-wrapper.focused select {
        transform: scale(1.01);
    }
`;
document.head.appendChild(style);

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('submitBtn').click();
    }

    // Escape to close messages
    if (e.key === 'Escape') {
        document.getElementById('successMessage').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
    }
});

// Prevent accidental form abandonment
let formModified = false;
document.getElementById('leadForm').addEventListener('input', () => {
    formModified = true;
});

document.getElementById('leadForm').addEventListener('submit', () => {
    formModified = false;
});

window.addEventListener('beforeunload', (e) => {
    if (formModified) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});

// Add focus trap for accessibility
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const modal = document.querySelector('.form-container');

if (modal) {
    const firstFocusableElement = modal.querySelectorAll(focusableElements)[0];
    const focusableContent = modal.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Performance monitoring
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);
        }, 0);
    });
}
