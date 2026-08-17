'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { CAAndExamScore, StudentReportCard } from '@/lib/types';
import {
  FileCheck2,
  Printer,
  Sparkles,
  Award,
  CheckCircle2,
  Building2,
  UserCheck,
  GraduationCap,
  Download,
  Filter,
  Save,
  MessageSquare,
} from 'lucide-react';

export const ResultManagement: React.FC = () => {
  const {
    currentUser,
    schoolProfile,
    students,
    classes,
    subjects,
    scores,
    reportCards,
    upsertScore,
    generateReportCard,
    updateReportCardComments,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'score_entry' | 'report_cards'>('score_entry');

  // Score Entry Grid State
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedSession, setSelectedSession] = useState(schoolProfile.currentSession);
  const [selectedTerm, setSelectedTerm] = useState<'1st Term' | '2nd Term' | '3rd Term'>(
    schoolProfile.currentTerm
  );

  // Local grid input memory
  const classStudents = students.filter((s) => s.classId === selectedClassId);
  const [localScoreInputs, setLocalScoreInputs] = useState<
    Record<string, { ca1: number; ca2: number; examScore: number }>
  >({});

  // Active Report Card Modal
  const [viewingReportCard, setViewingReportCard] = useState<StudentReportCard | null>(null);
  const [teacherCommentInput, setTeacherCommentInput] = useState('');
  const [principalCommentInput, setPrincipalCommentInput] = useState('');
  const [isGeneratingAiComments, setIsGeneratingAiComments] = useState(false);

  // Synchronize score input state when class or subject changes
  const handleScoreInputChange = (studentId: string, field: 'ca1' | 'ca2' | 'examScore', val: number) => {
    setLocalScoreInputs((prev) => {
      const current = prev[studentId] || { ca1: 15, ca2: 15, examScore: 45 };
      return {
        ...prev,
        [studentId]: {
          ...current,
          [field]: Math.max(0, Math.min(field === 'examScore' ? 60 : 20, val)),
        },
      };
    });
  };

  const handleSaveGridScores = () => {
    const targetClass = classes.find((c) => c.id === selectedClassId);
    const targetSubject = subjects.find((s) => s.id === selectedSubjectId);

    if (!targetClass || !targetSubject) return;

    classStudents.forEach((st) => {
      const existingScore = scores.find(
        (s) =>
          s.studentId === st.id &&
          s.subjectId === selectedSubjectId &&
          s.session === selectedSession &&
          s.term === selectedTerm
      );

      const input = localScoreInputs[st.id] || {
        ca1: existingScore ? existingScore.ca1 : 12,
        ca2: existingScore ? existingScore.ca2 : 12,
        examScore: existingScore ? existingScore.examScore : 55,
      };

      upsertScore({
        studentId: st.id,
        studentName: st.fullName,
        admissionNo: st.admissionNo,
        classId: selectedClassId,
        className: targetClass.name,
        subjectId: selectedSubjectId,
        subjectName: targetSubject.name,
        session: selectedSession,
        term: selectedTerm,
        ca1: Number(input.ca1),
        ca2: Number(input.ca2),
        examScore: Number(input.examScore),
      });
    });

    alert('Continuous Assessment & Examination Scores saved successfully!');
  };

  const handleOpenReportCard = (studentId: string) => {
    const rc = generateReportCard(studentId, selectedSession, selectedTerm);
    setViewingReportCard(rc);
    setTeacherCommentInput(rc.teacherComment);
    setPrincipalCommentInput(rc.principalComment);
  };

  // AI Comment Generator via Gemini
  const handleGenerateAiComments = async () => {
    if (!viewingReportCard) return;

    setIsGeneratingAiComments(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_report_comments',
          studentName: viewingReportCard.studentName,
          averageScore: viewingReportCard.averageScore,
          gradeSummary: viewingReportCard.averageScore >= 70 ? 'Distinction' : 'Good',
        }),
      });

      const data = await res.json();
      if (data.comments) {
        setTeacherCommentInput(data.comments.teacherComment || teacherCommentInput);
        setPrincipalCommentInput(data.comments.principalComment || principalCommentInput);
        updateReportCardComments(
          viewingReportCard.id,
          data.comments.teacherComment,
          data.comments.principalComment
        );
      }
    } catch (e) {
      console.error(e);
      alert('Failed to generate AI comments.');
    } finally {
      setIsGeneratingAiComments(false);
    }
  };

  const handleSaveComments = () => {
    if (!viewingReportCard) return;
    updateReportCardComments(viewingReportCard.id, teacherCommentInput, principalCommentInput);
    setViewingReportCard((prev) =>
      prev ? { ...prev, teacherComment: teacherCommentInput, principalComment: principalCommentInput } : null
    );
    alert('Report card comments updated!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-emerald-700" />
            Academic Result Management & Report Cards
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Divine Academy continuous assessment (CA) entry, class rankings, and printable report sheets.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('score_entry')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'score_entry' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Score Entry Grid
          </button>
          <button
            onClick={() => setActiveTab('report_cards')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'report_cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Report Card Hub
          </button>
        </div>
      </div>

      {/* SCORE ENTRY GRID VIEW */}
      {activeTab === 'score_entry' && (
        <div className="space-y-4 no-print">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Class</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Subject</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Academic Session</label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
              >
                <option value="2025/2026">2025/2026 Session</option>
                <option value="2024/2025">2024/2025 Session</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Term</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
              >
                <option value="1st Term">1st Term</option>
                <option value="2nd Term">2nd Term</option>
                <option value="3rd Term">3rd Term</option>
              </select>
            </div>
          </div>

          {/* Interactive Score Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Marks Entry Grid — {classes.find((c) => c.id === selectedClassId)?.name} (
                  {subjects.find((s) => s.id === selectedSubjectId)?.name})
                </h3>
                <p className="text-[11px] text-slate-500">Max Marks: CA1 (20), CA2 (20), Exam (60) = Total 100 Marks</p>
              </div>

              {(currentUser.role === 'ADMIN' || currentUser.role === 'TEACHER') && (
                <button
                  onClick={handleSaveGridScores}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Save Marks Entry
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Admission No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3 text-center">CA 1 (20)</th>
                    <th className="p-3 text-center">CA 2 (20)</th>
                    <th className="p-3 text-center">Exam (60)</th>
                    <th className="p-3 text-center">Total (100)</th>
                    <th className="p-3 text-center">Grade</th>
                    <th className="p-3 text-right">Report Card</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {classStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        No students enrolled in this class.
                      </td>
                    </tr>
                  ) : (
                    classStudents.map((st) => {
                      const existing = scores.find(
                        (s) =>
                          s.studentId === st.id &&
                          s.subjectId === selectedSubjectId &&
                          s.session === selectedSession &&
                          s.term === selectedTerm
                      );

                      const input = localScoreInputs[st.id] || {
                        ca1: existing ? existing.ca1 : 15,
                        ca2: existing ? existing.ca2 : 15,
                        examScore: existing ? existing.examScore : 50,
                      };

                      const currentTotal = Number(input.ca1) + Number(input.ca2) + Number(input.examScore);

                      let grade = 'A';
                      if (currentTotal < 40) grade = 'F';
                      else if (currentTotal < 45) grade = 'E';
                      else if (currentTotal < 50) grade = 'D';
                      else if (currentTotal < 60) grade = 'C';
                      else if (currentTotal < 70) grade = 'B';

                      return (
                        <tr key={st.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3 font-mono font-bold text-emerald-800">{st.admissionNo}</td>
                          <td className="p-3 font-bold text-slate-900">{st.fullName}</td>

                          <td className="p-3 text-center">
                            <input
                              type="number"
                              max={20}
                              min={0}
                              value={input.ca1}
                              onChange={(e) => handleScoreInputChange(st.id, 'ca1', Number(e.target.value))}
                              className="w-16 p-1 text-center bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                            />
                          </td>

                          <td className="p-3 text-center">
                            <input
                              type="number"
                              max={20}
                              min={0}
                              value={input.ca2}
                              onChange={(e) => handleScoreInputChange(st.id, 'ca2', Number(e.target.value))}
                              className="w-16 p-1 text-center bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                            />
                          </td>

                          <td className="p-3 text-center">
                            <input
                              type="number"
                              max={60}
                              min={0}
                              value={input.examScore}
                              onChange={(e) => handleScoreInputChange(st.id, 'examScore', Number(e.target.value))}
                              className="w-20 p-1 text-center bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                            />
                          </td>

                          <td className="p-3 text-center font-black text-slate-900 text-sm">
                            {currentTotal}
                          </td>

                          <td className="p-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-md font-extrabold text-xs ${
                                grade === 'A'
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : grade === 'F'
                                  ? 'bg-rose-100 text-rose-900'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {grade}
                            </span>
                          </td>

                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleOpenReportCard(st.id)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] transition flex items-center gap-1 ml-auto"
                            >
                              <Printer className="w-3.5 h-3.5 text-emerald-700" />
                              View Sheet
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT CARDS HUB VIEW */}
      {activeTab === 'report_cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 no-print">
          {students.map((st) => (
            <div
              key={st.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[11px]">
                    {st.className}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">{st.admissionNo}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900">{st.fullName}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  1st Term Academic Sheet • Divine Academy Okene
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-bold">Session: 2025/2026</span>
                <button
                  onClick={() => handleOpenReportCard(st.id)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Report Card
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OFFICIAL PRINTABLE REPORT CARD MODAL */}
      {viewingReportCard && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 overflow-y-auto p-4 flex justify-center items-start pt-6">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 print-container relative my-6">
            {/* Modal Controls (Hidden during print) */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 no-print">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                  Official Academic Report Card
                </span>
                <button
                  onClick={handleGenerateAiComments}
                  disabled={isGeneratingAiComments}
                  className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-lg font-bold text-xs transition flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  {isGeneratingAiComments ? 'Generating...' : 'AI Draft Comments'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Print / Download PDF
                </button>
                <button
                  onClick={() => setViewingReportCard(null)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* PRINTABLE OFFICIAL REPORT CARD TEMPLATE */}
            <div className="space-y-6 text-slate-900">
              {/* Official Header */}
              <div className="text-center border-b-2 border-emerald-800 pb-4">
                <div className="flex justify-center items-center gap-3 mb-1">
                  <div className="w-12 h-12 rounded-xl bg-emerald-800 text-amber-300 font-black text-xl flex items-center justify-center border-2 border-emerald-700">
                    DA
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-emerald-950 uppercase">
                    {schoolProfile.name}
                  </h1>
                </div>
                <p className="text-xs font-serif italic text-emerald-800 font-semibold">
                  Motto: &quot;{schoolProfile.motto}&quot;
                </p>
                <p className="text-[11px] font-medium text-slate-600">{schoolProfile.address}</p>
                <div className="mt-2 inline-block px-4 py-1 bg-emerald-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-md">
                  STUDENT ACADEMIC REPORT SHEET — {viewingReportCard.term.toUpperCase()} ({viewingReportCard.session})
                </div>
              </div>

              {/* Student Bio Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Student Name</span>
                  <strong className="text-slate-900">{viewingReportCard.studentName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Admission No.</span>
                  <strong className="text-emerald-800 font-mono">{viewingReportCard.admissionNo}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Class / Arm</span>
                  <strong className="text-slate-900">{viewingReportCard.className}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Class Position</span>
                  <strong className="text-emerald-900 font-black">
                    {viewingReportCard.positionInClass} out of {viewingReportCard.classSize}
                  </strong>
                </div>
              </div>

              {/* Cognitive Academic Scores Table */}
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-900 mb-2">
                  A. COGNITIVE ABILITY & ACADEMIC SCORES
                </h3>

                <table className="w-full text-left text-xs border border-slate-300 border-collapse">
                  <thead className="bg-emerald-900 text-white font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2 border border-emerald-800">Subject Title</th>
                      <th className="p-2 border border-emerald-800 text-center">CA 1 (20)</th>
                      <th className="p-2 border border-emerald-800 text-center">CA 2 (20)</th>
                      <th className="p-2 border border-emerald-800 text-center">Exam (60)</th>
                      <th className="p-2 border border-emerald-800 text-center">Total (100)</th>
                      <th className="p-2 border border-emerald-800 text-center">Grade</th>
                      <th className="p-2 border border-emerald-800">Teacher&apos;s Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                    {viewingReportCard.academicScores.map((sc) => (
                      <tr key={sc.id} className="hover:bg-slate-50">
                        <td className="p-2 border border-slate-200 font-bold">{sc.subjectName}</td>
                        <td className="p-2 border border-slate-200 text-center">{sc.ca1}</td>
                        <td className="p-2 border border-slate-200 text-center">{sc.ca2}</td>
                        <td className="p-2 border border-slate-200 text-center">{sc.examScore}</td>
                        <td className="p-2 border border-slate-200 text-center font-black">{sc.totalScore}</td>
                        <td className="p-2 border border-slate-200 text-center font-extrabold">{sc.grade}</td>
                        <td className="p-2 border border-slate-200 text-slate-600">{sc.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold text-xs text-slate-900">
                    <tr>
                      <td colSpan={4} className="p-2 border border-slate-300 text-right uppercase">
                        Cumulative Total / Average:
                      </td>
                      <td className="p-2 border border-slate-300 text-center text-emerald-900 font-black">
                        {viewingReportCard.totalScoreSum}
                      </td>
                      <td colSpan={2} className="p-2 border border-slate-300 text-emerald-900 font-black">
                        Average Score: {viewingReportCard.averageScore}%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Behavioral & Affective Ratings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50">
                  <h4 className="font-bold text-emerald-900 text-[11px] uppercase mb-2">
                    B. AFFECTIVE DEVELOPMENT (RATING 1-5)
                  </h4>
                  <div className="grid grid-cols-2 gap-y-1 text-[11px]">
                    <span>Punctuality: <strong>5/5</strong></span>
                    <span>Neatness: <strong>5/5</strong></span>
                    <span>Politeness: <strong>5/5</strong></span>
                    <span>Honesty: <strong>5/5</strong></span>
                    <span>Leadership: <strong>4/5</strong></span>
                    <span>Attentiveness: <strong>5/5</strong></span>
                  </div>
                </div>

                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50">
                  <h4 className="font-bold text-emerald-900 text-[11px] uppercase mb-2">
                    C. PSYCHOMOTOR DEVELOPMENT (RATING 1-5)
                  </h4>
                  <div className="grid grid-cols-2 gap-y-1 text-[11px]">
                    <span>Handwriting: <strong>4/5</strong></span>
                    <span>Sports & Games: <strong>5/5</strong></span>
                    <span>Verbal Fluency: <strong>5/5</strong></span>
                    <span>Handling Tools: <strong>4/5</strong></span>
                  </div>
                </div>
              </div>

              {/* Remarks & Signatures */}
              <div className="space-y-3 pt-2">
                <div className="p-3 border border-slate-200 rounded-xl bg-white space-y-1">
                  <span className="font-bold text-xs text-slate-700 block">Class Teacher&apos;s Comment:</span>
                  <p className="text-xs text-slate-800 italic font-medium leading-relaxed">
                    &quot;{viewingReportCard.teacherComment}&quot;
                  </p>
                </div>

                <div className="p-3 border border-slate-200 rounded-xl bg-white space-y-1">
                  <span className="font-bold text-xs text-slate-700 block">Principal&apos;s Comment &amp; Signature:</span>
                  <p className="text-xs text-slate-800 italic font-medium leading-relaxed">
                    &quot;{viewingReportCard.principalComment}&quot;
                  </p>
                </div>

                {/* Signatures Row */}
                <div className="pt-4 flex justify-between items-end text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Resumption Date:</span>
                    <strong className="text-slate-900">{viewingReportCard.nextTermBegins}</strong>
                  </div>

                  <div className="text-right">
                    <img
                      src={schoolProfile.principalSignatureUrl}
                      alt="Signature"
                      className="h-8 object-contain ml-auto mb-1 opacity-80"
                    />
                    <strong className="block font-extrabold text-slate-900">{schoolProfile.principalName}</strong>
                    <span className="text-[10px] text-emerald-800 font-bold uppercase">Principal, Divine Academy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
