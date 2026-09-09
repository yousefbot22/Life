// ============================================================
// ADMIN PAGE COMPONENT - FIXED SONGS MANAGEMENT
// ============================================================

const AdminComponent = {
    container: null,
    isLoggedIn: false,
    currentSection: 'dashboard',
    editingSongId: null, // Track which song is being edited
    // Admin credentials
    ADMIN_USERNAME: '',
    ADMIN_PASSWORD: '',

    // Initialize
    init: function() {
        this.container = document.getElementById('page-admin');
        this.isLoggedIn = this.checkAuth();
        this.render();
        this.bindEvents();
    },

    // Check authentication
    checkAuth: function() {
        return !!(window.CloudStore && window.CloudStore.isAdmin());
    },

    // Render
    render: function() {
        if (!this.isLoggedIn) {
            this.container.innerHTML = this.renderLoginForm();
            return;
        }
        this.container.innerHTML = this.renderDashboard();
        // Show default section
        this.showSection('dashboard');
    },

    // Render login form
    renderLoginForm: function() {
        return `
            <div class="admin-login" style="padding:30px 0;">
                <div class="glass" style="max-width:360px;margin:0 auto;padding:30px 24px;text-align:center;">
                    <div style="font-size:3rem;margin-bottom:8px;">🔐</div>
                    <h2 style="font-size:1.4rem;margin-bottom:4px;">لوحة التحكم</h2>
                    <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:20px;">أدخل بيانات الدخول</p>
                    <form id="adminLoginForm">
                        <div class="form-group">
                            <label style="text-align:right;display:block;font-size:0.8rem;color:var(--text-secondary);margin-bottom:4px;">البريد الإلكتروني</label>
                            <input type="email" id="adminUsername" placeholder="admin@example.com" style="text-align:center;" required />
                        </div>
                        <div class="form-group">
                            <label style="text-align:right;display:block;font-size:0.8rem;color:var(--text-secondary);margin-bottom:4px;">كلمة المرور</label>
                            <input type="password" id="adminPassword" placeholder="••••••••" style="text-align:center;" required />
                        </div>
                        <div id="adminLoginError" style="color:#e74c3c;font-size:0.85rem;min-height:24px;margin-bottom:10px;"></div>
                        <button type="submit" style="width:100%;padding:12px;border:none;border-radius:30px;background:var(--accent);color:#fff;font-family:var(--font);font-weight:700;cursor:pointer;transition:var(--transition);font-size:1rem;">
                            دخول
                        </button>
                    </form>
                </div>
            </div>
        `;
    },

    // Render dashboard
    renderDashboard: function() {
        const data = window.AppData || AppData;
        return `
            <div class="admin-panel">
                <div class="admin-header">
                    <h2>📊 لوحة التحكم</h2>
                    <div style="display:flex;gap:10px;align-items:center;">
                        <span style="font-size:0.8rem;color:var(--text-secondary);">
                            <i class="fas fa-user"></i> ${window.CloudStore?.getSession()?.user?.email || 'Admin'}
                        </span>
                        <button id="adminLogoutBtn" style="background:none;border:none;color:var(--text-secondary);cursor:pointer;font-size:0.85rem;font-family:var(--font);padding:4px 12px;border-radius:20px;transition:var(--transition);">
                            <i class="fas fa-sign-out-alt"></i> خروج
                        </button>
                    </div>
                </div>

                <div class="admin-grid">
                    <div class="admin-card" data-section="dashboard">
                        <div class="admin-icon">📊</div>
                        <div class="admin-label">نظرة عامة</div>
                        <div class="admin-count">إحصائيات</div>
                    </div>
                    <div class="admin-card" data-section="memories">
                        <div class="admin-icon">🖼</div>
                        <div class="admin-label">الذكريات</div>
                        <div class="admin-count">${data.memories.length}</div>
                    </div>
                    <div class="admin-card" data-section="messages">
                        <div class="admin-icon">💌</div>
                        <div class="admin-label">الرسائل</div>
                        <div class="admin-count">${data.messages.length}</div>
                    </div>
                    <div class="admin-card" data-section="songs">
                        <div class="admin-icon">🎵</div>
                        <div class="admin-label">الأغاني</div>
                        <div class="admin-count">${data.songs.length}</div>
                    </div>
                    <div class="admin-card" data-section="timeline">
                        <div class="admin-icon">📅</div>
                        <div class="admin-label">الجدول الزمني</div>
                        <div class="admin-count">${data.timeline.length}</div>
                    </div>
                    <div class="admin-card" data-section="settings">
                        <div class="admin-icon">⚙️</div>
                        <div class="admin-label">الإعدادات</div>
                        <div class="admin-count">تعديل</div>
                    </div>
                    <div class="admin-card" data-section="security">
                        <div class="admin-icon">🔐</div>
                        <div class="admin-label">الأمان</div>
                        <div class="admin-count">تغيير</div>
                    </div>
                    <div class="admin-card" data-section="music">
                        <div class="admin-icon">🎶</div>
                        <div class="admin-label">الموسيقى</div>
                        <div class="admin-count">إدارة</div>
                    </div>
                </div>

                <div id="adminContent"></div>
            </div>
        `;
    },

    // Show section
    showSection: function(section) {
        const content = document.getElementById('adminContent');
        if (!content) return;

        switch(section) {
            case 'dashboard':
                content.innerHTML = this.renderDashboardStats();
                break;
            case 'memories':
                content.innerHTML = this.renderMemoriesManager();
                break;
            case 'messages':
                content.innerHTML = this.renderMessagesManager();
                break;
            case 'songs':
                content.innerHTML = this.renderSongsManager();
                break;
            case 'timeline':
                content.innerHTML = this.renderTimelineManager();
                break;
            case 'settings':
                content.innerHTML = this.renderSettingsManager();
                break;
            case 'security':
                content.innerHTML = this.renderSecurityManager();
                break;
            case 'music':
                content.innerHTML = this.renderMusicManager();
                break;
            default:
                content.innerHTML = '';
        }

        this.currentSection = section;
        this.bindSectionEvents(section);
    },

    // Render dashboard stats
    renderDashboardStats: function() {
        const data = window.AppData || AppData;
        return `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0;">
                <div class="glass-sm" style="padding:16px;text-align:center;">
                    <div style="font-size:2rem;">🖼</div>
                    <div style="font-size:1.6rem;font-weight:700;">${data.memories.length}</div>
                    <div style="font-size:0.8rem;color:var(--text-secondary);">ذكريات</div>
                </div>
                <div class="glass-sm" style="padding:16px;text-align:center;">
                    <div style="font-size:2rem;">💌</div>
                    <div style="font-size:1.6rem;font-weight:700;">${data.messages.length}</div>
                    <div style="font-size:0.8rem;color:var(--text-secondary);">رسائل</div>
                </div>
                <div class="glass-sm" style="padding:16px;text-align:center;">
                    <div style="font-size:2rem;">🎵</div>
                    <div style="font-size:1.6rem;font-weight:700;">${data.songs.length}</div>
                    <div style="font-size:0.8rem;color:var(--text-secondary);">أغاني</div>
                </div>
                <div class="glass-sm" style="padding:16px;text-align:center;">
                    <div style="font-size:2rem;">📅</div>
                    <div style="font-size:1.6rem;font-weight:700;">${data.timeline.length}</div>
                    <div style="font-size:0.8rem;color:var(--text-secondary);">أحداث</div>
                </div>
            </div>
            <div class="glass-sm" style="padding:16px;text-align:center;color:var(--text-secondary);font-size:0.85rem;">
                <i class="fas fa-clock"></i> تاريخ البداية: ${Utils.formatDate(data.settings.startDate)}
            </div>
        `;
    },

    // Render memories manager
    renderMemoriesManager: function() {
        const data = window.AppData || AppData;
        return `
            <div class="admin-form">
                <div class="form-title">➕ إضافة ذكرى جديدة</div>
                <form id="memoryForm">
                    <div class="form-group">
                        <label>العنوان</label>
                        <input type="text" id="memoryTitle" placeholder="عنوان الذكرى" required />
                    </div>
                    <div class="form-group">
                        <label>الوصف</label>
                        <textarea id="memoryDesc" placeholder="وصف الذكرى"></textarea>
                    </div>
                    <div class="form-group">
                        <label>التاريخ</label>
                        <input type="date" id="memoryDate" required />
                    </div>
                    <div class="form-group">
                        <label>إيموجي</label>
                        <input type="text" id="memoryEmoji" placeholder="❤️" maxlength="2" />
                    </div>
                    <div class="form-group">
                        <label>رابط الصورة</label>
                        <input type="text" id="memoryImage" placeholder="https://example.com/image.jpg" />
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-save">💾 حفظ</button>
                        <button type="reset" class="btn-cancel">🗑 إلغاء</button>
                    </div>
                </form>
            </div>
            <div class="admin-list">
                <div style="font-weight:700;margin-bottom:8px;">📋 قائمة الذكريات (${data.memories.length})</div>
                ${data.memories.length ? data.memories.map(m => `
                    <div class="list-item" data-id="${m.id}">
                        <div class="item-info">
                            <div class="item-title">${m.emoji || '❤️'} ${m.title}</div>
                            <div class="item-sub">${Utils.formatDate(m.date)}</div>
                        </div>
                        <div class="item-actions">
                            <button class="edit-btn" data-id="${m.id}"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn" data-id="${m.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `).join('') : '<div style="text-align:center;padding:20px;color:var(--text-secondary);opacity:0.6;">لا توجد ذكريات</div>'}
            </div>
        `;
    },

    // Render messages manager
    renderMessagesManager: function() {
        const data = window.AppData || AppData;
        return `
            <div class="admin-form">
                <div class="form-title">➕ إضافة رسالة جديدة</div>
                <form id="messageForm">
                    <div class="form-group">
                        <label>العنوان</label>
                        <input type="text" id="messageTitle" placeholder="عنوان الرسالة" required />
                    </div>
                    <div class="form-group">
                        <label>نص الرسالة</label>
                        <textarea id="messageContent" placeholder="نص الرسالة" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>التاريخ</label>
                        <input type="date" id="messageDate" required />
                    </div>
                    <div class="form-group">
                        <label>إيموجي</label>
                        <input type="text" id="messageEmoji" placeholder="💌" maxlength="2" />
                    </div>
                    <div class="form-group">
                        <label>رابط الصورة (اختياري)</label>
                        <input type="text" id="messageImage" placeholder="https://example.com/image.jpg" />
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-save">💾 حفظ</button>
                        <button type="reset" class="btn-cancel">🗑 إلغاء</button>
                    </div>
                </form>
            </div>
            <div class="admin-list">
                <div style="font-weight:700;margin-bottom:8px;">📋 قائمة الرسائل (${data.messages.length})</div>
                ${data.messages.length ? data.messages.map(m => `
                    <div class="list-item" data-id="${m.id}">
                        <div class="item-info">
                            <div class="item-title">${m.emoji || '💌'} ${m.title}</div>
                            <div class="item-sub">${Utils.formatDate(m.date)}</div>
                        </div>
                        <div class="item-actions">
                            <button class="edit-btn" data-id="${m.id}"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn" data-id="${m.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `).join('') : '<div style="text-align:center;padding:20px;color:var(--text-secondary);opacity:0.6;">لا توجد رسائل</div>'}
            </div>
        `;
    },

    // ============================================================
    // FIXED: SONGS MANAGER WITH EDIT/DELETE
    // ============================================================
    renderSongsManager: function() {
        const data = window.AppData || AppData;
        const editingSong = this.editingSongId ? data.songs.find(s => s.id === this.editingSongId) : null;

        return `
            <div class="admin-form">
                <div class="form-title">${editingSong ? '✏️ تعديل الأغنية' : '➕ إضافة أغنية جديدة'}</div>
                <form id="songForm">
                    <input type="hidden" id="songEditId" value="${editingSong ? editingSong.id : ''}" />
                    <div class="form-group">
                        <label>اسم الأغنية</label>
                        <input type="text" id="songName" placeholder="اسم الأغنية" required value="${editingSong ? editingSong.name : ''}" />
                    </div>
                    <div class="form-group">
                        <label>اسم الفنان</label>
                        <input type="text" id="songArtist" placeholder="اسم الفنان" required value="${editingSong ? editingSong.artist : ''}" />
                    </div>
                    <div class="form-group">
                        <label>رابط الصورة (غلاف)</label>
                        <input type="text" id="songCover" placeholder="https://example.com/cover.jpg" value="${editingSong ? editingSong.cover : ''}" />
                    </div>
                    <div class="form-group">
                        <label>رابط الصوت (MP3 أو SoundCloud)</label>
                        <input type="text" id="songAudio" placeholder="MP3 مباشر أو رابط SoundCloud" value="${editingSong ? editingSong.audioUrl : ''}" />
                    </div>
                    <div class="form-group">
                        <label>الوصف</label>
                        <input type="text" id="songDesc" placeholder="وصف الأغنية" value="${editingSong ? editingSong.description : ''}" />
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-save">💾 ${editingSong ? 'تحديث' : 'حفظ'}</button>
                        ${editingSong ? `<button type="button" class="btn-cancel" id="cancelEditSong">🗑 إلغاء التعديل</button>` : ''}
                        <button type="reset" class="btn-cancel">🗑 إلغاء</button>
                    </div>
                </form>
            </div>
            <div class="admin-list">
                <div style="font-weight:700;margin-bottom:8px;">📋 قائمة الأغاني (${data.songs.length})</div>
                ${data.songs.length ? data.songs.map(s => `
                    <div class="list-item" data-id="${s.id}">
                        <div class="item-info">
                            <div class="item-title">🎵 ${s.name}</div>
                            <div class="item-sub">${s.artist} ${s.audioUrl ? '🔊' : '🔇'}</div>
                        </div>
                        <div class="item-actions">
                            <button class="edit-song-btn" data-id="${s.id}"><i class="fas fa-edit"></i></button>
                            <button class="delete-song-btn" data-id="${s.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `).join('') : '<div style="text-align:center;padding:20px;color:var(--text-secondary);opacity:0.6;">لا توجد أغاني</div>'}
            </div>
        `;
    },

    // Render timeline manager
    renderTimelineManager: function() {
        const data = window.AppData || AppData;
        return `
            <div class="admin-form">
                <div class="form-title">➕ إضافة حدث جديد</div>
                <form id="timelineForm">
                    <div class="form-group">
                        <label>العنوان</label>
                        <input type="text" id="timelineTitle" placeholder="عنوان الحدث" required />
                    </div>
                    <div class="form-group">
                        <label>الوصف</label>
                        <input type="text" id="timelineDesc" placeholder="وصف الحدث" />
                    </div>
                    <div class="form-group">
                        <label>إيموجي</label>
                        <input type="text" id="timelineEmoji" placeholder="✨" maxlength="2" />
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-save">💾 حفظ</button>
                        <button type="reset" class="btn-cancel">🗑 إلغاء</button>
                    </div>
                </form>
            </div>
            <div class="admin-list">
                <div style="font-weight:700;margin-bottom:8px;">📋 قائمة الأحداث (${data.timeline.length})</div>
                ${data.timeline.length ? data.timeline.map((t, i) => `
                    <div class="list-item" data-index="${i}">
                        <div class="item-info">
                            <div class="item-title">${t.emoji || '✨'} ${t.title}</div>
                            <div class="item-sub">${t.description || ''}</div>
                        </div>
                        <div class="item-actions">
                            <button class="edit-btn" data-index="${i}"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn" data-index="${i}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `).join('') : '<div style="text-align:center;padding:20px;color:var(--text-secondary);opacity:0.6;">لا توجد أحداث</div>'}
            </div>
        `;
    },

    // Render settings manager
    renderSettingsManager: function() {
        const data = window.AppData || AppData;
        const settings = data.settings;

        return `
            <div class="admin-form">
                <div class="form-title">⚙️ إعدادات الموقع</div>
                <form id="settingsForm">
                    <div class="form-group">
                        <label>اسم الموقع</label>
                        <input type="text" id="siteTitle" value="${settings.siteTitle || 'ذكرياتنا ❤️'}" />
                    </div>
                    <div class="form-group">
                        <label>العنوان الفرعي</label>
                        <input type="text" id="siteSubtitle" value="${settings.siteSubtitle || 'من بداية قصتنا إلى كل لحظة جميلة عشناها'}" />
                    </div>
                    <div class="form-group">
                        <label>تاريخ البداية</label>
                        <input type="datetime-local" id="startDate" value="${Utils.formatDateInput(settings.startDate)}" />
                    </div>
                    <div class="form-group">
                        <label>كلمة مرور الموقع (مركزية)</label>
                        <input type="password" id="sitePassword" value="${settings.sitePassword || ''}" placeholder="كلمة مرور دخول الموقع" />
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-save">💾 حفظ الإعدادات</button>
                    </div>
                </form>
            </div>
        `;
    },

    // Render security manager
    renderSecurityManager: function() {
        const email = window.CloudStore?.getSession()?.user?.email || '';
        return `
            <div class="admin-form">
                <div class="form-title">🔐 تغيير بيانات الدخول</div>
                <form id="securityForm">
                    <div class="form-group">
                        <label>البريد الإلكتروني الحالي</label>
                        <input type="email" id="currentUsername" value="${email}" disabled style="opacity:0.6;" />
                    </div>
                    <div class="form-group">
                        <label>كلمة المرور الحالية</label>
                        <input type="password" id="currentPassword" placeholder="••••••••" required />
                    </div>
                    <div class="form-group">
                        <label>البريد الإلكتروني الجديد</label>
                        <input type="email" id="newUsername" placeholder="اتركه فارغًا لعدم التغيير" />
                    </div>
                    <div class="form-group">
                        <label>كلمة المرور الجديدة</label>
                        <input type="password" id="newPassword" placeholder="••••••••" />
                    </div>
                    <div class="form-group">
                        <label>تأكيد كلمة المرور</label>
                        <input type="password" id="confirmPassword" placeholder="••••••••" />
                    </div>
                    <div style="color:var(--text-secondary);font-size:0.8rem;margin-bottom:12px;">
                        <i class="fas fa-info-circle"></i> بيانات الدخول أصبحت مركزية ومحفوظة في Supabase.
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-save">💾 تحديث البيانات</button>
                    </div>
                </form>
            </div>
        `;
    },

    // Render music manager
    renderMusicManager: function() {
        const data = window.AppData || AppData;
        const song = data.songs[0] || {};
        return `
            <div class="admin-form">
                <div class="form-title">🎶 إدارة الموسيقى الرئيسية</div>
                <form id="musicForm">
                    <div class="form-group">
                        <label>رابط الصوت (MP3 أو SoundCloud)</label>
                        <input type="text" id="musicAudioUrl" value="${song.audioUrl || ''}" placeholder="MP3 مباشر أو رابط SoundCloud" />
                        <div style="font-size:0.7rem;color:var(--text-secondary);margin-top:4px;">
                            <i class="fas fa-info-circle"></i> استخدم رابطاً مباشراً لملف MP3
                        </div>
                    </div>
                    <div class="form-group">
                        <label>رابط الغلاف</label>
                        <input type="text" id="musicCover" value="${song.cover || ''}" placeholder="https://example.com/cover.jpg" />
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-save">💾 تحديث الموسيقى</button>
                    </div>
                </form>
            </div>
            <div class="glass-sm" style="padding:16px;margin:12px 0;">
                <div style="font-weight:700;margin-bottom:8px;">📌 اختبار الرابط</div>
                <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
                    <input type="text" id="testAudioUrl" value="${song.audioUrl || ''}" placeholder="أدخل رابطاً للتجربة" style="flex:1;min-width:200px;padding:8px 14px;border-radius:30px;border:1px solid var(--glass-border);background:var(--bg-input);color:var(--text-primary);font-family:var(--font);" />
                    <button id="testAudioBtn" style="padding:8px 16px;border:none;border-radius:30px;background:var(--accent);color:#fff;cursor:pointer;font-family:var(--font);">▶️ اختبار</button>
                </div>
                <div id="testResult" style="font-size:0.8rem;margin-top:6px;color:var(--text-secondary);"></div>
            </div>
        `;
    },

    // ============================================================
    // BIND SECTION EVENTS
    // ============================================================
    bindSectionEvents: function(section) {
        switch(section) {
            case 'memories':
                this.bindMemoryEvents();
                break;
            case 'messages':
                this.bindMessageEvents();
                break;
            case 'songs':
                this.bindSongEvents();
                break;
            case 'timeline':
                this.bindTimelineEvents();
                break;
            case 'settings':
                this.bindSettingsEvents();
                break;
            case 'security':
                this.bindSecurityEvents();
                break;
            case 'music':
                this.bindMusicEvents();
                break;
        }
    },

    // Bind memory events
    bindMemoryEvents: function() {
        const form = document.getElementById('memoryForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const data = window.AppData || AppData;
                const newMemory = {
                    id: Utils.generateId(),
                    title: document.getElementById('memoryTitle').value,
                    description: document.getElementById('memoryDesc').value,
                    date: document.getElementById('memoryDate').value,
                    emoji: document.getElementById('memoryEmoji').value || '❤️',
                    image: document.getElementById('memoryImage').value || ''
                };
                data.memories.push(newMemory);
                this.showSection('memories');
                // Refresh home page
                if (window.HomeComponent) {
                    window.HomeComponent.render();
                }
                if (window.MemoriesComponent) {
                    window.MemoriesComponent.render();
                }
            });
        }

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من حذف هذه الذكرى؟')) {
                    const id = btn.dataset.id;
                    const data = window.AppData || AppData;
                    data.memories = data.memories.filter(m => m.id !== id);
                    window.saveData();
                    this.showSection('memories');
                    if (window.HomeComponent) window.HomeComponent.render();
                    if (window.MemoriesComponent) window.MemoriesComponent.render();
                }
            });
        });
    },

    // Bind message events
    bindMessageEvents: function() {
        const form = document.getElementById('messageForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const data = window.AppData || AppData;
                const newMessage = {
                    id: Utils.generateId(),
                    title: document.getElementById('messageTitle').value,
                    content: document.getElementById('messageContent').value,
                    date: document.getElementById('messageDate').value,
                    emoji: document.getElementById('messageEmoji').value || '💌',
                    image: document.getElementById('messageImage').value || ''
                };
                data.messages.push(newMessage);
                this.showSection('messages');
                if (window.MessagesComponent) window.MessagesComponent.render();
            });
        }

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
                    const id = btn.dataset.id;
                    const data = window.AppData || AppData;
                    data.messages = data.messages.filter(m => m.id !== id);
                    window.saveData();
                    this.showSection('messages');
                    if (window.MessagesComponent) window.MessagesComponent.render();
                }
            });
        });
    },

    // ============================================================
    // FIXED: BIND SONG EVENTS (Edit & Delete)
    // ============================================================
    bindSongEvents: function() {
        const form = document.getElementById('songForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const data = window.AppData || AppData;
                const editId = document.getElementById('songEditId').value;
                const songData = {
                    name: document.getElementById('songName').value,
                    artist: document.getElementById('songArtist').value,
                    cover: document.getElementById('songCover').value || '',
                    audioUrl: document.getElementById('songAudio').value || '',
                    description: document.getElementById('songDesc').value || ''
                };

                if (editId) {
                    // EDIT: Update existing song
                    const index = data.songs.findIndex(s => s.id === editId);
                    if (index !== -1) {
                        data.songs[index] = { ...data.songs[index], ...songData };
                        window.saveData();
                    }
                    this.editingSongId = null;
                } else {
                    // ADD: Create new song
                    const newSong = {
                        id: Utils.generateId(),
                        ...songData
                    };
                    data.songs.push(newSong);
                }

                this.showSection('songs');
                if (window.HomeComponent) {
                    window.HomeComponent.updateMusic();
                }
            });
        }

        // Cancel edit button
        const cancelEdit = document.getElementById('cancelEditSong');
        if (cancelEdit) {
            cancelEdit.addEventListener('click', () => {
                this.editingSongId = null;
                this.showSection('songs');
            });
        }

        // Edit buttons
        document.querySelectorAll('.edit-song-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                this.editingSongId = id;
                this.showSection('songs');
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-song-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من حذف هذه الأغنية؟')) {
                    const id = btn.dataset.id;
                    const data = window.AppData || AppData;
                    data.songs = data.songs.filter(s => s.id !== id);
                    window.saveData();
                    if (this.editingSongId === id) this.editingSongId = null;
                    this.showSection('songs');
                    if (window.HomeComponent) {
                        window.HomeComponent.updateMusic();
                    }
                }
            });
        });
    },

    // Bind timeline events
    bindTimelineEvents: function() {
        const form = document.getElementById('timelineForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const data = window.AppData || AppData;
                const newItem = {
                    emoji: document.getElementById('timelineEmoji').value || '✨',
                    title: document.getElementById('timelineTitle').value,
                    description: document.getElementById('timelineDesc').value || ''
                };
                data.timeline.push(newItem);
                this.showSection('timeline');
                if (window.HomeComponent) window.HomeComponent.render();
            });
        }

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من حذف هذا الحدث؟')) {
                    const index = parseInt(btn.dataset.index);
                    const data = window.AppData || AppData;
                    data.timeline.splice(index, 1);
                    window.saveData();
                    this.showSection('timeline');
                    if (window.HomeComponent) window.HomeComponent.render();
                }
            });
        });
    },

    // Bind settings events
    bindSettingsEvents: function() {
        const form = document.getElementById('settingsForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const data = window.AppData || AppData;
                data.settings.siteTitle = document.getElementById('siteTitle').value;
                data.settings.siteSubtitle = document.getElementById('siteSubtitle').value;
                data.settings.startDate = document.getElementById('startDate').value;
                data.settings.sitePassword = document.getElementById('sitePassword').value;
                await window.saveData();
                alert('✅ تم حفظ الإعدادات مركزيًا لكل الأجهزة');
                if (window.HomeComponent) window.HomeComponent.render();
            });
        }
    },

    // Bind security events
    bindSecurityEvents: function() {
        const form = document.getElementById('securityForm');
        if (!form) return;
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const currentPass = document.getElementById('currentPassword').value;
            const newEmail = document.getElementById('newUsername').value.trim();
            const newPass = document.getElementById('newPassword').value;
            const confirmPass = document.getElementById('confirmPassword').value;
            const currentEmail = window.CloudStore?.getSession()?.user?.email;
            if (!currentEmail) return alert('❌ جلسة Admin غير موجودة');
            try {
                // Re-authenticate before changing credentials.
                await window.CloudStore.login(currentEmail, currentPass);
                if (newPass && newPass !== confirmPass) return alert('❌ كلمة المرور الجديدة غير متطابقة');
                if (newPass && newPass.length < 6) return alert('❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل');
                if (newEmail || newPass) await window.CloudStore.updateUser({ email: newEmail || undefined, password: newPass || undefined });
                alert('✅ تم تحديث بيانات الدخول المركزية بنجاح');
                form.reset();
                this.render();
                this.bindEvents();
            } catch (err) {
                alert('❌ ' + (err.message || 'تعذر تحديث بيانات الدخول'));
            }
        });
    },

    // Bind music events
    bindMusicEvents: function() {
        const form = document.getElementById('musicForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const data = window.AppData || AppData;
                const audioUrl = document.getElementById('musicAudioUrl').value;
                const cover = document.getElementById('musicCover').value;
                
                if (data.songs.length === 0) {
                    data.songs.push({
                        id: Utils.generateId(),
                        name: 'الأغنية الرئيسية',
                        artist: 'ذكرياتنا',
                        cover: cover || '',
                        audioUrl: audioUrl || '',
                        description: ''
                    });
                } else {
                    data.songs[0].audioUrl = audioUrl || '';
                    data.songs[0].cover = cover || '';
                    window.saveData();
                }
                
                alert('✅ تم تحديث الموسيقى بنجاح');
                if (window.HomeComponent) {
                    window.HomeComponent.updateMusic();
                }
            });
        }

        // Test audio button
        const testBtn = document.getElementById('testAudioBtn');
        const testInput = document.getElementById('testAudioUrl');
        const testResult = document.getElementById('testResult');
        
        if (testBtn && testInput) {
            testBtn.addEventListener('click', () => {
                const url = testInput.value.trim();
                if (!url) {
                    testResult.textContent = '⚠️ الرجاء إدخال رابط';
                    testResult.style.color = '#e74c3c';
                    return;
                }
                
                // SoundCloud links are page URLs, not direct MP3 files.
                // They are supported by the site's official SoundCloud widget.
                if (/^(https?:\/\/)(www\.)?soundcloud\.com\//i.test(url)) {
                    testResult.textContent = '✅ رابط SoundCloud صالح للمشغل داخل الموقع';
                    testResult.style.color = '#2ecc71';
                    return;
                }

                testResult.textContent = '⏳ جاري اختبار الرابط...';
                testResult.style.color = 'var(--text-secondary)';
                
                const audio = new Audio();
                audio.preload = 'metadata';
                audio.src = url;
                
                audio.addEventListener('loadedmetadata', () => {
                    testResult.textContent = '✅ الرابط يعمل! المدة: ' + Math.floor(audio.duration) + ' ثانية';
                    testResult.style.color = '#2ecc71';
                    audio.src = '';
                });
                
                audio.addEventListener('error', () => {
                    testResult.textContent = '❌ الرابط لا يعمل. استخدم رابط MP3 مباشر أو رابط SoundCloud صالح.';
                    testResult.style.color = '#e74c3c';
                    audio.src = '';
                });
                
                setTimeout(() => {
                    if (testResult.textContent === '⏳ جاري اختبار الرابط...') {
                        testResult.textContent = '⏱️ انتهى الوقت. قد يكون الرابط بطيئاً أو غير صحيح';
                        testResult.style.color = '#f39c12';
                        audio.src = '';
                    }
                }, 5000);
            });
        }
    },

    // Bind main events
    bindEvents: function() {
        // Admin login
        const loginForm = document.getElementById('adminLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('adminUsername').value;
                const password = document.getElementById('adminPassword').value;
                const errorEl = document.getElementById('adminLoginError');

                if (!window.CloudStore) {
                    errorEl.textContent = '❌ خدمة التخزين السحابي غير متاحة';
                    return;
                }
                errorEl.textContent = '⏳ جاري تسجيل الدخول...';
                try {
                    await window.CloudStore.login(username.trim(), password);
                    this.ADMIN_USERNAME = username.trim();
                    this.isLoggedIn = true;
                    this.render();
                    this.bindEvents();
                    errorEl.textContent = '';
                    // If the cloud database is empty, upload the current defaults once.
                    const cloud = await window.CloudStore.load();
                    if (!cloud.memories.length && !cloud.messages.length && !cloud.songs.length && !cloud.timeline.length) {
                        await window.CloudStore.save(window.AppData || AppData);
                    } else {
                        window.AppData = cloud;
                        AppData = cloud;
                    }
                    this.render();
                    this.bindEvents();
                } catch (err) {
                    errorEl.textContent = '❌ ' + (err.message || 'بيانات الدخول غير صحيحة');
                }
            });
        }

        // Admin cards navigation
        document.querySelectorAll('.admin-card').forEach(card => {
            card.addEventListener('click', () => {
                const section = card.dataset.section;
                if (section) this.showSection(section);
            });
        });

        // Logout
        const logoutBtn = document.getElementById('adminLogoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                if (confirm('هل أنت متأكد من الخروج؟')) {
                    await window.CloudStore.logout();
                    this.isLoggedIn = false;
                    this.render();
                    this.bindEvents();
                }
            });
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminComponent;
}