import { useEffect, useState } from 'react';
import { getLeadCaptures } from '../../lib/db';
import type { LeadCaptureRecord } from '../../lib/db';

function formatUSD(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0 });
}

export function AdminLeads() {
  const [leads, setLeads]   = useState<LeadCaptureRecord[]>([]);
  const [notes, setNotes]   = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getLeadCaptures();
      setLeads(data);

      // Load existing notes
      const loaded: Record<string, string> = {};
      data.forEach((l) => {
        const n = localStorage.getItem(`rrio_lead_notes:${l.id}`);
        if (n) loaded[l.id] = n;
      });
      setNotes(loaded);
      setLoading(false);
    })();
  }, []);

  const handleSaveNote = (id: string) => {
    localStorage.setItem(`rrio_lead_notes:${id}`, draftNote);
    setNotes((prev) => ({ ...prev, [id]: draftNote }));
    setEditing(null);
    setDraftNote('');
  };

  const handleStartEdit = (id: string) => {
    setEditing(id);
    setDraftNote(notes[id] ?? '');
  };

  const handleDownloadCSV = () => {
    const header = 'Email,Capture Date,Estimated Loss ($),Company Count,Note';
    const rows = leads.map((l) => {
      const note = notes[l.id] ?? '';
      return [
        l.email,
        l.capturedAt,
        l.estimatedLoss,
        l.companyCount,
        `"${note.replace(/"/g, '""')}"`,
      ].join(',');
    });
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'rrio_leads.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{ color: 'var(--text-faint)', padding: '2rem', textAlign: 'center' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Lead List
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
            Total {leads.length} lead records
          </p>
        </div>
        <button className="btn btn-glow-blue" onClick={handleDownloadCSV} style={{ minHeight: '40px', padding: '0.5rem 1.125rem', fontSize: '0.75rem' }}>
          ⬇ Download as CSV
        </button>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflow: 'auto' }}>
        {leads.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-faint)', fontSize: '0.875rem', lineHeight: 1.7 }}>
            No leads captured yet.
            <br />
            Collected via PDF download or CSV upload.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Email', 'Capture Date', 'Estimated Loss', 'Company Count', 'Note / Status'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '0.875rem 1rem',
                      textAlign: 'left',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--text-faint)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <>
                  <tr
                    key={lead.id}
                    style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--text-main)', fontWeight: 500 }}>
                      {lead.email}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)' }}>
                      {lead.capturedAt}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--status-warning)', fontWeight: 700 }}>
                      {formatUSD(lead.estimatedLoss)}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)' }}>
                      {lead.companyCount}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      {editing === lead.id ? null : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {notes[lead.id] && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {notes[lead.id]}
                            </span>
                          )}
                          <button
                            className="btn btn-outline"
                            onClick={() => handleStartEdit(lead.id)}
                            style={{ padding: '0.3rem 0.75rem', minHeight: '32px', fontSize: '0.7rem' }}
                          >
                            Add Note
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  {editing === lead.id && (
                    <tr key={`${lead.id}-edit`}>
                      <td colSpan={5} style={{ padding: '0.5rem 1rem 1rem', background: 'rgba(13,211,255,0.03)' }}>
                        <textarea
                          className="form-textarea"
                          value={draftNote}
                          onChange={(e) => setDraftNote(e.target.value)}
                          placeholder="Write note..."
                          style={{ minHeight: '72px', marginBottom: '0.5rem' }}
                          autoFocus
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-glow-blue" onClick={() => handleSaveNote(lead.id)} style={{ minHeight: '36px', padding: '0.375rem 1rem', fontSize: '0.75rem' }}>
                            Save
                          </button>
                          <button className="btn btn-outline" onClick={() => setEditing(null)} style={{ minHeight: '36px', padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
