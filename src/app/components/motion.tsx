import { motion, type HTMLMotionProps, type Variants } from 'motion/react';
import { Terminal } from 'lucide-react';
import { TypingText } from './Typing';

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Container that staggers its <Item> children when it scrolls into view. */
export const stagger = (delay = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren } },
});

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function Stagger({
  children,
  delay = 0.08,
  delayChildren = 0,
  ...rest
}: HTMLMotionProps<'div'> & { delay?: number; delayChildren?: number }) {
  return (
    <motion.div
      variants={stagger(delay, delayChildren)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Item({ children, ...rest }: HTMLMotionProps<'div'>) {
  return (
    <motion.div variants={fadeUp} {...rest}>
      {children}
    </motion.div>
  );
}

/** Section heading used on every page: icon + typing title, with a drawn underline. */
export function PageHeading({
  title,
  delay = 0,
  badge,
  className = 'mb-8 lg:mb-12',
}: {
  title: string;
  delay?: number;
  badge?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={className}
    >
      <div className="flex items-center gap-4">
        <motion.span
          initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
          whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="inline-flex"
        >
          <Terminal className="text-[#00D23B] w-6 h-6" />
        </motion.span>
        <h2
          style={{ fontFamily: 'PP Mondwest, sans-serif' }}
          className="text-xl lg:text-2xl uppercase tracking-tight text-[#00D23B] font-medium"
        >
          <TypingText text={title} delay={delay} />
        </h2>
        {badge && (
          <span style={{ fontFamily: 'Satoshi, sans-serif' }} className="text-white/65 text-sm">
            {badge}
          </span>
        )}
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
        style={{ originX: 0 }}
        className="mt-4 h-px w-full bg-gradient-to-r from-[#00D23B]/60 via-white/10 to-transparent"
      />
    </motion.div>
  );
}
