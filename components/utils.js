// ============================================================
// UTILITIES - Helper functions
// ============================================================

const Utils = {
    // Generate unique ID
    generateId: function() {
        return Date.now() + Math.random() * 1000;
    },

    // Format date
    formatDate: function(date) {
        const d = new Date(date);
        return d.toLocaleDateString('ar-EG', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    },

    // Format date for input
    formatDateInput: function(date) {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    },

    // Debounce
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Escape HTML
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Truncate text
    truncate: function(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    // Get emoji from text
    getEmoji: function(text) {
        const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u2600-\u26FF]|[\u2700-\u27BF]|[❤️💕💗💖💘💝💞💟♥️❣️]/u;
        const match = text.match(emojiRegex);
        return match ? match[0] : '❤️';
    },

    // Local storage helpers
    storage: {
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('Storage set error:', e);
            }
        },
        get: function(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                return defaultValue;
            }
        },
        remove: function(key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn('Storage remove error:', e);
            }
        }
    },

    // DOM helpers
    dom: {
        get: function(selector) {
            return document.querySelector(selector);
        },
        getAll: function(selector) {
            return document.querySelectorAll(selector);
        },
        create: function(tag, className = '', innerHTML = '') {
            const el = document.createElement(tag);
            if (className) el.className = className;
            if (innerHTML) el.innerHTML = innerHTML;
            return el;
        },
        append: function(parent, child) {
            parent.appendChild(child);
            return parent;
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}