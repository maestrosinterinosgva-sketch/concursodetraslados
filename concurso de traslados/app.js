/**
 * Calculadora de Méritos - Concurso de Traslados BOE 2026/2027
 * Orden EFD/1041/2026, de 30 de septiembre (BOE 06/10/2026)
 */

// Estado global de la aplicación
const state = {
  modo: 'docentes', // 'docentes' | 'inspectores'
  
  // Bloque 1: Antigüedad
  p111_y: 0, p111_m: 0,
  p112_y: 0, p112_m: 0,
  p113_y: 0, p113_m: 0,
  p121_y: 0, p121_m: 0,
  p122_y: 0, p122_m: 0,
  p123_y: 0, p123_m: 0,
  
  // Bloque 2: Cátedras
  catedra: false,
  
  // Bloque 3: Académicos
  p311: 0, // Doctorado
  p312: 0, // Máster oficial
  p313: 0, // DEA / Suficiencia
  p314: 0, // Premio extraordinario
  p321a: 0, // Grado completo
  p321b: 0, // Grado pasarela
  p322: 0, // Diplomatura / 1er ciclo
  p323: 0, // 2º ciclo licenciatura
  p33_fp: 0, // Técnico Superior
  p33_mus: 0, // Título profesional música/danza
  p33_dlse: '0', // Lengua signos
  
  // Idiomas EOI (3.3)
  idioma_ingles_eoi: '0',
  idioma_frances_eoi: '0',
  idioma_aleman_eoi: '0',
  idioma_italiano_eoi: '0',
  idioma_otro_eoi: '0',
  
  // Bloque 4: Cargos directivos
  p41_y: 0, p41_m: 0, // Director
  p42_y: 0, p42_m: 0, // Vicedir, J. Estudios, Secr.
  p43_y: 0, p43_m: 0, // J. Dpto, Coordinador, Tutorías LOE
  
  // Bloque 5: Formación
  p51_horas: 0, // Horas recibidas
  p52_horas: 0, // Horas impartidas
  p53_esp: 0, // Nuevas especialidades
  p54_digital: '0', // CDD
  // Idiomas no EOI (5.5)
  idioma_ingles_no_eoi: '0',
  idioma_frances_no_eoi: '0',
  idioma_aleman_no_eoi: '0',
  idioma_italiano_no_eoi: '0',
  idioma_otro_no_eoi: '0',
  
  // Bloque 6: Otros méritos
  p61_lib_aut: 0,
  p61_lib_coaut: 0,
  p61_lib_3: 0,
  p61_lib_4: 0,
  p61_lib_5: 0,
  p61_lib_mas5: 0,
  p61_rev_aut: 0,
  p61_rev_coaut: 0,
  p61_rev_3mas: 0,
  p62_pts: 0, // Premios e innovación
  p63_dep_alto_nivel: 0,
  p63_dep_rendimiento: 0,
  p63_artistico_pts: 0,
  p64_y: 0, p64_m: 0, // Puestos admón
  p65_tribunales: 0, // Tribunales opos
  p66_master_grado: 0, // Tutor prácticas máster/grado
  p66_func_practicas: 0, // Tutor funcionarios prácticas
  p67_linguistica_pts: 0, // Plazas CCAA bilingües

  // Desempate
  desempate_ano_opos: 2022,
  desempate_nota_opos: 8.5000
};

// Formateador oficial de 4 decimales
function fmt(num) {
  if (isNaN(num) || num === null || num === undefined) return "0,0000";
  return num.toFixed(4).replace('.', ',');
}

function parseF(val) {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

function parseI(val) {
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : n;
}

// -------------------------------------------------------------
// MOTOR DE CÁLCULO
// -------------------------------------------------------------

function calculateSubapartado111(years, months) {
  // 1º y 2º año: 4.0000 pts/año (0.3333 por mes completo)
  // 3º año: 6.0000 pts (0.5000 por mes completo)
  // 4º y siguientes: 8.0000 pts/año (0.6666 por mes completo)
  let pts = 0;
  
  // Años completos
  if (years >= 1) pts += Math.min(years, 2) * 4.0000;
  if (years >= 3) pts += 6.0000;
  if (years >= 4) pts += (years - 3) * 8.0000;
  
  // Meses correspondientes al tramo en curso
  if (years < 2) {
    pts += months * 0.3333;
  } else if (years === 2) {
    pts += months * 0.5000;
  } else {
    pts += months * 0.6666;
  }
  
  return pts;
}

function calculateAll() {
  // 1. Antigüedad
  const s111 = calculateSubapartado111(state.p111_y, state.p111_m);
  const s112 = (state.p112_y * 4.0000) + (state.p112_m * 0.3333);
  const s113 = (state.p113_y * 4.0000) + (state.p113_m * 0.3333);
  const s121 = (state.p121_y * 2.0000) + (state.p121_m * 0.1666);
  const s122 = (state.p122_y * 1.5000) + (state.p122_m * 0.1250);
  const s123 = (state.p123_y * 0.7500) + (state.p123_m * 0.0625);
  const totalB1 = s111 + s112 + s113 + s121 + s122 + s123;

  // 2. Cátedras
  const totalB2 = state.catedra ? 5.0000 : 0.0000;

  // 3. Académicos
  const s311 = state.p311 * 6.0000;
  const s312 = state.p312 * 3.0000;
  const s313 = state.p313 * 2.0000;
  const s314 = state.p314 * 1.0000;
  const s321a = state.p321a * 5.0000;
  const s321b = state.p321b * 2.5000;
  const s322 = state.p322 * 3.0000;
  const s323 = state.p323 * 3.0000;
  const s33_fp = state.p33_fp * 2.0000;
  const s33_mus = state.p33_mus * 2.0000;
  const s33_dlse = parseFloat(state.p33_dlse) || 0;

  // Idiomas EOI (3.3)
  const eoi_ing = parseFloat(state.idioma_ingles_eoi) || 0;
  const eoi_fra = parseFloat(state.idioma_frances_eoi) || 0;
  const eoi_ale = parseFloat(state.idioma_aleman_eoi) || 0;
  const eoi_ita = parseFloat(state.idioma_italiano_eoi) || 0;
  const eoi_otr = parseFloat(state.idioma_otro_eoi) || 0;
  const s33_idiomas = eoi_ing + eoi_fra + eoi_ale + eoi_ita + eoi_otr;

  const rawB3 = s311 + s312 + s313 + s314 + s321a + s321b + s322 + s323 + s33_fp + s33_mus + s33_dlse + s33_idiomas;
  const totalB3 = Math.min(10.0000, rawB3);

  // 4. Cargos directivos
  const s41 = (state.p41_y * 4.5000) + (state.p41_m * 0.3750);
  const s42 = (state.p42_y * 3.0000) + (state.p42_m * 0.2500);
  const s43_raw = (state.p43_y * 1.5000) + (state.p43_m * 0.1250);
  const s43 = Math.min(10.0000, s43_raw); // Tope 10 en 4.3
  const rawB4 = s41 + s42 + s43;
  const totalB4 = Math.min(30.0000, rawB4);

  // 5. Formación
  // 5.1: 0.1000 por cada 10 horas completas, máx 9.0000
  const s51 = Math.min(9.0000, Math.floor(state.p51_horas / 10) * 0.1000);
  // 5.2: 0.1000 por cada 3 horas completas, máx 3.0000
  const s52 = Math.min(3.0000, Math.floor(state.p52_horas / 3) * 0.1000);
  const s53 = state.p53_esp * 1.0000;
  const s54 = parseFloat(state.p54_digital) || 0; // Competencia digital
  
  // Idiomas no EOI (5.5) - controlando no duplicar con 3.3 si ya puntuó el mismo idioma
  const noeoi_ing = eoi_ing > 0 ? 0 : (parseFloat(state.idioma_ingles_no_eoi) || 0);
  const noeoi_fra = eoi_fra > 0 ? 0 : (parseFloat(state.idioma_frances_no_eoi) || 0);
  const noeoi_ale = eoi_ale > 0 ? 0 : (parseFloat(state.idioma_aleman_no_eoi) || 0);
  const noeoi_ita = eoi_ita > 0 ? 0 : (parseFloat(state.idioma_italiano_no_eoi) || 0);
  const noeoi_otr = eoi_otr > 0 ? 0 : (parseFloat(state.idioma_otro_no_eoi) || 0);
  const s55_idiomas = noeoi_ing + noeoi_fra + noeoi_ale + noeoi_ita + noeoi_otr;

  const rawB5 = s51 + s52 + s53 + s54 + s55_idiomas;
  const totalB5 = Math.min(15.0000, rawB5);

  // 6. Otros méritos
  // 6.1: Publicaciones (máx 8.0000)
  const libPts = (state.p61_lib_aut * 1.0000) +
                 (state.p61_lib_coaut * 0.5000) +
                 (state.p61_lib_3 * 0.4000) +
                 (state.p61_lib_4 * 0.3000) +
                 (state.p61_lib_5 * 0.2000) +
                 (state.p61_lib_mas5 * 0.1000);
  const revPts = (state.p61_rev_aut * 0.2000) +
                 (state.p61_rev_coaut * 0.1000) +
                 (state.p61_rev_3mas * 0.0500);
  const s61 = Math.min(8.0000, libPts + revPts);

  const s62 = Math.min(2.5000, state.p62_pts);
  const s63_raw = (state.p63_dep_alto_nivel * 1.0000) +
                  (state.p63_dep_rendimiento * 0.5000) +
                  state.p63_artistico_pts;
  const s63 = Math.min(2.5000, s63_raw);
  const s64 = (state.p64_y * 1.5000) + (state.p64_m * 0.1250);
  const s65 = state.p65_tribunales * 0.5000;
  const s66 = (state.p66_master_grado * 0.1000) + (state.p66_func_practicas * 0.2000);
  const s67 = Math.min(5.0000, state.p67_linguistica_pts);

  const rawB6 = s61 + s62 + s63 + s64 + s65 + s66 + s67;
  const totalB6 = Math.min(15.0000, rawB6);

  // Total General
  const granTotal = totalB1 + totalB2 + totalB3 + totalB4 + totalB5 + totalB6;

  return {
    s111, s112, s113, s121, s122, s123, totalB1,
    totalB2,
    s311, s312, s313, s314, s321a, s321b, s322, s323, s33_fp, s33_mus, s33_dlse, s33_idiomas, rawB3, totalB3,
    s41, s42, s43_raw, s43, rawB4, totalB4,
    s51, s52, s53, s54, s55_idiomas, rawB5, totalB5,
    s61, libPts, revPts, s62, s63, s64, s65, s66, s67, rawB6, totalB6,
    granTotal
  };
}

// -------------------------------------------------------------
// ACTUALIZACIÓN DE INTERFAZ (UI)
// -------------------------------------------------------------

function updateUI() {
  const res = calculateAll();

  // Actualizar subtotales individuales en la UI
  setTxt('res_111', fmt(res.s111));
  setTxt('res_112', fmt(res.s112));
  setTxt('res_113', fmt(res.s113));
  setTxt('res_121', fmt(res.s121));
  setTxt('res_122', fmt(res.s122));
  setTxt('res_123', fmt(res.s123));

  setTxt('res_311', fmt(res.s311));
  setTxt('res_312', fmt(res.s312));
  setTxt('res_313', fmt(res.s313));
  setTxt('res_314', fmt(res.s314));
  setTxt('res_321a', fmt(res.s321a));
  setTxt('res_321b', fmt(res.s321b));
  setTxt('res_322', fmt(res.s322));
  setTxt('res_323', fmt(res.s323));
  setTxt('res_33_fp', fmt(res.s33_fp));
  setTxt('res_33_mus', fmt(res.s33_mus));
  setTxt('res_33_dlse', fmt(res.s33_dlse));
  setTxt('res_33_idiomas', fmt(res.s33_idiomas));

  setTxt('res_41', fmt(res.s41));
  setTxt('res_42', fmt(res.s42));
  setTxt('res_43', fmt(res.s43));

  setTxt('res_51', fmt(res.s51));
  setTxt('res_52', fmt(res.s52));
  setTxt('res_53', fmt(res.s53));
  setTxt('res_54', fmt(res.s54));
  setTxt('res_55', fmt(res.s55_idiomas));

  setTxt('res_61', fmt(res.s61));
  setTxt('res_62', fmt(res.s62));
  setTxt('res_63', fmt(res.s63));
  setTxt('res_64', fmt(res.s64));
  setTxt('res_65', fmt(res.s65));
  setTxt('res_66', fmt(res.s66));
  setTxt('res_67', fmt(res.s67));

  // Subtotales de Bloque
  updateBlockDisplay('b1', res.totalB1, null, res.totalB1);
  updateBlockDisplay('b2', res.totalB2, 5.0, res.totalB2);
  updateBlockDisplay('b3', res.totalB3, 10.0, res.rawB3);
  updateBlockDisplay('b4', res.totalB4, 30.0, res.rawB4);
  updateBlockDisplay('b5', res.totalB5, 15.0, res.rawB5);
  updateBlockDisplay('b6', res.totalB6, 15.0, res.rawB6);

  // Gran Total
  setTxt('grand_total_display', fmt(res.granTotal));
  setTxt('print_grand_total', fmt(res.granTotal));

  // Actualizar barras de progreso en barra lateral
  updateSidebarProgress('b1', res.totalB1, 50.0); // B1 sin límite, escala visual 50
  updateSidebarProgress('b2', res.totalB2, 5.0);
  updateSidebarProgress('b3', res.totalB3, 10.0);
  updateSidebarProgress('b4', res.totalB4, 30.0);
  updateSidebarProgress('b5', res.totalB5, 15.0);
  updateSidebarProgress('b6', res.totalB6, 15.0);

  // Auto-guardado en LocalStorage
  saveToLocalStorage();
}

function updateBlockDisplay(blockId, capped, max, raw) {
  const el = document.getElementById(`subtotal_${blockId}`);
  if (!el) return;
  el.textContent = fmt(capped);
  
  if (max !== null && raw > max) {
    el.classList.add('capped');
    el.title = `Puntuación bruta acumulada: ${fmt(raw)} puntos. Topea en ${fmt(max)}.`;
  } else {
    el.classList.remove('capped');
    el.title = '';
  }

  // Sidebar row text
  setTxt(`sb_val_${blockId}`, fmt(capped));
  setTxt(`print_val_${blockId}`, fmt(capped));
}

function updateSidebarProgress(blockId, val, max) {
  const bar = document.getElementById(`pb_${blockId}`);
  if (!bar) return;
  const pct = Math.min(100, Math.max(0, (val / max) * 100));
  bar.style.width = `${pct}%`;
}

function setTxt(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// -------------------------------------------------------------
// EVENT LISTENERS & VINCULACIÓN DE CAMPOS
// -------------------------------------------------------------

function setupEventListeners() {
  // Input fields number change
  document.querySelectorAll('input[data-bind]').forEach(input => {
    const key = input.dataset.bind;
    input.addEventListener('input', e => {
      if (input.type === 'checkbox') {
        state[key] = input.checked;
      } else if (input.type === 'number') {
        state[key] = parseF(input.value);
      } else {
        state[key] = input.value;
      }
      updateUI();
    });
  });

  // Selects change
  document.querySelectorAll('select[data-bind]').forEach(select => {
    const key = select.dataset.bind;
    select.addEventListener('change', e => {
      state[key] = select.value;
      updateUI();
    });
  });

  // Stepper buttons (+ / -)
  document.querySelectorAll('.stepper-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const targetId = btn.dataset.target;
      const step = parseF(btn.dataset.step || 1);
      const input = document.getElementById(targetId);
      if (input) {
        let val = parseF(input.value) + step;
        const min = input.min !== "" ? parseF(input.min) : 0;
        const max = input.max !== "" ? parseF(input.max) : Infinity;
        if (val < min) val = min;
        if (val > max) val = max;
        input.value = val;
        const key = input.dataset.bind;
        if (key) state[key] = val;
        updateUI();
      }
    });
  });

  // Toggle legal documentation accordions
  document.querySelectorAll('.doc-toggle-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const content = btn.nextElementSibling;
      if (content) {
        const isOpen = content.classList.contains('open');
        content.classList.toggle('open', !isOpen);
        btn.querySelector('.doc-icon').textContent = isOpen ? '📄' : '📂';
      }
    });
  });

  // Preset buttons
  document.querySelectorAll('[data-preset]').forEach(btn => {
    btn.addEventListener('click', e => {
      loadPreset(btn.dataset.preset);
    });
  });

  // Reset button
  const resetBtn = document.getElementById('reset_btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('¿Deseas reiniciar todos los valores de la calculadora a 0?')) {
        resetAll();
      }
    });
  }

  // Print button
  const printBtn = document.getElementById('print_btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Export JSON
  const exportBtn = document.getElementById('export_btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportData);
  }

  // Import JSON
  const importFile = document.getElementById('import_file');
  if (importFile) {
    importFile.addEventListener('change', importData);
  }

  // Modal Desempate
  const desempateBtn = document.getElementById('desempate_btn');
  const desempateModal = document.getElementById('desempate_modal');
  const closeModalBtn = document.getElementById('close_modal_btn');

  if (desempateBtn && desempateModal) {
    desempateBtn.addEventListener('click', () => {
      renderDesempateAnalysis();
      desempateModal.classList.add('open');
    });
  }
  if (closeModalBtn && desempateModal) {
    closeModalBtn.addEventListener('click', () => {
      desempateModal.classList.remove('open');
    });
  }
  if (desempateModal) {
    desempateModal.addEventListener('click', (e) => {
      if (e.target === desempateModal) desempateModal.classList.remove('open');
    });
  }
}

// -------------------------------------------------------------
// PRESETS / PERFILES DE EJEMPLO
// -------------------------------------------------------------

function resetAll() {
  for (const k in state) {
    if (typeof state[k] === 'boolean') state[k] = false;
    else if (typeof state[k] === 'number') state[k] = 0;
    else if (typeof state[k] === 'string') state[k] = '0';
  }
  state.modo = 'docentes';
  state.desempate_ano_opos = 2022;
  state.desempate_nota_opos = 8.5;
  syncInputsWithState();
  updateUI();
}

function loadPreset(name) {
  resetAll();
  if (name === 'maestro_8') {
    // Maestro de Primaria con 8 años de experiencia
    // 3 años definitivo centro actual, 2 años provisional previa, 3 años interino
    state.p111_y = 3; state.p111_m = 0; // 14 pts
    state.p112_y = 2; state.p112_m = 0; // 8 pts
    state.p121_y = 8; state.p121_m = 0; // 16 pts en el cuerpo
    state.p312 = 1; // 1 Máster oficial (3 pts)
    state.idioma_ingles_eoi = '2.0'; // B2 EOI (2 pts)
    state.p43_y = 3; state.p43_m = 0; // 3 años tutoría (4.5 pts)
    state.p51_horas = 350; // 3.5 pts
    state.p54_digital = '2.0'; // B2 CDD (2.0 pts)
    state.p66_master_grado = 2; // 2 cursos tutor prácticas (0.2 pts)
  } else if (name === 'secundaria_15') {
    // Secundaria con 15 años, Jefe de Dpto y publicaciones
    state.p111_y = 7; state.p111_m = 2; // 14 + 4*8 + 2*0.6666 = 47.3332
    state.p121_y = 15; state.p121_m = 0; // 30 pts
    state.p311 = 1; // Doctorado (6 pts)
    state.p312 = 1; // Máster (3 pts)
    state.idioma_ingles_eoi = '3.0'; // C1 EOI (3 pts) -> topea en 10 pts académicos!
    state.p43_y = 6; state.p43_m = 0; // 6 años jefe dpto (9 pts)
    state.p51_horas = 950; // Topea 9 pts
    state.p52_horas = 30; // 1 pto impartición
    state.p54_digital = '2.5'; // C1 CDD (2.5 pts) -> total formación 12.5
    state.p61_lib_aut = 1; // 1 libro autor (1 pto)
    state.p61_rev_aut = 3; // 3 revistas autor (0.6 pts)
    state.p65_tribunales = 2; // 2 tribunales (1 pto)
    state.p66_master_grado = 5; // 5 cursos tutor prácticas (0.5 pts)
  } else if (name === 'novel_practicas') {
    // Funcionario novel que concursa por 1ª vez desde provisional
    state.p112_y = 1; state.p112_m = 2; // 1 año y 2 meses provisional (4.6666 pts)
    state.p121_y = 2; state.p121_m = 0; // 2 años cuerpo (4 pts)
    state.p321a = 1; // Grado adicional o doble grado (5 pts)
    state.idioma_ingles_eoi = '3.0'; // C1 EOI (3 pts)
    state.p51_horas = 200; // 2 pts formación
    state.p54_digital = '1.5'; // B1 CDD (1.5 pts)
  } else if (name === 'catedratico') {
    // Catedrático con más de 20 años y cargo directivo
    state.catedra = true; // 5 pts
    state.p111_y = 12; state.p111_m = 0; // 14 + 9*8 = 86 pts
    state.p121_y = 22; state.p121_m = 0; // 44 pts
    state.p311 = 1; // Doctor (6 pts)
    state.p314 = 1; // Premio extraord (1 pto)
    state.p323 = 1; // 2º ciclo licenciatura (3 pts) -> 10 pts
    state.p41_y = 4; state.p41_m = 0; // 4 años director (18 pts)
    state.p42_y = 3; state.p42_m = 0; // 3 años jefe estudios (9 pts) -> 27 pts
    state.p51_horas = 1000; // 9 pts
    state.p52_horas = 90; // 3 pts
    state.p54_digital = '3.0'; // C2 CDD (3 pts) -> 15 pts formación (Tope!)
    state.p61_lib_aut = 4; state.p61_rev_aut = 10; // Tope publicaciones (8 pts)
    state.p65_tribunales = 3; // 1.5 pts
  }
  syncInputsWithState();
  updateUI();
}

function syncInputsWithState() {
  document.querySelectorAll('input[data-bind]').forEach(input => {
    const key = input.dataset.bind;
    if (input.type === 'checkbox') {
      input.checked = !!state[key];
    } else {
      input.value = state[key] !== undefined ? state[key] : '';
    }
  });

  document.querySelectorAll('select[data-bind]').forEach(select => {
    const key = select.dataset.bind;
    if (state[key] !== undefined) {
      select.value = state[key];
    }
  });
}

// -------------------------------------------------------------
// PERSISTENCIA Y EXPORTACIÓN
// -------------------------------------------------------------

function saveToLocalStorage() {
  try {
    localStorage.setItem('concurso_traslados_boe2026_state', JSON.stringify(state));
  } catch (e) {
    // Ignore storage quota
  }
}

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem('concurso_traslados_boe2026_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
      syncInputsWithState();
    }
  } catch (e) {
    console.error("Error al cargar de localStorage", e);
  }
}

function exportData() {
  const jsonStr = JSON.stringify({
    version: "BOE-A-2026-20763",
    fecha: new Date().toISOString(),
    datos: state,
    calculo: calculateAll()
  }, null, 2);

  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `meritos_concurso_traslados_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const imported = JSON.parse(event.target.result);
      if (imported.datos) {
        Object.assign(state, imported.datos);
        syncInputsWithState();
        updateUI();
        alert('¡Datos del baremo importados con éxito!');
      } else {
        alert('Formato de archivo no reconocido.');
      }
    } catch (err) {
      alert('Error al leer el archivo JSON.');
    }
  };
  reader.readAsText(file);
}

// -------------------------------------------------------------
// SIMULADOR DE DESEMPATE (ORDEN EFD/1041/2026 - APARTADO SEXTO)
// -------------------------------------------------------------

function renderDesempateAnalysis() {
  const res = calculateAll();
  const container = document.getElementById('desempate_content');
  if (!container) return;

  container.innerHTML = `
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
      <h4 style="margin-bottom: 8px; color: #1e3a8a;">Regla General de Desempate (Apartado Sexto de la Orden)</h4>
      <p style="font-size: 0.85rem; color: #475569; line-height: 1.45;">
        Los empates en el total de puntos se resuelven atendiendo <strong>sucesivamente a la mayor puntuación en cada uno de los apartados</strong> del baremo por su orden (1º Antigüedad, 2º Cátedras, 3º Académicos, 4º Cargos, 5º Formación, 6º Otros).
        Si persiste, se acude a los subapartados por orden (1.1.1, 1.1.2, 1.1.3...). De persistir, año de convocatoria y puntuación obtenida en el procedimiento selectivo de ingreso.
      </p>
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; margin-bottom: 16px;">
      <thead>
        <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: left;">
          <th style="padding: 8px 10px;">Orden Prioridad</th>
          <th style="padding: 8px 10px;">Apartado</th>
          <th style="padding: 8px 10px; text-align: right;">Tu Puntuación</th>
          <th style="padding: 8px 10px; text-align: center;">Tope Legal</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 10px; font-weight: 700; color: #4f46e5;">1º Criterio</td>
          <td style="padding: 8px 10px;">1. Antigüedad (Centro + Cuerpo)</td>
          <td style="padding: 8px 10px; text-align: right; font-weight: 700;">${fmt(res.totalB1)}</td>
          <td style="padding: 8px 10px; text-align: center; color: #64748b;">Sin límite</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 10px; font-weight: 700; color: #9333ea;">2º Criterio</td>
          <td style="padding: 8px 10px;">2. Cuerpos de Catedráticos</td>
          <td style="padding: 8px 10px; text-align: right; font-weight: 700;">${fmt(res.totalB2)}</td>
          <td style="padding: 8px 10px; text-align: center; color: #64748b;">5,0000</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 10px; font-weight: 700; color: #059669;">3º Criterio</td>
          <td style="padding: 8px 10px;">3. Méritos académicos</td>
          <td style="padding: 8px 10px; text-align: right; font-weight: 700;">${fmt(res.totalB3)}</td>
          <td style="padding: 8px 10px; text-align: center; color: #64748b;">10,0000</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 10px; font-weight: 700; color: #d97706;">4º Criterio</td>
          <td style="padding: 8px 10px;">4. Desempeño de cargos directivos</td>
          <td style="padding: 8px 10px; text-align: right; font-weight: 700;">${fmt(res.totalB4)}</td>
          <td style="padding: 8px 10px; text-align: center; color: #64748b;">30,0000</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 10px; font-weight: 700; color: #0284c7;">5º Criterio</td>
          <td style="padding: 8px 10px;">5. Formación y perfeccionamiento</td>
          <td style="padding: 8px 10px; text-align: right; font-weight: 700;">${fmt(res.totalB5)}</td>
          <td style="padding: 8px 10px; text-align: center; color: #64748b;">15,0000</td>
        </tr>
        <tr style="border-bottom: 2px solid #cbd5e1;">
          <td style="padding: 8px 10px; font-weight: 700; color: #e11d48;">6º Criterio</td>
          <td style="padding: 8px 10px;">6. Otros méritos</td>
          <td style="padding: 8px 10px; text-align: right; font-weight: 700;">${fmt(res.totalB6)}</td>
          <td style="padding: 8px 10px; text-align: center; color: #64748b;">15,0000</td>
        </tr>
        <tr style="background: #eff6ff; font-weight: 800;">
          <td colspan="2" style="padding: 10px;">PUNTUACIÓN TOTAL BAREMO</td>
          <td style="padding: 10px; text-align: right; font-size: 1.1rem; color: #1e40af;">${fmt(res.granTotal)}</td>
          <td style="padding: 10px; text-align: center;">-</td>
        </tr>
      </tbody>
    </table>

    <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 0.83rem; color: #334155;">
      💡 <em>Nota sobre la Antigüedad:</em> Si dos aspirantes tienen la misma puntuación en el Bloque 1, se desempatará comparando sucesivamente el subapartado <strong>1.1.1</strong>, luego <strong>1.1.2</strong>, luego <strong>1.1.3</strong>, luego <strong>1.2.1</strong>, etc.
    </div>
  `;
}

// -------------------------------------------------------------
// INICIALIZACIÓN
// -------------------------------------------------------------

window.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadFromLocalStorage();
  updateUI();
});
