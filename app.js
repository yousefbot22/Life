// ============================================================
// MAIN APPLICATION
// ============================================================

// Make AppData available globally with save function
window.AppData = AppData;
window.saveData = saveData;

// Make Utils available globally
window.Utils = Utils;

// Initialize all components
document.addEventListener('DOMContentLoaded', async function() {
    'use strict';

    // Load the central cloud copy before any page is rendered.
    if (window.CloudStore) await window.CloudStore.init();

    // ============================================================
    // STATE
    // ============================================================
    let currentPage = 'home';
    let isLoggedIn = false;

    // ============================================================
    // DOM REFS
    // ============================================================
    const pages = {
        home: document.getElementById('page-home'),
        memories: document.getElementById('page-memories'),
        messages: document.getElementById('page-messages'),
        chat: document.getElementById('page-chat'),
        admin: document.getElementById('page-admin')
    };

    const navBtns = document.querySelectorAll('.bottom-nav button');
    const loginOverlay = document.getElementById('loginOverlay');
    const loginPassword = document.getElementById('loginPassword');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');
    const adminBtn = document.getElementById('adminBtn');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightbox = document.getElementById('lightbox');

    // ============================================================
    // COMPONENTS
    // ============================================================
    window.HomeComponent = HomeComponent;
    window.MemoriesComponent = MemoriesComponent;
    window.MessagesComponent = MessagesComponent;
    window.ChatComponent = ChatComponent;
    window.AdminComponent = AdminComponent;

    // ============================================================
    // FLOATING HEARTS
    // ============================================================
    function createHearts() {
        const container = document.getElementById('hearts-container');
        const symbols = ['❤️', '💕', '♥️', '💗', '💖', '💝', '💞', '💟'];
        const count = Math.min(30, window.innerWidth / 20);
        
        for (let i = 0; i < count; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (0.8 + Math.random() * 1.4) + 'rem';
            heart.style.animationDuration = (12 + Math.random() * 20) + 's';
            heart.style.animationDelay = (Math.random() * 25) + 's';
            container.appendChild(heart);
        }
    }

    // ============================================================
    // AUTH (for site password)
    // ============================================================
    function checkSiteAuth() {
        const stored = Utils.storage.get('siteAuth', false);
        if (stored === true) {
            isLoggedIn = true;
            loginOverlay.classList.add('hidden');
            adminBtn.style.display = 'inline-block';
            return true;
        }
        return false;
    }

    function siteLogin(password) {
        const data = window.AppData || AppData;
        if (password === data.settings.sitePassword) {
            isLoggedIn = true;
            Utils.storage.set('siteAuth', true);
            loginOverlay.classList.add('hidden');
            adminBtn.style.display = 'inline-block';
            loginError.textContent = '';
            loginPassword.value = '';
            // Initialize admin if logged in
            if (window.AdminComponent) {
                window.AdminComponent.init();
                window.AdminComponent.initialized = true;
            }
            return true;
        } else {
            loginError.textContent = '❌ كلمة المرور غير صحيحة';
            return false;
        }
    }

    // ============================================================
    // NAVIGATION
    // ============================================================
    function navigateTo(page) {
        currentPage = page;
        
        // Hide all pages
        Object.keys(pages).forEach(key => {
            if (pages[key]) {
                pages[key].classList.remove('active');
            }
        });
        
        // Show target page
        if (pages[page]) {
            pages[page].classList.add('active');
        }
        
        // Update nav buttons - if admin, handle specially
        if (page === 'admin') {
            navBtns.forEach(btn => {
                btn.classList.remove('active');
            });
        } else {
            navBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.page === page);
            });
        }
        
        // Initialize component if not already
        if (page === 'home' && window.HomeComponent) {
            if (!window.HomeComponent.initialized) {
                window.HomeComponent.init();
                window.HomeComponent.initialized = true;
            } else {
                window.HomeComponent.render();
                window.HomeComponent.startCounter();
                window.HomeComponent.bindEvents();
                window.HomeComponent.updateMusic();
            }
        }
        
        if (page === 'memories' && window.MemoriesComponent) {
            if (!window.MemoriesComponent.initialized) {
                window.MemoriesComponent.init();
                window.MemoriesComponent.initialized = true;
            } else {
                window.MemoriesComponent.render();
                window.MemoriesComponent.bindEvents();
            }
        }
        
        if (page === 'messages' && window.MessagesComponent) {
            if (!window.MessagesComponent.initialized) {
                window.MessagesComponent.init();
                window.MessagesComponent.initialized = true;
            } else {
                window.MessagesComponent.render();
                window.MessagesComponent.bindEvents();
            }
        }
        
        if (page === 'chat' && window.ChatComponent) {
            if (!window.ChatComponent.initialized) {
                window.ChatComponent.init();
                window.ChatComponent.initialized = true;
            } else {
                window.ChatComponent.render();
                window.ChatComponent.bindEvents();
            }
        }
        
        if (page === 'admin' && window.AdminComponent) {
            if (!window.AdminComponent.initialized) {
                window.AdminComponent.init();
                window.AdminComponent.initialized = true;
            } else {
                window.AdminComponent.render();
                window.AdminComponent.bindEvents();
            }
        }
    }

    // ============================================================
    // EVENTS
    // ============================================================
    function initEvents() {
        // Nav buttons
        navBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const page = this.dataset.page;
                navigateTo(page);
            });
        });

        // Site login
        loginBtn.addEventListener('click', () => {
            siteLogin(loginPassword.value);
        });
        
        loginPassword.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                siteLogin(loginPassword.value);
            }
        });

        // Admin button - show admin page if logged in
        adminBtn.addEventListener('click', () => {
            if (isLoggedIn) {
                navigateTo('admin');
                navBtns.forEach(btn => {
                    btn.classList.remove('active');
                });
            }
        });

        // Lightbox close
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
        
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
            }
        });
    }

    // ============================================================
    // INIT
    // ============================================================
    function init() {
        // Create floating hearts
        createHearts();
        
        // Check site authentication
        checkSiteAuth();
        
        // Initialize events
        initEvents();
        
        // Initialize home page
        if (window.HomeComponent) {
            window.HomeComponent.init();
            window.HomeComponent.initialized = true;
        }
        
        // Navigate to home
        navigateTo('home');
        
        // Make admin available if logged in
        if (isLoggedIn && window.AdminComponent) {
            window.AdminComponent.init();
            window.AdminComponent.initialized = true;
        }
    }

    // Start the app
    init();
});