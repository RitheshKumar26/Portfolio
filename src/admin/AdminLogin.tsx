import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Terminal, Shield, ArrowLeft, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!isSupabaseConfigured) {
      // In preview mode without Supabase keys, allow immediate entry
      setTimeout(() => {
        setLoading(false);
        navigate('/admin');
      }, 500);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        navigate('/admin');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#00D23B 1px, transparent 1px), linear-gradient(90deg, #00D23B 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-md w-full relative z-10">
        {/* Top return link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-[#00D23B] text-xs font-mono mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO PUBLIC SITE</span>
        </Link>

        {/* Terminal Window Card */}
        <div className="bg-[#0a0a0a] border border-[#00D23B]/40 shadow-2xl shadow-[#00D23B]/10 rounded overflow-hidden">
          {/* Terminal Window Top Bar */}
          <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-[#00D23B]" />
              <span className="text-xs text-white/60 font-mono ml-2">AUTH_GATEWAY // SECURE_PORTAL</span>
            </div>
            <Shield className="w-4 h-4 text-[#00D23B]" />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-full bg-[#00D23B]/10 border border-[#00D23B]/30 text-[#00D23B] mb-2">
                <Terminal className="w-6 h-6" />
              </div>
              <h1 style={{ fontFamily: 'PP Mondwest, monospace' }} className="text-2xl tracking-wider text-white">
                ADMIN ACCESS
              </h1>
              <p className="text-xs text-white/50 font-mono">
                root@portfolio-auth:~$ ./request_clearance.sh
              </p>
            </div>

            {!isSupabaseConfigured && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded text-amber-300 text-xs font-mono flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">PREVIEW MODE ACTIVE</p>
                  <p className="text-amber-300/80 mt-1">
                    Supabase keys not yet configured. You can test the interface by clicking <b>Authorize Access</b> below.
                  </p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 rounded text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#66FF00] mb-2 uppercase">
                  User Identifier (Email)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cybersecurity.local"
                  required={isSupabaseConfigured}
                  className="w-full bg-black/60 border border-white/20 px-3.5 py-2.5 text-white font-mono text-xs focus:border-[#00D23B] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#66FF00] mb-2 uppercase">
                  Passphrase
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required={isSupabaseConfigured}
                  className="w-full bg-black/60 border border-white/20 px-3.5 py-2.5 text-white font-mono text-xs focus:border-[#00D23B] focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00D23B] text-black font-mono font-bold uppercase text-xs py-3 tracking-widest hover:bg-[#66FF00] transition-colors mt-6 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Terminal className="w-4 h-4 animate-spin" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <span>AUTHORIZE ACCESS</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
