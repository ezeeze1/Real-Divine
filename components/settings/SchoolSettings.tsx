'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { Settings, Building2, Save, Sparkles, ShieldCheck, KeyRound, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export const SchoolSettings: React.FC = () => {
  const { schoolProfile, updateSchoolProfile, currentUser, changeAdminPassword, adminPassword } = useSchool();

  const [name, setName] = useState(schoolProfile.name);
  const [motto, setMotto] = useState(schoolProfile.motto);
  const [address, setAddress] = useState(schoolProfile.address);
  const [phone, setPhone] = useState(schoolProfile.phone);
  const [email, setEmail] = useState(schoolProfile.email);
  const [session, setSession] = useState(schoolProfile.currentSession);
  const [term, setTerm] = useState(schoolProfile.currentTerm);
  const [principalName, setPrincipalName] = useState(schoolProfile.principalName);

  // Password Change State
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passFeedback, setPassFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
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

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassFeedback(null);

    if (newPass !== confirmPass) {
      setPassFeedback({ type: 'error', msg: 'New password and confirmation password do not match.' });
      return;
    }

    const res = changeAdminPassword(oldPass, newPass);
    if (res.success) {
      setPassFeedback({ type: 'success', msg: res.message || 'Admin password changed successfully!' });
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setPassFeedback({ type: 'error', msg: res.message || 'Failed to update admin password.' });
    }
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
      <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 text-xs">
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

      {/* Admin Password Security Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-purple-700" />
              Admin Password & Authentication Settings
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Change the system administrator password at will. All future admin logins will require this updated password.
            </p>
          </div>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 border border-purple-200 rounded-full font-bold text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
            Active Password: {adminPassword}
          </span>
        </div>

        {passFeedback && (
          <div
            className={`p-3.5 rounded-2xl border font-semibold flex items-center gap-2.5 text-xs ${
              passFeedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {passFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{passFeedback.msg}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Current Admin Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type={showOldPass ? 'text' : 'password'}
                required
                placeholder="Enter your current admin password..."
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowOldPass(!showOldPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">New Admin Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  placeholder="Min 4 characters..."
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Confirm New Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  placeholder="Re-enter new password..."
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs transition shadow-xs flex items-center gap-1.5"
            >
              <KeyRound className="w-4 h-4" />
              Update Admin Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
