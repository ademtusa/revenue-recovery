const fs = require('fs');

function replaceInFile(file, replacements) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [tr, en] of replacements) {
    if (content.includes(tr)) {
      content = content.replace(new RegExp(tr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), en);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}

const diagReplacements = [
  ['Otomatik Kurtarma Sırasında', 'During Automatic Recovery'],
  ['<Mail size={13} /> E-Posta', '<Mail size={13} /> Email'],
  ['<Phone size={13} /> Telefon', '<Phone size={13} /> Phone'],
  ['Alıcı E-Posta', 'Recipient Email'],
  ['E-Posta Konusu', 'Email Subject'],
  ['WhatsApp Numarası', 'WhatsApp Number'],
  ['Aksiyonu Kaydet & Tetikle', 'Save & Trigger Action'],
  ['Aksiyon Alındı:', 'Action Taken:'],
  ['E-Posta: <span', 'Email: <span'],
  ['✅ Recovered (Gelir Geri Kazanıldı)', '✅ Recovered'],
  ['<Check size={14} /> Kaydet', '<Check size={14} /> Save'],
  ['Risk Tutarı', 'Amount at Risk'],
  ['Sonrası:', 'After:'],
  ['Firma</span>', 'Companies</span>'],
  ['Kapatılma Statusu', 'Closing Status'],
  ['Lead Kayıt Havuzu', 'Lead Capture Pool'],
  ['E-Posta Adresi', 'Email Address'],
  ['Firma Sayısı', 'Company Count'],
  ['Recoverable Kayıp', 'Recoverable Loss'],
  ['Firma</td>', 'Companies</td>'],
  ['Kullanıcı Geri Bildirim Havuzu', 'User Feedback Pool'],
  ['>Yenile<', '>Refresh<'],
  ['Fayda Seviyesi', 'Usefulness Level'],
  ['label: \'Bekleyen\'', 'label: \'Pending\''],
  ['Categoryyi Belirle', 'Identify Category'],
  ['Recoverable Gelir Potansiyeli', 'Recoverable Revenue Potential'],
  ['Riskteki Gelir', 'Revenue at Risk'],
  ['Abandoned Opportunitylar', 'Abandoned Opportunities'],
  ['Korunan Ciro', 'Protected Revenue'],
  ['Kaybedilen / Churn', 'Lost / Churn'],
  ['Sonrası:', 'After:'],
  ['Firma', 'Companies']
];
replaceInFile('src/views/DiagnosisView.tsx', diagReplacements);

const pipelineReplacements = [
  ['label: \'Bekleyen\'', 'label: \'Pending\'']
];
replaceInFile('src/views/PipelineView.tsx', pipelineReplacements);

const authReplacements = [
  ['placeholder="Ahmet Yılmaz"', 'placeholder="John Doe"']
];
replaceInFile('src/views/AuthView.tsx', authReplacements);

const pricingReplacements = [
  ["setCardName('Ahmet Yılmaz')", "setCardName('John Doe')"],
  ['placeholder="Ahmet Yılmaz"', 'placeholder="John Doe"']
];
replaceInFile('src/components/PricingModal.tsx', pricingReplacements);

const adminFeedbackReplacements = [
  ['Kullanıcı Feedbackleri & Hata Raporları', 'User Feedbacks & Bug Reports']
];
replaceInFile('src/admin/tabs/AdminFeedback.tsx', adminFeedbackReplacements);
