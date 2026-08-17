'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { UserRole } from '@/lib/types';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  BookOpen,
  User,
  Bell,
  RefreshCw,
  Sparkles,
  ChevronDown,
  LogOut,
  Building2,
  PhoneCall,
  Mail,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, switchUserRole, schoolProfile, resetDataToDefaults } = useSchool();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);

  const rolesList: { role: UserRole; label: string; icon: React.ReactNode; badgeColor: string }[] = [
    {
      role: 'ADMIN',
      label: 'Administrator (Principal / VP)',
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" />,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    {
      role: 'TEACHER',
      label: 'Subject Teacher (Mr. Ibrahim Sule)',
      icon: <UserCheck className="w-4 h-4 text-blue-600" />,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
      role: 'STUDENT',
      label: 'Student (Divine Johnson - JSS1)',
      icon: <GraduationCap className="w-4 h-4 text-emerald-600" />,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      role: 'PARENT',
      label: 'Parent (Chief Johnson)',
      icon: <BookOpen className="w-4 h-4 text-amber-600" />,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
  ];

  const currentRoleConfig = rolesList.find((r) => r.role === currentUser.role) || rolesList[0];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      {/* Top Banner Accent */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white text-xs px-4 py-1.5 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-wide flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-amber-300" />
            {schoolProfile.name}
          </span>
          <span className="hidden sm:inline text-emerald-200">|</span>
          <span className="hidden sm:inline text-emerald-100 italic">&quot;{schoolProfile.motto}&quot;</span>
        </div>
        <div className="flex items-center gap-4 text-emerald-100 text-[11px]">
          <span>📍 {schoolProfile.address}</span>
          <span className="hidden md:inline bg-emerald-700/80 px-2 py-0.5 rounded-full font-medium text-amber-200 border border-emerald-600">
            {schoolProfile.currentSession} • {schoolProfile.currentTerm}
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* School Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 flex items-center justify-center text-white font-black text-lg shadow-sm border border-emerald-600">
            DA
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
              Divine Academy <span className="text-emerald-700 font-extrabold">Portal</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">School Management & CBT Examination System</p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher Button */}
          <div className="relative">
            <button

              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 transition"
              title="Click to test role permissions"
            >
              <span className="hidden sm:inline text-slate-500">View as:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-bold ${currentRoleConfig.badgeColor}`}
              >
                {currentRoleConfig.icon}
                {currentUser.role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                  <span>Switch Testing Role</span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                {rolesList.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => {
                      switchUserRole(item.role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 text-xs transition ${
                      currentUser.role === item.role ? 'bg-emerald-50/60 font-semibold text-emerald-900' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {currentUser.role === item.role && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    )}
                  </button>
                ))}
                <div className="pt-2 mt-1 border-t border-slate-100 px-3">
                  <button
                    onClick={() => {
                      if (confirm('Reset all portal demo data back to default state?')) {
                        resetDataToDefaults();
                        setShowRoleDropdown(false);
                      }
                    }}
                    className="w-full text-left text-[11px] text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1.5 py-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset Portal Data Defaults
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            onClick={() => setShowNotifModal(!showNotifModal)}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            title="School Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-600"></span>
          </button>

          {/* User Avatar & Name */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-90 transition text-left"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-xs text-emerald-800 overflow-hidden">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>
            <div className="hidden lg:block text-xs">
              <p className="font-bold text-slate-800 line-clamp-1">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 capitalize">{currentUser.role.toLowerCase()}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-600 overflow-hidden flex items-center justify-center font-bold text-lg text-emerald-900">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  currentUser.name.charAt(0)
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{currentUser.name}</h3>
                <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${currentRoleConfig.badgeColor}`}>
                  {currentUser.role}
                </span>
                <p className="text-xs text-slate-500 mt-0.5">{currentUser.email}</p>
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Email: <strong className="text-slate-900">{currentUser.email}</strong></span>
              </div>
              {currentUser.phoneNumber && (
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-slate-400" />
                  <span>Phone: <strong className="text-slate-900">{currentUser.phoneNumber}</strong></span>
                </div>
              )}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-semibold text-slate-800 mb-1">Active Role Permissions:</p>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {currentUser.role === 'ADMIN' && 'Full administrative access: Student/Teacher management, CBT creation, Score approval, Curriculum oversight, and Settings.'}
                  {currentUser.role === 'TEACHER' && 'Subject Teacher access: View assigned classes, enter CA & Exam scores, create CBT exams, and view curriculum lesson plans.'}
                  {currentUser.role === 'STUDENT' && 'Student portal access: Take CBT exams, check published report cards, view class timetable, and curriculum topics.'}
                  {currentUser.role === 'PARENT' && 'Parent portal access: Monitor child academic progress, review CBT score history, and download printable report cards.'}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotifModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-start justify-end p-4 pt-16">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                School Announcements
              </h3>
              <button
                onClick={() => setShowNotifModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="py-3 space-y-3 max-h-80 overflow-y-auto no-scrollbar">
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200">
                <p className="font-bold text-xs text-emerald-900">1st Term Mid-Term CBT Examinations</p>
                <p className="text-[11px] text-emerald-800 mt-1 leading-normal">
                  CBT testing is currently active for JSS1 Mathematics and SS2 Physics. All students should log in to test.
                </p>
                <span className="text-[10px] text-emerald-600 font-medium block mt-1.5">Today at 08:00 AM</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-xs text-slate-900">Result Publishing Update</p>
                <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                  1st Term academic report cards for Divine Academy Okene are now available in the Results tab.
                </p>
                <span className="text-[10px] text-slate-400 font-medium block mt-1.5">Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
