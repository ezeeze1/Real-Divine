'use client';

import React, { useState } from 'react';
import { SchoolProvider } from '@/context/SchoolContext';
import { Navbar } from '@/components/Navbar';
import { Sidebar, TabType } from '@/components/Sidebar';
import { OverviewDashboard } from '@/components/dashboard/OverviewDashboard';
import { StudentManagement } from '@/components/students/StudentManagement';
import { TeacherManagement } from '@/components/teachers/TeacherManagement';
import { ClassSubjectManagement } from '@/components/classes/ClassSubjectManagement';
import { CBTModule } from '@/components/cbt/CBTModule';
import { ResultManagement } from '@/components/results/ResultManagement';
import { CurriculumCentre } from '@/components/curriculum/CurriculumCentre';
import { AttendanceRegister } from '@/components/attendance/AttendanceRegister';
import { ClassTimetable } from '@/components/timetable/ClassTimetable';
import { AnnouncementBoard } from '@/components/announcements/AnnouncementBoard';
import { SchoolSettings } from '@/components/settings/SchoolSettings';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  return (
    <SchoolProvider>
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-emerald-200">
        {/* Top Sticky Header */}
        <Navbar />

        {/* Main Application Shell */}
        <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-3 sm:p-6 gap-6">
          {/* Navigation Sidebar */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Dashboard Canvas */}
          <main className="flex-1 min-w-0">
            {activeTab === 'dashboard' && <OverviewDashboard setActiveTab={setActiveTab} />}
            {activeTab === 'students' && <StudentManagement />}
            {activeTab === 'teachers' && <TeacherManagement />}
            {activeTab === 'classes' && <ClassSubjectManagement />}
            {activeTab === 'cbt' && <CBTModule />}
            {activeTab === 'results' && <ResultManagement />}
            {activeTab === 'curriculum' && <CurriculumCentre />}
            {activeTab === 'attendance' && <AttendanceRegister />}
            {activeTab === 'timetable' && <ClassTimetable />}
            {activeTab === 'announcements' && <AnnouncementBoard />}
            {activeTab === 'settings' && <SchoolSettings />}
          </main>
        </div>
      </div>
    </SchoolProvider>
  );
}
