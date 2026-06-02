const fs = require('fs');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Translated", filePath);
}

// AdminLoginView.tsx
replaceInFile('C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/admin/AdminLoginView.tsx', {
  "Hatalı şifre. Tekrar deneyin.": "Incorrect password. Please try again.",
  "RRIO RRS — Admin Paneli": "RRIO RRS — Admin Panel",
  "Yetkili erişim gereklidir": "Authorized access required",
  "Admin Şifresi": "Admin Password",
  "Doğrulanıyor…": "Verifying...",
  "Giriş Yap": "Login",
  "← Demo'ya Dön": "← Back to Demo"
});

// AdminPanel.tsx
replaceInFile('C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/admin/AdminPanel.tsx', {
  "Genel Bakış": "Overview",
  "Kullanıcılar": "Users",
  "Lead'ler": "Leads",
  "Geri Bildirimler": "Feedback",
  "Analitik": "Analytics",
  "Ayarlar": "Settings",
  "Kontrol Paneli": "Control Panel",
  "← Demo'ya Dön": "← Back to Demo"
});

// AdminOverview.tsx
replaceInFile('C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/admin/tabs/AdminOverview.tsx', {
  "Bekliyor": "Pending",
  "Aksiyonda": "In Action",
  "Kapatıldı": "Closed",
  "Yükleniyor…": "Loading...",
  "Toplam Kullanıcı": "Total Users",
  "Simüle edilmiş hesaplardan": "From simulated accounts",
  "Toplam Lead": "Total Leads",
  "Lead yakalama kaydı": "Lead capture record",
  "Toplam Geri Bildirim": "Total Feedback",
  "Feedback yanıtı": "Feedback response",
  "Kurtarılan Gelir": "Recovered Revenue",
  "CLOSED + recovered kayıtlar": "CLOSED + recovered records",
  "Son Aktiviteler": "Recent Activities",
  "Henüz kayıt yok.": "No records yet.",
  "Plan Dağılımı": "Plan Distribution",
  "Not: Yalnızca aktif session planı görüntülenebilir.": "Note: Only active session plan can be viewed."
});

// AdminAnalytics.tsx
replaceInFile('C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/admin/tabs/AdminAnalytics.tsx', {
  "Yükleniyor…": "Loading...",
  "📂 Kategori Dağılımı": "📂 Category Distribution",
  "Terk Edilen Fırsat": "Abandoned Opportunity",
  "Abonelik Çürümesi": "Subscription Decay",
  "Soğuyan İlişki": "Cooling Relationship",
  "🚨 Aciliyet Dağılımı": "🚨 Urgency Distribution",
  "Kritik": "Critical",
  "Orta": "Medium",
  "Düşük": "Low",
  "💰 Toplam Gelir Riski": "💰 Total Revenue Risk",
  "Toplam Risk": "Total Risk",
  "Bekliyor": "Pending",
  "Aksiyonda": "In Action",
  "Kurtarıldı": "Recovered",
  "🕐 Lead Zaman Çizelgesi (Son 5)": "🕐 Lead Timeline (Last 5)",
  "Henüz lead yok.": "No leads yet."
});
