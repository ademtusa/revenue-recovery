const fs = require('fs');

function translateAuthView() {
  const path = 'C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/views/AuthView.tsx';
  let content = fs.readFileSync(path, 'utf8');

  const replacements = {
    "Lütfen geçerli bir e-posta adresi girin.": "Please enter a valid email address.",
    "Demo hesabınız oluşturuldu! Giriş yapılıyor...": "Demo account created! Logging in...",
    "Giriş başarılı! Yönlendiriliyorsunuz...": "Login successful! Redirecting...",
    "Gelir kurtarma ve kayıp analitiği işletim platformu": "Revenue recovery and loss analytics operating platform",
    "Hesap Oluştur": "Create Account",
    "Sisteme Giriş": "System Login",
    "← Giriş yap": "← Log in",
    "Yeni hesap →": "New account →",
    "Şirket veya Yetkili Adı": "Company or Contact Name",
    "E-Posta Adresi": "Email Address",
    "Şifre": "Password",
    "Kayıt Ol": "Sign Up",
    "Giriş Yap": "Log In",
    "Bu demo tamamen tarayıcınızda çalışır. Sunucuya hiçbir veri gönderilmez.": "This demo runs entirely in your browser. No data is sent to the server.",
    "Gerçek hesap oluşturulmaz, şifreniz saklanmaz.": "No real account is created, your password is not stored.",
    "veya": "or",
    "Tek Tıkla Demo Girişi": "One-Click Demo Login",
    "🛠️ Yetkili / Yönetici Girişi": "🛠️ Admin / Manager Login",
    "Yerel Demo Sandbox": "Local Demo Sandbox",
    "256-bit Güvenlik": "256-bit Security",
    "Simülasyon Modu": "Simulation Mode"
  };

  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
  }
  fs.writeFileSync(path, content, 'utf8');
  console.log("Translated AuthView");
}

function translatePipelineView() {
  const path = 'C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/views/PipelineView.tsx';
  let content = fs.readFileSync(path, 'utf8');

  const replacements = {
    "Terk Edilmiş Fırsat": "Abandoned Opportunity",
    "Abonelik Çürümesi": "Subscription Decay",
    "Soğuk İlişki": "Cold Relationship",
    "✅ Kurtarıldı": "✅ Recovered",
    "💬 Yanıt Alındı": "💬 Replied",
    "🔄 Yeniden Açıldı": "🔄 Reopened",
    "⏳ Cevap Yok": "⏳ No Response",
    "❌ Churn": "❌ Churn",
    "BEKLEYENLER": "PENDING",
    "Aksiyon alınmayı bekliyor": "Waiting for action",
    "İŞLEMDE": "IN PROGRESS",
    "Temas kuruldu, yanıt bekleniyor": "Contact established, awaiting response",
    "KAPATILDI": "CLOSED",
    "Döngü sonuçlandı": "Loop concluded",
    "Pipeline yükleniyor...": "Loading pipeline...",
    "Teşhis Ekranı": "Diagnostic Screen",
    "Kanban Pipeline Görünümü": "Kanban Pipeline View",
    "\"Gelişmiş Pipeline Görünümü\" ile müşterilerinizi Kanban tahtasında yönetebilir, süreçler arası sürükle-bırak yapabilir ve kurtarma operasyonlarını görselleştirebilirsiniz. Bu özellik sadece <b>Pro</b> ve <b>Agency</b> planlarında mevcuttur.": "With \"Advanced Pipeline View\", you can manage your customers on a Kanban board, drag and drop between processes, and visualize recovery operations. This feature is only available on <b>Pro</b> and <b>Agency</b> plans.",
    "Pro Plana Geç": "Upgrade to Pro",
    "ay)": "mo)",
    "Yeniden Tara": "Rescan",
    "Tüm demo verisini sil ve sıfırla": "Delete all demo data and reset",
    "Demo'yu Sıfırla": "Reset Demo",
    "Çıkış": "Logout",
    "Kurtarma": "Recovery",
    "Pipeline Görünümü": "Pipeline View",
    "kayıt —": "records —",
    "toplam risk.": "total risk.",
    "Kurtarma süreçlerinin anlık durumu.": "Real-time status of recovery processes.",
    "Bekleyen": "Pending",
    "Aksiyon bekliyor.": "Awaiting action.",
    "İşlemde": "In Progress",
    "Yanıt bekleniyor.": "Awaiting response.",
    "Kurtarılan Ciro": "Recovered Revenue",
    "Geri kazanılan toplam.": "Total recovered.",
    "Başarı Oranı": "Success Rate",
    "Kapatılmış döngü başarısı.": "Closed loop success.",
    "Bu sütunda kayıt yok.": "No records in this column.",
    "Detaylı görünüm için tıklayın": "Click for detailed view",
    "Bekliyor": "Pending",
    "Öncelik Skoru": "Priority Score",
    "Toplam Risk": "Total Risk",
    "← Kaydırarak tüm kolonları görüntüleyin →": "← Swipe to view all columns →",
    "Kart detayları, AI mesaj şablonları ve döngü kapatma için": "For card details, AI message templates, and loop closing, switch to",
    "'na geçin.": ".",
    "Teşhis Ekranına Dön": "Return to Diagnostic Screen"
  };

  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
  }
  fs.writeFileSync(path, content, 'utf8');
  console.log("Translated PipelineView");
}

translateAuthView();
translatePipelineView();
