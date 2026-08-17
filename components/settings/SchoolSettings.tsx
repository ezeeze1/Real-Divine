'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { Settings, Building2, Save, Sparkles, ShieldCheck } from 'lucide-react';

export const SchoolSettings: React.FC = () => {
  const { schoolProfile, updateSchoolProfile } = useSchool();

  const [name, setName] = useState(schoolProfile.name);
  const [motto, setMotto] = useState(schoolProfile.motto);
  const [address, setAddress] = useState(schoolProfile.address);
  const [phone, setPhone] = useState(schoolProfile.phone);
  const [email, setEmail] = useState(schoolProfile.email);
  const [session, setSession] = useState(schoolProfile.currentSession);
  const [term, setTerm] = useState(schoolProfile.currentTerm);
  const [principalName, setPrincipalName] = useState(schoolProfile.principalName);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile({
      name,
      motto,
      address,
      phone,
      email,
      currentSession: session,
      currentTerm: term as any,
      principalName,
    });
    alert('School Profile & Term settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-700" />
            School Profile & Academic Term Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure Divine Academy secondary school identity, current session, and principal endorsements.
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 text-xs">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
            School Identity & Contact Info
          </h3>

          <div>
            <label className="block font-bold text-slate-700 mb-1">School Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">School Motto</label>
              <input
                type="text"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Principal&apos;s Full Name</label>
              <input
                type="text"
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">School Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-3 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Active Academic Session & Term
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Academic Session</label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              >
                <option value="2025/2026">2025/2026 Academic Session</option>
                <option value="2024/2025">2024/2025 Academic Session</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Active Term</label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              >
                <option value="1st Term">1st Term</option>
                <option value="2nd Term">2nd Term</option>
                <option value="3rd Term">3rd Term</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            Save Profile Settings
          </button>
        </div>
      </form>
    </div>
  );
};
