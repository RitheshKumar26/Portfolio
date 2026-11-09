import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import imgNaju from '../../assets/naju.png';
import { EASE } from '../components/motion';

const NAME = 'Najmudeen';

export default function Home() {
  const base = 2;

  return (
    <section id="hero" className="relative h-screen overflow-hidden bg-black">
      {/* Background linear gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, #000000 0%, #1B1B1B 52%, #292929 71%, #3F3F3F 100%)' }}
      />

      {/* Portrait — slow settle-in */}
      <div className="absolute inset-0 flex justify-center items-start pointer-events-none">
        <motion.img
          src={imgNaju}
          alt="Najmudeen"
          initial={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.6, ease: EASE, delay: base - 0.2 }}
          className="h-[95vh] w-auto object-cover object-top grayscale"
        />
      </div>

      {/* Bottom gradient — fades image into black */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[55%] z-10"
        style={{ background: 'linear-gradient(to top, #000 25%, transparent 100%)' }}
      />

      {/* Bio text — desktop */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: base }}
        className="absolute z-30 hidden md:block"
        style={{ bottom: '28%', right: '10%', maxWidth: '580px' }}
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
        <button
          type="button"
          onClick={() => document.getElementById("summary")?.scrollIntoView({ behavior: "smooth" })}
          style={{ fontFamily: 'Fragment Mono, monospace' }}
          className="mt-5 cursor-pointer inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#00D23B] hover:text-white border-b border-[#00D23B]/40 hover:border-white pb-0.5 transition-colors"
        >
          Read summary <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* Bio text — mobile */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: base }}
        className="absolute z-30 md:hidden px-6"
        style={{ bottom: '18%', right: 0, left: 0 }}
      >
        <p
          className="text-white/65 text-right"
          style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: '1.5' }}
        >
          Hi, I'm Najmudeen. My work centers around understanding how systems are exposed, how information is
          discovered, and how threats can be identified before they escalate.
        </p>
      </motion.div>

      {/* NAJMUDEEN — massive name, letters rise in one by one */}
      <h1
        aria-label={NAME}
        className="absolute bottom-0 left-0 w-full z-20 uppercase text-white leading-[0.82] pl-4 sm:pl-10 lg:pl-25 text-[40px] sm:text-[70px] md:text-[100px] lg:text-[150px] flex overflow-hidden"
        style={{ fontFamily: 'Sooner, sans-serif' }}
      >
        {NAME.split('').map((ch, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            initial={{ y: '105%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: base + 0.3 + i * 0.05 }}
            className="inline-block"
          >
            {ch}
          </motion.span>
        ))}
      </h1>
    </section>
  );
}
