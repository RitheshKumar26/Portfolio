import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { EASE } from './components/motion';
import Home from './pages/Home';
import Summary from './pages/Summary';
import Skills from './pages/Skills';
import Certifications from './pages/Certifications';
import Tools from './pages/Tools';
import Contact from './pages/Contact';

export type { Certificate } from './data';

const NAV_ITEMS = [
  { label: 'Summary', id: 'summary' },
  { label: 'Skills', id: 'skills' },
  { label: 'Certifications', id: 'certifications' },
  { label: 'Tools', id: 'tools' },
  { label: 'Contact', id: 'contact' },
];

/** Letter-roll hover label used by the desktop menu */
function RollLabel({ text }: { text: string }) {
  const letters = text.split('');
  return (
    <>
      <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">
        {letters.map((letter, i) => (
          <span key={i} className="inline-block" style={{ transitionDelay: `${i * 30}ms` }}>
            {letter}
          </span>
        ))}
      </span>
      <span className="absolute left-0 top-full transition-transform duration-500 group-hover:-translate-y-full">
        {letters.map((letter, i) => (
          <span key={i} className="inline-block" style={{ transitionDelay: `${i * 30}ms` }}>
            {letter}
          </span>
        ))}
      </span>
    </>
  );
}

function Preloader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 bg-black origin-top"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [frosted, setFrosted] = useState(false);
  const [active, setActive] = useState<string>('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  // Frost the navbar once scrolled past the hero; track the active section.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const heroHeight = document.getElementById('hero')?.offsetHeight ?? window.innerHeight;
      setFrosted(el.scrollTop > heroHeight - 80);
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { root: el, threshold: 0.5 }
    );
    ['hero', ...NAV_ITEMS.map((n) => n.id)].forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });

    return () => {
      el.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={scrollRef}
        className="bg-black text-white h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      >
        {isLoading && <Preloader onDone={() => setIsLoading(false)} />}

        {/* Navigation */}
        <motion.nav
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 1.6 }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            frosted
              ? 'bg-black/40 backdrop-blur-md border-b border-white/10'
              : 'bg-transparent backdrop-blur-none border-b border-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen((o) => !o)}
                className="lg:hidden flex flex-col justify-center items-center w-8 h-8 p-2 -ml-2 relative z-50"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <motion.span
                  className="w-7 h-[3px] bg-[#00D23B] absolute"
                  animate={mobileMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }}
                  transition={{ duration: 0.3, ease: EASE }}
                />
                <motion.span
                  className="w-7 h-[3px] bg-[#00D23B] absolute"
                  animate={mobileMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }}
                  transition={{ duration: 0.3, ease: EASE }}
                />
              </button>

              <button
                onClick={() => scrollToSection('hero')}
                aria-label="Back to top"
                style={{ fontFamily: 'Sooner, sans-serif' }}
                className="relative z-50 text-2xl lg:text-4xl tracking-tight text-white uppercase hover:text-[#00D23B] transition-colors duration-300 cursor-pointer"
              >
                <motion.span
                  className="inline-block"
                  whileHover={{ rotate: -8, scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  ¶
                </motion.span>
              </button>

              {/* Desktop menu */}
              <div className="hidden lg:flex items-center gap-8 xl:gap-12 ml-auto mr-8">
                {NAV_ITEMS.map((item) => {
                  const isActive = active === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      style={{ fontFamily: 'PP Mondwest, sans-serif', fontSize: '20px' }}
                      className={`relative uppercase transition-colors duration-500 group h-8 cursor-pointer ${
                        isActive ? 'text-[#00D23B]' : 'text-white/80 hover:text-[#00D23B]'
                      }`}
                    >
                      <span className="relative block overflow-hidden h-8">
                        <RollLabel text={item.label} />
                      </span>
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[#00D23B]"
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 lg:gap-3 px-3 py-2">
                <div className="relative">
                  <div className="w-2 h-2 bg-[#00D23B] rounded-full" />
                  <div className="absolute inset-0 bg-[#00D23B] rounded-full animate-ping opacity-40" />
                </div>
                <span
                  style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700, letterSpacing: '0px' }}
                  className="text-[#00D23B] text-xs lg:text-sm uppercase"
                >
                  Online
                </span>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 bg-black z-40"
            >
              <div className="flex flex-col items-center justify-center h-full space-y-8">
                {NAV_ITEMS.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.45, ease: EASE, delay: 0.08 + index * 0.07 }}
                    onClick={() => scrollToSection(item.id)}
                    style={{ fontFamily: 'PP Mondwest, sans-serif' }}
                    className={`text-3xl uppercase transition-colors ${
                      active === item.id ? 'text-[#00D23B]' : 'text-white/80 hover:text-[#00D23B]'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sections */}
        <div className="snap-start"><Home /></div>
        <div className="snap-start"><Summary /></div>
        <div className="snap-start"><Skills /></div>
        <div className="snap-start"><Certifications /></div>
        <div className="snap-start"><Tools /></div>
        <div className="snap-start">
          <Contact />
          <footer className="pb-6 -mt-4 bg-black">
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
        </div>
      </div>
    </MotionConfig>
  );
}
