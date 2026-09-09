// ============================================================
// HOME PAGE COMPONENT - FIXED MUSIC PLAYER
// ============================================================

const HomeComponent = {
    container: null,
    counterInterval: null,
    audioElement: null,
    soundCloudWidget: null,
    soundCloudReady: false,
    soundCloudUrl: '',
    isPlaying: false,

    // Initialize
    init: function() {
        this.container = document.getElementById('page-home');
        this.render();
        this.startCounter();
        this.bindEvents();
        this.setupAudio();
    },

    // Setup audio element / SoundCloud widget
    setupAudio: function() {
        this.audioElement = document.getElementById('homeAudio');

        const data = window.AppData || AppData;
        const song = data.songs[0] || {};

        if (this.isSoundCloudUrl(song.audioUrl)) {
            this.setupSoundCloud(song.audioUrl);
            return;
        }

        if (!this.audioElement) {
            this.audioElement = document.createElement('audio');
            this.audioElement.id = 'homeAudio';
            this.audioElement.preload = 'auto';
            document.body.appendChild(this.audioElement);
        }

        this.updateMusic();

        this.audioElement.onended = () => {
            this.isPlaying = false;
            const playBtn = document.getElementById('homePlayBtn');
            if (playBtn) playBtn.textContent = '▶️';
        };

        this.audioElement.onerror = (e) => {
            console.warn('تشغيل الصوت فشل:', e);
            this.isPlaying = false;
            const playBtn = document.getElementById('homePlayBtn');
            if (playBtn) playBtn.textContent = '▶️';
        };
    },

    isSoundCloudUrl: function(url) {
        try {
            const u = new URL(String(url || '').trim());
            return /(^|\.)soundcloud\.com$/i.test(u.hostname) || /(^|\.)on\.soundcloud\.com$/i.test(u.hostname);
        } catch (e) {
            return false;
        }
    },

    setupSoundCloud: function(url) {
        this.soundCloudUrl = String(url || '').trim();
        this.soundCloudReady = false;

        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.removeAttribute('src');
            this.audioElement.load();
            this.audioElement.style.display = 'none';
        }

        let frame = document.getElementById('homeSoundCloudFrame');
        if (!frame) {
            frame = document.createElement('iframe');
            frame.id = 'homeSoundCloudFrame';
            frame.title = 'SoundCloud player';
            frame.setAttribute('allow', 'autoplay');
            frame.setAttribute('scrolling', 'no');
            frame.setAttribute('frameborder', '0');
            frame.style.position = 'fixed';
            frame.style.width = '1px';
            frame.style.height = '1px';
            frame.style.opacity = '0';
            frame.style.pointerEvents = 'none';
            frame.style.left = '-10px';
            frame.style.bottom = '-10px';
            document.body.appendChild(frame);
        }

        frame.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(this.soundCloudUrl) + '&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false';

        const initWidget = () => {
            if (!window.SC || !window.SC.Widget) return false;
            this.soundCloudWidget = window.SC.Widget(frame);
            this.soundCloudWidget.bind(window.SC.Widget.Events.PLAY, () => {
                this.isPlaying = true;
                const btn = document.getElementById('homePlayBtn');
                if (btn) btn.textContent = '⏸️';
            });
            this.soundCloudWidget.bind(window.SC.Widget.Events.PAUSE, () => {
                this.isPlaying = false;
                const btn = document.getElementById('homePlayBtn');
                if (btn) btn.textContent = '▶️';
            });
            this.soundCloudWidget.bind(window.SC.Widget.Events.FINISH, () => {
                this.isPlaying = false;
                const btn = document.getElementById('homePlayBtn');
                if (btn) btn.textContent = '▶️';
            });
            this.soundCloudWidget.bind(window.SC.Widget.Events.READY, () => {
                this.soundCloudReady = true;
            });
            return true;
        };

        const tryInit = () => {
            if (this.soundCloudWidget) return true;
            return initWidget();
        };
        if (!tryInit()) {
            frame.addEventListener('load', tryInit, { once: true });
            const timer = setInterval(() => {
                if (tryInit()) clearInterval(timer);
            }, 250);
            setTimeout(() => clearInterval(timer), 10000);
        }
    },

    // Render
    render: function() {
        const data = window.AppData || AppData;
        const settings = data.settings;
        const song = data.songs[0] || {};

        this.container.innerHTML = `
            <!-- Hero -->
            <div class="hero">
                <h1>ذكرياتنا 💕</h1>
                <p>${settings.siteSubtitle || 'من بداية قصتنا إلى كل لحظة جميلة عشناها'}</p>
            </div>

            <!-- Counter -->
            <div class="counter" id="homeCounter">
                <div class="time-unit">
                    <span class="number" id="years">0</span>
                    <div class="label">سنوات</div>
                </div>
                <div class="time-unit">
                    <span class="number" id="months">0</span>
                    <div class="label">أشهر</div>
                </div>
                <div class="time-unit">
                    <span class="number" id="days">0</span>
                    <div class="label">أيام</div>
                </div>
                <div class="time-unit">
                    <span class="number" id="hours">0</span>
                    <div class="label">ساعات</div>
                </div>
                <div class="time-unit">
                    <span class="number" id="minutes">0</span>
                    <div class="label">دقائق</div>
                </div>
                <div class="time-unit">
                    <span class="number" id="seconds">0</span>
                    <div class="label">ثواني</div>
                </div>
            </div>

            <!-- Music Player -->
            <div class="music-player" id="homeMusic">
                <img class="cover" id="homeMusicCover" src="${song.cover || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%231a1015"/%3E%3Ctext x="50" y="60" font-size="40" text-anchor="middle" fill="%23d4a0a0"%3E🎵%3C/text%3E%3C/svg%3E'}" alt="cover" />
                <div class="info">
                    <div class="song-name" id="homeSongName">${song.name || 'أغنية البداية'}</div>
                    <div class="artist" id="homeArtist">${song.artist || 'ذكرياتنا'}</div>
                </div>
                <div class="controls">
                    <button class="play-btn" id="homePlayBtn">▶️</button>
                    <button id="homeVolumeBtn" title="كتم الصوت">🔊</button>
                </div>
            </div>

            <!-- Timeline -->
            <div class="section-title">
                <span class="bar"></span>
                📖 ذكرياتنا الزمنية
            </div>
            <div class="timeline" id="timelineContainer">
                ${this.renderTimelineItems()}
            </div>
        `;
    },

    // Render timeline items
    renderTimelineItems: function() {
        const data = window.AppData || AppData;
        return data.timeline.map(item => `
            <div class="timeline-item">
                <span class="tl-emoji">${item.emoji || '✨'}</span>
                <span class="tl-title">${item.title}</span>
                <div class="tl-desc">${item.description || ''}</div>
            </div>
        `).join('');
    },

    // Start counter
    startCounter: function() {
        this.updateCounter();
        if (this.counterInterval) clearInterval(this.counterInterval);
        this.counterInterval = setInterval(() => this.updateCounter(), 1000);
    },

    // Update counter
    updateCounter: function() {
        const data = window.AppData || AppData;
        const start = new Date(data.settings.startDate);
        const now = new Date();

        // Calendar-accurate elapsed time. Do not approximate months as 30.44 days.
        let years = 0;
        let months = 0;
        let cursor = new Date(start);
        if (!Number.isNaN(start.getTime()) && now >= start) {
            years = now.getFullYear() - start.getFullYear();
            cursor.setFullYear(start.getFullYear() + years);
            if (cursor > now) {
                years--;
                cursor.setFullYear(start.getFullYear() + years);
            }

            months = now.getMonth() - cursor.getMonth();
            if (months < 0) months += 12;
            cursor.setMonth(cursor.getMonth() + months);
            if (cursor > now) {
                months--;
                cursor = new Date(start);
                cursor.setFullYear(start.getFullYear() + years);
                cursor.setMonth(cursor.getMonth() + months);
            }
        }

        const diff = (!Number.isNaN(start.getTime()) && now >= start) ? Math.floor((now - cursor) / 1000) : 0;
        const seconds = diff;
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        const els = {
            years: document.getElementById('years'),
            months: document.getElementById('months'),
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };

        if (els.years) els.years.textContent = years;
        if (els.months) els.months.textContent = months;
        if (els.days) els.days.textContent = days;
        if (els.hours) els.hours.textContent = hours % 24;
        if (els.minutes) els.minutes.textContent = minutes % 60;
        if (els.seconds) els.seconds.textContent = seconds % 60;
    },

    // ============================================================
    // FIXED: MUSIC PLAYER
    // ============================================================
    toggleMusic: function() {
        const data = window.AppData || AppData;
        const song = data.songs[0] || {};

        if (!song.audioUrl) {
            alert('⚠️ لا يوجد رابط صوتي. أضف رابطاً في لوحة التحكم (قسم الموسيقى)');
            return;
        }

        if (this.isSoundCloudUrl(song.audioUrl)) {
            if (!this.soundCloudWidget || this.soundCloudUrl !== song.audioUrl) {
                this.setupSoundCloud(song.audioUrl);
            }

            if (!this.soundCloudWidget || !this.soundCloudReady) {
                alert('⏳ جاري تجهيز مشغل SoundCloud، حاول مرة أخرى بعد لحظة.');
                return;
            }

            if (this.isPlaying) {
                this.soundCloudWidget.pause();
            } else {
                this.soundCloudWidget.play();
            }
            return;
        }

        if (!this.audioElement) {
            this.setupAudio();
            return;
        }

        if (this.isPlaying) {
            this.audioElement.pause();
            this.isPlaying = false;
            const btn = document.getElementById('homePlayBtn');
            if (btn) btn.textContent = '▶️';
            return;
        }

        if (this.audioElement.src !== song.audioUrl) {
            this.audioElement.src = song.audioUrl;
            this.audioElement.load();
        }

        this.audioElement.play().then(() => {
            this.isPlaying = true;
            const btn = document.getElementById('homePlayBtn');
            if (btn) btn.textContent = '⏸️';
        }).catch((e) => {
            console.warn('تشغيل الصوت فشل:', e);
            alert('⚠️ لا يمكن تشغيل الصوت. تأكد من أن الرابط صحيح ومسموح تشغيله.');
            this.isPlaying = false;
            const btn = document.getElementById('homePlayBtn');
            if (btn) btn.textContent = '▶️';
        });
    },

    toggleVolume: function() {
        const data = window.AppData || AppData;
        const song = data.songs[0] || {};

        if (this.isSoundCloudUrl(song.audioUrl)) {
            if (!this.soundCloudWidget) {
                this.setupSoundCloud(song.audioUrl);
                return;
            }
            if (this._scMuted) {
                this.soundCloudWidget.setVolume(100);
                this._scMuted = false;
                const btn = document.getElementById('homeVolumeBtn');
                if (btn) btn.textContent = '🔊';
            } else {
                this.soundCloudWidget.setVolume(0);
                this._scMuted = true;
                const btn = document.getElementById('homeVolumeBtn');
                if (btn) btn.textContent = '🔇';
            }
            return;
        }

        if (!this.audioElement) return;
        this.audioElement.muted = !this.audioElement.muted;
        const btn = document.getElementById('homeVolumeBtn');
        if (btn) btn.textContent = this.audioElement.muted ? '🔇' : '🔊';
    },

    // Update music info when song changes
    updateMusic: function() {
        const data = window.AppData || AppData;
        const song = data.songs[0] || {};

        const cover = document.getElementById('homeMusicCover');
        const nameEl = document.getElementById('homeSongName');
        const artistEl = document.getElementById('homeArtist');

        if (cover) cover.src = song.cover || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%231a1015"/%3E%3Ctext x="50" y="60" font-size="40" text-anchor="middle" fill="%23d4a0a0"%3E🎵%3C/text%3E%3C/svg%3E';
        if (nameEl) nameEl.textContent = song.name || 'أغنية البداية';
        if (artistEl) artistEl.textContent = song.artist || 'ذكرياتنا';

        if (this.isSoundCloudUrl(song.audioUrl)) {
            this.setupSoundCloud(song.audioUrl);
            return;
        }

        if (this.audioElement && song.audioUrl) {
            this.audioElement.style.display = '';
            this.audioElement.src = song.audioUrl;
            this.audioElement.load();
        }
    },

    // Bind events
    bindEvents: function() {
        // Music play button
        const playBtn = document.getElementById('homePlayBtn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.toggleMusic());
        }

        // Volume button
        const volumeBtn = document.getElementById('homeVolumeBtn');
        if (volumeBtn) {
            volumeBtn.addEventListener('click', () => this.toggleVolume());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                this.toggleMusic();
            }
        });
    },

    // Destroy
    destroy: function() {
        if (this.counterInterval) {
            clearInterval(this.counterInterval);
            this.counterInterval = null;
        }
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement = null;
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomeComponent;
}