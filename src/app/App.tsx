import { Terminal, Mail, Github, Linkedin, ExternalLink } from 'lucide-react';

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
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
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
              {['Summary', 'Skills', 'Projects', 'Tools', 'Contact'].map((item) => (
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
          {['Summary', 'Skills', 'Projects', 'Tools', 'Contact'].map((item, index) => (
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

      {/* Projects */}
      <section id="projects" className="relative min-h-screen py-16 lg:py-24 bg-black snap-start flex flex-col justify-center">
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
                        placeholder="Bhai"
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
                        placeholder="bhai@gmail.com"
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
                      placeholder="Your message here"
                      rows={6}
                      style={{ fontFamily: 'Fragment Mono, monospace' }}
                      className="w-full bg-transparent border border-white/30 px-4 py-3 text-white/75 placeholder:text-white/30 focus:border-[#66FF00] focus:outline-none resize-none text-sm"
                    />
                  </div>

                  {/* Status Message */}
                  {statusMessage && (
                    <div 
                      style={{ fontFamily: 'Fragment Mono, monospace' }}
                      className={`p-3 text-sm ${formStatus === 'success' ? 'bg-[#00D23B]/20 text-[#00D23B] border border-[#00D23B]/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}
                    >
                      {formStatus === 'success' ? '✓' : '✗'} {statusMessage}
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
            </div>
          </div>
        </footer>
      </section>


    </div>
  );
}
