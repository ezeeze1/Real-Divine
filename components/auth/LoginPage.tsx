'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { UserRole } from '@/lib/types';
import {
  ShieldCheck,
  UserCheck,
  GraduationCap,
  BookOpen,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Sparkles,
  AlertCircle,
  KeyRound,
  ChevronRight,
  User as UserIcon,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, schoolProfile, adminPassword } = useSchool();

  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
    setUsername('');
    setPassword('');
  };

  const getAssignedPassword = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return adminPassword;
      case 'TEACHER':
        return 'teacher123';
      case 'STUDENT':
        return 'student123';
      case 'PARENT':
        return 'parent123';
    }
  };

  const getSampleUsername = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'Admin User';
      case 'TEACHER':
        return 'Mr. David Okoh';
      case 'STUDENT':
        return 'Amina Ibrahim';
      case 'PARENT':
        return 'Alhaji Ibrahim Yakubu';
    }
  };

  const currentAssignedPassword = getAssignedPassword(selectedRole);

  const handleAutoFill = () => {
    setUsername(getSampleUsername(selectedRole));
    setPassword(currentAssignedPassword);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username || !username.trim()) {
      setErrorMsg('Please enter your username or full name.');
      return;
    }

    if (!password || !password.trim()) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = login(username, password, selectedRole);
      setIsLoading(false);
      if (!result.success && result.message) {
        setErrorMsg(result.message);
      }
    }, 200);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return {
          label: 'Administrator',
          color: 'bg-purple-100 text-purple-900 border-purple-300',
          icon: <ShieldCheck className="w-4 h-4 text-purple-700" />,
        };
      case 'TEACHER':
        return {
          label: 'Subject Teacher',
          color: 'bg-blue-100 text-blue-900 border-blue-300',
          icon: <UserCheck className="w-4 h-4 text-blue-700" />,
        };
      case 'STUDENT':
        return {
          label: 'Student Portal',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          icon: <GraduationCap className="w-4 h-4 text-emerald-700" />,
        };
      case 'PARENT':
        return {
          label: 'Parent / Guardian',
          color: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: <BookOpen className="w-4 h-4 text-amber-700" />,
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-emerald-200">
      {/* Background Decorative Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Header */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 text-slate-300 px-4 py-3 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-sm shadow-sm border border-emerald-500">
              DA
            </div>
            <div>
              <h2 className="font-bold text-white text-sm tracking-tight leading-none">
                {schoolProfile.name}
              </h2>
              <p className="text-[11px] text-emerald-400 font-medium italic mt-0.5">
                &quot;{schoolProfile.motto}&quot; • {schoolProfile.state}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 rounded-full font-bold text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {schoolProfile.currentSession} Session ({schoolProfile.currentTerm})
            </span>
          </div>
        </div>
      </header>

      {/* Main Login Body */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Card Header */}
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-6 text-white text-center relative">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-emerald-700/80 border-2 border-emerald-400/80 flex items-center justify-center text-white font-black text-2xl shadow-lg">
              DA
            </div>
            <h1 className="text-xl font-bold tracking-tight">Divine Academy Portal</h1>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              School Management & Computer-Based Testing System
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Login Failed</p>
                  <p className="text-[11px] font-normal text-rose-700 mt-0.5">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* 1. Account Role Selector Cards */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-800 text-xs flex items-center justify-between">
                <span>Select Account Role *</span>
                <span className="text-[11px] text-emerald-800 font-semibold">
                  (Choose your role)
                </span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleRoleChange('ADMIN')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                    selectedRole === 'ADMIN'
                      ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-400/50 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-purple-100 border border-purple-200">
                    <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">Admin</p>
                    <p className="text-[10px] text-slate-500 truncate">Principal / VP</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('TEACHER')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                    selectedRole === 'TEACHER'
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-400/50 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-blue-100 border border-blue-200">
                    <UserCheck className="w-4 h-4 text-blue-700 shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">Teacher</p>
                    <p className="text-[10px] text-slate-500 truncate">Subject Teacher</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('STUDENT')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                    selectedRole === 'STUDENT'
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/50 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-emerald-100 border border-emerald-200">
                    <GraduationCap className="w-4 h-4 text-emerald-700 shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">Student</p>
                    <p className="text-[10px] text-slate-500 truncate">Student Portal</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('PARENT')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                    selectedRole === 'PARENT'
                      ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/50 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-amber-100 border border-amber-200">
                    <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">Parent</p>
                    <p className="text-[10px] text-slate-500 truncate">Parent / Guardian</p>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Username Input Field */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-800 text-xs">
                User Name / Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder={`Enter your ${selectedRole.toLowerCase()} name (e.g. ${getSampleUsername(selectedRole)})...`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-2xl font-medium text-slate-900 text-xs transition"
                />
              </div>
            </div>

            {/* 3. Assigned Password Input Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block font-bold text-slate-800 text-xs">
                  Assign Password *
                </label>
                <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-rose-500" />
                  Required
                </span>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter assigned password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-2xl font-medium text-slate-900 text-xs transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password & Username Hint Banner */}
              <div className="text-[11px] text-slate-600 bg-slate-100 p-2.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span>
                    🔑 Assigned Password:{' '}
                    <strong className="text-slate-900 font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-300 ml-1">
                      {currentAssignedPassword}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold underline bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200 transition"
                  >
                    Quick Auto-Fill
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  Sample Username for {getRoleBadge(selectedRole).label}:{' '}
                  <strong className="text-slate-700 font-semibold">{getSampleUsername(selectedRole)}</strong>
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              {isLoading ? 'Authenticating...' : `Sign In as ${getRoleBadge(selectedRole).label}`}
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Info */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-[11px] text-slate-500 text-center font-medium">
            Divine Academy Okene • Secure Multi-User Portal
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-3 px-4 text-center border-t border-slate-800 z-10">
        &copy; {new Date().getFullYear()} {schoolProfile.name}. All rights reserved.
      </footer>
    </div>
  );
};
