'use client';

import React from 'react';
import { useSchool } from '@/context/SchoolContext';
import { TabType } from '../Sidebar';
import {
  GraduationCap,
  Users,
  BookOpenCheck,
  MonitorPlay,
  FileCheck2,
  CalendarCheck2,
  Megaphone,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Award,
} from 'lucide-react';

interface OverviewProps {
  setActiveTab: (tab: TabType) => void;
}

export const OverviewDashboard: React.FC<OverviewProps> = ({ setActiveTab }) => {
  const {
    currentUser,
    schoolProfile,
    students,
    teachers,
    classes,
    cbtExams,
    cbtAttempts,
    scores,
    announcements,
  } = useSchool();

  const activeCbtCount = cbtExams.filter((e) => e.status === 'Published').length;
  const totalSubmissions = cbtAttempts.length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white p-6 sm:p-8 shadow-md">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/20 to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Welcome to Divine Academy Portal</span>
            <span>•</span>
            <span>{schoolProfile.currentSession} Session</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Hello, {currentUser.name}! 👋
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-2 leading-relaxed max-w-2xl">
            {currentUser.role === 'ADMIN' &&
              'You are logged in as School Administrator. Monitor academic performance, approve student CBT exams, manage staff directory, and oversee report card publishing.'}
            {currentUser.role === 'TEACHER' &&
              'You are logged in as Subject Teacher. Prepare CBT examination banks, input CA and term exam scores, mark attendance, and manage week lesson plans.'}
            {currentUser.role === 'STUDENT' &&
              'Welcome to your Divine Academy student portal. Complete active CBT tests, check your 1st Term academic report card, and view class lesson notes.'}
            {currentUser.role === 'PARENT' &&
              'Welcome to the Guardian Portal. Monitor your child’s academic progress, review CBT score logs, and print official report cards.'}
          </p>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-emerald-700/60">
            {currentUser.role === 'ADMIN' && (
              <>
                <button
                  onClick={() => setActiveTab('students')}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-lg font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Register New Student
                </button>
                <button
                  onClick={() => setActiveTab('cbt')}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <MonitorPlay className="w-3.5 h-3.5 text-amber-300" />
                  Create CBT Exam
                </button>
                <button
                  onClick={() => setActiveTab('results')}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-300" />
                  Enter CA & Exam Scores
                </button>
              </>
            )}

            {currentUser.role === 'TEACHER' && (
              <>
                <button
                  onClick={() => setActiveTab('cbt')}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-lg font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                >
                  <MonitorPlay className="w-3.5 h-3.5" />
                  Create CBT Test
                </button>
                <button
                  onClick={() => setActiveTab('results')}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
                  Score Entry Grid
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <BookOpenCheck className="w-3.5 h-3.5 text-emerald-300" />
                  Lesson Plans & Notes
                </button>
              </>
            )}

            {(currentUser.role === 'STUDENT' || currentUser.role === 'PARENT') && (
              <>
                <button
                  onClick={() => setActiveTab('cbt')}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-lg font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                >
                  <MonitorPlay className="w-3.5 h-3.5" />
                  Take Active CBT Test
                </button>
                <button
                  onClick={() => setActiveTab('results')}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
                  Check 1st Term Report Card
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Students</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{students.length}</div>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            Enrolled across {classes.length} Arms
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Teachers</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{teachers.length}</div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">
            Subject & Form Instructors
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active CBT Tests</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <MonitorPlay className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{activeCbtCount}</div>
          <span className="text-[11px] text-amber-700 font-semibold block mt-1">
            {totalSubmissions} Student Attempt Logs
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Academic Term</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">{schoolProfile.currentTerm}</div>
          <span className="text-[11px] text-purple-700 font-semibold block mt-1">
            Session {schoolProfile.currentSession}
          </span>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CBT Exams Quick Widget */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <MonitorPlay className="w-5 h-5 text-emerald-700" />
                Computer-Based Test (CBT) Portal Status
              </h3>
              <p className="text-xs text-slate-500">Live online examinations and mid-term assessments</p>
            </div>
            <button
              onClick={() => setActiveTab('cbt')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
            >
              Go to CBT Portal <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {cbtExams.map((exam) => (
              <div
                key={exam.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                      {exam.className}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{exam.subjectName}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 mt-1">{exam.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {exam.durationMinutes} Minutes
                    </span>
                    <span>•</span>
                    <span>{exam.questions.length} Questions ({exam.totalMarks} Marks)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('cbt')}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition shadow-2xs"
                  >
                    {currentUser.role === 'STUDENT' ? 'Start Exam' : 'View / Manage'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notice Board Side Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-500" />
                School Notice Board
              </h3>
              <button
                onClick={() => setActiveTab('announcements')}
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((anc) => (
                <div key={anc.id} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60">
                  <div className="flex items-center justify-between text-[10px] text-amber-800 font-bold mb-1">
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-200/80">{anc.category}</span>
                    <span>{anc.createdAt}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">{anc.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-normal">{anc.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 italic">
              Divine Academy Secondary School, Okene • Portal v2.5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
