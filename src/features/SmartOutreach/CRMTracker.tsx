import React, { useState, useEffect } from 'react';
import { Download, Plus, Search, Trash2, Edit2, Calendar, MessageSquare, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Prospect {
  id: string;
  name: string;
  role: string;
  company: string;
  status: 'Identified' | 'Messaged' | 'Replied' | 'Meeting Booked' | 'Closed' | 'Not Interested';
  lastMessageDate: string;
  nextFollowUpDate: string;
  notes: string;
  dateAdded: string;
}

export function CRMTracker() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const emptyForm: Omit<Prospect, 'id' | 'dateAdded'> = {
    name: '', role: '', company: '', status: 'Identified',
    lastMessageDate: '', nextFollowUpDate: '', notes: ''
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const saved = localStorage.getItem('somyra_crm_prospects');
    if (saved) {
      try {
         setProspects(JSON.parse(saved));
      } catch(e) {}
    }
  }, []);

  const saveToStorage = (data: Prospect[]) => {
    setProspects(data);
    localStorage.setItem('somyra_crm_prospects', JSON.stringify(data));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = prospects.map(p => p.id === editingId ? { ...form, id: editingId, dateAdded: p.dateAdded } : p);
      saveToStorage(updated);
      setEditingId(null);
    } else {
      const newProspect: Prospect = {
        ...form,
        id: Math.random().toString(36).substring(7),
        dateAdded: new Date().toISOString()
      };
      saveToStorage([newProspect, ...prospects]);
    }
    setForm(emptyForm);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    saveToStorage(prospects.filter(p => p.id !== id));
    setDeleteConfirmId(null);
  };

  const startEdit = (p: Prospect) => {
    setForm({
      name: p.name, role: p.role, company: p.company, status: p.status,
      lastMessageDate: p.lastMessageDate, nextFollowUpDate: p.nextFollowUpDate, notes: p.notes
    });
    setEditingId(p.id);
    setIsAdding(true);
  };

  // Safe date format that avoids timezone off-by-one errors
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    // dateStr is YYYY-MM-DD from date input; parse as UTC to prevent timezone shift
    const [y, m, d] = dateStr.split('-');
    if (!y || !m || !d) return '-';
    return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)))
      .toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  };

  const exportCSV = () => {
    if (prospects.length === 0) return;
    const headers = ['Name', 'Role', 'Company', 'Status', 'Last Message', 'Next Follow Up', 'Notes', 'Date Added'];
    const rows = prospects.map(p => [
      `"${p.name}"`, `"${p.role}"`, `"${p.company}"`, `"${p.status}"`, 
      `"${p.lastMessageDate}"`, `"${p.nextFollowUpDate}"`, `"${p.notes.replace(/"/g, '""')}"`, `"${p.dateAdded}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'somyra_prospects.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = prospects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Identified': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'Messaged': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Replied': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Meeting Booked': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Closed': return 'bg-teal-accent/10 text-teal-accent border-teal-accent/20';
      case 'Not Interested': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search prospects..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 bg-bg-secondary border border-border-card rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-teal-accent/50"
            />
          </div>
          <select
             value={filterStatus}
             onChange={e => setFilterStatus(e.target.value)}
             className="bg-bg-secondary border border-border-card rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-teal-accent/50"
          >
            <option value="All" className="bg-[#0D0D0D]">All Statuses</option>
            <option value="Identified" className="bg-[#0D0D0D]">Identified</option>
            <option value="Messaged" className="bg-[#0D0D0D]">Messaged</option>
            <option value="Replied" className="bg-[#0D0D0D]">Replied</option>
            <option value="Meeting Booked" className="bg-[#0D0D0D]">Meeting Booked</option>
            <option value="Closed" className="bg-[#0D0D0D]">Closed</option>
            <option value="Not Interested" className="bg-[#0D0D0D]">Not Interested</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportCSV}
            disabled={prospects.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border-card text-white text-sm font-medium rounded-xl hover:border-white/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button 
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
              setIsAdding(!isAdding);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-teal-accent text-black text-sm font-bold rounded-xl hover:bg-teal-accent/90 transition-colors"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? 'Cancel' : 'Add Prospect'}
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-bg-secondary border border-border-card rounded-2xl p-5 md:p-6 overflow-hidden"
            onSubmit={handleSave}
          >
            <h3 className="text-white font-bold mb-4">{editingId ? 'Edit Prospect' : 'New Prospect'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted">Name *</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full name" className="input-field py-2.5" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted">Role</label>
                <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="Job title" className="input-field py-2.5" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted">Company</label>
                <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="Company name" className="input-field py-2.5" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value as any})} className="input-field py-2.5">
                  <option value="Identified" className="bg-[#0D0D0D]">Identified</option>
                  <option value="Messaged" className="bg-[#0D0D0D]">Messaged</option>
                  <option value="Replied" className="bg-[#0D0D0D]">Replied</option>
                  <option value="Meeting Booked" className="bg-[#0D0D0D]">Meeting Booked</option>
                  <option value="Closed" className="bg-[#0D0D0D]">Closed</option>
                  <option value="Not Interested" className="bg-[#0D0D0D]">Not Interested</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted">Last Message Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input type="date" value={form.lastMessageDate} onChange={e => setForm({...form, lastMessageDate: e.target.value})} className="input-field py-2.5 pl-9" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted">Next Follow-Up</label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input type="date" value={form.nextFollowUpDate} onChange={e => setForm({...form, nextFollowUpDate: e.target.value})} className="input-field py-2.5 pl-9" />
                </div>
              </div>
            </div>

            {/* Notes — visible on all screens now */}
            <div className="space-y-1 mb-4">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted">Notes</label>
              <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Quick notes about the interaction..." rows={2} className="input-field resize-none" />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingId(null); setForm(emptyForm); }}
                className="px-4 py-2 min-h-[44px] text-sm text-muted hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 min-h-[44px] bg-teal-accent text-black text-sm font-bold rounded-xl hover:bg-teal-accent/90 transition-colors"
              >
                {editingId ? 'Save Changes' : 'Add Prospect'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-border-card bg-bg-secondary w-full">
        {prospects.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-10 h-10 text-muted mb-4" />
            <p className="text-white font-medium mb-1">No prospects tracked yet</p>
            <p className="text-sm text-muted">Keep your outreach organized locally without heavy CRMs.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <Search className="w-8 h-8 text-muted mb-3" />
            <p className="text-white font-medium mb-1">No results found</p>
            <p className="text-sm text-muted">Try a different search or filter.</p>
          </div>
        ) : (
          <table className="w-full text-left whitespace-nowrap min-w-[800px]">
            <thead className="bg-white/5 border-b border-border-card text-xs uppercase tracking-wider text-muted font-semibold">
              <tr>
                <th className="px-6 py-4">Prospect</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Activity</th>
                <th className="px-6 py-4">Next Step</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-card text-sm">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{p.name}</div>
                    <div className="text-xs text-muted mt-0.5">{p.role}{p.company && ` at ${p.company}`}</div>
                    {p.notes?.trim() && <div className="text-xs text-muted/60 mt-1 max-w-[200px] truncate italic">"{p.notes}"</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {formatDate(p.lastMessageDate)}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {formatDate(p.nextFollowUpDate)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => startEdit(p)} className="p-2 min-h-[44px] min-w-[44px] text-muted hover:text-white transition-colors inline-flex items-center justify-center"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteConfirmId(p.id)} className="p-2 min-h-[44px] min-w-[44px] text-muted hover:text-red-400 transition-colors ml-1 inline-flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Custom Delete Confirm Dialog */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="overlay-shell">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="overlay-backdrop"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="dialog-panel"
            >
              <div className="dialog-icon bg-red-400/10">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <div className="dialog-header">
                <h3 className="dialog-title">Remove Prospect?</h3>
                <p className="dialog-copy dialog-section text-safe">
                  This will permanently delete{' '}
                  <strong className="text-white">
                    {prospects.find(p => p.id === deleteConfirmId)?.name || 'this prospect'}
                  </strong>{' '}
                  from your tracker.
                </p>
              </div>
              <div className="dialog-actions">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="dialog-button border border-white/10 text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="dialog-button bg-red-400 text-white shadow-lg shadow-red-400/20 hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
