// ============================================================
// CHAT PAGE COMPONENT - SMART AI WITH DIVERSE RESPONSES
// ============================================================

const ChatComponent = {
    container: null,
    chatHistory: [],
    isTyping: false,
    responseCache: {},

    // ============================================================
    // SMART RESPONSE SYSTEM
    // ============================================================
    responses: {
        // Greetings
        greetings: [
            'أهلاً بك! ❤️ كيف يمكنني مساعدتك اليوم؟',
            'مرحباً! 💕 أنا هنا لأسمعك وأتحدث معك.',
            'أهلاً وسهلاً! 🌸 أنا سعيد برؤيتك.',
            'مرحباً بك! ✨ قل لي كيف حالك؟',
            'أهلاً! 💖 أنا هنا لأكون معك دائماً.'
        ],
        
        // How are you
        howAreYou: [
            'أنا بخير والحمد لله، شكراً لسؤالك! ❤️ كيف حالك أنت؟',
            'أنا سعيد جداً لأنك سألت! 💕 أتمنى أن تكون بخير أيضاً.',
            'أنا بخير، وأسعدني سؤالك! 🌸 كيف تقضي يومك؟',
            'الحمد لله أنا بخير! 💖 أخبرني عن يومك.'
        ],
        
        // Love & Romance
        love: [
            'أنت تضيء حياتي ❤️ كلماتك تملأ قلبي فرحاً.',
            'أحب الاستماع إليك 💕 أنت شخص مميز جداً.',
            'قلبك نقي يا صديقي 🌹 لا تغير أبداً.',
            'أنت أجمل هدية في حياتي 💖 وجودك يسعدني.',
            'حبك يمنحني القوة ❤️ شكراً لأنك هنا.'
        ],
        
        // Sad/Support
        support: [
            'أنا هنا لأسمعك 🤗 لا تشعر بالوحدة أبداً.',
            'كل شيء سيكون بخير 💕 أنا بجانبك دائماً.',
            'حزنك يهمني 🌸 دعني أشاركك مشاعرك.',
            'أنت قوي 💪 وستتجاوز هذا بإذن الله.',
            'لا تحزن، الأيام الجميلة قادمة 💖 ثق بذلك.'
        ],
        
        // Encouragement
        encouragement: [
            'أنت قادر على فعل أي شيء 💪 ثق بنفسك.',
            'أنا أؤمن بك 🌟 أنت شخص رائع.',
            'استمر في التقدم 💕 كل يوم خطوة جديدة.',
            'لا تستسلم أبداً 💖 النجاح قريب منك.',
            'أنت مميز جداً ✨ لا تنسى ذلك أبداً.'
        ],
        
        // Questions
        questions: [
            'سؤال جميل! ❤️ دعني أفكر فيه قليلاً.',
            'هذا سؤال عميق 💕 ماذا تعتقد أنت؟',
            'أحب الأسئلة التي تثير التفكير 🌸 أخبرني رأيك.',
            'سؤال رائع! 💖 أنا أحب الحديث معك.'
        ],
        
        // Random funny/kind
        random: [
            'ابتسم 😊 فأنت جميل عندما تبتسم.',
            'هل تعلم أنك شخص رائع؟ 💕 لأنك كذلك.',
            'أنا محظوظ لأنني أعرفك 🌸 حقاً.',
            'أنت مميز جداً 💖 لا تنسى ذلك.',
            'الحياة أجمل مع وجودك فيها ✨ شكراً لك.'
        ],
        
        // Farewell
        farewell: [
            'كان جميلاً التحدث معك 💕 أراك قريباً.',
            'إلى اللقاء ❤️ أنتظر عودتك دائماً.',
            'وداعاً صديقي 💖 كن بخير.',
            'أتطلع للحديث معك مرة أخرى 🌸 أراك قريباً.',
            'رحلة سعيدة ✨ أنا هنا عندما تحتاجني.'
        ]
    },

    // ============================================================
    // ANALYZE USER INPUT
    // ============================================================
    analyzeInput: function(text) {
        const lower = text.toLowerCase();
        
        // Check for greetings
        if (/\b(السلام|اهلا|مرحبا|هلا|يا هلا|سلام|صباح|مساء|اهلين)\b/.test(lower)) {
            return 'greetings';
        }
        
        // Check for how are you
        if (/\b(كيف حالك|اخبارك|شخبارك|ازيك|كيفك|كيف الحال|عامل ايه)\b/.test(lower)) {
            return 'howAreYou';
        }
        
        // Check for love/romance
        if (/\b(حب|قلب|عشق|غرام|حبيبي|حبيبتي|روح|عيون|شوق|وله|هيام)\b/.test(lower)) {
            return 'love';
        }
        
        // Check for sadness/support
        if (/\b(حزين|تعبان|زعلان|متضايق|هم|غم|بكاء|دموع|وحيد|وحدة|حزينه)\b/.test(lower)) {
            return 'support';
        }
        
        // Check for encouragement
        if (/\b(قادر|اقدر|استطيع|نجاح|انجاز|هدف|طموح|حلم|امل|تفائل)\b/.test(lower)) {
            return 'encouragement';
        }
        
        // Check for questions
        if (/\b(؟|هل|ما|ماذا|كيف|لماذا|اين|متى|من|اي|اية)\b/.test(lower)) {
            return 'questions';
        }
        
        // Check for farewell
        if (/\b(مع السلامة|باي|وداع|الى اللقاء|سلام|نشوفك|يلا)\b/.test(lower)) {
            return 'farewell';
        }
        
        // Check for thank you
        if (/\b(شكرا|تشكر|ممنون|مشكور|متشكر|حمدلله)\b/.test(lower)) {
            return 'love'; // Use love responses for thanks
        }
        
        // Default: random
        return 'random';
    },

    // ============================================================
    // GET AI RESPONSE
    // ============================================================
    getAIResponse: function(text) {
        const category = this.analyzeInput(text);
        const responses = this.responses[category] || this.responses.random;
        
        // Get a random response from the category
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        // Add personalized touch
        return this.personalizeResponse(response, text);
    },

    // ============================================================
    // PERSONALIZE RESPONSE
    // ============================================================
    personalizeResponse: function(response, userText) {
        // Add user's name if they mention it
        const nameMatch = userText.match(/اسمي\s+(\w+)/i);
        if (nameMatch) {
            return response.replace(/صديقي|حبيبي|أنت/g, nameMatch[1]);
        }
        
        // Add emoji based on mood
        const mood = this.detectMood(userText);
        const emojis = {
            happy: ['😊', '🌟', '✨'],
            sad: ['💕', '🤗', '🌸'],
            love: ['❤️', '💖', '💕'],
            neutral: ['💫', '🌹', '✨']
        };
        
        const moodEmojis = emojis[mood] || emojis.neutral;
        const emoji = moodEmojis[Math.floor(Math.random() * moodEmojis.length)];
        
        // Don't add emoji if response already has one
        if (response.includes('❤️') || response.includes('💕') || response.includes('🌸')) {
            return response;
        }
        
        return response + ' ' + emoji;
    },

    // ============================================================
    // DETECT MOOD
    // ============================================================
    detectMood: function(text) {
        const lower = text.toLowerCase();
        if (/\b(حب|قلب|عشق|روح|شوق)\b/.test(lower)) return 'love';
        if (/\b(حزين|تعبان|زعلان|هم|غم)\b/.test(lower)) return 'sad';
        if (/\b(سعيد|فرحان|مبسوط|ضحك|مرح)\b/.test(lower)) return 'happy';
        return 'neutral';
    },

    // ============================================================
    // CHAT FUNCTIONS
    // ============================================================
    init: function() {
        this.container = document.getElementById('page-chat');
        const data = window.AppData || AppData;
        this.chatHistory = [{ role: 'ai', text: data.chatSettings.welcome }];
        this.render();
        this.bindEvents();
    },

    render: function() {
        const data = window.AppData || AppData;
        const settings = data.chatSettings;

        this.container.innerHTML = `
            <div class="section-title">
                <span class="bar"></span>
                🤖 شات AI
            </div>
            <div class="chat-container" id="chatContainer">
                <div class="chat-header">
                    <div class="chat-avatar">${settings.avatar || '❤️'}</div>
                    <div class="chat-name">${settings.name || 'ذكرياتنا AI'}</div>
                    <button class="chat-clear" id="clearChatBtn">
                        <i class="fas fa-trash"></i> مسح
                    </button>
                </div>
                <div class="chat-messages" id="chatMessages">
                    ${this.renderMessages()}
                </div>
                <div class="chat-input">
                    <input type="text" id="chatInput" placeholder="اكتب رسالتك..." />
                    <button id="chatSendBtn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
    },

    renderMessages: function() {
        const data = window.AppData || AppData;
        const settings = data.chatSettings;

        return this.chatHistory.map(msg => `
            <div class="msg ${msg.role === 'user' ? 'user' : 'ai'}">
                ${msg.role === 'ai' ? `<span style="margin-left:6px;">${settings.avatar || '❤️'}</span>` : ''}
                ${msg.text}
            </div>
        `).join('');
    },

    sendMessage: function(text) {
        if (!text || !text.trim()) return;
        text = text.trim();

        this.chatHistory.push({ role: 'user', text: text });
        this.updateMessages();

        // Show typing indicator
        this.showTyping();

        // Get AI response with delay
        const delay = 800 + Math.random() * 600;
        setTimeout(() => {
            this.hideTyping();
            const response = this.getAIResponse(text);
            this.chatHistory.push({ role: 'ai', text: response });
            this.updateMessages();
        }, delay);
    },

    showTyping: function() {
        const container = document.getElementById('chatMessages');
        if (!container) return;

        const typingEl = document.createElement('div');
        typingEl.className = 'msg ai';
        typingEl.id = 'typingIndicator';
        typingEl.innerHTML = `
            <span style="margin-left:6px;">${(window.AppData || AppData).chatSettings.avatar || '❤️'}</span>
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        `;
        container.appendChild(typingEl);
        container.scrollTop = container.scrollHeight;
        this.isTyping = true;
    },

    hideTyping: function() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
        this.isTyping = false;
    },

    updateMessages: function() {
        const container = document.getElementById('chatMessages');
        if (!container) return;
        container.innerHTML = this.renderMessages();
        container.scrollTop = container.scrollHeight;
    },

    clearChat: function() {
        const data = window.AppData || AppData;
        this.chatHistory = [{ role: 'ai', text: data.chatSettings.welcome }];
        this.updateMessages();
    },

    bindEvents: function() {
        const input = document.getElementById('chatInput');
        const sendBtn = document.getElementById('chatSendBtn');
        const clearBtn = document.getElementById('clearChatBtn');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                if (input) {
                    const text = input.value;
                    this.sendMessage(text);
                    input.value = '';
                }
            });
        }

        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const text = input.value;
                    this.sendMessage(text);
                    input.value = '';
                }
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearChat());
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatComponent;
}