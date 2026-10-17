import React, { useState } from 'react';
import { School, CheckCircle2, Send, Users, Sparkles, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SchoolPacksSection: React.FC = () => {
  const { submitSchoolEnquiry } = useApp();

  const [formData, setFormData] = useState({
    schoolName: '',
    contactPerson: '',
    email: '',
    phone: '',
    studentCount: '50-100',
    gradeLevel: 'Playgroup & Nursery',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.schoolName || !formData.email || !formData.phone) return;

    submitSchoolEnquiry(formData);
    setSubmitted(true);
    setFormData({
      schoolName: '',
      contactPerson: '',
      email: '',
      phone: '',
      studentCount: '50-100',
      gradeLevel: 'Playgroup & Nursery',
      message: '',
    });
  };

  const packFeatures = [
    {
      title: 'Nursery Worksheet Packs',
      desc: 'Big outlines, tactile tracing, and finger motor dexterity exercises.',
      tag: 'Playgroup & Nursery',
      color: '#FFF9D2',
    },
    {
      title: 'LKG Colouring & Phonics',
      desc: 'Alphabet identification, basic counting 1-10, and shape matching sheets.',
      tag: 'Lower KG',
      color: '#E3F6FF',
    },
    {
      title: 'UKG Kindergarten Workbooks',
      desc: 'Sight words, numbers 1-50, pattern mazes, and early science prompts.',
      tag: 'Upper KG',
      color: '#EBFCEE',
    },
    {
      title: 'Monthly Festival & Seasonal Packs',
      desc: 'Cultural celebration worksheets for school annual events and crafts.',
      tag: 'All Grades',
      color: '#FFE8EC',
    },
  ];

  return (
    <section id="school-packs" className="py-16 sm:py-20 bg-gradient-to-b from-[#FFFDF5] to-[#E0E7FF]/30 border-t border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-black tracking-wide mb-2">
            <School className="w-3.5 h-3.5 text-indigo-600" />
            PLAYSCHOOLS, NURSERIES &amp; EDUCATORS
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-neutral-900 tracking-tight">
            Creative Learning for Every Classroom! 🏫
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 font-medium">
            Empower your preschool teachers with printable curriculum-aligned activity PDFs.
            Unlimited classroom printing rights for early childhood centres.
          </p>
        </div>

        {/* 2-Column Split: Packs Overview & Enquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Pack Tiers and Benefits */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packFeatures.map((pack, idx) => (
                <div
                  key={idx}
                  style={{ backgroundColor: pack.color }}
                  className="rounded-3xl p-5 border-2 border-neutral-200/80 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-700 bg-white/80 px-2 py-0.5 rounded-full">
                      {pack.tag}
                    </span>
                    <h3 className="font-heading font-extrabold text-sm sm:text-base text-neutral-900 mt-2">
                      {pack.title}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {pack.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-black/5 flex items-center gap-1 text-[11px] font-extrabold text-neutral-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Includes Unlimited School Print License</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Educator Benefits Strip */}
            <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 shadow-xs space-y-3">
              <h4 className="font-heading font-extrabold text-sm text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Why 120+ Playschools Choose Little Colour World:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-neutral-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Customized with your school logo
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Print fresh copies for all batches
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Cost-effective bulk institution pricing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Immediate GST invoice &amp; tax receipts
                </li>
              </ul>
            </div>
          </div>

          {/* Right: School Enquiry Form */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-200 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-neutral-900">
                  School &amp; Institutional Enquiry
                </h3>
                <p className="text-xs text-neutral-500 font-bold">
                  Get a personalized sample pack &amp; school pricing quote
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-heading font-extrabold text-lg text-emerald-900">
                  Thank You for Your School Enquiry! 🎉
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  Our curriculum coordinator will reach out to you within 24 hours with a tailored sample workbook and institution licensing rates.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      School / Daycare Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Little Blossoms Playschool"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-neutral-50 text-xs font-bold text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anita Sharma (Principal)"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-neutral-50 text-xs font-bold text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="school@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-neutral-50 text-xs font-bold text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-neutral-50 text-xs font-bold text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Approx. Number of Students
                    </label>
                    <select
                      value={formData.studentCount}
                      onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-neutral-50 text-xs font-bold text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <option value="Under 50">Under 50 students</option>
                      <option value="50-100">50 - 100 students</option>
                      <option value="100-250">100 - 250 students</option>
                      <option value="250+">250+ students (Multi-branch)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Primary Age / Grade Level
                    </label>
                    <select
                      value={formData.gradeLevel}
                      onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-neutral-50 text-xs font-bold text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <option value="Playgroup & Nursery">Playgroup &amp; Nursery (Ages 2-3)</option>
                      <option value="LKG">LKG (Ages 3-4)</option>
                      <option value="UKG">UKG (Ages 4-5)</option>
                      <option value="All Preschool Grades">All Preschool Grades</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Specific Requirements / Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your curriculum schedule or specific topics needed (e.g. tracing, festival themes)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-neutral-50 text-xs font-bold text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send School Packs Enquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
