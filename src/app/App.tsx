import { Terminal, Mail, Github, Linkedin, ExternalLink, X, ShieldCheck, Award, BadgeCheck, CheckCircle2, Copy, Check } from 'lucide-react';

// Local asset imports
import imgNaju from '../assets/naju.png';
import imgNmap from '../assets/nmap.png';
import imgNikto from '../assets/nikto.png';
import imgWireshark from '../assets/wireshark.png';
import imgMetasploit from '../assets/metasploit.png';
import imgHashcat from '../assets/Hashcat.png';
import imgJtr from '../assets/jtr.png';
import imgMaltego from '../assets/maltego.png';
import imgSqlmap from '../assets/sqlmap.png';
import imgKaliLinux from '../assets/Kali linux.png';
import imgWindows from '../assets/windows.png';
import imgP1 from '../assets/p1.png';
import imgP2 from '../assets/p2.png';
import { useState, useEffect } from 'react';
import { fetchCertificates, fetchProjects, recordContactMessage, isSupabaseConfigured } from '../lib/supabase';

export interface Certificate {
  id: string;
  name: string;
  code: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  verificationUrl: string;
  sha256: string;
  skills: string[];
}

const certificates: Certificate[] = [
  {
    id: 'sec-plus',
    name: 'CompTIA Security+',
    code: 'SY0-701',
    issuer: 'CompTIA',
    issueDate: '2024',
    expiryDate: '2027',
    credentialId: 'COMP001021948',
    verificationUrl: 'https://www.credly.com/',
    sha256: '9a3f7b2c0184e921d782bc4e5f019a28c34512e088ba7610',
    skills: ['Network Security', 'Threat Hunting', 'Vulnerability Mgmt', 'Cryptography']
  },
  {
    id: 'ejpt',
    name: 'eJPTv2 - Junior Penetration Tester',
    code: 'eJPTv2',
    issuer: 'INE Security',
    issueDate: '2024',
    expiryDate: 'Non-Expiring',
    credentialId: 'INE-EJPT-849201',
    verificationUrl: 'https://www.ine.com/',
    sha256: '8b12f734a991c0e8234db0299f1283e7456bc91001dfa234',
    skills: ['Network Reconnaissance', 'Host Auditing', 'Exploitation', 'Web App Pentesting']
  },
  {
    id: 'ceh',
    name: 'Certified Ethical Hacker (CEH)',
    code: 'v12',
    issuer: 'EC-Council',
    issueDate: '2024',
    expiryDate: '2027',
    credentialId: 'ECC-91823746',
    verificationUrl: 'https://aspen.eccouncil.org/Verify',
    sha256: 'c4981d0092fa8b12e45609312bc88190de4568912301fa77',
    skills: ['Attack Surface Analysis', 'Malware Analysis', 'Sniffing & Evasion', 'System Hacking']
  },
  {
    id: 'google-sec',
    name: 'Google Cybersecurity Professional',
    code: 'GCP-SEC',
    issuer: 'Google',
    issueDate: '2023',
    expiryDate: 'Non-Expiring',
    credentialId: 'GCP-SEC-582910',
    verificationUrl: 'https://www.coursera.org/verify/',
    sha256: '14f09238bc8901de78234bc5678912ef0129384756abcdef',
    skills: ['SIEM & Packet Analysis', 'Python & Bash', 'Linux Security', 'Incident Response']
  }
];

// Terminal Command Typing Effect Component
function TerminalTyping({ commands }: { commands: string[] }) {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    const currentCommand = commands[currentCommandIndex];
    
    if (currentCharIndex < currentCommand.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentCommand.slice(0, currentCharIndex + 1));
        setCurrentCharIndex(currentCharIndex + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        const nextIndex = (currentCommandIndex + 1) % commands.length;
        setCurrentCommandIndex(nextIndex);
        setCurrentCharIndex(0);
        setDisplayedText('');
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentCharIndex, currentCommandIndex, commands]);

  return (
    <div style={{ fontFamily: 'Fragment Mono, monospace' }} className="text-[#66FF00] space-y-2 min-h-[120px] md:min-h-[150px] text-base md:text-lg lg:text-[22px]">
      {commands.map((cmd, index) => (
        <p key={index} className={index === currentCommandIndex ? 'opacity-100' : 'opacity-30'}>
          {index === currentCommandIndex ? (
            <>
              &gt; {displayedText}
              <span className="inline-block w-[2px] h-4 md:h-5 bg-[#66FF00] ml-1 animate-pulse" />
            </>
          ) : (
            `> ${cmd}`
          )}
        </p>
      ))}
    </div>
  );
}
function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted && delay > 0) {
      const startTimeout = setTimeout(() => setHasStarted(true), delay);
      return () => clearTimeout(startTimeout);
    }
    
    if (delay === 0) setHasStarted(true);
    
    if (!hasStarted) return;

    const typingSpeed = isDeleting ? 20 : 50;
    const pauseTime = isDeleting ? 300 : 3000;

    if (!isDeleting && currentIndex === text.length) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && currentIndex === 0) {
      const timeout = setTimeout(() => setIsDeleting(false), pauseTime);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayedText(text.slice(0, currentIndex - 1));
        setCurrentIndex(currentIndex - 1);
      } else {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, text, delay, hasStarted]);

  return (
    <span>
      {displayedText}
      <span className="inline-block w-[2px] h-5 bg-[#00D23B] ml-1 animate-pulse" />
    </span>
  );
}

export default function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [liveCertificates, setLiveCertificates] = useState<Certificate[]>(certificates);
  const [liveProjects, setLiveProjects] = useState<any[]>([]);

  useEffect(() => {
    async function loadDynamicData() {
      if (!isSupabaseConfigured) return;
      try {
        const [remoteCerts, remoteProjects] = await Promise.all([
          fetchCertificates(),
          fetchProjects()
        ]);
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
        if (remoteProjects && remoteProjects.length > 0) {
          setLiveProjects(remoteProjects.filter((p: any) => p.is_published));
        }
      } catch (err) {
        console.warn('Could not load dynamic data from Supabase:', err);
      }
    }
    loadDynamicData();
  }, []);

  const copyCredential = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Slower preloader - completes in ~3.5 seconds
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => setShowContent(true), 100);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Parallax scroll effect
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setStatusMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        recordContactMessage(formData.name, formData.email, formData.message);
        setFormStatus('success');
        setStatusMessage('Message transmitted successfully!');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => {
          setFormStatus('idle');
          setStatusMessage('');
        }, 5000);
      } else {
        setFormStatus('error');
        setStatusMessage(data.error || 'Transmission failed. Please try again.');
      }
    } catch (error) {
      setFormStatus('error');
      setStatusMessage('Connection error. Please check if the server is running.');
    }
  };

  return (
    <div className="bg-black text-white h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      {/* Preloader with Vertical Grid Reveal - Hero visible behind */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          {/* Vertical Grid Lines - covers hero, reveals as strips animate */}
          <div className="absolute inset-0 flex">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-black origin-top"
                style={{
                  animation: `gridReveal 1s ease-out ${i * 0.15}s forwards`,
                  transform: 'scaleY(1)'
                }}
              />
            ))}
          </div>

          <style>{`
            @keyframes gridReveal {
              0% {
                transform: scaleY(1);
              }
              100% {
                transform: scaleY(0);
              }
            }
          `}</style>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Hamburger Menu - Two green lines / X toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex flex-col justify-center items-center w-8 h-8 p-2 -ml-2 relative"
              aria-label="Toggle menu"
            >
              <span 
                className={`w-7 h-[3px] bg-[#00D23B] absolute transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'rotate-45' : '-translate-y-[5px]'}`} 
              />
              <span 
                className={`w-7 h-[3px] bg-[#00D23B] absolute transition-all duration-300 ease-in-out ${mobileMenuOpen ? '-rotate-45' : 'translate-y-[5px]'}`} 
              />
            </button>

            <button 
              onClick={() => scrollToSection('hero')}
              style={{ fontFamily: 'Sooner, sans-serif' }} 
              className="text-2xl lg:text-4xl tracking-tight text-white uppercase hover:text-[#00D23B] transition-colors duration-300 cursor-pointer"
            >
              NAT
            </button>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8 xl:gap-12 ml-auto mr-8">
              {['Summary', 'Skills', 'Certifications', 'Tools', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  style={{ fontFamily: 'PP Mondwest, sans-serif', fontSize: '20px' }}
                  className="relative uppercase text-white/80 hover:text-[#00D23B] transition-all duration-500 group overflow-hidden h-8"
                >
                  {/* Original text */}
                  <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">
                    {item.split('').map((letter, index) => (
                      <span
                        key={index}
                        className="inline-block transition-transform duration-300"
                        style={{ transitionDelay: `${index * 30}ms` }}
                      >
                        {letter}
                      </span>
                    ))}
                  </span>
                  
                  {/* Rotating text (appears from top) */}
                  <span className="absolute left-0 top-full transition-transform duration-500 group-hover:-translate-y-full">
                    {item.split('').map((letter, index) => (
                      <span
                        key={index}
                        className="inline-block transition-transform duration-300"
                        style={{ transitionDelay: `${index * 30}ms` }}
                      >
                        {letter}
                      </span>
                    ))}
                  </span>
              
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 lg:gap-3 px-3 py-2">
              <div className="relative">
                <div className="w-2 h-2 bg-[#00D23B] rounded-full" />
                <div className="absolute inset-0 bg-[#00D23B] rounded-full animate-ping opacity-40" />
              </div>
              <span style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700, letterSpacing: '0px' }} className="text-[#00D23B] text-xs lg:text-sm uppercase">Online</span>
            </div>
          </div>
        </div>

      </nav>

      {/* Mobile Menu Full Screen Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black z-40 transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {['Summary', 'Skills', 'Certifications', 'Tools', 'Contact'].map((item, index) => (
            <button
              key={item}
              onClick={() => {
                scrollToSection(item.toLowerCase());
                setMobileMenuOpen(false);
              }}
              style={{ fontFamily: 'PP Mondwest, sans-serif', animationDelay: `${index * 100}ms` }}
              className={`text-3xl uppercase text-white/80 hover:text-[#00D23B] transition-colors ${mobileMenuOpen ? 'animate-fadeIn' : ''}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen overflow-hidden bg-black snap-start">

        {/* Background linear gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, #000000 0%, #1B1B1B 52%, #292929 71%, #3F3F3F 100%)' }}
        />

        {/* Portrait — centered, portrait crop */}
        <div className="absolute inset-0 flex justify-center items-start pointer-events-none">
          <img
            src={imgNaju}
            alt="Najmudeen"
            className="h-[95vh] w-auto object-cover object-top grayscale"
          />
        </div>

        {/* Bottom gradient — fades image into black */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[55%] z-10"
          style={{ background: 'linear-gradient(to top, #000 25%, transparent 100%)' }}
        />

        {/* Bio text — lower right on desktop */}
        <div 
          className="absolute z-30 opacity-0 hidden md:block" 
          style={{ bottom: '28%', right: '10%', maxWidth: '580px', animation: 'fadeInUp 1s ease-out 2s forwards' }}
        >
          <p
            className="text-white/65 text-justify"
            style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500, fontSize: '18px', lineHeight: '1.3' }}
          >
            Hi, I'm Najmudeen. My work centers around<br />
            understanding how systems are exposed,<br />
            how information is discovered, and how threats can<br />
            be identified before they escalate.
          </p>
        </div>

        {/* Bio text — mobile version positioned like the design */}
        <div 
          className="absolute z-30 opacity-0 md:hidden px-6" 
          style={{ bottom: '18%', right: '0', left: '0', animation: 'fadeInUp 1s ease-out 2s forwards' }}
        >
          <p
            className="text-white/65 text-right"
            style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: '1.5' }}
          >
            Hi, I'm Najmudeen. My work centers around understanding how systems are exposed, how information is discovered, and how threats can be identified before they escalate.
          </p>
        </div>

        {/* NAJMUDEEN — massive bottom name */}
        <h1
          className="absolute bottom-0 left-0 w-full z-20 uppercase text-white leading-[0.82] pl-4 sm:pl-10 lg:pl-25 opacity-0 text-[40px] sm:text-[70px] md:text-[100px] lg:text-[150px]"
          style={{ fontFamily: 'Sooner, sans-serif', animation: 'fadeInUp 1s ease-out 2.3s forwards' }}
        >
          Najmudeen
        </h1>

        {/* Hero animations */}
        <style>{`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}</style>

      </section>

      {/* Executive Summary */}
      <section id="summary" className="relative min-h-screen py-16 lg:py-24 bg-black snap-start flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8 lg:mb-12">
            <Terminal className="text-[#00D23B] w-6 h-6" />
            <h2 style={{ fontFamily: 'PP Mondwest, sans-serif' }} className="text-xl lg:text-2xl uppercase tracking-tight text-[#00D23B] font-medium">
              <TypingText text="Executive Summary" />
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <TerminalTyping commands={[
              'Network Reconnaissance...',
              'OSINT & Digital Footprinting...',
              'Attack Surface Analysis...'
            ]} />

            <div style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-white/65 space-y-4 leading-relaxed text-base md:text-lg lg:text-[22px]">
              <p>
                I am an aspiring <span style={{ fontWeight: 700 }} className="text-[#66FF00] uppercase">Cybersecurity Analyst</span> with
                practical experience in network reconnaissance, OSINT investigations, and infrastructure analysis.
              </p>
              <p>
                My work focuses on understanding how systems are exposed, how digital footprints are mapped,
                and how potential threats can be identified before they escalate.
              </p>
              <p>
                My goal is to contribute to threat intelligence and security operations environments where
                structured analysis, reconnaissance skills, and continuous learning are essential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Capabilities */}
      <section id="skills" className="relative min-h-screen py-16 lg:py-24 bg-black snap-start flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12 lg:mb-16">
            <Terminal className="text-[#00D23B] w-6 h-6" />
            <h2 style={{ fontFamily: 'PP Mondwest, sans-serif' }} className="text-xl lg:text-2xl uppercase tracking-tight text-[#00D23B] font-medium">
              <TypingText text="Operational Capabilities" delay={200} />
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Card 1 - Networking */}
            <div className="bg-white/5 p-6 lg:p-8 flex flex-col h-full border border-white/10 hover:border-[#00D23B]/50 transition-all duration-300">
              <div className="flex items-start justify-between mb-12">
                <span style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 300 }} className="text-7xl lg:text-8xl text-white/65">1</span>
                <span style={{ fontFamily: 'Satoshi, sans-serif' }} className="text-xs text-white/65">[05]</span>
              </div>
              <h3 style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }} className="text-lg lg:text-xl text-[#66FF00] uppercase mb-6 text-center">Networking</h3>
              <div style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="space-y-3 mb-auto text-base lg:text-lg">
                <p>TCP/IP</p>
                <p>HTTP/HTTPS</p>
                <p>DNS</p>
                <p>Active vs Passive Recon</p>
                <p>Ports & Services</p>
              </div>
              <div className="my-6">
                <svg className="w-full h-[1px]" preserveAspectRatio="none">
                  <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="white" strokeOpacity="0.25" strokeDasharray="7 7" />
                </svg>
              </div>
              <p style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-sm text-white/55">Surface discovery & service identification.</p>
            </div>

            {/* Card 2 - Operating Systems */}
            <div className="bg-white/5 p-6 lg:p-8 flex flex-col h-full border border-white/10 hover:border-[#00D23B]/50 transition-all duration-300">
              <div className="flex items-start justify-between mb-12">
                <span style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 300 }} className="text-7xl lg:text-8xl text-white/65">2</span>
                <span style={{ fontFamily: 'Satoshi, sans-serif' }} className="text-xs text-white/65">[02]</span>
              </div>
              <h3 style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }} className="text-lg lg:text-xl text-[#66FF00] uppercase mb-6 text-center">Operating Systems</h3>
              <div className="flex gap-8 mb-auto items-end justify-center">
                <div className="flex flex-col items-center">
                  <img src={imgKaliLinux} alt="Kali Linux" className="w-16 h-16 lg:w-20 lg:h-20 object-contain mb-2" />
                  <p style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }} className="text-xs lg:text-sm">KALI LINUX</p>
                </div>
                <div className="flex flex-col items-center">
                  <img src={imgWindows} alt="Windows" className="w-16 h-16 lg:w-20 lg:h-20 object-contain mb-2" />
                  <p style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }} className="text-xs lg:text-sm">WINDOWS</p>
                </div>
              </div>
              <div className="my-6">
                <svg className="w-full h-[1px]" preserveAspectRatio="none">
                  <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="white" strokeOpacity="0.25" strokeDasharray="7 7" />
                </svg>
              </div>
              <p style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-sm text-white/55">Cross-platform analysis & testing workflows</p>
            </div>

            {/* Card 3 - Tools */}
            <div className="bg-white/5 p-6 lg:p-8 flex flex-col h-full border border-white/10 hover:border-[#00D23B]/50 transition-all duration-300">
              <div className="flex items-start justify-between mb-12">
                <span style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 300 }} className="text-7xl lg:text-8xl text-white/65">3</span>
                <span style={{ fontFamily: 'Satoshi, sans-serif' }} className="text-xs text-white/65">[09]</span>
              </div>
              <h3 style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }} className="text-lg lg:text-xl text-[#66FF00] uppercase mb-6 text-center">Tools</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col items-center">
                  <img src={imgNmap} alt="Nmap" className="w-12 h-12 object-contain mb-1" />
                  <p style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-xs">NMAP</p>
                </div>
                <div className="flex flex-col items-center">
                  <img src={imgNikto} alt="Nikto" className="w-12 h-12 object-contain mb-1" />
                  <p style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-xs">NIKTO</p>
                </div>
                <div className="flex flex-col items-center">
                  <img src={imgWireshark} alt="Wireshark" className="w-12 h-12 object-contain mb-1" />
                  <p style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-xs">WIRESHARK</p>
                </div>
                <div className="flex flex-col items-center">
                  <img src={imgMetasploit} alt="Metasploit" className="w-12 h-12 object-contain mb-1" />
                  <p style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-xs">METASPLOIT</p>
                </div>
              </div>
              <p style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-xs text-white/65 text-right mb-auto">+5 Tools</p>
              <div className="my-6">
                <svg className="w-full h-[1px]" preserveAspectRatio="none">
                  <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="white" strokeOpacity="0.25" strokeDasharray="7 7" />
                </svg>
              </div>
              <p style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-sm text-white/55">
                Practical tool-driven security analysis.
              </p>
            </div>

            {/* Card 4 - OSINT */}
            <div className="bg-white/5 p-6 lg:p-8 flex flex-col h-full border border-white/10 hover:border-[#00D23B]/50 transition-all duration-300">
              <div className="flex items-start justify-between mb-12">
                <span style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 300 }} className="text-7xl lg:text-8xl text-white/65">4</span>
                <span style={{ fontFamily: 'Satoshi, sans-serif' }} className="text-xs text-white/65">[04]</span>
              </div>
              <h3 style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }} className="text-lg lg:text-xl text-[#66FF00] uppercase mb-6 text-center">OSINT</h3>
              <div style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="space-y-3 mb-auto text-base lg:text-lg">
                <p>Google Dorking</p>
                <p>DNS Analysis</p>
                <p>Username Enumeration</p>
                <p>Infrastructure Mapping</p>
              </div>
              <div className="my-6">
                <svg className="w-full h-[1px]" preserveAspectRatio="none">
                  <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="white" strokeOpacity="0.25" strokeDasharray="7 7" />
                </svg>
              </div>
              <p style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-sm text-white/55">Digital footprint investigation & exposure mapping.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Certifications */}
      <section id="certifications" className="relative min-h-screen py-16 lg:py-24 bg-black snap-start flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center gap-4 mb-4">
            <Terminal className="text-[#00D23B] w-6 h-6" />
            <h2 style={{ fontFamily: 'PP Mondwest, sans-serif' }} className="text-xl lg:text-2xl uppercase tracking-tight text-[#00D23B] font-medium">
              <TypingText text="Security Certifications" delay={300} />
            </h2>
            <span style={{ fontFamily: 'Satoshi, sans-serif' }} className="text-white/65 text-sm">[04]</span>
          </div>

          <p style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-sm md:text-base text-white/60 max-w-2xl mb-8 lg:mb-10">
            Accredited cybersecurity credentials validating structured offensive security methodologies, network reconnaissance, and threat mitigation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {liveCertificates.map((cert) => (
              <div
                key={cert.id}
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects - Hidden */}
      <section id="projects" className="hidden relative min-h-screen py-16 lg:py-24 bg-black snap-start flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12 lg:mb-16">
            <Terminal className="text-[#00D23B] w-6 h-6" />
            <h2 style={{ fontFamily: 'PP Mondwest, sans-serif' }} className="text-xl lg:text-2xl uppercase tracking-tight text-[#00D23B] font-medium">
              <TypingText text="Project Deployments" delay={400} />
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Project 1 */}
            <div className="group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Terminal className="text-gray-400 w-5 h-5" />
                  <span style={{ fontFamily: 'PP Mondwest, sans-serif' }} className="text-xl lg:text-2xl uppercase tracking-tight text-gray-400">Project 01</span>
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href="https://github.com/yourusername/project1" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#00D23B] transition-colors">
                    <Github className="w-6 h-6" />
                  </a>
                  <a href="https://project1-demo.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#00D23B] transition-colors">
                    <ExternalLink className="w-6 h-6" />
                  </a>
                </div>
              </div>

              <div className="aspect-square bg-white/5 rounded-lg overflow-hidden mb-6 flex items-center justify-center">
                <img
                  src={imgP1}
                  alt="Web Application Security Assessment"
                  className="w-full h-full object-contain scale-125"
                />
              </div>

              <h3 style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }} className="text-2xl lg:text-3xl xl:text-4xl mb-4">
                Web Application Security Assessment
              </h3>
              <p style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-lg lg:text-xl text-gray-400 leading-relaxed">
                Simulated black-box penetration test against vulnerable web environment.
              </p>
            </div>

            {/* Project 2 */}
            <div className="group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Terminal className="text-gray-400 w-5 h-5" />
                  <span style={{ fontFamily: 'PP Mondwest, sans-serif' }} className="text-xl lg:text-2xl uppercase tracking-tight text-gray-400">Project 02</span>
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href="https://github.com/yourusername/project2" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#00D23B] transition-colors">
                    <Github className="w-6 h-6" />
                  </a>
                  <a href="https://project2-demo.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#00D23B] transition-colors">
                    <ExternalLink className="w-6 h-6" />
                  </a>
                </div>
              </div>

              <div className="aspect-square bg-white/5 rounded-lg overflow-hidden mb-6 flex items-center justify-center">
                <img
                  src={imgP2}
                  alt="Encrypted File Vault"
                  className="w-full h-full object-contain scale-125"
                />
              </div>

              <h3 style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }} className="text-2xl lg:text-3xl xl:text-4xl mb-4">
                Encrypted File Vault
              </h3>
              <p style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-lg lg:text-xl text-gray-400 leading-relaxed">
                Secure file storage solution implementing AES-256 encryption with zero-knowledge architecture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="relative min-h-screen py-16 lg:py-24 bg-[#020202] overflow-hidden snap-start flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12">
            <Terminal className="text-[#00D23B] w-6 h-6" />
            <h2 style={{ fontFamily: 'PP Mondwest, sans-serif' }} className="text-xl lg:text-2xl uppercase tracking-tight text-[#00D23B] font-medium">
              <TypingText text="Tools" delay={600} />
            </h2>
            <span style={{ fontFamily: 'Satoshi, sans-serif' }} className="text-white/65 text-sm">[09]</span>
          </div>

          {/* Marquee Container */}
          <div className="relative">
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .marquee-content {
                animation: marquee 20s linear infinite;
              }
              .marquee-content:hover {
                animation-play-state: paused;
              }
            `}</style>
            
            <div className="flex">
              <div className="marquee-content flex items-center gap-20 lg:gap-32">
                {/* First set of tools */}
                {[
                  { img: imgNmap, name: 'NMAP' },
                  { img: imgNikto, name: 'NIKTO' },
                  { img: imgWireshark, name: 'WIRESHARK' },
                  { img: imgMetasploit, name: 'METASPLOIT' },
                  { img: imgHashcat, name: 'HASHCAT' },
                  { img: imgJtr, name: 'JOHN THE RIPPER' },
                  { img: imgMaltego, name: 'MALTEGO' },
                  { img: imgSqlmap, name: 'SQLMAP' },
                  { img: imgKaliLinux, name: 'KALI LINUX' }
                ].map((tool, index) => (
                  <div key={index} className="group relative flex-shrink-0">
                    <img 
                      src={tool.img} 
                      alt={tool.name} 
                      className="w-32 h-32 lg:w-40 lg:h-40 object-contain grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer" 
                    />
                    <span 
                      style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }}
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs lg:text-sm text-[#00D23B] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    >
                      {tool.name}
                    </span>
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {[
                  { img: imgNmap, name: 'NMAP' },
                  { img: imgNikto, name: 'NIKTO' },
                  { img: imgWireshark, name: 'WIRESHARK' },
                  { img: imgMetasploit, name: 'METASPLOIT' },
                  { img: imgHashcat, name: 'HASHCAT' },
                  { img: imgJtr, name: 'JOHN THE RIPPER' },
                  { img: imgMaltego, name: 'MALTEGO' },
                  { img: imgSqlmap, name: 'SQLMAP' },
                  { img: imgKaliLinux, name: 'KALI LINUX' }
                ].map((tool, index) => (
                  <div key={`dup-${index}`} className="group relative flex-shrink-0">
                    <img 
                      src={tool.img} 
                      alt={tool.name} 
                      className="w-32 h-32 lg:w-40 lg:h-40 object-contain grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer" 
                    />
                    <span 
                      style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500 }}
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs lg:text-sm text-[#00D23B] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    >
                      {tool.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative min-h-screen pt-16 lg:pt-24 pb-6 bg-black snap-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8 lg:mb-12">
            <Terminal className="text-[#00D23B] w-6 h-6" />
            <h2 style={{ fontFamily: 'PP Mondwest, sans-serif' }} className="text-xl lg:text-2xl uppercase tracking-tight text-[#00D23B] font-medium">
              <TypingText text="Initiate Communication" delay={800} />
            </h2>
          </div>

          <p style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-lg text-white/65 mb-12">
            Available for cybersecurity roles, collaboration opportunities, and security discussions.
          </p>

          <div className="grid lg:grid-cols-[380px,1fr] gap-6 lg:gap-8">
            {/* Left Column - Contact Info */}
            <div className="bg-[#0a0a0a] p-6 lg:p-8 space-y-0">
              {/* Email */}
              <div className="py-6">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="text-white w-4 h-4" />
                  <span style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-sm text-white/80">Email</span>
                </div>
                <a href="mailto:najmudeen.cs@gmail.com" className="flex items-start gap-3 hover:text-[#00D23B] transition-colors">
                  <Mail className="text-white w-5 h-5 mt-1 flex-shrink-0" />
                  <span style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-lg text-white break-all">najmudeen.cs@gmail.com</span>
                </a>
              </div>

              <div className="border-t border-dashed border-white/20" />

              {/* LinkedIn */}
              <div className="py-6">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="text-white w-4 h-4" />
                  <span style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-sm text-white/80">Linkedin</span>
                </div>
                <a href="https://www.linkedin.com/in/najmudeen007/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#00D23B] transition-colors">
                  <Linkedin className="text-white w-5 h-5" />
                  <span style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-lg text-white">najmudeen007</span>
                </a>
              </div>

              <div className="border-t border-dashed border-white/20" />

              {/* GitHub */}
              <div className="py-6">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="text-white w-4 h-4" />
                  <span style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-sm text-white/80">Github</span>
                </div>
                <a href="https://github.com/Najmudeen-cs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#00D23B] transition-colors">
                  <Github className="text-white w-5 h-5" />
                  <span style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-lg text-white">Najmudeen-cs</span>
                </a>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-[#0a0a0a]">
              {/* Terminal Header */}
              <div className="bg-white h-10 flex items-center px-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span style={{ fontFamily: 'Fragment Mono, monospace' }} className="ml-4 text-black text-xs uppercase tracking-wide">
                  Secure Message Interface
                </span>
              </div>

              {/* Form Content */}
              <div className="p-5 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label style={{ fontFamily: 'Fragment Mono, monospace' }} className="block text-[#66FF00] mb-3 text-sm">
                        Identifier
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder=" Ghost"
                        style={{ fontFamily: 'Fragment Mono, monospace' }}
                        className="w-full bg-transparent border border-white/30 px-4 py-3 text-white/75 placeholder:text-white/30 focus:border-[#66FF00] focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily: 'Fragment Mono, monospace' }} className="block text-[#66FF00] mb-3 text-sm">
                        Contact Channel
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ghost@gmail.com"
                        style={{ fontFamily: 'Fragment Mono, monospace' }}
                        className="w-full bg-transparent border border-white/30 px-4 py-3 text-white/75 placeholder:text-white/30 focus:border-[#66FF00] focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontFamily: 'Fragment Mono, monospace' }} className="block text-[#66FF00] mb-3 text-sm">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Transmit your message..."
                      rows={6}
                      style={{ fontFamily: 'Fragment Mono, monospace' }}
                      className="w-full bg-transparent border border-white/30 px-4 py-3 text-white/75 placeholder:text-white/30 focus:border-[#66FF00] focus:outline-none resize-none text-sm"
                    />
                  </div>

                  {/* Status Message */}
                  {statusMessage && (
                    <div 
                      style={{ fontFamily: 'Fragment Mono, monospace' }}
                      className={`p-3 text-sm flex items-center justify-between ${formStatus === 'success' ? 'bg-[#00D23B]/20 text-[#00D23B] border border-[#00D23B]/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}
                    >
                      <span>{formStatus === 'success' ? '✓' : '✗'} {statusMessage}</span>
                      <button
                        type="button"
                        onClick={() => { setStatusMessage(''); setFormStatus('idle'); }}
                        className="ml-3 hover:opacity-70 transition-opacity"
                        aria-label="Close message"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      style={{ fontFamily: 'Fragment Mono, monospace' }}
                      className={`border border-[#66FF00] text-[#66FF00] px-8 py-3 uppercase text-xs tracking-wider transition-all duration-300 ${formStatus === 'sending' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#66FF00] hover:text-black'}`}
                    >
                      {formStatus === 'sending' ? 'Transmitting...' : 'Transmit'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2">
              <p style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-white/60 text-sm">
                © 2026 Najmudeen | All rights reserved
              </p>
              <p style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }} className="text-white/60 text-sm">
                Engineered by Madras Web Company
              </p>
              <p style={{ fontFamily: 'Fragment Mono, monospace' }} className="pt-1">
                <a href="/login" className="text-white/25 hover:text-[#00D23B] text-[11px] transition-colors">
                  [SYSTEM_ACCESS // ADMIN_CONSOLE]
                </a>
              </p>
            </div>
          </div>
        </footer>
      </section>



      {/* Inspection Modal */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedCert(null)}
        >
          <div 
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
          </div>
        </div>
      )}

    </div>
  );
}
