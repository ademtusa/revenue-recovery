import { v4 as uuidv4 } from 'uuid';

export type Category = 'ABANDONED_OPPORTUNITY' | 'SUBSCRIPTION_DECAY' | 'COLD_RELATIONSHIP';
export type WorkflowStatus = 'PENDING' | 'ACTION_TAKEN' | 'CLOSED';
export type ActionType = 'E-Posta Gönderildi' | 'Telefonla Arandı' | 'WhatsApp / SMS' | 'Sosyal Ağ / LinkedIn';
export type OutcomeType = 'replied' | 'reopened' | 'recovered' | 'no_response' | 'churned';

export interface IntelligenceEvent {
  date: string;
  type: string;
  title: string;
  description: string;
}

export interface IntelligenceRecord {
  id: string;
  category: Category;
  clientName: string;
  contactPerson: string;
  clientEmail?: string;
  clientPhone?: string;
  context: string; 
  revenueImpact: number;
  urgency: 'CRITICAL' | 'MEDIUM' | 'LOW';
  subCause: string;
  strategy: string;
  draftMessage: string;
  status: WorkflowStatus;
  actionType?: ActionType;
  outcome?: OutcomeType;
  // Event-Driven Mimarisi Alanları
  eventHistory: IntelligenceEvent[];
  priorityScore: number; // 0-100 ciro ve zaman kaybı riski puanı
  confidenceScore: number; // 0-100 analist güven skoru
  lastUpdated: string;
}

export interface LeadCaptureRecord {
  id: string;
  email: string;
  capturedAt: string;
  companyCount: number;
  estimatedLoss: number;
}

const STORAGE_KEY = 'rrio_revenue_records';
const LEAD_STORAGE_KEY = 'rrio_lead_captures';

export const initializeDB = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const MOCK_DATA: IntelligenceRecord[] = [
      {
        id: uuidv4(),
        category: 'ABANDONED_OPPORTUNITY',
        clientName: 'TechCorp A.Ş.',
        contactPerson: 'Ahmet Yılmaz (CEO)',
        clientEmail: 'ahmet.yilmaz@techcorp.com.tr',
        clientPhone: '+905321234567',
        context: 'E-Ticaret Altyapı Yenilemesi',
        revenueImpact: 4500,
        urgency: 'CRITICAL',
        subCause: 'Fiyat tereddüdü veya karar erteleme sebebiyle teklif sonrası takip unutuldu.',
        strategy: 'Zaman odaklı, hızlı takip. Pürüz giderici ve net.',
        draftMessage: "Ahmet Bey merhaba, E-Ticaret altyapısı projemizle ilgili önceliklerin değişip değişmediğini kontrol etmek istedim. Taslak veya bütçe konusunda aklınıza takılan bir nokta varsa hızlıca netleştirebiliriz.",
        status: 'PENDING',
        priorityScore: 92,
        confidenceScore: 95,
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 gün önce
        eventHistory: [
          { date: '10 Nisan 2026', type: 'lead_created', title: 'Aday Oluşturuldu', description: 'Web sitesi üzerinden e-ticaret altyapısı için talep oluşturuldu.' },
          { date: '12 Nisan 2026', type: 'lead_contacted', title: 'İlk Temas Kuruldu', description: 'Ahmet Yılmaz ile gereksinim detayları görüşüldü.' },
          { date: '15 Nisan 2026', type: 'proposal_sent', title: 'Teklif Gönderildi', description: 'Yıllık lisans ve altyapı bedelini içeren resmi teklif iletildi.' },
          { date: '16 Nisan 2026', type: 'proposal_viewed', title: 'Teklif İncelendi', description: 'Müşteri adayının teklif dosyasını 3 kez açıp okuduğu tespit edildi.' },
          { date: '30 Nisan 2026', type: 'proposal_followup_missed', title: 'Takip Araması Kaçırıldı', description: 'Teklif sonrası yapılması gereken 14. gün takip görüşmesi planlanmadı (Gelir Kaçağı!).' },
          { date: '05 Mayıs 2026', type: 'recovery_triggered', title: 'Kurtarma Tetiklendi', description: 'Olay güdümlü motor tarafından acil kurtarma süreci başlatıldı.' }
        ]
      },
      {
        id: uuidv4(),
        category: 'SUBSCRIPTION_DECAY',
        clientName: 'Lumina Mimarlık',
        contactPerson: 'Selin Kaya (Kurucu)',
        clientEmail: 'selin@luminamimarlik.com',
        clientPhone: '+905449876543',
        context: 'Pro Danışmanlık Üyeliği',
        revenueImpact: 1200,
        urgency: 'MEDIUM',
        subCause: 'Sisteme giriş sıklığında %60 düşüş tespit edildi. İptal ve çürüme riski.',
        strategy: 'Değer hatırlatıcı, Akıllı Nazik Hatırlatma (Baskısız).',
        draftMessage: "Selin Hanım, sistemdeki son raporunuzu incelediğimde 'Aylık Strateji Değerlendirmesi' hakkınızı henüz kullanmadığınızı fark ettim. Bu hafta 15 dakikalık bir kontrol görüşmesi ayarlayalım mı?",
        status: 'PENDING',
        priorityScore: 78,
        confidenceScore: 88,
        lastUpdated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        eventHistory: [
          { date: '01 Ocak 2026', type: 'lead_created', title: 'Abonelik Başlatıldı', description: 'Pro danışmanlık paketi 12 aylık taahhüt ile aktif edildi.' },
          { date: '15 Mart 2026', type: 'customer_engaged_again', title: 'Kullanım Zirvesi', description: 'Müşteri platform panellerini haftada ortalama 4 kez kullandı.' },
          { date: '10 Nisan 2026', type: 'customer_churn_risk', title: 'Aktivite Çürümesi', description: 'Platform oturumlarında %60 oranında sert bir düşüş tespit edildi.' },
          { date: '01 Mayıs 2026', type: 'customer_inactive', title: 'Etkileşimsiz Dönem', description: 'Son 30 gündür hiçbir panel hareketi veya danışmanlık görüşmesi kaydedilmedi.' },
          { date: '12 Mayıs 2026', type: 'recovery_triggered', title: 'Çürüme Uyarısı', description: 'Müşteri geri kazanımı için otomasyon tetiklendi.' }
        ]
      },
      {
        id: uuidv4(),
        category: 'COLD_RELATIONSHIP',
        clientName: 'Nexus Lojistik',
        contactPerson: 'Caner Öz (Operasyon Müdürü)',
        clientEmail: 'caner.oz@nexuslojistik.com',
        clientPhone: '+905557654321',
        context: 'Geçmiş Alışveriş (2025 Q1)',
        revenueImpact: 8500,
        urgency: 'LOW',
        subCause: 'Son başarılı projeden bu yana 7 aydır hiçbir iletişim kurulmadı. Churn riski.',
        strategy: 'İlişki odaklı, satış kokmayan güven tazelemesi.',
        draftMessage: "Caner Bey merhaba, uzun zamandır görüşemedik. Geçen yılki lojistik otomasyonu projenizin nasıl gittiğini merak ettim. Umarım her şey yolundadır, kahve içmeye bekleriz.",
        status: 'PENDING',
        priorityScore: 65,
        confidenceScore: 78,
        lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        eventHistory: [
          { date: '15 Eylül 2025', type: 'lead_created', title: 'İlk Sözleşme', description: 'Lojistik otomasyon projesi için el sıkışıldı.' },
          { date: '20 Ekim 2025', type: 'proposal_won', title: 'Proje Başarıyla Kapatıldı', description: 'Kurulumlar tamamlandı ve ciro tahsil edilerek proje kapatıldı.' },
          { date: '01 Kasım 2025', type: 'customer_engaged_again', title: 'Destek Talebi', description: 'Ufak bir optimizasyon talebi çözülerek teslim edildi.' },
          { date: '15 Kasım 2025', type: 'customer_inactive', title: 'İletişim Donması', description: 'Son işlemden bu yana firma ile hiçbir kanaldan diyalog kurulmadı.' },
          { date: '15 Mayıs 2026', type: 'recovery_triggered', title: 'Soğuk Hat Hatırlatması', description: 'İletişim boşluğunu kapatmak adına ilişki tazeleyici aksiyon tetiklendi.' }
        ]
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
  }
};

export const getRecords = async (): Promise<IntelligenceRecord[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveRecords = async (records: IntelligenceRecord[]): Promise<void> => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export interface RawCSVRow {
  Company?: string;
  Revenue?: string;
  LastContactDays?: string;
  Contact?: string;
  Project?: string;
  Email?: string;
  Phone?: string;
  'E-Posta'?: string;
  eposta?: string;
  Mail?: string;
  Telefon?: string;
  tel?: string;
  [key: string]: string | undefined;
}

export const addRecordsFromCSV = async (parsedData: RawCSVRow[]): Promise<void> => {
  const current = await getRecords();
  
  // Transform raw CSV data into Event-Driven IntelligenceRecords
  const newRecords: IntelligenceRecord[] = parsedData
    .filter(row => row.Company && row.Revenue) 
    .map(row => {
      const days = parseInt(row.LastContactDays || '') || 30;
      const revenue = parseInt(row.Revenue || '') || 0;
      
      let category: Category;
      let urgency: 'CRITICAL' | 'MEDIUM' | 'LOW';
      let subCause: string;
      let strategy: string;
      let draftMessage: string;
      const eventHistory: IntelligenceEvent[] = [];
      
      // Calculate dynamic priority score
      // High revenue + high days without contact = high priority
      const revenueFactor = Math.min(revenue / 100, 50); // max 50 points from ciro
      const daysFactor = Math.min(days / 6, 50); // max 50 points from waiting time
      const priorityScore = Math.round(revenueFactor + daysFactor);

      if (days > 180) {
        category = 'COLD_RELATIONSHIP';
        urgency = 'LOW';
        subCause = 'Son başarılı projeden bu yana uzun süredir hiçbir diyalog kurulmadı. Unutulma ve rakibe kayma riski.';
        strategy = 'İlişki odaklı, satış kokmayan samimi güven tazelemesi.';
        draftMessage = `${row.Contact || 'Merhaba'}, uzun zamandır görüşemedik. ${row.Project || 'Son projenizin'} nasıl gittiğini merak ettim. Umarım her şey harika gidiyordur, kahve içmeye bekleriz.`;
        
        eventHistory.push(
          { date: '10 Ay Önce', type: 'lead_created', title: 'İlk Müşteri Tanımı', description: 'Müşteri kaydı veritabanında oluşturuldu.' },
          { date: '8 Ay Önce', type: 'proposal_won', title: 'Fırsat Kazanıldı', description: 'İlgili proje bütçesiyle başarıyla tamamlandı.' },
          { date: '6 Ay Önce', type: 'customer_inactive', title: 'İletişim Boşluğu', description: 'Destek veya satış kanallarında 6 aydır sıfır hareket.' },
          { date: 'Bugün', type: 'recovery_triggered', title: 'Teşhis Tetiklendi', description: 'Sessiz müşteri kaybını önlemek üzere kurtarma radarına alındı.' }
        );
      } else if (days < 60 && revenue > 3000) {
        category = 'ABANDONED_OPPORTUNITY';
        urgency = 'CRITICAL';
        subCause = 'Yüksek cirolu teklif sunulmuş ancak takip aranması kaçırıldığı için beklemede kalmış.';
        strategy = 'Zaman duyarlı takip araması. Karar engelini çözücü net teklif.';
        draftMessage = `${row.Contact || 'Merhaba'}, projemizle ilgili önceliklerin değişip değişmediğini kontrol etmek istedim. Teklif veya bütçe detaylarında aklınıza takılan bir nokta varsa hızlıca netleştirebiliriz.`;
        
        eventHistory.push(
          { date: '25 Gün Önce', type: 'lead_created', title: 'Talep Alındı', description: 'Web formundan teklif talebi kaydedildi.' },
          { date: '20 Gün Önce', type: 'lead_qualified', title: 'Aday Nitelendirildi', description: 'Gereksinim analizi tamamlanarak bütçe onaylandı.' },
          { date: '15 Gün Önce', type: 'proposal_sent', title: 'Teklif İletildi', description: 'Resmi teklif dokümanı paylaşıldı.' },
          { date: '12 Gün Önce', type: 'proposal_viewed', title: 'Müşteri İnceledi', description: 'Müşteri teklif dosyasını görüntüledi ancak yanıt dönmedi.' },
          { date: '5 Gün Önce', type: 'proposal_followup_missed', title: 'Takip Araması Unutuldu', description: 'Teklif takip araması takvimde gecikti (Gelir Kaçağı!).' },
          { date: 'Bugün', type: 'recovery_triggered', title: 'Takip Kurtarma Tetiklendi', description: 'Kurtarma motoru acil AI takibi önerdi.' }
        );
      } else {
        category = 'SUBSCRIPTION_DECAY';
        urgency = 'MEDIUM';
        subCause = 'Son 30 günde platform kullanım sıklığında veya abonelik etkileşiminde çürüme saptandı.';
        strategy = 'Fayda hatırlatıcı nazik temas. Ekstra destek teklifi.';
        draftMessage = `${row.Contact || 'Merhaba'}, sistem verilerinizi incelediğimizde bazı üyelik avantajlarınızı henüz kullanmadığınızı fark ettik. Bu hafta kısa bir görüşme ayarlayalım mı?`;
        
        eventHistory.push(
          { date: '60 Gün Önce', type: 'lead_created', title: 'Hizmet Başladı', description: 'Abonelik paketi sorunsuz aktif edildi.' },
          { date: '45 Gün Önce', type: 'customer_engaged_again', title: 'Etkin Kullanım', description: 'Müşteri platformda ilk projelerini oluşturdu.' },
          { date: '30 Gün Önce', type: 'customer_churn_risk', title: 'Etkileşim Kaybı', description: 'Sisteme giriş sıklığı %40 oranında azaldı.' },
          { date: 'Bugün', type: 'recovery_triggered', title: 'İptal Önleme Tetiklendi', description: 'Çürüme eylemini durdurmak için geri kazanım aksiyonu başlatıldı.' }
        );
      }

      const email = row.Email || row['E-Posta'] || row.eposta || row.Mail || '';
      const phone = row.Phone || row.Telefon || row.tel || '';
      const confidenceScore = Math.min(Math.round(80 + (revenue % 17)), 98);

      return {
        id: uuidv4(),
        category,
        clientName: row.Company || 'Bilinmeyen Firma',
        contactPerson: row.Contact || 'Bilinmiyor',
        clientEmail: email,
        clientPhone: phone,
        context: row.Project || 'Genel Değerlendirme',
        revenueImpact: revenue,
        urgency,
        subCause,
        strategy,
        draftMessage,
        status: 'PENDING',
        priorityScore,
        confidenceScore,
        lastUpdated: new Date().toISOString(),
        eventHistory
      };
    });

  await saveRecords([...newRecords, ...current]);
};

export const updateRecord = async (id: string, updates: Partial<IntelligenceRecord>): Promise<void> => {
  const current = await getRecords();
  const updated = current.map(r => {
    if (r.id === id) {
      const updatedRecord = { ...r, ...updates };
      // If action is logged, append 'recovery_action_taken' event
      if (updates.status === 'ACTION_TAKEN' && updates.actionType) {
        updatedRecord.eventHistory = [
          ...r.eventHistory,
          {
            date: 'Bugün',
            type: 'recovery_action_taken',
            title: 'Kurtarma Başlatıldı',
            description: `AI Mesaj Şablonu '${updates.actionType}' kanalı ile gönderildi.`
          }
        ];
      }
      // If loop is closed, append corresponding event
      if (updates.status === 'CLOSED' && updates.outcome) {
        let eventType = 'recovery_action_failed';
        let eventTitle = 'Döngü Kapatıldı';
        let outcomeLabel = 'Sonuçlandırıldı';

        if (updates.outcome === 'recovered') {
          eventType = 'recovery_completed';
          eventTitle = 'Gelir Kurtarıldı!';
          outcomeLabel = 'Kurtarıldı (Gelir Geri Kazanıldı)';
        } else if (updates.outcome === 'replied') {
          eventType = 'customer_replied';
          eventTitle = 'Yanıt Alındı';
          outcomeLabel = 'Yanıt Alındı (İletişim Aktif)';
        } else if (updates.outcome === 'reopened') {
          eventType = 'deal_reopened';
          eventTitle = 'Fırsat Yeniden Açıldı';
          outcomeLabel = 'Yeniden Açıldı (Süreç Baştan Başladı)';
        } else if (updates.outcome === 'no_response') {
          eventType = 'no_response';
          eventTitle = 'Yanıt Yok';
          outcomeLabel = 'Cevap Alınamadı';
        } else if (updates.outcome === 'churned') {
          eventType = 'customer_churned';
          eventTitle = 'Kayıp (Churn)';
          outcomeLabel = 'Müşteri Kaybedildi / Churn';
        }

        updatedRecord.eventHistory = [
          ...updatedRecord.eventHistory,
          {
            date: 'Bugün',
            type: eventType,
            title: eventTitle,
            description: `Döngü Sonlandırıldı. Sonuç: ${outcomeLabel}`
          }
        ];
      }
      return updatedRecord;
    }
    return r;
  });
  await saveRecords(updated);
};

export const clearRecords = async (): Promise<void> => {
  localStorage.removeItem(STORAGE_KEY);
  initializeDB(); 
};

// --- Lead Capture Storage Engine ---
export const getLeadCaptures = async (): Promise<LeadCaptureRecord[]> => {
  const data = localStorage.getItem(LEAD_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLeadCapture = async (email: string, estimatedLoss: number, companyCount: number): Promise<void> => {
  const captures = await getLeadCaptures();
  const newCapture: LeadCaptureRecord = {
    id: uuidv4(),
    email,
    capturedAt: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    companyCount,
    estimatedLoss
  };
  localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify([newCapture, ...captures]));
};
