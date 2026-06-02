const fs = require('fs');

const code = `import { v4 as uuidv4 } from 'uuid';
import { db } from './firebase';
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export type Category = 'ABANDONED_OPPORTUNITY' | 'SUBSCRIPTION_DECAY' | 'COLD_RELATIONSHIP';
export type WorkflowStatus = 'PENDING' | 'ACTION_TAKEN' | 'CLOSED';
export type ActionType = 'Email Sent' | 'Phone Call' | 'WhatsApp / SMS' | 'Social Network / LinkedIn';
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
  eventHistory: IntelligenceEvent[];
  priorityScore: number;
  confidenceScore: number;
  lastUpdated: string;
}

export interface LeadCaptureRecord {
  id: string;
  email: string;
  capturedAt: string;
  companyCount: number;
  estimatedLoss: number;
}

// Since Firestore is schemaless, we don't strictly need initializeDB to seed data, 
// but we will keep it for demo purpose if the db is empty.
export const initializeDB = async () => {
  const records = await getRecords();
  if (records.length === 0) {
    const MOCK_DATA: IntelligenceRecord[] = [
      {
        id: uuidv4(),
        category: 'ABANDONED_OPPORTUNITY',
        clientName: 'TechCorp Inc.',
        contactPerson: 'John Smith (CEO)',
        clientEmail: 'ahmet.yilmaz@techcorp.com.tr',
        clientPhone: '+905321234567',
        context: 'E-Commerce Infrastructure Renewal',
        revenueImpact: 4500,
        urgency: 'CRITICAL',
        subCause: 'Follow-up missed after proposal due to price hesitation or decision delay.',
        strategy: 'Time-sensitive, quick follow-up. Friction-removing and clear.',
        draftMessage: "Hi John, I wanted to check if priorities have changed regarding our E-Commerce infrastructure project. If you have any questions about the draft or budget, we can quickly clarify them.",
        status: 'PENDING',
        priorityScore: 92,
        confidenceScore: 95,
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        eventHistory: [
          { date: 'April 10, 2026', type: 'lead_created', title: 'Lead Created', description: 'Request for e-commerce infrastructure created via website.' },
          { date: 'April 12, 2026', type: 'lead_contacted', title: 'First Contact Established', description: 'Requirement details discussed with John Smith.' },
          { date: 'April 15, 2026', type: 'proposal_sent', title: 'Proposal Sent', description: 'Official proposal including annual license and infrastructure fee was sent.' },
          { date: 'April 16, 2026', type: 'proposal_viewed', title: 'Proposal Viewed', description: 'It was detected that the prospect opened and read the proposal file 3 times.' },
          { date: 'April 30, 2026', type: 'proposal_followup_missed', title: 'Follow-up Call Missed', description: 'The 14th day follow-up meeting after the proposal was not planned (Revenue Leak!).' },
          { date: 'May 05, 2026', type: 'recovery_triggered', title: 'Recovery Triggered', description: 'Emergency recovery process initiated by event-driven engine.' }
        ]
      },
      {
        id: uuidv4(),
        category: 'SUBSCRIPTION_DECAY',
        clientName: 'Lumina Architecture',
        contactPerson: 'Jane Doe (Founder)',
        clientEmail: 'selin@luminamimarlik.com',
        clientPhone: '+905449876543',
        context: 'Pro Consulting Membership',
        revenueImpact: 1200,
        urgency: 'MEDIUM',
        subCause: 'A 60% drop in login frequency detected. Risk of cancellation and decay.',
        strategy: 'Value reminder, Smart Gentle Reminder (No Pressure).',
        draftMessage: "Jane, I noticed when reviewing your last report in the system that you haven't used your 'Monthly Strategy Assessment' right yet. Shall we set up a 15-minute check-in call this week?",
        status: 'PENDING',
        priorityScore: 78,
        confidenceScore: 88,
        lastUpdated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        eventHistory: [
          { date: 'January 01, 2026', type: 'lead_created', title: 'Subscription Started', description: 'Pro consulting package activated with 12-month commitment.' },
          { date: 'March 15, 2026', type: 'customer_engaged_again', title: 'Peak Usage', description: 'Customer used platform panels on average 4 times a week.' },
          { date: 'April 10, 2026', type: 'customer_churn_risk', title: 'Activity Decay', description: 'A sharp 60% drop in platform sessions detected.' },
          { date: 'May 01, 2026', type: 'customer_inactive', title: 'Inactive Period', description: 'No panel movement or consulting meeting recorded in the last 30 days.' },
          { date: 'May 12, 2026', type: 'recovery_triggered', title: 'Decay Warning', description: 'Automation triggered for customer recovery.' }
        ]
      },
      {
        id: uuidv4(),
        category: 'COLD_RELATIONSHIP',
        clientName: 'Nexus Logistics',
        contactPerson: 'Mike Johnson (Operations Manager)',
        clientEmail: 'caner.oz@nexuslojistik.com',
        clientPhone: '+905557654321',
        context: 'Past Purchase (2025 Q1)',
        revenueImpact: 8500,
        urgency: 'LOW',
        subCause: 'No communication established for 7 months since the last successful project. Churn risk.',
        strategy: 'Relationship-focused, non-salesy trust renewal.',
        draftMessage: "Hi Mike, long time no see. I wondered how your logistics automation project from last year was going. Hope everything is alright, let's grab coffee sometime.",
        status: 'PENDING',
        priorityScore: 65,
        confidenceScore: 78,
        lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        eventHistory: [
          { date: 'September 15, 2025', type: 'lead_created', title: 'First Contract', description: 'Shook hands for the logistics automation project.' },
          { date: 'October 20, 2025', type: 'proposal_won', title: 'Project Closed Successfully', description: 'Installations completed and project closed after revenue collected.' },
          { date: 'November 01, 2025', type: 'customer_engaged_again', title: 'Support Request', description: 'A minor optimization request was solved and delivered.' },
          { date: 'November 15, 2025', type: 'customer_inactive', title: 'Communication Freeze', description: 'No dialogue established with the company through any channel since the last transaction.' },
          { date: 'May 15, 2026', type: 'recovery_triggered', title: 'Cold Line Reminder', description: 'Relationship refreshing action triggered to close the communication gap.' }
        ]
      }
    ];
    await saveRecords(MOCK_DATA);
  }
};

export const getRecords = async (): Promise<IntelligenceRecord[]> => {
  try {
    const q = query(collection(db, "records"), orderBy("lastUpdated", "desc"));
    const querySnapshot = await getDocs(q);
    const records: IntelligenceRecord[] = [];
    querySnapshot.forEach((doc) => {
      records.push(doc.data() as IntelligenceRecord);
    });
    return records;
  } catch (e) {
    console.error("Error getting documents: ", e);
    // Fallback to localstorage if db fails
    const data = localStorage.getItem('rrio_revenue_records');
    return data ? JSON.parse(data) : [];
  }
};

export const saveRecords = async (records: IntelligenceRecord[]): Promise<void> => {
  try {
    for (const record of records) {
      await setDoc(doc(db, "records", record.id), record);
    }
  } catch (e) {
    console.error("Error saving documents: ", e);
    localStorage.setItem('rrio_revenue_records', JSON.stringify(records));
  }
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

export type PlanType = 'FREE' | 'PRO' | 'AGENCY';

export const getUserPlan = (): PlanType => {
  return (localStorage.getItem('rrio_user_plan') as PlanType) || 'FREE';
};

export const setUserPlan = (plan: PlanType) => {
  localStorage.setItem('rrio_user_plan', plan);
};

export const addRecordsFromCSV = async (parsedData: RawCSVRow[]): Promise<{ recordsSaved: number; limitHit: boolean }> => {
  const current = await getRecords();
  const userPlan = getUserPlan();
  
  let dataToProcess = parsedData.filter(row => row.Company && row.Revenue);
  let limitHit = false;

  if (userPlan === 'FREE') {
    const freeLimit = parseInt(localStorage.getItem('rrio_free_limit') ?? '15', 10);
    if (dataToProcess.length > freeLimit) {
      dataToProcess = dataToProcess.slice(0, freeLimit);
      limitHit = true;
    }
  }

  const newRecords: IntelligenceRecord[] = dataToProcess.map(row => {
      const days = parseInt(row.LastContactDays || '') || 30;
      const revenue = parseInt(row.Revenue || '') || 0;
      
      let category: Category;
      let urgency: 'CRITICAL' | 'MEDIUM' | 'LOW';
      let subCause: string;
      let strategy: string;
      let draftMessage: string;
      const eventHistory: IntelligenceEvent[] = [];
      
      const revenueFactor = Math.min(revenue / 100, 50);
      const daysFactor = Math.min(days / 6, 50);
      const priorityScore = Math.round(revenueFactor + daysFactor);

      if (days > 180) {
        category = 'COLD_RELATIONSHIP';
        urgency = 'LOW';
        subCause = 'No dialogue established for a long time since the last successful project. Risk of being forgotten and shifting to competitor.';
        strategy = 'Relationship-focused, non-salesy sincere trust renewal.';
        draftMessage = \`\${row.Contact || 'Hello'}, long time no see. I wondered how Your last project's how it went. Hope everything is going great, let's grab coffee.\`;
        
        eventHistory.push(
          { date: '10 Months Ago', type: 'lead_created', title: 'First Customer Definition', description: 'Customer record created in the database.' },
          { date: '8 Months Ago', type: 'proposal_won', title: 'Opportunity Won', description: 'Related project successfully completed with its budget.' },
          { date: '6 Months Ago', type: 'customer_inactive', title: 'Communication Gap', description: 'Zero movement in support or sales channels for 6 months.' },
          { date: 'Today', type: 'recovery_triggered', title: 'Diagnosis Triggered', description: 'Taken into recovery radar to prevent silent customer loss.' }
        );
      } else if (days < 60 && revenue > 3000) {
        category = 'ABANDONED_OPPORTUNITY';
        urgency = 'CRITICAL';
        subCause = 'High-revenue proposal presented but left pending because follow-up call was missed.';
        strategy = 'Time-sensitive follow-up call. Clear proposal to resolve decision obstacle.';
        draftMessage = \`\${row.Contact || 'Hello'}, I wanted to check if priorities have changed regarding our project. If you have any questions about proposal or budget details, we can quickly clarify them.\`;
        
        eventHistory.push(
          { date: '25 Days Ago', type: 'lead_created', title: 'Request Received', description: 'Proposal request from web form recorded.' },
          { date: '20 Days Ago', type: 'lead_qualified', title: 'Lead Qualified', description: 'Requirement analysis completed and budget approved.' },
          { date: '15 Days Ago', type: 'proposal_sent', title: 'Proposal Forwarded', description: 'Official proposal document shared.' },
          { date: '12 Days Ago', type: 'proposal_viewed', title: 'Customer Reviewed', description: 'Customer viewed the proposal file but didn\\'t respond.' },
          { date: '5 Days Ago', type: 'proposal_followup_missed', title: 'Follow-up Call Forgotten', description: 'Proposal follow-up call delayed in calendar (Revenue Leak!).' },
          { date: 'Today', type: 'recovery_triggered', title: 'Follow-up Recovery Triggered', description: 'Recovery engine suggested urgent AI follow-up.' }
        );
      } else {
        category = 'SUBSCRIPTION_DECAY';
        urgency = 'MEDIUM';
        subCause = 'Decay detected in platform usage frequency or subscription engagement in the last 30 days.';
        strategy = 'Benefit-reminding gentle contact. Extra support offer.';
        draftMessage = \`\${row.Contact || 'Hello'}, we noticed when reviewing your system data that you haven\\'t used some of your membership benefits yet. Shall we set up a short meeting this week?\`;
        
        eventHistory.push(
          { date: '60 Days Ago', type: 'lead_created', title: 'Service Started', description: 'Subscription package activated without issues.' },
          { date: '45 Days Ago', type: 'customer_engaged_again', title: 'Active Usage', description: 'Customer created their first projects on the platform.' },
          { date: '30 Days Ago', type: 'customer_churn_risk', title: 'Engagement Loss', description: 'System login frequency decreased by 40%.' },
          { date: 'Today', type: 'recovery_triggered', title: 'Cancellation Prevention Triggered', description: 'Recovery action started to stop the decay process.' }
        );
      }

      const email = row.Email || row['E-Posta'] || row.eposta || row.Mail || '';
      const phone = row.Phone || row.Telefon || row.tel || '';
      const confidenceScore = Math.min(Math.round(80 + (revenue % 17)), 98);

      return {
        id: uuidv4(),
        category,
        clientName: row.Company || 'Unknown Company',
        contactPerson: row.Contact || 'Unknown',
        clientEmail: email,
        clientPhone: phone,
        context: row.Project || 'General Assessment',
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

  await saveRecords([...newRecords]);
  return { recordsSaved: newRecords.length, limitHit };
};

export const updateRecord = async (id: string, updates: Partial<IntelligenceRecord>): Promise<void> => {
  try {
    const current = await getRecords();
    const record = current.find(r => r.id === id);
    if (!record) return;

    const updatedRecord = { ...record, ...updates };
    
    if (updates.status === 'ACTION_TAKEN' && updates.actionType) {
      updatedRecord.eventHistory = [
        ...record.eventHistory,
        {
          date: 'Today',
          type: 'recovery_action_taken',
          title: 'Recovery Started',
          description: \`AI Message Template sent via \${updates.actionType} channel.\`
        }
      ];
    }
    if (updates.status === 'CLOSED' && updates.outcome) {
      let eventType = 'recovery_action_failed';
      let eventTitle = 'Loop Closed';
      let outcomeLabel = 'Concluded';

      if (updates.outcome === 'recovered') {
        eventType = 'recovery_completed';
        eventTitle = 'Revenue Recovered!';
        outcomeLabel = 'Recovered (Revenue Gained Back)';
      } else if (updates.outcome === 'replied') {
        eventType = 'customer_replied';
        eventTitle = 'Replied';
        outcomeLabel = 'Replied (Communication Active)';
      } else if (updates.outcome === 'reopened') {
        eventType = 'deal_reopened';
        eventTitle = 'Opportunity Reopened';
        outcomeLabel = 'Reopened (Process Restarted)';
      } else if (updates.outcome === 'no_response') {
        eventType = 'no_response';
        eventTitle = 'No Response';
        outcomeLabel = 'No Answer Received';
      } else if (updates.outcome === 'churned') {
        eventType = 'customer_churned';
        eventTitle = 'Lost (Churn)';
        outcomeLabel = 'Customer Lost / Churn';
      }

      updatedRecord.eventHistory = [
        ...updatedRecord.eventHistory,
        {
          date: 'Today',
          type: eventType,
          title: eventTitle,
          description: \`Loop Concluded. Result: \${outcomeLabel}\`
        }
      ];
    }
    
    await updateDoc(doc(db, "records", id), updatedRecord);
  } catch (e) {
    console.error("Error updating document: ", e);
  }
};

export const clearRecords = async (): Promise<void> => {
  try {
    const records = await getRecords();
    for (const record of records) {
      await deleteDoc(doc(db, "records", record.id));
    }
  } catch (e) {
    console.error("Error clearing records: ", e);
  }
  await initializeDB(); 
};

// --- Lead Capture Storage Engine ---
export const getLeadCaptures = async (): Promise<LeadCaptureRecord[]> => {
  try {
    const q = query(collection(db, "leads"));
    const querySnapshot = await getDocs(q);
    const leads: LeadCaptureRecord[] = [];
    querySnapshot.forEach((doc) => {
      leads.push(doc.data() as LeadCaptureRecord);
    });
    return leads;
  } catch (e) {
    console.error("Error getting leads: ", e);
    const data = localStorage.getItem('rrio_lead_captures');
    return data ? JSON.parse(data) : [];
  }
};

export const saveLeadCapture = async (email: string, estimatedLoss: number, companyCount: number): Promise<void> => {
  const newCapture: LeadCaptureRecord = {
    id: uuidv4(),
    email,
    capturedAt: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    companyCount,
    estimatedLoss
  };
  try {
    await setDoc(doc(db, "leads", newCapture.id), newCapture);
  } catch (e) {
    console.error("Error saving lead: ", e);
    const captures = await getLeadCaptures();
    localStorage.setItem('rrio_lead_captures', JSON.stringify([newCapture, ...captures]));
  }
};

export const saveFeedback = async (feedbackData: any) => {
  const fb = {
    ...feedbackData,
    id: uuidv4(),
    timestamp: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
  try {
    await setDoc(doc(db, "feedbacks", fb.id), fb);
  } catch (e) {
    console.error("Error saving feedback: ", e);
    const raw = localStorage.getItem('rrio_feedback_responses');
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(fb);
    localStorage.setItem('rrio_feedback_responses', JSON.stringify(list));
  }
};

export const getFeedbacks = async (): Promise<any[]> => {
  try {
    const q = query(collection(db, "feedbacks"));
    const querySnapshot = await getDocs(q);
    const feedbacks: any[] = [];
    querySnapshot.forEach((doc) => {
      feedbacks.push(doc.data());
    });
    return feedbacks;
  } catch (e) {
    console.error("Error getting feedbacks: ", e);
    const raw = localStorage.getItem('rrio_feedback_responses');
    return raw ? JSON.parse(raw) : [];
  }
};

export const clearFeedbacks = async (): Promise<void> => {
  try {
    const feedbacks = await getFeedbacks();
    for (const fb of feedbacks) {
      if (fb.id) await deleteDoc(doc(db, "feedbacks", fb.id));
    }
  } catch (e) {
    console.error("Error clearing feedbacks: ", e);
    localStorage.removeItem('rrio_feedback_responses');
  }
};
`;

fs.writeFileSync('C:/Users/LENOVADEM/Documents/Antigravinity/Creaizen/revenue-recovery/src/lib/db.ts', code, 'utf8');
console.log('db.ts updated successfully.');
