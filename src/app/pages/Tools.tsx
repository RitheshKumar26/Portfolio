import { motion } from 'motion/react';
import { PageHeading } from '../components/motion';
import imgNmap from '../../assets/nmap.png';
import imgNikto from '../../assets/nikto.png';
import imgWireshark from '../../assets/wireshark.png';
import imgMetasploit from '../../assets/metasploit.png';
import imgHashcat from '../../assets/Hashcat.png';
import imgJtr from '../../assets/jtr.png';
import imgMaltego from '../../assets/maltego.png';
import imgSqlmap from '../../assets/sqlmap.png';
import imgKaliLinux from '../../assets/Kali linux.png';

const TOOLS = [
  { img: imgNmap, name: 'NMAP' },
  { img: imgNikto, name: 'NIKTO' },
  { img: imgWireshark, name: 'WIRESHARK' },
  { img: imgMetasploit, name: 'METASPLOIT' },
  { img: imgHashcat, name: 'HASHCAT' },
  { img: imgJtr, name: 'JOHN THE RIPPER' },
  { img: imgMaltego, name: 'MALTEGO' },
  { img: imgSqlmap, name: 'SQLMAP' },
  { img: imgKaliLinux, name: 'KALI LINUX' },
];

export default function Tools() {
  return (
    <section id="tools" className="relative min-h-screen pt-28 lg:pt-36 pb-16 lg:pb-24 bg-[#020202] overflow-hidden flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <PageHeading title="Tools" delay={600} badge="[09]" className="mb-16" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        className="relative"
      >
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-content { animation: marquee 20s linear infinite; }
          .marquee-content:hover { animation-play-state: paused; }
        `}</style>

        <div className="flex">
          <div className="marquee-content flex items-center gap-20 lg:gap-32 pr-20 lg:pr-32">
            {[...TOOLS, ...TOOLS].map((tool, index) => (
              <div key={index} className="group relative flex-shrink-0">
                <img
                  src={tool.img}
                  alt={tool.name}
                  className="w-32 h-32 lg:w-40 lg:h-40 object-contain grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300 cursor-pointer"
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
      </motion.div>
    </section>
  );
}
