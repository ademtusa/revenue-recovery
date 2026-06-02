const fs = require('fs');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Translated", filePath);
}

// src/index.css
replaceInFile('C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/index.css', {
  "/* Red — Risk / Loss / Kaçak */": "/* Red — Risk / Loss / Leak */",
  "/* scrollbar alanı her sayfada rezerve → geçişte zıplama yok */": "/* scrollbar space reserved on every page → no jumping on transition */"
});

// src/lib/db.ts
replaceInFile('C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/lib/db.ts', {
  "analist güven skoru": "analyst confidence score",
  "2 gün önce": "2 days ago",
  "Replied (İletişim Aktif)": "Replied (Communication Active)"
});

// src/views/LoadingEngine.tsx
replaceInFile('C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/views/LoadingEngine.tsx', {
  "/* ghost topbar yüksekliği + nefes payı */": "/* ghost topbar height + breathing room */",
  "/* Ghost topbar — sayfa geçişi tutarlılığı için (Logo + Brand) */": "/* Ghost topbar — for page transition consistency (Logo + Brand) */"
});

// src/views/DiagnosisView.tsx
replaceInFile('C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/views/DiagnosisView.tsx', {
  "RRS Zeka Teşhis Motoru": "RRS Intelligence Diagnosis Engine",
  "Çıkış": "Logout",
  "Döngüsü Recovered Revenue": "Cycle Recovered Revenue",
  "Olay Güdümlü Zaman Tüneli": "Event-Driven Timeline",
  "İstihbarat Teşhisi": "Intelligence Diagnosis",
  "Yüksek Güvenilirlik": "High Confidence",
  "Medium Güvenilirlik": "Medium Confidence",
  "Low Güvenilirlik": "Low Confidence",
  "Önerilen Strateji": "Recommended Strategy",
  "Kurtarma Şablonu": "Recovery Template",
  "Pro Plan ile Şablonu Göster": "Show Template with Pro Plan",
  "Aksiyon Başlat": "Start Action",
  "Sistem 2 saat içinde otomatik şablonu tetikleyecektir.": "The system will automatically trigger the template within 2 hours.",
  "E-POSTA ASİSTANI": "EMAIL ASSISTANT",
  "WHATSAPP ASİSTANI": "WHATSAPP ASSISTANT",
  "Mesaj Taslağı": "Message Draft",
  "Döngüyü Kapatmak İçin Sonuç Seçin:": "Select Outcome to Close Cycle:",
  "Sonucu seçin...": "Select outcome...",
  "💬 Replied (İletişim Aktif)": "💬 Replied (Communication Active)",
  "Döngü Sonucu": "Cycle Outcome",
  "Gerçekleşen Aksiyon": "Realized Action",
  "Global İstihbarat Kaydı": "Global Intelligence Record",
  "Henüz analiz edilmiş veri bulunmamaktadır.": "There is no analyzed data yet.",
  "Gelişmiş Kurtarma ve Sonuç Merkezi": "Advanced Recovery and Outcome Center",
  "Ücretsiz planda sadece teşhis yapabilirsiniz. \"Recovery & Outcome Center\" (Outcomes Center); kurtarılan ciroları, before/after dönüşümlerini ve operasyonel başarı oranlarını takip etmek içindir ve sadece <b>Pro</b> planda mevcuttur.": "You can only diagnose in the free plan. \"Recovery & Outcome Center\"; is for tracking recovered revenues, before/after conversions, and operational success rates, and is only available in the <b>Pro</b> plan.",
  "Tahsil edilmiş kesin gelir.": "Collected definite revenue.",
  "İlişkisi tazelenmiş değer.": "Value of refreshed relationship.",
  "Ulaşılamayan bütçe tutarı.": "Unreachable budget amount.",
  "Başarı Oranı": "Success Rate",
  "Kapatılmış döngü başarısı.": "Closed cycle success.",
  "Dönüşüm Analizi": "Conversion Analysis",
  "Abandoned Opportunity → Kurtarma": "Abandoned Opportunity → Recovery",
  "Teklif İlgisiz & Unutulmuş": "Proposal Ignored & Forgotten",
  "Takip Başlatıldı & Gelir Recovered": "Follow-up Started & Revenue Recovered",
  "Subscription Decay → Stabilize": "Subscription Decay → Stabilize",
  "Login Oranı Low (%40 Churn Riski)": "Login Rate Low (40% Churn Risk)",
  "Temas Kuruldu & İlişki Tazelendi": "Contact Established & Relationship Refreshed",
  "Cold Relationship → Yeniden Aktif": "Cold Relationship → Reactivated",
  "6+ Aydır Sıfır Temas & Unutulmuş": "Zero Contact for 6+ Months & Forgotten",
  "Kahve Sohbeti & Yeni Proje Fırsatı": "Coffee Chat & New Project Opportunity",
  "Öncesi:": "Before:",
  "Sonuçlanan:": "Resulting:",
  "Kapatılmış Kurtarma Döngüleri": "Closed Recovery Cycles",
  "İyileşen Gelir": "Recovered Revenue",
  "Henüz hiçbir kurtarma döngüsü sonuçlandırılmadı.": "No recovery cycles have been concluded yet.",
  "CSV Dışa Aktar": "Export CSV",
  "Henüz toplanmış lead kaydı bulunmamaktadır.": "There are no captured lead records yet.",
  "Teşhis Datei": "Diagnosis Date",
  "Henüz toplanmış geri bildirim bulunmamaktadır.": "There is no feedback collected yet.",
  "En Değerli Kısım": "Most Valuable Part",
  "Görüş / Öneri": "Feedback / Suggestion"
});
