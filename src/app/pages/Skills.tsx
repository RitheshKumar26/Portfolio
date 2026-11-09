import { motion } from 'motion/react';
import { PageHeading, Stagger, fadeUp } from '../components/motion';
import imgNmap from '../../assets/nmap.png';
import imgNikto from '../../assets/nikto.png';
import imgWireshark from '../../assets/wireshark.png';
import imgMetasploit from '../../assets/metasploit.png';
import imgKaliLinux from '../../assets/Kali linux.png';
import imgWindows from '../../assets/windows.png';

export default function Skills() {
  return (
    <section id="skills" className="relative min-h-screen pt-28 lg:pt-36 pb-16 lg:pb-24 bg-black flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <PageHeading title="Operational Capabilities" delay={200} className="mb-12 lg:mb-16" />

        <Stagger delay={0.12} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Card 1 - Networking */}
            <motion.div variants={fadeUp} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="bg-white/5 p-6 lg:p-8 flex flex-col h-full border border-white/10 hover:border-[#00D23B]/50 hover:shadow-[0_0_30px_-10px_rgba(0,210,59,0.35)] transition-[border-color,box-shadow] duration-300">
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
            </motion.div>

            {/* Card 2 - Operating Systems */}
            <motion.div variants={fadeUp} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="bg-white/5 p-6 lg:p-8 flex flex-col h-full border border-white/10 hover:border-[#00D23B]/50 hover:shadow-[0_0_30px_-10px_rgba(0,210,59,0.35)] transition-[border-color,box-shadow] duration-300">
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
            </motion.div>

            {/* Card 3 - Tools */}
            <motion.div variants={fadeUp} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="bg-white/5 p-6 lg:p-8 flex flex-col h-full border border-white/10 hover:border-[#00D23B]/50 hover:shadow-[0_0_30px_-10px_rgba(0,210,59,0.35)] transition-[border-color,box-shadow] duration-300">
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
            </motion.div>

            {/* Card 4 - OSINT */}
            <motion.div variants={fadeUp} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="bg-white/5 p-6 lg:p-8 flex flex-col h-full border border-white/10 hover:border-[#00D23B]/50 hover:shadow-[0_0_30px_-10px_rgba(0,210,59,0.35)] transition-[border-color,box-shadow] duration-300">
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
            </motion.div>
        </Stagger>
      </div>
    </section>
  );
}
