// Navigation Controller — Sanah's AI + Private Credit Research Dashboard
(function() {
    'use strict';

    const Navigation = {
        currentPage: 'overview',
        sidebarCollapsed: false,
        mobileMenuOpen: false,
        isDarkTheme: true,
        searchOpen: false,

        pages: [
            { id: 'overview', label: 'Company Overview', icon: '◉' },
            { id: 'financial', label: 'Financial Trends', icon: '📊' },
            { id: 'language', label: 'Management Language', icon: '💬' },
            { id: 'divergence', label: 'Management vs Numbers', icon: '⚡' },
            { id: 'credit', label: 'Credit Events & Debt', icon: '🏦' },
            { id: 'stress', label: 'Stress Testing', icon: '🔬' },
            { id: 'comparison', label: 'AI vs Human Analysis', icon: '🤖' },
            { id: 'evidence', label: 'Evidence & Audit Trail', icon: '📋' },
            { id: 'sources', label: 'Data Sources', icon: '🔗' }
        ],

        init() {
            this.bindEvents();
            this.loadThemePreference();
            this.navigateTo('overview');
            this.updateQuarterSelector();
        },

        bindEvents() {
            // Sidebar nav clicks
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = item.dataset.page;
                    this.navigateTo(page);
                    if (window.innerWidth <= 768) this.closeMobileMenu();
                });
            });

            // Sidebar toggle
            const sidebarToggle = document.getElementById('sidebar-toggle');
            if (sidebarToggle) {
                sidebarToggle.addEventListener('click', () => this.toggleSidebar());
            }

            // Mobile hamburger
            const hamburger = document.getElementById('mobile-menu-btn');
            if (hamburger) {
                hamburger.addEventListener('click', () => this.toggleMobileMenu());
            }

            // Mobile overlay click to close
            const overlay = document.getElementById('mobile-overlay');
            if (overlay) {
                overlay.addEventListener('click', () => this.closeMobileMenu());
            }

            // Theme toggle
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', () => this.toggleTheme());
            }

            // Search toggle
            const searchToggle = document.getElementById('search-toggle');
            if (searchToggle) {
                searchToggle.addEventListener('click', () => this.toggleSearch());
            }

            // Search input
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') this.toggleSearch();
                });
            }

            // Quarter selector
            const quarterSelect = document.getElementById('quarter-select');
            if (quarterSelect) {
                quarterSelect.addEventListener('change', (e) => {
                    this.onQuarterChange(e.target.value);
                });
            }

            // Window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && this.mobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'k') {
                    e.preventDefault();
                    this.toggleSearch();
                }
                if (e.key === 'Escape') {
                    this.closeAllModals();
                    this.closeMobileMenu();
                }
            });

            // Notification bell (demo)
            const notifBtn = document.getElementById('notification-btn');
            if (notifBtn) {
                notifBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showNotificationPanel();
                });
            }

            // Click outside to dismiss popovers
            document.addEventListener('click', (e) => {
                const notifPanel = document.getElementById('notification-panel');
                if (notifPanel && notifPanel.classList.contains('active')) {
                    if (!notifPanel.contains(e.target)) {
                        notifPanel.classList.remove('active');
                    }
                }
                const searchResults = document.getElementById('search-results');
                const searchContainer = document.querySelector('.search-container');
                if (searchResults && searchResults.classList.contains('active')) {
                    if (!searchContainer.contains(e.target)) {
                        searchResults.classList.remove('active');
                    }
                }
            });
        },

        navigateTo(pageId) {
            // Hide all pages
            document.querySelectorAll('.page-section').forEach(page => {
                page.classList.remove('active');
            });

            // Show target page
            const targetPage = document.getElementById('page-' + pageId);
            if (targetPage) {
                targetPage.classList.add('active');
            }

            // Update nav active state
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
                if (item.dataset.page === pageId) {
                    item.classList.add('active');
                }
            });

            this.currentPage = pageId;

            // Trigger page-specific initialization
            if (window.Dashboard && window.Dashboard.onPageChange) {
                window.Dashboard.onPageChange(pageId);
            }

            // Scroll to top
            const mainContent = document.querySelector('.main-content');
            if (mainContent) mainContent.scrollTop = 0;

            // Update URL hash without scrolling
            history.replaceState(null, null, '#' + pageId);
        },

        toggleSidebar() {
            this.sidebarCollapsed = !this.sidebarCollapsed;
            const sidebar = document.querySelector('.sidebar');
            const mainContent = document.querySelector('.main-content');
            
            if (this.sidebarCollapsed) {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('sidebar-collapsed');
            } else {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('sidebar-collapsed');
            }
        },

        toggleMobileMenu() {
            this.mobileMenuOpen = !this.mobileMenuOpen;
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.getElementById('mobile-overlay');
            
            if (this.mobileMenuOpen) {
                sidebar.classList.add('mobile-open');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                this.closeMobileMenu();
            }
        },

        closeMobileMenu() {
            this.mobileMenuOpen = false;
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.getElementById('mobile-overlay');
            
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        },

        toggleTheme() {
            this.isDarkTheme = !this.isDarkTheme;
            document.body.classList.toggle('theme-light', !this.isDarkTheme);
            
            const icon = document.querySelector('#theme-toggle .theme-icon');
            if (icon) icon.textContent = this.isDarkTheme ? '☀️' : '🌙';
            
            localStorage.setItem('sanah-theme', this.isDarkTheme ? 'dark' : 'light');

            // Re-render charts with new theme colors
            if (window.ChartManager && window.ChartManager.updateTheme) {
                window.ChartManager.updateTheme(this.isDarkTheme);
            }
        },

        loadThemePreference() {
            const saved = localStorage.getItem('sanah-theme');
            if (saved === 'light') {
                this.isDarkTheme = false;
                document.body.classList.add('theme-light');
                const icon = document.querySelector('#theme-toggle .theme-icon');
                if (icon) icon.textContent = '🌙';
            }
        },

        toggleSearch() {
            this.searchOpen = !this.searchOpen;
            const searchContainer = document.querySelector('.search-container');
            const searchInput = document.getElementById('search-input');
            
            if (searchContainer) {
                searchContainer.classList.toggle('active', this.searchOpen);
            }
            if (this.searchOpen && searchInput) {
                searchInput.focus();
            }
        },

        handleSearch(query) {
            // Demo search - filters visible content
            const searchResults = document.getElementById('search-results');
            if (!searchResults) return;
            
            if (query.length < 2) {
                searchResults.classList.remove('active');
                return;
            }
            
            // Search through pages, claims, evidence
            const results = [];
            const q = query.toLowerCase();
            
            // Search management claims
            if (window.DashboardData && window.DashboardData.managementClaims) {
                window.DashboardData.managementClaims.forEach(claim => {
                    if (claim.statement.toLowerCase().includes(q) || claim.topic.toLowerCase().includes(q)) {
                        results.push({ type: 'Claim', text: claim.statement, page: 'language', quarter: claim.quarter });
                    }
                });
            }
            
            // Search evidence
            if (window.DashboardData && window.DashboardData.evidenceRecords) {
                window.DashboardData.evidenceRecords.forEach(ev => {
                    if (ev.evidence_excerpt.toLowerCase().includes(q)) {
                        results.push({ type: 'Evidence', text: ev.evidence_excerpt.substring(0, 100) + '...', page: 'evidence', quarter: ev.quarter });
                    }
                });
            }

            // Search pages
            Navigation.pages.forEach(p => {
                if (p.label.toLowerCase().includes(q)) {
                    results.push({ type: 'Page', text: p.label, page: p.id });
                }
            });
            
            // Display results
            if (results.length > 0) {
                searchResults.innerHTML = results.slice(0, 8).map(r => 
                    '<div class="search-result-item" data-page="' + r.page + '">' +
                    '<span class="search-result-type">' + r.type + '</span>' +
                    '<span class="search-result-text">' + r.text + '</span>' +
                    (r.quarter ? '<span class="search-result-quarter">' + r.quarter + '</span>' : '') +
                    '</div>'
                ).join('');
                searchResults.classList.add('active');
                
                // Bind clicks
                searchResults.querySelectorAll('.search-result-item').forEach(item => {
                    item.addEventListener('click', () => {
                        Navigation.navigateTo(item.dataset.page);
                        Navigation.toggleSearch();
                    });
                });
            } else {
                searchResults.innerHTML = '<div class="search-empty">No results found</div>';
                searchResults.classList.add('active');
            }
        },

        updateQuarterSelector() {
            const select = document.getElementById('quarter-select');
            if (!select || !window.DashboardData) return;
            
            const quarters = window.DashboardData.quarterlyData.map(q => q.quarter);
            select.innerHTML = quarters.map(q => 
                '<option value="' + q + '"' + (q === quarters[quarters.length - 1] ? ' selected' : '') + '>' + q + '</option>'
            ).join('');
        },

        onQuarterChange(quarter) {
            if (window.Dashboard && window.Dashboard.onQuarterChange) {
                window.Dashboard.onQuarterChange(quarter);
            }
        },

        showNotificationPanel() {
            const panel = document.getElementById('notification-panel');
            if (panel) {
                panel.classList.toggle('active');
            }
        },

        // Modal management
        openModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        },

        closeModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        },

        closeAllModals() {
            document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
            document.querySelectorAll('.evidence-drawer.active').forEach(d => d.classList.remove('active'));
            document.body.style.overflow = '';
        },

        // Evidence drawer
        openEvidenceDrawer(evidenceId) {
            const drawer = document.getElementById('evidence-drawer');
            if (!drawer || !window.DashboardData) return;
            
            const records = window.DashboardData.evidenceRecords || [];
            // Match exact or flexible ID (EV-001 -> EVD-001)
            let evidence = records.find(e => e.id === evidenceId || e.id === evidenceId.replace('EV-', 'EVD-') || e.id === evidenceId.replace('EVD-', 'EV-'));
            if (!evidence && records.length > 0) {
                evidence = records[0];
            }
            if (!evidence) return;
            
            const content = drawer.querySelector('.evidence-drawer-content');
            if (content) {
                content.innerHTML = this.renderEvidenceDetail(evidence);
            }
            
            drawer.classList.add('active');
            document.body.style.overflow = 'hidden';
        },

        closeEvidenceDrawer() {
            const drawer = document.getElementById('evidence-drawer');
            if (drawer) {
                drawer.classList.remove('active');
                document.body.style.overflow = '';
            }
        },

        renderEvidenceDetail(ev) {
            return '<div class="evidence-detail">' +
                '<div class="evidence-meta">' +
                    '<span class="badge badge-info">' + ev.document_type + '</span>' +
                    '<span class="evidence-quarter">' + ev.quarter + '</span>' +
                    '<span class="evidence-date">' + ev.document_date + '</span>' +
                '</div>' +
                '<h3>' + ev.company + ' — ' + ev.source_section + '</h3>' +
                (ev.speaker ? '<p class="evidence-speaker">Speaker: ' + ev.speaker + '</p>' : '') +
                '<div class="evidence-excerpt-box">' +
                    '<p class="evidence-label">Source Excerpt [ILLUSTRATIVE EXAMPLE]:</p>' +
                    '<blockquote>' + ev.evidence_excerpt + '</blockquote>' +
                '</div>' +
                (ev.ai_interpretation ? '<div class="evidence-ai-box"><p class="evidence-label">AI Interpretation:</p><p>' + ev.ai_interpretation + '</p></div>' : '') +
                '<div class="evidence-confidence">' +
                    '<span>Confidence: ' + ev.confidence + '%</span>' +
                    (ev.error_category ? '<span class="badge badge-watch">Error: ' + ev.error_category + '</span>' : '') +
                '</div>' +
                '<div class="evidence-source-link">' +
                    '<a href="' + ev.source_url + '" target="_blank" rel="noopener" class="btn btn-secondary">Open Source Document</a>' +
                '</div>' +
                '<p class="demo-disclosure">⚠️ Demonstration Mode — Illustrative example, not verified historical data.</p>' +
            '</div>';
        }
    };

    window.Navigation = Navigation;

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        Navigation.init();
    });
})();
