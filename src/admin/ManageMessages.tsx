import { useState, useEffect } from 'react';
import { fetchContactMessages, deleteContactMessage, DBContactMessage } from '../lib/supabase';
import { Mail, Trash2, Calendar, User, AtSign, Eye, X } from 'lucide-react';

export default function ManageMessages() {
  const [messages, setMessages] = useState<DBContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<DBContactMessage | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchContactMessages();
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete message from "${name}"?`)) return;
    await deleteContactMessage(id);
    setMessages(messages.filter((m) => m.id !== id));
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 style={{ fontFamily: 'PP Mondwest, monospace' }} className="text-2xl lg:text-3xl text-white">
          INBOX INQUIRIES
        </h1>
        <p className="text-xs text-white/50 font-mono mt-1">
          Review encrypted messages received via the portfolio terminal contact interface.
        </p>
      </div>

      <div className="bg-[#0a0a0a] border border-white/10 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/5 border-b border-white/10 text-white/60 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Identifier</th>
                <th className="py-3 px-4">Contact Channel</th>
                <th className="py-3 px-4">Message Preview</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {messages.map((m) => (
                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-white/40 whitespace-nowrap">
                    {new Date(m.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#66FF00] whitespace-nowrap">
                    {m.name}
                  </td>
                  <td className="py-3 px-4 text-white/70 whitespace-nowrap">
                    <a href={`mailto:${m.email}`} className="hover:text-[#00D23B] transition-colors">
                      {m.email}
                    </a>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-white/60">
                    {m.message}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedMessage(m)}
                        className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded cursor-pointer"
                        title="View Full Message"
                      >
                        Read
                      </button>
                      <button
                        onClick={() => handleDelete(m.id, m.name)}
                        className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {messages.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-white/40">
                    No messages received yet. All contact form submissions will appear here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Reader Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-lg w-full bg-[#0a0a0a] border border-[#00D23B]/50 rounded p-6 space-y-4 font-mono text-xs shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <span className="text-[#00D23B] font-bold tracking-wider uppercase">
                INQUIRY_PAYLOAD // RECORD
              </span>
              <button onClick={() => setSelectedMessage(null)} className="text-white/60 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 bg-black/60 p-4 border border-white/10 rounded">
              <div className="flex items-center gap-2 text-white/50">
                <Calendar className="w-3.5 h-3.5 text-[#00D23B]" />
                <span>TIMESTAMP:</span>
                <span className="text-white">{new Date(selectedMessage.created_at).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <User className="w-3.5 h-3.5 text-[#00D23B]" />
                <span>FROM:</span>
                <span className="text-[#66FF00] font-bold">{selectedMessage.name}</span>
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <AtSign className="w-3.5 h-3.5 text-[#00D23B]" />
                <span>CHANNEL:</span>
                <a href={`mailto:${selectedMessage.email}`} className="text-white hover:text-[#00D23B] underline">
                  {selectedMessage.email}
                </a>
              </div>
            </div>

            <div>
              <label className="block text-white/50 mb-2 uppercase text-[11px]">TRANSMITTED PAYLOAD:</label>
              <div className="bg-black/60 p-4 border border-white/10 rounded text-white/90 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <a
                href={`mailto:${selectedMessage.email}?subject=RE: Portfolio Inquiry&body=Hi ${selectedMessage.name},%0D%0A%0D%0A`}
                className="bg-[#00D23B] text-black font-bold px-4 py-2 hover:bg-[#66FF00] transition-colors"
              >
                REPLY VIA EMAIL
              </a>
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 border border-white/20 text-white/70 hover:text-white"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
