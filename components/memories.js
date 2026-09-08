// ============================================================
// MEMORIES PAGE COMPONENT
// ============================================================

const MemoriesComponent = {
    container: null,
    lightboxItems: [],
    lightboxIndex: 0,

    // Initialize
    init: function() {
        this.container = document.getElementById('page-memories');
        this.render();
        this.bindEvents();
    },

    // Render
    render: function() {
        const data = window.AppData || AppData;
        const memories = data.memories || [];

        if (!memories.length) {
            this.container.innerHTML = `
                <div class="section-title">
                    <span class="bar"></span>
                    🖼 ذكرياتنا
                </div>
                <div class="empty-state">
                    <span class="big-emoji">📸</span>
                    لا توجد ذكريات بعد
                </div>
            `;
            return;
        }

        this.container.innerHTML = `
            <div class="section-title">
                <span class="bar"></span>
                🖼 ذكرياتنا
            </div>
            <div class="cards-grid" id="memoriesGrid">
                ${memories.map((m, i) => `
                    <div class="card-item" data-index="${i}">
                        <img class="card-img" src="${m.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%231a1015"/%3E%3Ctext x="100" y="115" font-size="70" text-anchor="middle" fill="%23d4a0a0"%3E❤️%3C/text%3E%3C/svg%3E'}" alt="${m.title}" loading="lazy" />
                        <div class="card-body">
                            <div class="card-title">${m.emoji || '❤️'} ${m.title}</div>
                            <div class="card-date">${Utils.formatDate(m.date)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Store items for lightbox
        this.lightboxItems = memories;
    },

    // Bind events
    bindEvents: function() {
        const grid = document.getElementById('memoriesGrid');
        if (!grid) return;

        grid.querySelectorAll('.card-item').forEach((el) => {
            el.addEventListener('click', (e) => {
                const index = parseInt(el.dataset.index);
                this.openLightbox(index);
            });
        });

        // Listen for lightbox navigation
        const prevBtn = document.getElementById('lbPrev');
        const nextBtn = document.getElementById('lbNext');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.lightboxIndex > 0) {
                    this.lightboxIndex--;
                    this.updateLightbox();
                }
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.lightboxIndex < this.lightboxItems.length - 1) {
                    this.lightboxIndex++;
                    this.updateLightbox();
                }
            });
        }
    },

    // Open lightbox
    openLightbox: function(index) {
        this.lightboxIndex = index;
        this.updateLightbox();
        document.getElementById('lightbox').classList.add('active');

        // Show/hide navigation
        const prevBtn = document.getElementById('lbPrev');
        const nextBtn = document.getElementById('lbNext');
        if (prevBtn) prevBtn.style.display = this.lightboxItems.length > 1 ? 'block' : 'none';
        if (nextBtn) nextBtn.style.display = this.lightboxItems.length > 1 ? 'block' : 'none';
    },

    // Update lightbox content
    updateLightbox: function() {
        const item = this.lightboxItems[this.lightboxIndex];
        if (!item) return;

        document.getElementById('lbImg').src = item.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%231a1015"/%3E%3Ctext x="100" y="115" font-size="70" text-anchor="middle" fill="%23d4a0a0"%3E❤️%3C/text%3E%3C/svg%3E';
        document.getElementById('lbTitle').textContent = `${item.emoji || '❤️'} ${item.title}`;
        document.getElementById('lbDesc').textContent = item.description || '';
        document.getElementById('lbDate').textContent = Utils.formatDate(item.date);
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MemoriesComponent;
}