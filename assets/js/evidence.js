// Evidence & Audit Trail Manager — Sanah's AI + Private Credit Research Dashboard
(function() {
    'use strict';

    const EvidenceManager = {
        filters: {
            search: '',
            quarter: 'all',
            documentType: 'all',
            errorCategory: 'all'
        },
        currentSort: { field: 'quarter', direction: 'desc' },

        init() {
            this.bindEvents();
            this.render();
        },

        bindEvents() {
            // Search
            const searchInput = document.getElementById('evidence-search');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.filters.search = e.target.value.toLowerCase();
                    this.render();
                });
            }

            // Quarter filter
            const quarterFilter = document.getElementById('evidence-quarter-filter');
            if (quarterFilter) {
                this.populateQuarterFilter(quarterFilter);
                quarterFilter.addEventListener('change', (e) => {
                    this.filters.quarter = e.target.value;
                    this.render();
                });
            }

            // Document type filter
            const docTypeFilter = document.getElementById('evidence-doctype-filter');
            if (docTypeFilter) {
                docTypeFilter.addEventListener('change', (e) => {
                    this.filters.documentType = e.target.value;
                    this.render();
                });
            }

            // Error category filter
            const errorFilter = document.getElementById('evidence-error-filter');
            if (errorFilter) {
                errorFilter.addEventListener('change', (e) => {
                    this.filters.errorCategory = e.target.value;
                    this.render();
                });
            }

            // Sort headers
            document.querySelectorAll('[data-sort-evidence]').forEach(header => {
                header.addEventListener('click', () => {
                    const field = header.dataset.sortEvidence;
                    if (this.currentSort.field === field) {
                        this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
                    } else {
                        this.currentSort.field = field;
                        this.currentSort.direction = 'asc';
                    }
                    this.render();
                });
            });
        },

        populateQuarterFilter(select) {
            if (!window.DashboardData) return;
            const quarters = [...new Set(window.DashboardData.evidenceRecords.map(e => e.quarter))];
            select.innerHTML = '<option value="all">All Quarters</option>' +
                quarters.map(q => '<option value="' + q + '">' + q + '</option>').join('');
        },

        getFilteredRecords() {
            if (!window.DashboardData) return [];

            let records = [...window.DashboardData.evidenceRecords];

            // Apply filters
            if (this.filters.search) {
                records = records.filter(r =>
                    r.evidence_excerpt.toLowerCase().includes(this.filters.search) ||
                    r.source_section.toLowerCase().includes(this.filters.search) ||
                    (r.speaker && r.speaker.toLowerCase().includes(this.filters.search)) ||
                    (r.ai_interpretation && r.ai_interpretation.toLowerCase().includes(this.filters.search))
                );
            }

            if (this.filters.quarter !== 'all') {
                records = records.filter(r => r.quarter === this.filters.quarter);
            }

            if (this.filters.documentType !== 'all') {
                records = records.filter(r => r.document_type === this.filters.documentType);
            }

            if (this.filters.errorCategory !== 'all') {
                if (this.filters.errorCategory === 'none') {
                    records = records.filter(r => !r.error_category);
                } else {
                    records = records.filter(r => r.error_category === this.filters.errorCategory);
                }
            }

            // Sort
            records.sort((a, b) => {
                let aVal = a[this.currentSort.field] || '';
                let bVal = b[this.currentSort.field] || '';
                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return this.currentSort.direction === 'asc' ? aVal - bVal : bVal - aVal;
                }
                return this.currentSort.direction === 'asc'
                    ? String(aVal).localeCompare(String(bVal))
                    : String(bVal).localeCompare(String(aVal));
            });

            return records;
        },

        render() {
            this.renderTable();
            this.renderStats();
        },

        renderTable() {
            const tbody = document.getElementById('evidence-table-body');
            if (!tbody) return;

            const records = this.getFilteredRecords();

            if (records.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="empty-state-cell">No evidence records match your filters.</td></tr>';
                return;
            }

            tbody.innerHTML = records.map(r => {
                const confidenceClass = r.confidence >= 70 ? 'text-green' : r.confidence >= 40 ? 'text-amber' : 'text-red';
                const errorBadge = r.error_category
                    ? '<span class="badge badge-watch">' + r.error_category + '</span>'
                    : '<span class="badge badge-healthy">Clean</span>';

                return '<tr class="evidence-row" data-evidence-id="' + r.id + '">' +
                    '<td><span class="badge badge-info">' + r.document_type + '</span></td>' +
                    '<td>' + r.quarter + '</td>' +
                    '<td>' + (r.speaker || '—') + '</td>' +
                    '<td class="evidence-excerpt-cell">' +
                        '<span class="line-clamp-2">' + r.evidence_excerpt.substring(0, 120) + '...</span>' +
                    '</td>' +
                    '<td class="' + confidenceClass + '">' + r.confidence + '%</td>' +
                    '<td>' + errorBadge + '</td>' +
                    '<td>' +
                        '<button class="btn btn-ghost btn-sm" onclick="Navigation.openEvidenceDrawer(\'' + r.id + '\')" title="View details">📋</button>' +
                        '<a href="' + r.source_url + '" target="_blank" rel="noopener" class="btn btn-ghost btn-sm" title="Open source">🔗</a>' +
                    '</td>' +
                '</tr>';
            }).join('');
        },

        renderStats() {
            const statsContainer = document.getElementById('evidence-stats');
            if (!statsContainer || !window.DashboardData) return;

            const records = window.DashboardData.evidenceRecords;
            const total = records.length;
            const avgConfidence = Math.round(records.reduce((sum, r) => sum + r.confidence, 0) / total);
            const withErrors = records.filter(r => r.error_category).length;
            const docTypes = [...new Set(records.map(r => r.document_type))].length;

            statsContainer.innerHTML = 
                '<div class="stat-card"><span class="stat-value">' + total + '</span><span class="stat-label">Total Records</span></div>' +
                '<div class="stat-card"><span class="stat-value">' + avgConfidence + '%</span><span class="stat-label">Avg Confidence</span></div>' +
                '<div class="stat-card"><span class="stat-value">' + withErrors + '</span><span class="stat-label">With Errors</span></div>' +
                '<div class="stat-card"><span class="stat-value">' + docTypes + '</span><span class="stat-label">Document Types</span></div>';
        }
    };

    window.EvidenceManager = EvidenceManager;
})();
