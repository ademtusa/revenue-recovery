import { v4 as uuidv4 } from 'uuid';

export type Category = 'ABANDONED_OPPORTUNITY' | 'SUBSCRIPTION_DECAY' | 'COLD_RELATIONSHIP';
export type WorkflowStatus = 'PENDING' | 'ACTION_TAKEN' | 'CLOSED';
export type ActionType = 'E-Posta Gönderildi' | 'Telefonla Arandı' | 'WhatsApp / SMS' | 'Sosyal Ağ / LinkedIn';
export type OutcomeType = 'Kurtarıldı / Kazanıldı' | 'İlişki Tazelendi (Onore Edildi)' | 'Ulaşılamadı / Cevap Yok' | 'Reddedildi / Kaybedildi';

export interface IntelligenceRecord {
  id: string;
  category: Category;
  clientName: string;
  contactPerson: string;
  context: string; 
  revenueImpact: number;
  urgency: 'CRITICAL' | 'MEDIUM' | 'LOW';
  subCause: string;
  strategy: string;
  draftMessage: string;
  status: WorkflowStatus;
  actionType?: ActionType;
  outcome?: OutcomeType;
}

const STORAGE_KEY = 'creaizen_revenue_records';

// Initialize with mock data if empty
export const initializeDB = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const MOCK_DATA: IntelligenceRecord[] = [
      {
        id: uuidv4(),
        category: 'ABANDONED_OPPORTUNITY',
        clientName: 'TechCorp A.Ş.',
        contactPerson: 'Ahmet Yılmaz (CEO)',
        context: 'E-Ticaret Altyapı Yenilemesi',
        revenueImpact: 4500,
        urgency: 'CRITICAL',
        subCause: 'Fiyat tereddüdü veya karar erteleme sebebiyle teklif sonrası iletişim kesildi.',
        strategy: 'Zaman odaklı, hızlı takip. Pürüz giderici ve net.',
        draftMessage: "Ahmet Bey merhaba, E-Ticaret altyapısı projemizle ilgili önceliklerin değişip değişmediğini kontrol etmek istedim. Taslak veya bütçe konusunda aklınıza takılan bir nokta varsa hızlıca netleştirebiliriz.",
        status: 'PENDING'
      },
      {
        id: uuidv4(),
        category: 'SUBSCRIPTION_DECAY',
        clientName: 'Lumina Mimarlık',
        contactPerson: 'Selin Kaya (Kurucu)',
        context: 'Pro Danışmanlık Üyeliği',
        revenueImpact: 1200,
        urgency: 'MEDIUM',
        subCause: 'Sisteme giriş sıklığında %60 düşüş tespit edildi. İptal riski.',
        strategy: 'Değer hatırlatıcı, Akıllı Nazik Hatırlatma (Baskısız).',
        draftMessage: "Selin Hanım, sistemdeki son raporunuzu incelediğimde 'Aylık Strateji Değerlendirmesi' hakkınızı henüz kullanmadığınızı fark ettim. Bu hafta 15 dakikalık bir kontrol görüşmesi ayarlayalım mı?",
        status: 'PENDING'
      },
      {
        id: uuidv4(),
        category: 'COLD_RELATIONSHIP',
        clientName: 'Nexus Lojistik',
        contactPerson: 'Caner Öz (Operasyon Müdürü)',
        context: 'Geçmiş Alışveriş (2025 Q1)',
        revenueImpact: 8500,
        urgency: 'LOW',
        subCause: 'Son başarılı projeden bu yana 7 aydır iletişim kurulmadı. Rakibe kayma riski.',
        strategy: 'İlişki odaklı, satış kokmayan güven tazelemesi.',
        draftMessage: "Caner Bey merhaba, uzun zamandır görüşemedik. Geçen yılki lojistik otomasyonu projenizin nasıl gittiğini merak ettim. Umarım her şey yolundadır, kahve içmeye bekleriz.",
        status: 'PENDING'
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
  }
};

export const getRecords = async (): Promise<IntelligenceRecord[]> => {
  // Simulate network delay to mimic real DB
  await new Promise(resolve => setTimeout(resolve, 500));
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveRecords = async (records: IntelligenceRecord[]): Promise<void> => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const addRecordsFromCSV = async (parsedData: any[]): Promise<void> => {
  const current = await getRecords();
  
  // Transform raw CSV data into IntelligenceRecords
  // Expected CSV columns: Company, Contact, Project, Revenue, LastContactDays
  const newRecords: IntelligenceRecord[] = parsedData
    .filter(row => row.Company && row.Revenue) // Skip empty rows
    .map(row => {
      const days = parseInt(row.LastContactDays) || 30;
      const revenue = parseInt(row.Revenue) || 0;
      
      // Basic rules-based AI engine
      let category: Category = 'COLD_RELATIONSHIP';
      let urgency: 'CRITICAL' | 'MEDIUM' | 'LOW' = 'LOW';
      let subCause = '';
      let strategy = '';
      let draftMessage = '';

      if (days > 180) {
        category = 'COLD_RELATIONSHIP';
        urgency = 'LOW';
        subCause = 'Son projeden bu yana uzun süredir iletişim yok. Rakibe kayma riski.';
        strategy = 'İlişki odaklı, satış kokmayan güven tazelemesi.';
        draftMessage = `${row.Contact || 'Merhaba'}, uzun zamandır görüşemedik. ${row.Project || 'Son projenizin'} nasıl gittiğini merak ettim. Kahve içmeye bekleriz.`;
      } else if (days < 60 && revenue > 3000) {
        category = 'ABANDONED_OPPORTUNITY';
        urgency = 'CRITICAL';
        subCause = 'Yüksek değerli fırsat beklemede. Fiyat veya karar erteleme riski.';
        strategy = 'Zaman odaklı, hızlı takip. Pürüz giderici ve net.';
        draftMessage = `${row.Contact || 'Merhaba'}, projemizle ilgili önceliklerin değişip değişmediğini kontrol etmek istedim. Aklınıza takılan bir nokta varsa netleştirebiliriz.`;
      } else {
        category = 'SUBSCRIPTION_DECAY';
        urgency = 'MEDIUM';
        subCause = 'Etkileşim eksikliği tespit edildi. Kayıp riski artıyor.';
        strategy = 'Değer hatırlatıcı nazik temas.';
        draftMessage = `${row.Contact || 'Merhaba'}, sistem verilerinizi incelediğimizde bazı avantajları henüz kullanmadığınızı fark ettik. Kısa bir görüşme ayarlayalım mı?`;
      }

      return {
        id: uuidv4(),
        category,
        clientName: row.Company,
        contactPerson: row.Contact || 'Bilinmiyor',
        context: row.Project || 'Genel Değerlendirme',
        revenueImpact: revenue,
        urgency,
        subCause,
        strategy,
        draftMessage,
        status: 'PENDING'
      };
    });

  // Add new records to top of list
  await saveRecords([...newRecords, ...current]);
};

export const updateRecord = async (id: string, updates: Partial<IntelligenceRecord>): Promise<void> => {
  const current = await getRecords();
  const updated = current.map(r => r.id === id ? { ...r, ...updates } : r);
  await saveRecords(updated);
};

export const clearRecords = async (): Promise<void> => {
  localStorage.removeItem(STORAGE_KEY);
  initializeDB(); // Reset to mock defaults for demo
};
