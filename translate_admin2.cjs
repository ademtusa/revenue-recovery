const fs = require('fs');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Translated", filePath);
}

// AdminFeedback.tsx
replaceInFile('C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/admin/tabs/AdminFeedback.tsx', {
  "Tüm kullanıcı geri bildirimlerini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.": "Are you sure you want to delete all user feedback? This action cannot be undone.",
  "E-Posta,Tarih,Tur,Fayda Derecesi,En Degerli Kisim,Yorum/Hata Detayi": "Email,Date,Type,Usefulness,Most Valuable,Comment/Bug Detail",
  "🪲 Hata Raporu": "🪲 Bug Report",
  "💡 Öneri/Fikir": "💡 Suggestion/Idea",
  "❓ Soru/Yardım": "❓ Question/Help",
  "Geri Bildirim": "Feedback",
  "Çok Faydalı": "Very Useful",
  "Biraz Faydalı": "Somewhat Useful",
  "Kullanıcı Geri Bildirimleri & Hata Raporları": "User Feedback & Bug Reports",
  "Canlı sürüm test kullanıcılarından toplanan anlık saha verileri": "Real-time field data collected from live test users",
  "CSV Dışa Aktar": "Export CSV",
  "Tümünü Temizle": "Clear All",
  "Toplam Yanıt": "Total Responses",
  "🪲 Hatalar": "🪲 Bugs",
  "💡 Öneri/Özellik": "💡 Suggestion/Feature",
  "❓ Sorular": "❓ Questions",
  "Tümü": "All",
  "💡 Öneriler": "💡 Suggestions",
  "Henüz test kullanıcılarından gelen bir geri bildirim bulunmamaktadır.": "There is no feedback from test users yet.",
  "Bu filtre türünde kayıt bulunmamaktadır.": "There are no records in this filter type.",
  "ornek-tester@sirket.com": "example-tester@company.com",
  "Bilinmeyen Tarih": "Unknown Date",
  "⭐ En Değerli:": "⭐ Most Valuable:"
});

// AdminLeads.tsx
replaceInFile('C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/admin/tabs/AdminLeads.tsx', {
  "E-Posta,Yakalanma Tarihi,Tahmini Kayıp ($),Şirket Sayısı,Not": "Email,Capture Date,Estimated Loss ($),Company Count,Note",
  "Yükleniyor…": "Loading...",
  "Lead Listesi": "Lead List",
  "Toplam": "Total",
  "lead kaydı": "lead records",
  "⬇ CSV Olarak İndir": "⬇ Download as CSV",
  "Henüz lead yakalanmadı.": "No leads captured yet.",
  "PDF indirme veya CSV yükleme ile toplanır.": "Collected via PDF download or CSV upload.",
  "E-Posta": "Email",
  "Yakalanma Tarihi": "Capture Date",
  "Tahmini Kayıp": "Estimated Loss",
  "Şirket Sayısı": "Company Count",
  "Not / Durum": "Note / Status",
  "Not Ekle": "Add Note",
  "Not yazın…": "Write note...",
  "Kaydet": "Save",
  "İptal": "Cancel"
});

// AdminSettings.tsx
replaceInFile('C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/admin/tabs/AdminSettings.tsx', {
  "Mevcut şifre hatalı.": "Current password is incorrect.",
  "Yeni şifre en az 6 karakter olmalı.": "New password must be at least 6 characters.",
  "Şifreler eşleşmiyor.": "Passwords do not match.",
  "Şifre başarıyla güncellendi.": "Password updated successfully.",
  "Tüm demo verisi silinecek ve oturum kapatılacak. Emin misiniz?": "All demo data will be deleted and you will be logged out. Are you sure?",
  "Tüm lead'ler silinecek. Emin misiniz?": "All leads will be deleted. Are you sure?",
  "Lead'ler temizlendi.": "Leads cleared.",
  "Tüm feedback'ler silinecek. Emin misiniz?": "All feedback will be deleted. Are you sure?",
  "Feedback'ler temizlendi.": "Feedback cleared.",
  "Tüm kayıtlar sıfırlanacak (demo verisi geri gelecek). Emin misiniz?": "All records will be reset (demo data will return). Are you sure?",
  "Kayıtlar sıfırlandı.": "Records reset.",
  "🔐 Admin Bilgileri": "🔐 Admin Info",
  "Mevcut Şifre": "Current Password",
  "Yeni Şifre": "New Password",
  "Yeni Şifre (Tekrar)": "New Password (Repeat)",
  "Şifreyi Güncelle": "Update Password",
  "⚙️ Demo Yapılandırması": "⚙️ Demo Configuration",
  "FREE Plan Kayıt Limiti": "FREE Plan Record Limit",
  "✓ Kaydedildi": "✓ Saved",
  "Kaydet": "Save",
  "FREE plan kullanıcıları bu limitin üzerinde CSV satırı yükleyemez.": "FREE plan users cannot upload CSV rows above this limit.",
  "🔄 Demo'yu Sıfırla": "🔄 Reset Demo",
  "🗄️ Veri Yönetimi": "🗄️ Data Management",
  "Tüm Lead'leri Temizle": "Clear All Leads",
  "Tüm Feedback'leri Temizle": "Clear All Feedback",
  "Tüm Kayıtları Sıfırla": "Reset All Records",
  "Temizle": "Clear",
  "ℹ️ Sistem Bilgisi": "ℹ️ System Info",
  "localStorage Kullanımı": "localStorage Usage",
  "Toplam Kayıt Sayısı": "Total Records Count",
  "Versiyon": "Version"
});

// AdminUsers.tsx
replaceInFile('C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/admin/tabs/AdminUsers.tsx', {
  "Yükleniyor…": "Loading...",
  "Tüm demo verisi silinecek ve oturumunuz kapatılacak. Emin misiniz?": "All demo data will be deleted and your session will be logged out. Are you sure?",
  "Aktif Session E-Postası": "Active Session Email",
  "Mevcut Plan": "Current Plan",
  "Toplam Kayıt Sayısı": "Total Records Count",
  "Son CSV Yüklemesi": "Last CSV Upload",
  "Feedback Gönderdi mi?": "Sent Feedback?",
  "Evet": "Yes",
  "Hayır": "No",
  "Gönderilen Toplam Feedback": "Total Feedback Sent",
  "Ücretsiz Plan Satır Limiti": "Free Plan Row Limit",
  "Limit'e Çarptı mı?": "Hit Limit?",
  "Aktif Oturum Bilgisi": "Active Session Info",
  "localStorage tabanlı — gerçek kullanıcı takibi": "localStorage based — real user tracking",
  "🔄 Demo'yu Sıfırla": "🔄 Reset Demo",
  "Çoklu kullanıcı takibi": "Multi-user tracking",
  "gerçek backend entegrasyonuyla aktif olacaktır. Şu an yalnızca aktif tarayıcı oturumundaki veriler okunabilmektedir.": "will be active with real backend integration. Currently, only data from the active browser session can be read.",
  " Satır": " Rows"
});
