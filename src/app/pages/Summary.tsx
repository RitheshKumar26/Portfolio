import { motion } from 'motion/react';
import { PageHeading, Stagger, Item } from '../components/motion';
import { TerminalTyping } from '../components/Typing';

export default function Summary() {
  return (
    <section id="summary" className="relative min-h-screen pt-28 lg:pt-36 pb-16 lg:pb-24 bg-black flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <PageHeading title="Executive Summary" />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <TerminalTyping
              commands={[
                'Network Reconnaissance...',
                'OSINT & Digital Footprinting...',
                'Attack Surface Analysis...',
              ]}
            />
          </motion.div>

          <Stagger
            delay={0.15}
            delayChildren={0.35}
            style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }}
            className="text-white/65 space-y-4 leading-relaxed text-base md:text-lg lg:text-[22px]"
          >
            <Item>
              <p>
                I am an aspiring{' '}
                <span style={{ fontWeight: 700 }} className="text-[#66FF00] uppercase">
                  Cybersecurity Analyst
                </span>{' '}
                with practical experience in network reconnaissance, OSINT investigations, and infrastructure
                analysis.
              </p>
            </Item>
            <Item>
              <p>
                My work focuses on understanding how systems are exposed, how digital footprints are mapped, and
                how potential threats can be identified before they escalate.
              </p>
            </Item>
            <Item>
              <p>
                My goal is to contribute to threat intelligence and security operations environments where
                structured analysis, reconnaissance skills, and continuous learning are essential.
              </p>
            </Item>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
