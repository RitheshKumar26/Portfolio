import { Outlet, useNavigate, useLocation, Link } from 'react-router';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Terminal, Award, FolderGit2, Mail, LayoutDashboard, ExternalLink, LogOut, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user?.email) setUserEmail(data.user.email);
      });
    } else {
      setUserEmail('demo-admin@local');
    }
  }, []);

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Certificates', path: '/admin/certificates', icon: Award },
    { label: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { label: 'Inquiries', path: '/admin/messages', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#00D23B]/10 border border-[#00D23B]/40 flex items-center justify-center text-[#00D23B]">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <span style={{ fontFamily: 'PP Mondwest, monospace' }} className="text-lg tracking-wider text-white">
                  ¶ // CONTROL_CENTER
                </span>
                <span className="ml-2 text-[10px] text-[#00D23B] border border-[#00D23B]/30 px-1.5 py-0.5 rounded uppercase font-mono">
                  ADMIN
                </span>
              </div>
            </div>

            {/* Quick Status and Actions */}
            <div className="flex items-center gap-4 text-xs font-mono">
              {!isSupabaseConfigured && (
                <div className="hidden md:flex items-center gap-1.5 text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>PREVIEW MODE (NO DB KEYS)</span>
                </div>
              )}

              {userEmail && (
                <span className="hidden sm:inline text-white/50 border-r border-white/10 pr-4">
                  {userEmail}
                </span>
              )}

              <Link
                to="/"
                target="_blank"
                className="text-white/70 hover:text-[#00D23B] flex items-center gap-1 transition-colors px-2.5 py-1 rounded hover:bg-white/5"
              >
                <span>Live Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors px-2.5 py-1 rounded hover:bg-red-500/10 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto py-2 -mb-px">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono tracking-wider transition-all rounded ${
                    isActive
                      ? 'bg-[#00D23B]/10 text-[#00D23B] border border-[#00D23B]/40 font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label.toUpperCase()}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0a] py-4 text-center text-xs text-white/40 font-mono">
        PORTFOLIO SECURITY MANAGEMENT SUITE • AUTHORIZED ACCESS ONLY
      </footer>
    </div>
  );
}
