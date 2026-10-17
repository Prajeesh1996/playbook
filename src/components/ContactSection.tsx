import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, Send, CheckCircle2, ChevronDown, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FAQ_ITEMS } from '../data/initialData';

export const ContactSection: React.FC = () => {
  const { submitContactMessage } = useApp();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Question',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    submitContactMessage(form);
    setSubmitted(true);
    setForm({
      name: '',
      email: '',
      phone: '',
      subject: 'General Question',
      message: '',
    });
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-gradient-to-b from-[#FFFDF5] to-[#FFF9D2]/30 border-t border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black tracking-wide mb-2">
            WE ARE HERE TO HELP
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-neutral-900 tracking-tight">
            Get in Touch with Us! 💌
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 font-medium">
            Have questions about digital downloads, printing tips, or custom school packages? Our friendly support team is always glad to assist!
          </p>
        </div>

        {/* 2-Column Grid: Contact Form & FAQ Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form & Quick Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-200 shadow-lg">
              <h3 className="font-heading font-extrabold text-lg text-neutral-900 mb-4">
                Send Us a Note
              </h3>

              {submitted ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-heading font-extrabold text-emerald-950 text-base">
                    Message Received!
                  </h4>
                  <p className="text-xs text-emerald-800 font-medium">
                    We've received your note and will reply to your email within a few hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohini Menon"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="parent@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Your Message *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="How can we help you or your little artist today?"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-bold bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-[#FFD93D] hover:bg-[#ffdf59] text-neutral-900 font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer border border-amber-400"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>

            {/* Quick Contact Badges */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href="mailto:support@littlecolourworld.com"
                className="p-3.5 rounded-2xl bg-white border border-neutral-200 hover:border-amber-400 flex items-center gap-2.5 text-xs font-bold text-neutral-800 transition-colors shadow-2xs"
              >
                <Mail className="w-4 h-4 text-[#FF8A65]" />
                <div>
                  <div className="text-[10px] text-neutral-400">Support Email</div>
                  <div className="truncate">support@littlecolourworld.com</div>
                </div>
              </a>

              <a
                href="https://wa.me/919876543210?text=Hi%20Little%20Colour%20World!%20I%20have%20a%20question%20about%20your%20colouring%20books."
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 hover:border-emerald-400 flex items-center gap-2.5 text-xs font-bold text-emerald-900 transition-colors shadow-2xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-current" />
                <div>
                  <div className="text-[10px] text-emerald-600">WhatsApp Chat</div>
                  <div>Chat on WhatsApp</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <h3 className="font-heading font-extrabold text-xl text-neutral-900">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-amber-200/80 shadow-2xs overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-heading font-extrabold text-sm sm:text-base text-neutral-900 hover:text-amber-800 cursor-pointer"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-amber-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium border-t border-neutral-100 pt-3">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
