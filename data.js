// ============================================================
// DATA STORE - Cloud-first persistence with localStorage fallback
// ============================================================

// Default data (your data)
const defaultData = {
    // Site Settings
    settings: {
        sitePassword: '15122007',
        startDate: '2026-09-04T00:00:00',
        siteTitle: 'ذكرياتنا ❤️',
        siteSubtitle: 'من بداية قصتنا إلى كل لحظة جميلة عشناها',
        theme: 'dark'
    },

    // Memories
    memories: [{
        id: 1,
        title: 'أول لقاء',
        description: 'اليوم الذي تغير فيه كل شيء',
        date: '2026-09-04',
        emoji: '💕',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%231a1015"/%3E%3Ctext x="100" y="115" font-size="70" text-anchor="middle" fill="%23d4a0a0"%3E💕%3C/text%3E%3C/svg%3E'
    }, {
        id: 2,
        title: 'أول رسالة',
        description: 'رجعنا لبعض تاني',
        date: '2026-09-02',
        emoji: '💌',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%231a1015"/%3E%3Ctext x="100" y="115" font-size="70" text-anchor="middle" fill="%23d4a0a0"%3E💌%3C/text%3E%3C/svg%3E'
    }, {
        id: 3,
        title: 'أجمل يوم',
        description: 'ضحكتك تغير الدنيا',
        date: '2026-09-05',
        emoji: '🌹',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%231a1015"/%3E%3Ctext x="100" y="115" font-size="70" text-anchor="middle" fill="%23d4a0a0"%3E🌹%3C/text%3E%3C/svg%3E'
    }],

    // Messages
    messages: [{
        id: 1,
        title: 'رسالة الصباح',
        content: 'صباح الخير يا أجمل شخص في الكون. كل يوم معك هو هدية.',
        date: '2026-09-06',
        emoji: '🌅',
        image: ''
    }, {
        id: 2,
        title: 'حبي لك',
        content: 'أنت كل شيء بالنسبة لي. لا أتخيل حياتي بدونك.',
        date: '2026-09-06',
        emoji: '❤️',
        image: ''
    }, {
        id: 3,
        title: 'أمنية',
        content: 'أتمنى أن نبقى معًا إلى الأبد. أنت نصفي الآخر.',
        date: '2026-09-06',
        emoji: '✨',
        image: ''
    }],

    // Timeline
    timeline: [
        { emoji: '❤️', title: 'البداية', description: 'بدأت قصتنا الجميلة' },
        { emoji: '📸', title: 'أول ذكرى', description: 'أول صورة معًا' },
        { emoji: '💌', title: 'أول رسالة', description: 'كلمات من القلب' },
        { emoji: '🌹', title: 'أجمل لحظة', description: 'يوم لا يُنسى' },
        { emoji: '✨', title: 'ذكرياتنا الحالية', description: 'كل يوم هو قصة جديدة' }
    ],

    // Songs
    songs: [{
        id: 1,
        name: 'أغنية البداية 🎵',
        artist: 'SoundCloud • ذكرياتنا',
        cover: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%231a1015"/%3E%3Ctext x="50" y="60" font-size="40" text-anchor="middle" fill="%23d4a0a0"%3E🎵%3C/text%3E%3C/svg%3E',
        audioUrl: 'https://soundcloud.com/ali-h-al-rubaie-2694222/qm6zdhsvigjl',
        description: 'أول أغنية في قائمتنا'
    }, {
        id: 2,
        name: 'أغنية الحب',
        artist: 'ذكرياتنا',
        cover: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%231a1015"/%3E%3Ctext x="50" y="60" font-size="40" text-anchor="middle" fill="%23d4a0a0"%3E💕%3C/text%3E%3C/svg%3E',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        description: 'أغنية تعبر عن الحب'
    }],

    // Chat Settings
    chatSettings: {
        name: 'ذكرياتنا AI',
        avatar: '❤️',
        welcome: 'أهلًا ❤️ أنا هنا لأسمعك وأتحدث معك. أخبرني كيف تشعر اليوم؟',
        systemPrompt: 'أنت مساعد رومانسي ولطيف، تتحدث باللهجة العربية. أنت صديق حنون ومتفهم وتحب الاستماع.',
        language: 'ar'
    }
};

// ============================================================
// Load saved data or use default
// ============================================================
function loadData() {
    try {
        const saved = localStorage.getItem('appData');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Merge with default to ensure all fields exist
            return mergeDeep(defaultData, parsed);
        }
    } catch (e) {
        console.warn('Failed to load saved data:', e);
    }
    return JSON.parse(JSON.stringify(defaultData));
}

// ============================================================
// Deep merge helper
// ============================================================
function mergeDeep(target, source) {
    const result = { ...target };
    for (const key in source) {
        if (source[key] instanceof Object && !Array.isArray(source[key])) {
            result[key] = mergeDeep(target[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}

// ============================================================
// Create AppData with persistence
// ============================================================
let AppData = loadData();

// ============================================================
// Save function
// ============================================================
async function saveData() {
    try {
        localStorage.setItem('appData', JSON.stringify(AppData));
        if (window.CloudStore) {
            const ok = await window.CloudStore.save(AppData);
            if (ok) console.log('☁️ Data synced to all devices');
        }
    } catch (e) {
        console.warn('Failed to save/sync data:', e);
    }
}

// ============================================================
// Auto-save wrapper for array methods
// ============================================================
function wrapArrayMethods(array, arrayName) {
    const originalPush = array.push;
    array.push = function(...items) {
        const result = originalPush.apply(this, items);
        saveData();
        return result;
    };

    const originalPop = array.pop;
    array.pop = function() {
        const result = originalPop.apply(this);
        saveData();
        return result;
    };

    const originalSplice = array.splice;
    array.splice = function(...args) {
        const result = originalSplice.apply(this, args);
        saveData();
        return result;
    };

    const originalShift = array.shift;
    array.shift = function() {
        const result = originalShift.apply(this);
        saveData();
        return result;
    };

    const originalUnshift = array.unshift;
    array.unshift = function(...items) {
        const result = originalUnshift.apply(this, items);
        saveData();
        return result;
    };

    // Override filter to save after filtering
    const originalFilter = array.filter;
    array.filter = function(...args) {
        const result = originalFilter.apply(this, args);
        // Update the original array reference
        const parent = AppData;
        for (const key in parent) {
            if (parent[key] === this) {
                parent[key] = result;
                saveData();
                break;
            }
        }
        return result;
    };

    return array;
}

// ============================================================
// Wrap all arrays with auto-save
// ============================================================
wrapArrayMethods(AppData.memories, 'memories');
wrapArrayMethods(AppData.messages, 'messages');
wrapArrayMethods(AppData.songs, 'songs');
wrapArrayMethods(AppData.timeline, 'timeline');

// ============================================================
// Helper to update object properties with auto-save
// ============================================================
function updateData(callback) {
    callback();
    saveData();
}

// ============================================================
// Watch for settings changes
// ============================================================
const settingsProxy = new Proxy(AppData.settings, {
    set(target, property, value) {
        target[property] = value;
        saveData();
        return true;
    }
});

// Replace settings with proxy
AppData.settings = settingsProxy;

// ============================================================
// Save initially
// ============================================================
saveData();

// ============================================================
// Export
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppData;
    module.exports.saveData = saveData;
    module.exports.updateData = updateData;
} else {
    // Make available globally
    window.AppData = AppData;
    window.saveData = saveData;
    window.updateData = updateData;
}

console.log('💾 Data loaded and ready with auto-save');
console.log('📊 Memories:', AppData.memories.length);
console.log('💌 Messages:', AppData.messages.length);
console.log('🎵 Songs:', AppData.songs.length);