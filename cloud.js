/* ============================================================
   CLOUD DATA LAYER - Supabase
   Central storage for all site content.
   ============================================================ */

const CloudStore = (() => {
    // This project reuses the Supabase project already bundled with
    // the React version of the site.
    const SUPABASE_URL = 'https://krvfsszbffhilxeaqhlc.supabase.co';
    const CONFIG = {
        url: SUPABASE_URL,
        anonKey: 'sb_publishable_x43cT9JmKYazT0JakfZ1Ww_mJBUl90V'
    };

    let session = null;
    let initialized = false;

    const headers = (token = null) => ({
        'apikey': CONFIG.anonKey,
        'Authorization': `Bearer ${token || CONFIG.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    });

    async function rest(path, options = {}, token = null) {
        const response = await fetch(`${CONFIG.url}${path}`, {
            ...options,
            headers: { ...headers(token), ...(options.headers || {}) }
        });
        const text = await response.text();
        let body = null;
        try { body = text ? JSON.parse(text) : null; } catch (_) { body = text; }
        if (!response.ok) {
            const message = body?.message || body?.error_description || body?.hint || body?.error || `HTTP ${response.status}`;
            throw new Error(message);
        }
        return body;
    }

    function uuid() {
        return (crypto && crypto.randomUUID) ? crypto.randomUUID() :
            'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }

    function getSession() {
        try { return JSON.parse(localStorage.getItem('supabaseSession') || 'null'); } catch (_) { return null; }
    }

    function setSession(value) {
        session = value;
        if (value) localStorage.setItem('supabaseSession', JSON.stringify(value));
        else localStorage.removeItem('supabaseSession');
    }

    function mapFromCloud(rows, settingsRows, chatRows) {
        const current = window.AppData || {};
        const settings = settingsRows?.[0];
        const chat = chatRows?.[0];
        return {
            ...current,
            settings: settings ? {
                ...current.settings,
                siteTitle: settings.site_title || current.settings.siteTitle,
                siteSubtitle: settings.hero_text || current.settings.siteSubtitle,
                startDate: settings.start_date || current.settings.startDate,
                theme: settings.background || current.settings.theme,
                sitePassword: settings.site_password || current.settings.sitePassword
            } : current.settings,
            memories: (rows.memories || []).map(x => ({ id:x.id, title:x.title, description:x.description||'', date:x.memory_date, emoji:x.emoji||'❤️', image:x.image_url||'' })),
            messages: (rows.messages || []).map(x => ({ id:x.id, title:x.title, content:x.content||'', date:x.message_date, emoji:x.emoji||'💌', image:x.image_url||'' })),
            songs: (rows.songs || []).map(x => ({ id:x.id, name:x.title, artist:x.artist||'', cover:x.cover_url||'', audioUrl:x.audio_url, description:x.description||'' })),
            timeline: (rows.timeline || []).map(x => ({ id:x.id, emoji:x.emoji||'✨', title:x.title, description:x.description||'', date:x.timeline_date })),
            chatSettings: chat ? { name:chat.ai_name||'ذكرياتنا AI', avatar:chat.ai_avatar_url||'❤️', welcome:chat.welcome_message||'', systemPrompt:chat.system_prompt||'', language:chat.language||'ar' } : current.chatSettings
        };
    }

    async function getTable(table) {
        return rest(`/rest/v1/${table}?select=*`, {}, session?.access_token || null);
    }

    async function load() {
        const [settings, memories, messages, songs, timeline, chatSettings] = await Promise.all([
            getTable('site_settings'), getTable('memories'), getTable('messages'), getTable('songs'), getTable('timeline'), getTable('chat_settings')
        ]);
        return mapFromCloud({ memories, messages, songs, timeline }, settings, chatSettings);
    }

    function ensureIds(data) {
        ['memories','messages','songs','timeline'].forEach(key => {
            (data[key] || []).forEach(item => {
                if (!item.id || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(item.id))) item.id = uuid();
            });
        });
    }

    async function syncTable(table, items, mapper) {
        const existing = await rest(`/rest/v1/${table}?select=id`, {}, session.access_token);
        const mapped = items.map(mapper);
        if (mapped.length) await rest(`/rest/v1/${table}`, { method:'POST', body:JSON.stringify(mapped), headers:{'Prefer':'resolution=merge-duplicates,return=minimal'} }, session.access_token);
        const keep = mapped.map(x => x.id);
        const remove = existing.filter(x => !keep.includes(x.id)).map(x => x.id);
        if (remove.length) {
            // Supabase/PostgREST supports repeated id query params safely.
            const q = remove.map(id => `id.neq.${encodeURIComponent(id)}`).join('&');
            // Delete extras one by one to avoid URL/filter edge cases.
            for (const id of remove) await rest(`/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, { method:'DELETE', headers:{'Prefer':'return=minimal'} }, session.access_token);
        }
    }

    async function save(data) {
        if (!session?.access_token) return false;
        ensureIds(data);

        await syncTable('memories', data.memories || [], x => ({
            id:x.id, title:x.title||'', description:x.description||'', image_url:x.image||null,
            memory_date:x.date || new Date().toISOString().slice(0,10), emoji:x.emoji||'❤️', sort_order:0
        }));
        await syncTable('messages', data.messages || [], x => ({
            id:x.id, title:x.title||'', content:x.content||'', message_date:x.date || new Date().toISOString().slice(0,10),
            emoji:x.emoji||'💌', image_url:x.image||null, sort_order:0
        }));
        await syncTable('songs', data.songs || [], x => ({
            id:x.id, title:x.name||'', artist:x.artist||'', audio_url:x.audioUrl||'', cover_url:x.cover||null, description:x.description||'', sort_order:0
        }));
        await syncTable('timeline', data.timeline || [], x => ({
            id:x.id, title:x.title||'', description:x.description||'', timeline_date:x.date || new Date().toISOString().slice(0,10), emoji:x.emoji||'✨', image_url:x.image||null, sort_order:0
        }));

        const settingsRows = await getTable('site_settings');
        const settingsId = settingsRows?.[0]?.id;
        const settingsPayload = {
            site_name:data.settings.siteTitle||'ذكرياتنا ❤️',
            site_title:data.settings.siteTitle||'ذكرياتنا | قصتنا الجميلة',
            hero_text:data.settings.siteSubtitle||'',
            start_date:data.settings.startDate||new Date().toISOString(),
            background:data.settings.theme||'dark',
            site_password:data.settings.sitePassword||''
        };
        if (settingsId) await rest(`/rest/v1/site_settings?id=eq.${settingsId}`, {method:'PATCH',body:JSON.stringify(settingsPayload)}, session.access_token);
        else await rest('/rest/v1/site_settings', {method:'POST',body:JSON.stringify(settingsPayload)}, session.access_token);

        const chat = data.chatSettings || {};
        const chatRows = await getTable('chat_settings');
        const chatPayload = {
            ai_name:chat.name||'ذكرياتنا AI',
            ai_avatar_url:chat.avatar||'❤️',
            welcome_message:chat.welcome||'',
            system_prompt:chat.systemPrompt||'',
            language:chat.language||'ar'
        };
        if (chatRows?.[0]?.id) await rest(`/rest/v1/chat_settings?id=eq.${chatRows[0].id}`, {method:'PATCH',body:JSON.stringify(chatPayload)}, session.access_token);
        else await rest('/rest/v1/chat_settings', {method:'POST',body:JSON.stringify(chatPayload)}, session.access_token);

        return true;
    }

    async function login(email, password) {
        const result = await rest('/auth/v1/token?grant_type=password', { method:'POST', body:JSON.stringify({ email, password }) });
        if (!result?.access_token) throw new Error('تعذر تسجيل الدخول');
        setSession(result);
        // Verify that the account is an admin before allowing writes.
        const profile = await rest(`/rest/v1/profiles?id=eq.${encodeURIComponent(result.user.id)}&select=id,role`, {}, result.access_token);
        if (!profile?.[0] || profile[0].role !== 'admin') {
            setSession(null);
            throw new Error('الحساب ليس Admin');
        }
        return result;
    }


    async function updateUser(payload) {
        if (!session?.access_token) throw new Error('جلسة Admin غير موجودة');
        const result = await rest('/auth/v1/user', { method:'PUT', body:JSON.stringify(payload) }, session.access_token);
        if (result?.access_token) setSession({ ...session, ...result });
        else if (result?.user) setSession({ ...session, user: result.user });
        return result;
    }

    async function logout() {
        if (session?.access_token) {
            try { await rest('/auth/v1/logout', {method:'POST'}, session.access_token); } catch (_) {}
        }
        setSession(null);
    }

    async function init() {
        if (initialized) return;
        session = getSession();
        // Validate session and refresh content. Public visitors need no login.
        try {
            const cloud = await load();
            if (cloud && cloud.memories) {
                window.AppData = cloud;
                AppData = cloud;
                if (typeof saveData === 'function') localStorage.setItem('appData', JSON.stringify(cloud));
            }
        } catch (e) {
            console.warn('Cloud load failed; using local fallback:', e);
        }
        initialized = true;
    }

    return {
        init, load, save, login, logout, updateUser,
        isAdmin: () => !!session?.access_token,
        getSession: () => session,
        config: CONFIG
    };
})();

window.CloudStore = CloudStore;
