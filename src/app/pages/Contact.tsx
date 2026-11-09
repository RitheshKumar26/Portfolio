import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Github, Linkedin, Terminal, X } from 'lucide-react';
import { PageHeading, Stagger, Item, EASE } from '../components/motion';
import { recordContactMessage } from '../../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

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
    <section id="contact" className="relative min-h-screen pt-28 lg:pt-36 pb-10 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeading title="Initiate Communication" delay={800} />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }}
          className="text-lg text-white/65 mb-12"
        >
          Available for cybersecurity roles, collaboration opportunities, and security discussions.
        </motion.p>

        <Stagger delay={0.15} className="grid lg:grid-cols-[380px,1fr] gap-6 lg:gap-8">
          <Item className="bg-[#0a0a0a] p-6 lg:p-8 space-y-0">
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
        </Item>

        {/* Right Column - Contact Form */}
        <Item className="bg-[#0a0a0a]">
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
              <AnimatePresence>{statusMessage && (
                <motion.div initial={{ opacity: 0, y: -8 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} exit={{ opacity: 0, y: -8 }} 
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
                </motion.div>
              )}</AnimatePresence>

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
        </Item>
        </Stagger>
      </div>
    </section>
  );
}
