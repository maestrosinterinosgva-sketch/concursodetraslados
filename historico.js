/**
 * historico.js - Buscador de Notas de Corte y Adjudicaciones
 * Concurso de Traslados de la Comunitat Valenciana 2025/2026
 * Basado en datos oficiales del DOGV 10331 y 10332
 */

(function() {
  'use strict';

  // State
  let allCortes = [];
  let summary = {};
  let currentFiltered = [];
  let pageSize = 30;
  let currentPage = 1;
  let userPoints = null;

  // Filter state
  const filters = {
    cuerpo: 'TODOS',
    especialidad: 'TODAS',
    provincia: 'TODAS',
    search: '',
    sortBy: 'corte_desc',
    onlyAdmitted: false
  };

  function initHistorico() {
    if (typeof HISTORICO_CONCURSO_DATA === 'undefined') {
      console.warn('HISTORICO_CONCURSO_DATA no está disponible');
      return;
    }

    allCortes = HISTORICO_CONCURSO_DATA.cortes || [];
    summary = HISTORICO_CONCURSO_DATA.summary || {};

    // Check user points from calculator
    detectUserPoints();

    // Populate filter dropdowns
    populateFilters();

    // Setup event listeners
    setupListeners();

    // Initial render
    applyFilters();
  }

  function detectUserPoints() {
    // Try to get points from localStorage or global app state
    try {
      const saved = localStorage.getItem('concurso_traslados_boe2026_state');
      if (saved) {
        const state = JSON.parse(saved);
        if (state && typeof state.totalPoints === 'number' && state.totalPoints > 0) {
          userPoints = state.totalPoints;
        }
      }
    } catch (e) {
      console.warn('Error leyendo puntos guardados:', e);
    }

    // Also check window.lastCalculatedTotal
    if (typeof window.lastCalculatedTotal === 'number' && window.lastCalculatedTotal > 0) {
      userPoints = window.lastCalculatedTotal;
    }

    updateUserPointsBadge();
  }

  function updateUserPointsBadge() {
    const badge = document.getElementById('hist_user_points_badge');
    const filterCheckboxContainer = document.getElementById('hist_only_admitted_container');
    if (!badge) return;

    if (userPoints !== null && userPoints > 0) {
      badge.style.display = 'inline-flex';
      badge.innerHTML = `<span>🎯</span> <strong>Tus puntos calculados:</strong> <span class="pts-val">${userPoints.toFixed(4)} pts</span> <button class="btn-clear-pts" id="hist_refresh_pts" title="Actualizar con el cálculo actual">🔄</button>`;
      if (filterCheckboxContainer) filterCheckboxContainer.style.display = 'inline-flex';

      const refreshBtn = document.getElementById('hist_refresh_pts');
      if (refreshBtn) {
        refreshBtn.onclick = (e) => {
          e.stopPropagation();
          detectUserPoints();
          applyFilters();
        };
      }
    } else {
      badge.style.display = 'inline-flex';
      badge.innerHTML = `<span>💡</span> <span>Calcula tus méritos en la otra pestaña para ver si habrías obtenido plaza</span>`;
      if (filterCheckboxContainer) filterCheckboxContainer.style.display = 'none';
    }
  }

  function populateFilters() {
    const specSelect = document.getElementById('hist_filter_especialidad');
    const provSelect = document.getElementById('hist_filter_provincia');

    if (!specSelect) return;

    // Build specialties with counts
    const specCounts = {};
    allCortes.forEach(c => {
      specCounts[c.esp] = (specCounts[c.esp] || 0) + c.plz;
    });

    const sortedSpecs = Object.keys(specCounts).sort((a, b) => a.localeCompare(b, 'es'));

    specSelect.innerHTML = '<option value="TODAS">Todas las especialidades (' + sortedSpecs.length + ')</option>';
    sortedSpecs.forEach(esp => {
      const opt = document.createElement('option');
      opt.value = esp;
      opt.textContent = `${esp} (${specCounts[esp]} plazas)`;
      specSelect.appendChild(opt);
    });

    // Populate stats counters in UI
    const totalPlazasEl = document.getElementById('hist_stat_plazas');
    const totalCentrosEl = document.getElementById('hist_stat_centros');
    const totalSpecsEl = document.getElementById('hist_stat_specs');

    if (totalPlazasEl) totalPlazasEl.textContent = (summary.total_adjudicaciones || 5136).toLocaleString('es-ES');
    if (totalCentrosEl) totalCentrosEl.textContent = (summary.total_centros || 1410).toLocaleString('es-ES');
    if (totalSpecsEl) totalSpecsEl.textContent = (summary.total_especialidades || 93).toString();
  }

  function setupListeners() {
    // Body filter buttons
    const cuerpoBtns = document.querySelectorAll('[data-cuerpo-filter]');
    cuerpoBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        cuerpoBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filters.cuerpo = btn.dataset.cuerpoFilter;
        currentPage = 1;
        applyFilters();

        if (typeof gtag === 'function') {
          gtag('event', 'filtro_cuerpo', {
            'event_category': 'historico',
            'cuerpo': filters.cuerpo
          });
        }
      });
    });

    // Specialty dropdown
    const specSelect = document.getElementById('hist_filter_especialidad');
    if (specSelect) {
      specSelect.addEventListener('change', () => {
        filters.especialidad = specSelect.value;
        currentPage = 1;
        applyFilters();

        if (typeof gtag === 'function' && filters.especialidad !== 'TODAS') {
          gtag('event', 'filtro_especialidad', {
            'event_category': 'historico',
            'especialidad': filters.especialidad
          });
        }
      });
    }

    // Province dropdown
    const provSelect = document.getElementById('hist_filter_provincia');
    if (provSelect) {
      provSelect.addEventListener('change', () => {
        filters.provincia = provSelect.value;
        currentPage = 1;
        applyFilters();
      });
    }

    // Search input (with debounce)
    const searchInput = document.getElementById('hist_search_input');
    let searchDebounceTimer = null;
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
          filters.search = searchInput.value.trim().toLowerCase();
          currentPage = 1;
          applyFilters();

          if (filters.search.length >= 3 && typeof gtag === 'function') {
            gtag('event', 'busqueda_historico', {
              'event_category': 'historico',
              'search_term': filters.search
            });
          }
        }, 250);
      });

      // Clear search button
      const clearSearchBtn = document.getElementById('hist_clear_search');
      if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
          searchInput.value = '';
          filters.search = '';
          currentPage = 1;
          applyFilters();
          searchInput.focus();
        });
      }
    }

    // Sort by dropdown
    const sortSelect = document.getElementById('hist_sort_select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        filters.sortBy = sortSelect.value;
        applySort();
        renderResults();
      });
    }

    // Only admitted checkbox
    const admittedCb = document.getElementById('hist_only_admitted_cb');
    if (admittedCb) {
      admittedCb.addEventListener('change', () => {
        filters.onlyAdmitted = admittedCb.checked;
        currentPage = 1;
        applyFilters();
      });
    }

    // Reset all filters button
    const resetBtn = document.getElementById('hist_reset_filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetAllFilters);
    }

    // Load more button
    const loadMoreBtn = document.getElementById('hist_load_more_btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderResults(true);
      });
    }

    // Listen for tab switching to re-check user points
    const tabHistorico = document.getElementById('nav_tab_historico');
    if (tabHistorico) {
      tabHistorico.addEventListener('click', () => {
        detectUserPoints();
        applyFilters();
      });
    }
  }

  function resetAllFilters() {
    filters.cuerpo = 'TODOS';
    filters.especialidad = 'TODAS';
    filters.provincia = 'TODAS';
    filters.search = '';
    filters.sortBy = 'corte_desc';
    filters.onlyAdmitted = false;

    // Reset controls
    document.querySelectorAll('[data-cuerpo-filter]').forEach(b => {
      b.classList.toggle('active', b.dataset.cuerpoFilter === 'TODOS');
    });
    const specSelect = document.getElementById('hist_filter_especialidad');
    if (specSelect) specSelect.value = 'TODAS';
    const provSelect = document.getElementById('hist_filter_provincia');
    if (provSelect) provSelect.value = 'TODAS';
    const searchInput = document.getElementById('hist_search_input');
    if (searchInput) searchInput.value = '';
    const sortSelect = document.getElementById('hist_sort_select');
    if (sortSelect) sortSelect.value = 'corte_desc';
    const admittedCb = document.getElementById('hist_only_admitted_cb');
    if (admittedCb) admittedCb.checked = false;

    currentPage = 1;
    applyFilters();
  }

  function applyFilters() {
    currentFiltered = allCortes.filter(c => {
      // Cuerpo filter
      if (filters.cuerpo === 'MAESTROS' && c.crp !== 'Maestros') return false;
      if (filters.cuerpo === 'SECUNDARIA' && c.crp === 'Maestros') return false;

      // Especialidad filter
      if (filters.especialidad !== 'TODAS' && c.esp !== filters.especialidad) return false;

      // Provincia filter
      if (filters.provincia !== 'TODAS') {
        const provNorm = c.prv ? c.prv.toLowerCase() : '';
        if (!provNorm.includes(filters.provincia.toLowerCase())) return false;
      }

      // Admitted filter (requires userPoints)
      if (filters.onlyAdmitted && userPoints !== null) {
        if (userPoints < c.min) return false;
      }

      // Search term
      if (filters.search) {
        const q = filters.search;
        const inCod = c.cod && c.cod.includes(q);
        const inCen = c.cen && c.cen.toLowerCase().includes(q);
        const inMun = c.mun && c.mun.toLowerCase().includes(q);
        const inEsp = c.esp && c.esp.toLowerCase().includes(q);
        const inCom = c.com && c.com.toLowerCase().includes(q);
        if (!inCod && !inCen && !inMun && !inEsp && !inCom) return false;
      }

      return true;
    });

    applySort();
    renderResults(false);
    updateResultCounters();
  }

  function applySort() {
    switch (filters.sortBy) {
      case 'corte_desc':
        currentFiltered.sort((a, b) => b.min - a.min);
        break;
      case 'corte_asc':
        currentFiltered.sort((a, b) => a.min - b.min);
        break;
      case 'plazas_desc':
        currentFiltered.sort((a, b) => b.plz - a.plz || b.min - a.min);
        break;
      case 'mun_asc':
        currentFiltered.sort((a, b) => a.mun.localeCompare(b.mun, 'es') || a.cen.localeCompare(b.cen, 'es'));
        break;
      case 'cen_asc':
        currentFiltered.sort((a, b) => a.cen.localeCompare(b.cen, 'es'));
        break;
      default:
        currentFiltered.sort((a, b) => b.min - a.min);
    }
  }

  function updateResultCounters() {
    const countEl = document.getElementById('hist_results_count');
    const plazasCountEl = document.getElementById('hist_results_plazas_total');

    if (!countEl) return;

    const totalPlz = currentFiltered.reduce((acc, c) => acc + c.plz, 0);
    countEl.textContent = currentFiltered.length.toLocaleString('es-ES');
    if (plazasCountEl) {
      plazasCountEl.textContent = totalPlz.toLocaleString('es-ES');
    }

    // Toggle reset filters visibility
    const isFiltered = (
      filters.cuerpo !== 'TODOS' ||
      filters.especialidad !== 'TODAS' ||
      filters.provincia !== 'TODAS' ||
      filters.search !== '' ||
      filters.onlyAdmitted
    );
    const resetBtn = document.getElementById('hist_reset_filters');
    if (resetBtn) {
      resetBtn.style.display = isFiltered ? 'inline-flex' : 'none';
    }
  }

  function renderResults(append = false) {
    const container = document.getElementById('hist_results_list');
    const loadMoreContainer = document.getElementById('hist_load_more_container');
    if (!container) return;

    if (!append) {
      container.innerHTML = '';
      currentPage = 1;
    }

    if (currentFiltered.length === 0) {
      container.innerHTML = `
        <div class="hist-empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No se han encontrado resultados</h3>
          <p>Prueba a cambiar los filtros de especialidad o provincia, o escribe otro término de búsqueda.</p>
          <button class="btn btn-primary" onclick="window.HistoricoModule.resetAllFilters()">Restablecer Filtros</button>
        </div>
      `;
      if (loadMoreContainer) loadMoreContainer.style.display = 'none';
      return;
    }

    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, currentFiltered.length);
    const pageItems = currentFiltered.slice(startIdx, endIdx);

    const fragment = document.createDocumentFragment();

    pageItems.forEach((c, idx) => {
      const card = createCorteCard(c, startIdx + idx);
      fragment.appendChild(card);
    });

    container.appendChild(fragment);

    // Show/hide Load More button
    if (loadMoreContainer) {
      const hasMore = endIdx < currentFiltered.length;
      loadMoreContainer.style.display = hasMore ? 'block' : 'none';
      const remaining = currentFiltered.length - endIdx;
      const countLabel = document.getElementById('hist_remaining_count');
      if (countLabel) countLabel.textContent = remaining.toLocaleString('es-ES');
    }
  }

  function createCorteCard(c, globalIndex) {
    const card = document.createElement('div');
    card.className = 'hist-card';
    card.dataset.code = c.cod;

    // Simulation comparison badge
    let simHtml = '';
    if (userPoints !== null && userPoints > 0) {
      const diff = userPoints - c.min;
      if (diff >= 0) {
        simHtml = `
          <div class="sim-badge sim-pass" title="Con tus ${userPoints.toFixed(4)} puntos habrías superado la nota de corte de este centro">
            <span class="sim-dot">🟢</span>
            <span class="sim-text">Habrías obtenido plaza (+${diff.toFixed(2)} pts)</span>
          </div>
        `;
      } else {
        simHtml = `
          <div class="sim-badge sim-miss" title="Te habrían faltado ${Math.abs(diff).toFixed(2)} puntos para alcanzar la nota de corte de este centro">
            <span class="sim-dot">🔴</span>
            <span class="sim-text">A ${Math.abs(diff).toFixed(2)} pts del corte</span>
          </div>
        `;
      }
    }

    // Province badge styling
    const provBadgeClass = c.prv === 'Alicante' ? 'prov-ali' : (c.prv === 'Castellón' ? 'prov-cas' : 'prov-val');
    const cuerpoBadge = c.crp === 'Maestros' ? '👨‍🏫 Maestros' : '🎓 Secundaria y FP';

    card.innerHTML = `
      <div class="hist-card-header">
        <div class="hist-card-info">
          <div class="hist-badges-row">
            <span class="hist-badge hist-badge-cuerpo">${cuerpoBadge}</span>
            <span class="hist-badge ${provBadgeClass}">${c.prv || 'CV'}</span>
            <span class="hist-code-badge" title="Código de centro oficial">COD: ${c.cod}</span>
          </div>
          <h4 class="hist-center-title">${escapeHtml(c.cen)}</h4>
          <div class="hist-location-line">
            <span>📍 ${escapeHtml(c.mun)}${c.com ? ' • ' + escapeHtml(c.com) : ''}</span>
          </div>
          <div class="hist-spec-tag">
            <span>📚</span> <strong>${escapeHtml(c.esp)}</strong>
          </div>
        </div>

        <div class="hist-card-score-box">
          <div class="score-label">NOTA DE CORTE</div>
          <div class="score-number">${c.min.toFixed(4)}</div>
          <div class="score-sub">
            <span>${c.plz} ${c.plz === 1 ? 'plaza adjudicada' : 'plazas adjudicadas'}</span>
            ${c.plz > 1 ? `<span class="score-max-sub" title="Puntuación máxima adjudicada">Máx: ${c.max.toFixed(2)}</span>` : ''}
          </div>
          ${simHtml}
        </div>
      </div>

      <div class="hist-card-footer">
        <button class="btn-toggle-adj" data-target="adj_${globalIndex}" aria-expanded="false">
          <span>👥</span> Ver adjudicaciones oficiales (${c.adj.length}) <span class="arrow">▾</span>
        </button>
      </div>

      <div class="hist-adj-dropdown" id="adj_${globalIndex}" style="display:none;">
        <div class="hist-adj-table-wrap">
          <table class="hist-adj-table">
            <thead>
              <tr>
                <th>#</th>
                <th>DNI / Nombre</th>
                <th>Puntos</th>
                <th>Tipo</th>
                <th>Procedencia</th>
              </tr>
            </thead>
            <tbody>
              ${c.adj.map((a, aIdx) => `
                <tr class="${aIdx === c.adj.length - 1 ? 'row-corte' : ''}">
                  <td class="col-idx">${aIdx + 1}</td>
                  <td class="col-cand">
                    <strong>${escapeHtml(a.dni)}</strong>
                    <span class="cand-name">${escapeHtml(a.nom)}</span>
                  </td>
                  <td class="col-pts">
                    <strong>${a.pts.toFixed(4)}</strong>
                    ${aIdx === c.adj.length - 1 ? '<span class="corte-tag" title="Última plaza adjudicada (Nota de corte)">Corte</span>' : ''}
                  </td>
                  <td class="col-tipo">
                    <span class="tipo-badge ${a.tipo.includes('preferente') ? 'tipo-pref' : ''}">${escapeHtml(a.tipo)}</span>
                  </td>
                  <td class="col-orig">${escapeHtml(a.orig || 'Bolsa / Provisional / Sin centro previo')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Toggle button handler
    const toggleBtn = card.querySelector('.btn-toggle-adj');
    const dropdown = card.querySelector('.hist-adj-dropdown');
    if (toggleBtn && dropdown) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = dropdown.style.display !== 'none';
        dropdown.style.display = isOpen ? 'none' : 'block';
        toggleBtn.setAttribute('aria-expanded', !isOpen);
        toggleBtn.classList.toggle('expanded', !isOpen);
        const arrow = toggleBtn.querySelector('.arrow');
        if (arrow) arrow.textContent = isOpen ? '▾' : '▴';

        if (!isOpen && typeof gtag === 'function') {
          gtag('event', 'ver_detalle_adjudicaciones', {
            'event_category': 'historico',
            'centro': c.cen,
            'especialidad': c.esp
          });
        }
      });
    }

    return card;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Public API
  window.HistoricoModule = {
    init: initHistorico,
    resetAllFilters: resetAllFilters,
    updateUserPoints: function(pts) {
      userPoints = typeof pts === 'number' ? pts : null;
      updateUserPointsBadge();
      applyFilters();
    }
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHistorico);
  } else {
    initHistorico();
  }
})();
