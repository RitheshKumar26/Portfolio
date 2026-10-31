import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  fetchCertificates, 
  fetchProjects, 
  fetchContactMessages, 
  isSupabaseConfigured,
  DBCertificate,
  DBProject,
  DBContactMessage 
} from '../lib/supabase';
import { Award, FolderGit2, Mail, Plus, CheckCircle, Database, ShieldCheck, Terminal, AlertTriangle } from 'lucide-react';

export default function DashboardOverview() {
  const [certs, setCerts] = useState<DBCertificate[]>([]);
  const [projects, setProjects] = useState<DBProject[]>([]);
  const [messages, setMessages] = useState<DBContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const [loadedCerts, loadedProjects, loadedMessages] = await Promise.all([
          fetchCertificates(),
          fetchProjects(),
          fetchContactMessages(),
        ]);
        setCerts(loadedCerts);
        setProjects(loadedProjects);
        setMessages(loadedMessages);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#00D23B] font-mono text-xs mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00D23B] animate-ping" />
            <span>OPERATIONAL STATUS: ACTIVE</span>
          </div>
          <h1 style={{ fontFamily: 'PP Mondwest, monospace' }} className="text-2xl lg:text-3xl text-white">
            PORTFOLIO OVERVIEW
          </h1>
          <p className="text-xs text-white/50 font-mono mt-1">
            Manage your credentials, project catalog, and live visitor inquiries.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/certificates"
            className="bg-[#00D23B] text-black text-xs font-mono font-bold px-3.5 py-2 rounded flex items-center gap-1.5 hover:bg-[#66FF00] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD CERTIFICATE</span>
          </Link>
          <Link
            to="/admin/projects"
            className="bg-white/10 text-white text-xs font-mono px-3.5 py-2 rounded flex items-center gap-1.5 hover:bg-white/20 transition-colors border border-white/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD PROJECT</span>
          </Link>
        </div>
      </div>

      {/* Supabase Status Alert if not configured */}
      {!isSupabaseConfigured && (
        <div className="bg-amber-500/10 border border-amber-500/40 p-4 rounded text-xs font-mono text-amber-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>SUPABASE CREDENTIALS PENDING CONFIGURATION</span>
          </div>
          <p className="text-amber-300/80 leading-relaxed">
            The admin interface is fully functional in preview mode. To connect your live PostgreSQL database, copy your 
            <b> VITE_SUPABASE_URL</b> and <b>VITE_SUPABASE_ANON_KEY</b> into your local <b>.env</b> file.
            The complete database SQL script is saved in <b>supabase/schema.sql</b>.
          </p>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded hover:border-[#00D23B]/40 transition-colors">
          <div className="flex items-center justify-between text-white/50 mb-3 font-mono text-xs">
            <span>CERTIFICATES</span>
            <Award className="w-4 h-4 text-[#00D23B]" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {loading ? '...' : certs.length}
          </div>
          <p className="text-[11px] text-white/40 font-mono mt-1">
            Active security credentials
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded hover:border-[#00D23B]/40 transition-colors">
          <div className="flex items-center justify-between text-white/50 mb-3 font-mono text-xs">
            <span>PROJECTS</span>
            <FolderGit2 className="w-4 h-4 text-[#00D23B]" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {loading ? '...' : projects.length}
          </div>
          <p className="text-[11px] text-white/40 font-mono mt-1">
            Portfolio deployments
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded hover:border-[#00D23B]/40 transition-colors">
          <div className="flex items-center justify-between text-white/50 mb-3 font-mono text-xs">
            <span>INQUIRIES</span>
            <Mail className="w-4 h-4 text-[#00D23B]" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {loading ? '...' : messages.length}
          </div>
          <p className="text-[11px] text-white/40 font-mono mt-1">
            Contact form submissions
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded hover:border-[#00D23B]/40 transition-colors">
          <div className="flex items-center justify-between text-white/50 mb-3 font-mono text-xs">
            <span>DATABASE</span>
            <Database className="w-4 h-4 text-[#00D23B]" />
          </div>
          <div className="text-sm font-bold font-mono text-[#00D23B] mt-2 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            <span>{isSupabaseConfigured ? 'CONNECTED' : 'LOCAL PREVIEW'}</span>
          </div>
          <p className="text-[11px] text-white/40 font-mono mt-2">
            Supabase PostgreSQL Engine
          </p>
        </div>
      </div>

      {/* Quick Access Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Certificates */}
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#00D23B]" />
              <h2 className="text-sm font-mono text-white uppercase font-bold tracking-wider">
                Certifications Catalog
              </h2>
            </div>
            <Link to="/admin/certificates" className="text-xs font-mono text-[#00D23B] hover:underline">
              Manage All &rarr;
            </Link>
          </div>

          <div className="space-y-2">
            {certs.slice(0, 4).map((c) => (
              <div key={c.id} className="p-3 bg-white/5 border border-white/5 rounded flex items-center justify-between text-xs font-mono">
                <div>
                  <p className="text-white font-medium">{c.name}</p>
                  <p className="text-white/40 text-[11px]">{c.issuer} • {c.code}</p>
                </div>
                <span className="text-[#00D23B] text-[10px] border border-[#00D23B]/30 px-1.5 py-0.5 rounded">
                  {c.credential_id}
                </span>
              </div>
            ))}
            {certs.length === 0 && !loading && (
              <p className="text-xs text-white/40 font-mono py-4 text-center">No certificates found.</p>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#00D23B]" />
              <h2 className="text-sm font-mono text-white uppercase font-bold tracking-wider">
                Recent Inquiries
              </h2>
            </div>
            <Link to="/admin/messages" className="text-xs font-mono text-[#00D23B] hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-2">
            {messages.slice(0, 4).map((m) => (
              <div key={m.id} className="p-3 bg-white/5 border border-white/5 rounded space-y-1 text-xs font-mono">
                <div className="flex justify-between items-center text-white/70">
                  <span className="font-semibold text-white">{m.name}</span>
                  <span className="text-white/40 text-[10px]">{new Date(m.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-white/50 text-[11px] truncate">{m.message}</p>
              </div>
            ))}
            {messages.length === 0 && !loading && (
              <p className="text-xs text-white/40 font-mono py-4 text-center">No contact messages received yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
