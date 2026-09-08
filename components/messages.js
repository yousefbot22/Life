// ============================================================
// MESSAGES PAGE COMPONENT
// ============================================================

const MessagesComponent = {
    container: null,

    // Initialize
    init: function() {
        this.container = document.getElementById('page-messages');
        this.render();
        this.bindEvents();
    },

    // Render
    render: function() {
        const data = window.AppData || AppData;
        const messages = data.messages || [];

        if (!messages.length) {
            this.container.innerHTML = `
                <div class="section-title">
                    <span class="bar"></span>
                    💌 رسائل خاصة
                </div>
                <div class="empty-state">
                    <span class="big-emoji">💌</span>
                    لا توجد رسائل بعد
                </div>
            `;
            return;
        }

        this.container.innerHTML = `
            <div class="section-title">
                <span class="bar"></span>
                💌 رسائل خاصة
            </div>
            <div class="cards-grid" id="messagesGrid">
                ${messages.map((m, i) => `
                    <div class="card-item" data-index="${i}">
                        ${m.image ? 
                            `<img class="card-img" src="${m.image}" alt="${m.title}" loading="lazy" />` :
                            `<div class="card-img" style="display:flex;align-items:center;justify-content:center;font-size:3rem;background:var(--bg-secondary);">${m.emoji || '💌'}</div>`
                        }
                        <div class="card-body">
                            <div class="card-title">${m.emoji || '💌'} ${m.title}</div>
                            <div class="card-date">${Utils.formatDate(m.date)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // Bind events
    bindEvents: function() {
        const grid = document.getElementById('messagesGrid');
        if (!grid) return;

        grid.querySelectorAll('.card-item').forEach((el) => {
            el.addEventListener('click', () => {
                const index = parseInt(el.dataset.index);
                const data = window.AppData || AppData;
                const msg = data.messages[index];
                if (!msg) return;

                // Show message in lightbox
                document.getElementById('lbImg').src = msg.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%231a1015"/%3E%3Ctext x="100" y="115" font-size="70" text-anchor="middle" fill="%23d4a0a0"%3E💌%3C/text%3E%3C/svg%3E';
                document.getElementById('lbTitle').textContent = `${msg.emoji || '💌'} ${msg.title}`;
                document.getElementById('lbDesc').textContent = msg.content || '';
                document.getElementById('lbDate').textContent = Utils.formatDate(msg.date);
                document.getElementById('lightbox').classList.add('active');

                // Hide navigation for messages
                document.getElementById('lbPrev').style.display = 'none';
                document.getElementById('lbNext').style.display = 'none';
            });
        });
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MessagesComponent;
}