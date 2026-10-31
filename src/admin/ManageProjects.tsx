import { useState, useEffect } from 'react';
import { 
  fetchProjects, 
  saveProject, 
  deleteProject, 
  uploadAsset, 
  DBProject 
} from '../lib/supabase';
import { FolderGit2, Plus, Edit2, Trash2, ExternalLink, Github, X, Shield, Upload } from 'lucide-react';

export default function ManageProjects() {
  const [projects, setProjects] = useState<DBProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Partial<DBProject> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject({
      title: '',
      description: '',
      category: 'Penetration Testing',
      github_url: '',
      demo_url: '',
      technologies: [],
      display_order: projects.length + 1,
      is_published: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (project: DBProject) => {
    setEditingProject({ ...project });
    setModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    const { error } = await deleteProject(id);
    if (error) {
      setStatusMsg({ type: 'error', text: error.message });
    } else {
      setStatusMsg({ type: 'success', text: `Deleted "${title}" successfully.` });
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const { data, error } = await saveProject(editingProject);
    if (error) {
      setStatusMsg({ type: 'error', text: error.message });
    } else {
      setStatusMsg({ type: 'success', text: 'Project saved successfully.' });
      setModalOpen(false);
      loadData();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;
    setUploading(true);
    try {
      const publicUrl = await uploadAsset(file, 'projects');
      if (publicUrl) {
        setEditingProject({ ...editingProject, image_url: publicUrl });
      }
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'PP Mondwest, monospace' }} className="text-2xl lg:text-3xl text-white">
            PROJECT DEPLOYMENTS
          </h1>
          <p className="text-xs text-white/50 font-mono mt-1">
            Manage your hands-on cybersecurity assessments, tool builds, and lab walkthroughs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#00D23B] text-black text-xs font-mono font-bold px-4 py-2.5 rounded flex items-center gap-2 hover:bg-[#66FF00] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>NEW PROJECT</span>
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <div key={p.id} className="bg-[#0a0a0a] border border-white/10 hover:border-[#00D23B]/40 p-5 rounded space-y-4 font-mono text-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-white/50 border-b border-white/5 pb-2">
                <span className="text-[#66FF00]">{p.category}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded ${p.is_published ? 'bg-[#00D23B]/10 text-[#00D23B] border border-[#00D23B]/30' : 'bg-white/10 text-white/40'}`}>
                  {p.is_published ? 'PUBLISHED' : 'DRAFT'}
                </span>
              </div>

              <h2 className="text-lg text-white font-bold">{p.title}</h2>
              <p className="text-white/60 text-xs leading-relaxed line-clamp-3">{p.description}</p>

              {p.technologies && p.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.technologies.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/70 rounded text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-4">
              <div className="flex items-center gap-3">
                {p.github_url && (
                  <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white" title="GitHub Repo">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {p.demo_url && (
                  <a href={p.demo_url} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#00D23B]" title="Live Demo">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="px-2.5 py-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id, p.title)}
                  className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {projects.length === 0 && !loading && (
          <div className="col-span-2 py-12 text-center text-white/40 font-mono text-xs border border-dashed border-white/10 rounded">
            No projects found. Click <b>"NEW PROJECT"</b> to publish your work.
          </div>
        )}
      </div>

      {/* Modal Form */}
      {modalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-2xl w-full bg-[#0a0a0a] border border-[#00D23B]/50 rounded p-6 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00D23B]" />
                <h2 className="text-sm font-mono text-white uppercase font-bold tracking-wider">
                  {editingProject.id ? 'EDIT PROJECT' : 'NEW PROJECT DEPLOYMENT'}
                </h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#66FF00] mb-1">PROJECT TITLE *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="e.g. Web Application Penetration Test"
                  className="w-full bg-black/60 border border-white/20 p-2 text-white focus:border-[#00D23B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#66FF00] mb-1">CATEGORY</label>
                <input
                  type="text"
                  value={editingProject.category || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  placeholder="e.g. Offensive Security / Cryptography"
                  className="w-full bg-black/60 border border-white/20 p-2 text-white focus:border-[#00D23B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#66FF00] mb-1">DESCRIPTION *</label>
                <textarea
                  required
                  rows={4}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  placeholder="Overview of the simulated attack, methodology, findings, and remediation..."
                  className="w-full bg-black/60 border border-white/20 p-2 text-white focus:border-[#00D23B] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#66FF00] mb-1">GITHUB REPO URL</label>
                  <input
                    type="url"
                    value={editingProject.github_url || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-black/60 border border-white/20 p-2 text-white focus:border-[#00D23B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#66FF00] mb-1">DEMO / WRITEUP URL</label>
                  <input
                    type="url"
                    value={editingProject.demo_url || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, demo_url: e.target.value })}
                    placeholder="https://demo.com or report link"
                    className="w-full bg-black/60 border border-white/20 p-2 text-white focus:border-[#00D23B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#66FF00] mb-1">TOOLS & TECHNOLOGIES (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={editingProject.technologies?.join(', ') || ''}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })}
                  placeholder="Burp Suite, SQLmap, Wireshark, Python"
                  className="w-full bg-black/60 border border-white/20 p-2 text-white focus:border-[#00D23B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#66FF00] mb-1">PROJECT SCREENSHOT URL</label>
                <input
                  type="text"
                  value={editingProject.image_url || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, image_url: e.target.value })}
                  placeholder="https://... or upload below"
                  className="w-full bg-black/60 border border-white/20 p-2 text-white focus:border-[#00D23B] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={editingProject.is_published ?? true}
                    onChange={(e) => setEditingProject({ ...editingProject, is_published: e.target.checked })}
                    className="accent-[#00D23B]"
                  />
                  <span>Published on Live Site</span>
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
                    Save Project
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
