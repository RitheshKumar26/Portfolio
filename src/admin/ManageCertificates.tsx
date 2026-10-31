import { useState, useEffect } from 'react';
import { 
  fetchCertificates, 
  saveCertificate, 
  deleteCertificate, 
  uploadAsset, 
  isSupabaseConfigured,
  DBCertificate 
} from '../lib/supabase';
import { Award, Plus, Edit2, Trash2, ExternalLink, X, Check, Upload, Shield, AlertCircle } from 'lucide-react';

export default function ManageCertificates() {
  const [certs, setCerts] = useState<DBCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCert, setEditingCert] = useState<Partial<DBCertificate> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchCertificates();
    setCerts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingCert({
      name: '',
      code: '',
      issuer: '',
      issue_date: new Date().getFullYear().toString(),
      expiry_date: 'Non-Expiring',
      credential_id: '',
      verification_url: '',
      sha256: '',
      skills: [],
      display_order: certs.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cert: DBCertificate) => {
    setEditingCert({ ...cert });
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    const { error } = await deleteCertificate(id);
    if (error) {
      setStatusMsg({ type: 'error', text: error.message });
    } else {
      setStatusMsg({ type: 'success', text: `Deleted "${name}" successfully.` });
      setCerts(certs.filter((c) => c.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    const { data, error } = await saveCertificate(editingCert);
    if (error) {
      setStatusMsg({ type: 'error', text: error.message });
    } else {
      setStatusMsg({ type: 'success', text: 'Certificate saved successfully.' });
      setModalOpen(false);
      loadData();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCert) return;
    setUploading(true);
    try {
      const publicUrl = await uploadAsset(file, 'certificates');
      if (publicUrl) {
        setEditingCert({ ...editingCert, badge_image_url: publicUrl });
      }
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'PP Mondwest, monospace' }} className="text-2xl lg:text-3xl text-white">
            CERTIFICATION CREDENTIALS
          </h1>
          <p className="text-xs text-white/50 font-mono mt-1">
            Add, update, and manage your verified cybersecurity badges.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#00D23B] text-black text-xs font-mono font-bold px-4 py-2.5 rounded flex items-center gap-2 hover:bg-[#66FF00] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>NEW CERTIFICATE</span>
        </button>
      </div>

      {statusMsg && (
        <div
          className={`p-3 rounded text-xs font-mono flex items-center justify-between ${
            statusMsg.type === 'success'
              ? 'bg-[#00D23B]/10 border border-[#00D23B]/30 text-[#00D23B]'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/5 border-b border-white/10 text-white/60 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Credential Name</th>
                <th className="py-3 px-4">Issuer</th>
                <th className="py-3 px-4">Credential ID</th>
                <th className="py-3 px-4">Validity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {certs.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#00D23B] shrink-0" />
                      <span>{c.name}</span>
                      <span className="text-white/40 text-[10px]">({c.code})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white/70">{c.issuer}</td>
                  <td className="py-3 px-4 text-[#66FF00]">{c.credential_id}</td>
                  <td className="py-3 px-4 text-white/50">{c.issue_date} – {c.expiry_date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        c.is_active
                          ? 'bg-[#00D23B]/10 text-[#00D23B] border border-[#00D23B]/30'
                          : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {c.is_active ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {c.verification_url && (
                        <a
                          href={c.verification_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-white/50 hover:text-[#00D23B] transition-colors"
                          title="Open Verification Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-white/70 hover:text-white transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        className="p-1.5 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {certs.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-white/40">
                    No certificates found. Click <b>"NEW CERTIFICATE"</b> to add your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {modalOpen && editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-2xl w-full bg-[#0a0a0a] border border-[#00D23B]/50 rounded p-6 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00D23B]" />
                <h2 className="text-sm font-mono text-white uppercase font-bold tracking-wider">
                  {editingCert.id ? 'EDIT CERTIFICATION RECORD' : 'NEW CERTIFICATION RECORD'}
                </h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#66FF00] mb-1">CERTIFICATE NAME *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.name || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                    placeholder="e.g. CompTIA Security+"
                    className="w-full bg-black/60 border border-white/20 p-2 text-white focus:border-[#00D23B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#66FF00] mb-1">CODE / EXAM NUMBER</label>
                  <input
                    type="text"
                    value={editingCert.code || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, code: e.target.value })}
                    placeholder="e.g. SY0-701"
                    className="w-full bg-black/60 border border-white/20 p-2 text-white focus:border-[#00D23B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#66FF00] mb-1">ISSUER *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.issuer || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    placeholder="e.g. CompTIA / INE Security"
                    className="w-full bg-black/60 border border-white/20 p-2 text-white focus:border-[#00D23B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#66FF00] mb-1">CREDENTIAL ID *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.credential_id || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, credential_id: e.target.value })}
                    placeholder="e.g. COMP001021948"
                    className="w-full bg-black/60 border border-white/20 p-2 text-white focus:border-[#00D23B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#66FF00] mb-1">ISSUE DATE</label>
                  <input
                    type="text"
                    value={editingCert.issue_date || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issue_date: e.target.value })}
                    placeholder="e.g. 2024"
                    className="w-full bg-black/60 border border-white/20 p-2 text-white focus:border-[#00D23B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#66FF00] mb-1">EXPIRY DATE</label>
                  <input
                    type="text"
                    value={editingCert.expiry_date || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, expiry_date: e.target.value })}
                    placeholder="e.g. 2027 or Non-Expiring"
                    className="w-full bg-black/60 border border-white/20 p-2 text-white focus:border-[#00D23B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#66FF00] mb-1">OFFICIAL VERIFICATION URL</label>
                <input
                  type="url"
                  value={editingCert.verification_url || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, verification_url: e.target.value })}
                  placeholder="https://www.credly.com/badges/..."
                  className="w-full bg-black/60 border border-white/20 p-2 text-white focus:border-[#00D23B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#66FF00] mb-1">SHA-256 FINGERPRINT (OPTIONAL)</label>
                <input
                  type="text"
                  value={editingCert.sha256 || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, sha256: e.target.value })}
                  placeholder="e.g. 9a3f7b2c0184e921d782bc4e5f019a28..."
                  className="w-full bg-black/60 border border-white/20 p-2 text-white focus:border-[#00D23B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#66FF00] mb-1">SKILLS / DOMAINS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={editingCert.skills?.join(', ') || ''}
                  onChange={(e) => setEditingCert({
                    ...editingCert,
                    skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })}
                  placeholder="Network Security, Threat Hunting, Cryptography"
                  className="w-full bg-black/60 border border-white/20 p-2 text-white focus:border-[#00D23B] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={editingCert.is_active ?? true}
                    onChange={(e) => setEditingCert({ ...editingCert, is_active: e.target.checked })}
                    className="accent-[#00D23B]"
                  />
                  <span>Active & Visible on Public Portfolio</span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-white/20 text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#00D23B] text-black font-bold hover:bg-[#66FF00] cursor-pointer"
                  >
                    Save Certificate
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
