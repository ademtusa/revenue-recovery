const fs = require('fs');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Translated", filePath);
}

// src/admin/tabs/AdminUsers.tsx
replaceInFile('C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/admin/tabs/AdminUsers.tsx', {
  "gerçek backend entegrasyonuyla aktif olacaktır. Şu an yalnızca aktif tarayıcı": "will be active with real backend integration. Currently, only data from the active browser session can be read."
});

// src/admin/tabs/AdminSettings.tsx
replaceInFile('C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/admin/tabs/AdminSettings.tsx', {
  "Tüm lead'ler silinecek. Emin misiniz?": "All leads will be deleted. Are you sure?",
  "Tüm feedback'ler silinecek. Emin misiniz?": "All feedback will be deleted. Are you sure?",
  "/* ── Bölüm 1 — Admin Şifresi ── */": "/* ── Section 1 — Admin Password ── */",
  "/* ── Bölüm 2 — Demo Yapılandırması ── */": "/* ── Section 2 — Demo Configuration ── */",
  "/* ── Bölüm 3 — Veri Yönetimi ── */": "/* ── Section 3 — Data Management ── */",
  "/* ── Bölüm 4 — Sistem Bilgisi ── */": "/* ── Section 4 — System Info ── */"
});

// src/views/DiagnosisView.tsx
replaceInFile('C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/views/DiagnosisView.tsx', {
  "fb.wasUseful === 'Çok Faydalı' ? 'badge-success' : fb.wasUseful === 'Biraz Faydalı' ? 'badge-warning' : 'badge-danger'": "fb.wasUseful === 'Very Useful' ? 'badge-success' : fb.wasUseful === 'Somewhat Useful' ? 'badge-warning' : 'badge-danger'"
});

// src/views/UploadView.tsx
replaceInFile('C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/views/UploadView.tsx', {
  "SmartHome Türkiye": "SmartHome Turkey",
  "7 Müşteri &amp; Deals Analizi": "7 Customers &amp; Deals Analysis"
});

// src/views/PipelineView.tsx
replaceInFile('C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/views/PipelineView.tsx', {
  "Recovery süreçlerinin anlık durumu.": "Instant status of recovery processes.",
  "Diagnostic Screenna Dön": "Back to Diagnostic Screen"
});
