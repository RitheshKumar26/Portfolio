import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Terminal, ExternalLink, X, ShieldCheck, CheckCircle2, Copy, Check } from 'lucide-react';
import { PageHeading, Stagger, fadeUp } from '../components/motion';
import { certificates, type Certificate } from '../data';
import { fetchCertificates, isSupabaseConfigured } from '../../lib/supabase';

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [liveCertificates, setLiveCertificates] = useState<Certificate[]>(certificates);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) return;
      try {
        const remoteCerts = await fetchCertificates();
        if (remoteCerts && remoteCerts.length > 0) {
          setLiveCertificates(
            remoteCerts.map((c: any) => ({
              id: c.id,
              name: c.name,
              code: c.code,
              issuer: c.issuer,
              issueDate: c.issue_date,
              expiryDate: c.expiry_date,
              credentialId: c.credential_id,
              verificationUrl: c.verification_url,
              sha256: c.sha256 || '',
              skills: c.skills || [],
            }))
          );
        }
      } catch (err) {
        console.warn('Could not load certificates from Supabase:', err);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const copyCredential = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="certifications" className="relative min-h-screen pt-28 lg:pt-36 pb-16 lg:pb-24 bg-black flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <PageHeading title="Security Certifications" delay={300} badge="[04]" className="mb-4" />

        <p style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-sm md:text-base text-white/60 max-w-2xl mb-8 lg:mb-10 mt-4">
          Accredited cybersecurity credentials validating structured offensive security methodologies, network reconnaissance, and threat mitigation.
        </p>

        <Stagger delay={0.12} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {liveCertificates.map((cert) => (
              <motion.div
                key={cert.id}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                className="bg-white/5 border border-white/10 hover:border-[#00D23B]/60 transition-all duration-300 p-6 lg:p-7 flex flex-col justify-between group relative"
              >
                <div>
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00D23B]" />
                      <span style={{ fontFamily: 'Fragment Mono, monospace' }} className="text-[11px] text-white/40 ml-2 tracking-wider uppercase">
                        {cert.code}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#00D23B]/10 border border-[#00D23B]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D23B] animate-pulse" />
                      <span style={{ fontFamily: 'Fragment Mono, monospace' }} className="text-[10px] text-[#00D23B] font-semibold tracking-wider uppercase">
                        VERIFIED
                      </span>
                    </div>
                  </div>

                  {/* Title & Issuer */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700 }} className="text-xs uppercase tracking-wider text-[#66FF00]">
                        {cert.issuer}
                      </span>
                      <h3 style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }} className="text-xl lg:text-2xl text-white group-hover:text-[#00D23B] transition-colors mt-1">
                        {cert.name}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded border border-white/10 bg-white/5 flex items-center justify-center text-[#00D23B] shrink-0 group-hover:border-[#00D23B]/40 transition-colors">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Monospace Metadata Panel */}
                  <div style={{ fontFamily: 'Fragment Mono, monospace' }} className="text-xs space-y-1.5 py-3 px-3.5 bg-black/40 border border-white/5 rounded mb-4">
                    <div className="flex justify-between items-center text-white/50">
                      <span>CREDENTIAL ID:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white/90">{cert.credentialId}</span>
                        <button
                          type="button"
                          onClick={() => copyCredential(cert.credentialId)}
                          title="Copy Credential ID"
                          className="text-white/40 hover:text-[#00D23B] transition-colors cursor-pointer"
                          aria-label={`Copy Credential ID ${cert.credentialId}`}
                        >
                          {copiedId === cert.credentialId ? (
                            <Check className="w-3.5 h-3.5 text-[#00D23B]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between text-white/50">
                      <span>VALIDITY:</span>
                      <span className="text-white/80">{cert.issueDate} – {cert.expiryDate}</span>
                    </div>
                  </div>

                  {/* Skills/Domains Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {cert.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }}
                        className="text-[11px] px-2 py-0.5 bg-white/5 border border-white/10 text-white/70 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-dashed border-white/15">
                  <button
                    type="button"
                    onClick={() => setSelectedCert(cert)}
                    style={{ fontFamily: 'Fragment Mono, monospace' }}
                    className="text-xs text-white/60 hover:text-[#00D23B] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>INSPECT RECORD</span>
                  </button>
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontFamily: 'Fragment Mono, monospace' }}
                    className="text-xs text-[#00D23B] hover:text-white flex items-center gap-1.5 transition-colors border border-[#00D23B]/40 hover:border-[#00D23B] px-3 py-1 rounded"
                  >
                    <span>VERIFY</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </Stagger>
      </div>

      {/* Inspection Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="max-w-xl w-full bg-[#0a0a0a] border border-[#00D23B]/50 p-6 space-y-5 relative shadow-2xl shadow-[#00D23B]/10"
              onClick={(e) => e.stopPropagation()}
            >
    {/* Modal Header */}
    <div className="flex items-center justify-between pb-3 border-b border-white/15">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#00D23B]" />
        <span style={{ fontFamily: 'Fragment Mono, monospace' }} className="text-xs text-[#00D23B] ml-2 tracking-wider uppercase">
          PAYLOAD // CERT_VERIFICATION_RECORD
        </span>
      </div>
      <button 
        type="button"
        onClick={() => setSelectedCert(null)}
        className="text-white/60 hover:text-white cursor-pointer"
        aria-label="Close dialog"
      >
        <X className="w-5 h-5" />
      </button>
    </div>

    {/* Modal Content */}
    <div style={{ fontFamily: 'Fragment Mono, monospace' }} className="text-xs space-y-2.5 bg-black/60 p-4 border border-white/10 rounded">
      <div className="text-[#00D23B] flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4" />
        <span>[LEDGER_STATUS]: OFFICIAL_ACCREDITATION_VERIFIED</span>
      </div>
      <div className="text-white/60">
        &gt; HOLDER: <span className="text-white">NAJMUDEEN</span>
      </div>
      <div className="text-white/60">
        &gt; CERTIFICATION: <span className="text-[#66FF00]">{selectedCert.name} ({selectedCert.code})</span>
      </div>
      <div className="text-white/60">
        &gt; ISSUING_ORGANIZATION: <span className="text-white">{selectedCert.issuer}</span>
      </div>
      <div className="text-white/60">
        &gt; CREDENTIAL_ID: <span className="text-white">{selectedCert.credentialId}</span>
      </div>
      <div className="text-white/60">
        &gt; PERIOD: <span className="text-white">{selectedCert.issueDate} – {selectedCert.expiryDate}</span>
      </div>
      <div className="text-white/60 break-all">
        &gt; SHA-256_FINGERPRINT: <span className="text-white/70">{selectedCert.sha256}</span>
      </div>
      <div className="text-white/60">
        &gt; DOMAINS: <span className="text-white/90">{selectedCert.skills.join(' • ')}</span>
      </div>
    </div>

    {/* Modal Actions */}
    <div className="flex items-center justify-between pt-2">
      <button
        type="button"
        onClick={() => copyCredential(selectedCert.credentialId)}
        style={{ fontFamily: 'Fragment Mono, monospace' }}
        className="text-xs text-white/70 hover:text-[#00D23B] flex items-center gap-1.5 border border-white/20 hover:border-[#00D23B] px-3.5 py-2 transition-colors cursor-pointer"
      >
        {copiedId === selectedCert.credentialId ? <Check className="w-4 h-4 text-[#00D23B]" /> : <Copy className="w-4 h-4" />}
        <span>{copiedId === selectedCert.credentialId ? 'ID COPIED' : 'COPY CREDENTIAL ID'}</span>
      </button>

      <a
        href={selectedCert.verificationUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontFamily: 'Fragment Mono, monospace' }}
        className="text-xs bg-[#00D23B] text-black font-semibold hover:bg-[#66FF00] px-4 py-2 flex items-center gap-1.5 transition-colors"
      >
        <span>OPEN OFFICIAL VERIFY</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
