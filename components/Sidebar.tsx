'use client';

import React from 'react';
import { useSchool } from '@/context/SchoolContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpenCheck,
  MonitorPlay,
  FileCheck2,
  BookMarked,
  CalendarCheck2,
  Clock3,
  Megaphone,
  Settings,
  Sparkles,
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'students'
  | 'teachers'
  | 'classes'
  | 'cbt'
  | 'results'
  | 'curriculum'
  | 'attendance'
  | 'timetable'
  | 'announcements'
  | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser } = useSchool();

  const navItems: {
    id: TabType;
    label: string;
    icon: React.ReactNode;
    roles: ('ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT')[];
    badge?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
    },
    {
      id: 'cbt',
      label: 'CBT Examination System',
      icon: <MonitorPlay className="w-4 h-4" />,
      roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      badge: 'Interactive',
    },
    {
      id: 'results',
      label: 'Results & Report Cards',
      icon: <FileCheck2 className="w-4 h-4" />,
      roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      badge: 'Printable',
    },
    {
      id: 'curriculum',
      label: 'Curriculum Centre (JSS-SS)',
      icon: <BookMarked className="w-4 h-4" />,
      roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
    },
    {
      id: 'students',
      label: 'Student Directory',
      icon: <GraduationCap className="w-4 h-4" />,
      roles: ['ADMIN', 'TEACHER', 'PARENT'],
    },
    {
      id: 'teachers',
      label: 'Teacher Directory',
      icon: <Users className="w-4 h-4" />,
      roles: ['ADMIN', 'TEACHER'],
    },
    {
      id: 'classes',
      label: 'Classes & Subjects',
      icon: <BookOpenCheck className="w-4 h-4" />,
      roles: ['ADMIN', 'TEACHER'],
    },
    {
      id: 'attendance',
      label: 'Attendance Register',
      icon: <CalendarCheck2 className="w-4 h-4" />,
      roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
    },
    {
      id: 'timetable',
      label: 'Class Timetable',
      icon: <Clock3 className="w-4 h-4" />,
      roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: <Megaphone className="w-4 h-4" />,
      roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
    },
    {
      id: 'settings',
      label: 'School Settings',
      icon: <Settings className="w-4 h-4" />,
      roles: ['ADMIN'],
    },
  ];

  // Filter menu items by user role permissions
  const visibleItems = navItems.filter((item) => item.roles.includes(currentUser.role));

  return (
    <aside className="w-full lg:w-64 bg-slate-900 text-slate-300 p-4 flex flex-col shrink-0 no-print rounded-2xl lg:rounded-none">
      <div className="mb-4 pb-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Main Navigation</span>
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
            <Sparkles className="w-3 h-3" />
            {currentUser.role} Portal View
          </span>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {visibleItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition group ${
                isActive
                  ? 'bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-900/30'
                  : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-slate-200'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                    isActive ? 'bg-amber-400 text-slate-900' : 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer info card */}
      <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <p className="font-bold text-slate-200 text-xs mb-1">Divine Academy Portal</p>
          <p className="text-slate-400 leading-tight">
            Okene, Kogi State. Powered by Next.js & Gemini AI.
          </p>
        </div>
      </div>
    </aside>
  );
};
