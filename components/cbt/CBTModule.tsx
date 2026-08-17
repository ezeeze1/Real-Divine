'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { CBTExam, CBTQuestion, CBTAttempt } from '@/lib/types';
import {
  MonitorPlay,
  Plus,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Check,
  ChevronRight,
  ChevronLeft,
  Award,
  FileQuestion,
  Users,
  Brain,
  Trash2,
} from 'lucide-react';

export const CBTModule: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    cbtExams,
    cbtAttempts,
    classes,
    subjects,
    teachers,
    students,
    createCBTExam,
    updateCBTExam,
    submitCBTAttempt,
  } = useSchool();

  const [activeView, setActiveView] = useState<'list' | 'create' | 'live_test' | 'results_review'>('list');

  // Selected Exam for Taking or Viewing
  const [selectedExam, setSelectedExam] = useState<CBTExam | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<CBTAttempt | null>(null);

  // Live Test State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}); // questionId -> optionId
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // New Exam Creation Form State
  const [newTitle, setNewTitle] = useState('');
  const [newClassId, setNewClassId] = useState(classes[0]?.id || '');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || '');
  const [newDuration, setNewDuration] = useState(15);
  const [newPassPercent, setNewPassPercent] = useState(50);
  const [newStartDateTime, setNewStartDateTime] = useState('2026-08-17T09:00');
  const [newQuestions, setNewQuestions] = useState<CBTQuestion[]>([]);

  // Manual Question Form State inside Exam Creator
  const [qText, setQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');

  // Utility to shuffle options array randomly for student test takers
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Handle OK & Log Out from Student Portal after Exam Review
  const handleOkLogout = () => {
    setActiveView('list');
    setSelectedExam(null);
    setActiveAttempt(null);

    if (currentUser.role === 'STUDENT') {
      switchUserRole('ADMIN');
      alert('Examination session completed and result logged. You have been logged out.');
    }
  };

  // AI Question Generation State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  // Submit Exam
  const handleFinalSubmit = useCallback(() => {
    if (!selectedExam) return;

    let totalObtained = 0;
    const answerLogs = selectedExam.questions.map((q) => {
      const selectedOptionId = userAnswers[q.id] || '';
      const isCorrect = selectedOptionId === q.correctOptionId;
      const marksObtained = isCorrect ? q.marks : 0;
      totalObtained += marksObtained;

      return {
        questionId: q.id,
        selectedOptionId,
        isCorrect,
        marksObtained,
      };
    });

    const percentageScore = Number(((totalObtained / selectedExam.totalMarks) * 100).toFixed(1));
    const passed = percentageScore >= selectedExam.passPercentage;

    // Student identity
    const currentStudent = students.find((s) => s.id === currentUser.studentId) || students[0];

    const attempt = submitCBTAttempt({
      examId: selectedExam.id,
      examTitle: selectedExam.title,
      studentId: currentStudent.id,
      studentName: currentStudent.fullName,
      admissionNo: currentStudent.admissionNo,
      answers: answerLogs,
      scoreObtained: totalObtained,
      totalPossibleMarks: selectedExam.totalMarks,
      percentageScore,
      passed,
      startedAt: new Date().toLocaleString(),
      completedAt: new Date().toLocaleString(),
      timeTakenSeconds: selectedExam.durationMinutes * 60 - timeLeftSeconds,
    });

    setActiveAttempt(attempt);
    setIsExamSubmitted(true);
    setShowSubmitModal(false);
    setActiveView('results_review');
  }, [selectedExam, userAnswers, students, currentUser, submitCBTAttempt, timeLeftSeconds]);

  // Timer Effect during Live Test
  useEffect(() => {
    if (activeView !== 'live_test' || isExamSubmitted || timeLeftSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit(); // Auto submit when time reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeView, isExamSubmitted, timeLeftSeconds, handleFinalSubmit]);

  // Start Exam Player
  const startExamPlayer = (exam: CBTExam) => {
    // Check if student has already attempted this exam
    const currentStudentId = currentUser.studentId || students.find((s) => s.fullName === currentUser.name)?.id;
    const hasAttempted = cbtAttempts.some(
      (att) => att.examId === exam.id && (att.studentId === currentStudentId || att.studentName === currentUser.name)
    );

    if (currentUser.role === 'STUDENT' && hasAttempted) {
      alert('You have already submitted an attempt for this examination. Re-taking is not permitted.');
      return;
    }

    // Randomize options for every question to shuffle answer positions for student test takers
    const randomizedQuestions = exam.questions.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));

    setSelectedExam({ ...exam, questions: randomizedQuestions });
    setUserAnswers({});
    setMarkedForReview({});
    setCurrentQuestionIndex(0);
    setTimeLeftSeconds(exam.durationMinutes * 60);
    setIsExamSubmitted(false);
    setActiveView('live_test');
  };

  // Format Start Date Time
  const formatStartDateTime = (isoString?: string) => {
    if (!isoString) return 'Available Immediately';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return isoString;
    }
  };

  const isExamOpen = (isoString?: string) => {
    if (!isoString) return true;
    return new Date().getTime() >= new Date(isoString).getTime();
  };

  // Add Question to New Exam
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !optA.trim() || !optB.trim()) {
      alert('Please enter question text and at least options A and B.');
      return;
    }

    // Default correct option is Option A; system automatically randomizes option positions during student test taking
    const question: CBTQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      questionText: qText.trim(),
      options: [
        { id: 'opt-a', text: optA.trim() },
        { id: 'opt-b', text: optB.trim() },
        { id: 'opt-c', text: optC.trim() || 'Option C' },
        { id: 'opt-d', text: optD.trim() || 'Option D' },
      ],
      correctOptionId: 'opt-a',
      marks: 4,
    };

    setNewQuestions((prev) => [...prev, question]);

    // Reset inputs
    setQText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
  };

  // AI Auto-Generate CBT Questions
  const handleGenerateAiQuestions = async () => {
    const cls = classes.find((c) => c.id === newClassId);
    const sub = subjects.find((s) => s.id === newSubjectId);

    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_cbt_questions',
          classLevel: cls?.level || 'JSS1',
          subject: sub?.name || 'Mathematics',
          topic: aiTopic || 'General Term Assessment',
        }),
      });

      const data = await res.json();
      if (data.questions && Array.isArray(data.questions)) {
        setNewQuestions((prev) => [...prev, ...data.questions]);
      } else if (data.error) {
        alert(`AI Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to Gemini AI generator.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Save Created Exam
  const handleSaveExam = () => {
    if (!newTitle.trim()) {
      alert('Please enter an exam title.');
      return;
    }
    if (newQuestions.length === 0) {
      alert('Please add at least 1 question to the exam.');
      return;
    }

    const cls = classes.find((c) => c.id === newClassId);
    const sub = subjects.find((s) => s.id === newSubjectId);

    const totalMarksSum = newQuestions.reduce((acc, q) => acc + q.marks, 0);

    createCBTExam({
      title: newTitle.trim(),
      subjectId: newSubjectId,
      subjectName: sub ? sub.name : 'Mathematics',
      classId: newClassId,
      className: cls ? cls.name : 'JSS1 A',
      teacherId: currentUser.teacherId || 'teacher-1',
      durationMinutes: newDuration,
      totalMarks: totalMarksSum,
      passPercentage: newPassPercent,
      maxAttempts: 1,
      shuffleQuestions: true,
      status: 'Published',
      startDateTime: newStartDateTime,
      questions: newQuestions,
    });

    // Reset Form
    setNewTitle('');
    setNewQuestions([]);
    setActiveView('list');
  };

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* View Switcher Bar */}
      {activeView !== 'live_test' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MonitorPlay className="w-6 h-6 text-emerald-700" />
              Computer-Based Testing (CBT) System
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Divine Academy digital examination engine, timed student tests, and auto-marking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeView !== 'list' && (
              <button
                onClick={() => setActiveView('list')}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs transition"
              >
                Back to Exam List
              </button>
            )}

            {(currentUser.role === 'ADMIN' || currentUser.role === 'TEACHER') && activeView === 'list' && (
              <button
                onClick={() => {
                  setNewQuestions([]);
                  setActiveView('create');
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Create CBT Exam
              </button>
            )}
          </div>
        </div>
      )}

      {/* VIEW 1: EXAM LIST */}
      {activeView === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Exams List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-emerald-700" />
              Available CBT Examinations ({cbtExams.length})
            </h3>

            {cbtExams.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                No active CBT examinations found.
              </div>
            ) : (
              cbtExams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-extrabold text-[10px] uppercase">
                        {exam.className}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[10px]">
                        {exam.subjectName}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {exam.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-black text-base text-slate-900">{exam.title}</h4>
                    <div className="text-xs text-slate-500 mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Duration: <strong>{exam.durationMinutes} Mins</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Questions: <strong>{exam.questions.length}</strong> ({exam.totalMarks} Marks)
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-emerald-800">
                        Start: <strong>{formatStartDateTime(exam.startDateTime)}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Passing Score: {exam.passPercentage}%
                    </span>

                    {(() => {
                      const currentStudentId =
                        currentUser.studentId || students.find((s) => s.fullName === currentUser.name)?.id;
                      const hasAlreadyAttempted = cbtAttempts.some(
                        (att) =>
                          att.examId === exam.id &&
                          (att.studentId === currentStudentId || att.studentName === currentUser.name)
                      );

                      if (currentUser.role === 'STUDENT' && hasAlreadyAttempted) {
                        return (
                          <button
                            disabled
                            className="px-4 py-2 bg-slate-200 text-slate-600 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-not-allowed border border-slate-300"
                            title="You have already submitted your attempt for this exam."
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Already Attempted (0 Remaining)
                          </button>
                        );
                      }

                      if (currentUser.role === 'STUDENT' && !isExamOpen(exam.startDateTime)) {
                        return (
                          <button
                            disabled
                            className="px-4 py-2 bg-slate-200 text-slate-500 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-not-allowed"
                            title={`Exam scheduled for ${formatStartDateTime(exam.startDateTime)}`}
                          >
                            <Clock className="w-4 h-4 text-slate-400" />
                            Scheduled for {formatStartDateTime(exam.startDateTime)}
                          </button>
                        );
                      }

                      return (
                        <button
                          onClick={() => startExamPlayer(exam)}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition shadow-2xs flex items-center gap-1.5"
                        >
                          <MonitorPlay className="w-4 h-4 text-amber-300" />
                          {currentUser.role === 'STUDENT' ? 'Start CBT Exam' : 'Preview Live Exam'}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Student Attempt History Side Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
              <Award className="w-4 h-4 text-amber-500" />
              Recent CBT Attempt Logs ({cbtAttempts.length})
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto no-scrollbar">
              {cbtAttempts.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No test submissions logged yet.</p>
              ) : (
                cbtAttempts.map((att) => (
                  <div key={att.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900 line-clamp-1">{att.studentName}</span>
                      <span className={att.passed ? 'text-emerald-700 font-extrabold' : 'text-rose-600 font-extrabold'}>
                        {att.percentageScore}% ({att.passed ? 'PASSED' : 'FAILED'})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{att.examTitle}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                      <span>Score: {att.scoreObtained}/{att.totalPossibleMarks}</span>
                      <span>{att.completedAt}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: EXAM CREATOR (TEACHER / ADMIN) */}
      {activeView === 'create' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-700" />
              Create CBT Exam & Question Bank
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Exam Title *</label>
                <input
                  type="text"
                  placeholder="e.g. JSS1 Mathematics 1st Term CBT Test"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Class *</label>
                <select
                  value={newClassId}
                  onChange={(e) => setNewClassId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject *</label>
                <select
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Start Date & Time *</label>
                <input
                  type="datetime-local"
                  value={newStartDateTime}
                  onChange={(e) => setNewStartDateTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-xs"
                />
              </div>
            </div>
          </div>

          {/* AI Generator Banner */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl border border-purple-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> Gemini AI Question Generator
                </span>
                <h4 className="font-bold text-sm text-white mt-1">Auto-generate curriculum-aligned questions</h4>
              </div>

              <div className="flex items-center gap-2 flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="e.g. Whole Numbers & Place Values"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  disabled={isGeneratingAi}
                  onClick={handleGenerateAiQuestions}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded-xl shadow-xs transition shrink-0 disabled:opacity-50"
                >
                  {isGeneratingAi ? 'Generating...' : 'Generate Questions'}
                </button>
              </div>
            </div>
          </div>

          {/* Manual Question Form & List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Manual Entry */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Add Question Manually</h4>

              <form onSubmit={handleAddQuestion} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Question Text *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Enter question prompt..."
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>

                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Option A is automatically set as the correct answer. The CBT engine randomizes the option order for students when taking the exam.
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Option A (Correct Answer) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Correct Option A"
                      value={optA}
                      onChange={(e) => setOptA(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Option B (Wrong Option) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Wrong Option B"
                      value={optB}
                      onChange={(e) => setOptB(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Option C (Wrong Option)</label>
                    <input
                      type="text"
                      placeholder="Wrong Option C"
                      value={optC}
                      onChange={(e) => setOptC(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Option D (Wrong Option)</label>
                    <input
                      type="text"
                      placeholder="Wrong Option D"
                      value={optD}
                      onChange={(e) => setOptD(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition"
                >
                  Add Question to Bank
                </button>
              </form>
            </div>

            {/* Current Question Bank Preview */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <h4 className="font-bold text-slate-900 text-sm">Question Bank Preview ({newQuestions.length})</h4>
                  <span className="text-xs text-emerald-800 font-bold">
                    Total: {newQuestions.reduce((a, b) => a + b.marks, 0)} Marks
                  </span>
                </div>

                <div className="space-y-3 max-h-[380px] overflow-y-auto no-scrollbar">
                  {newQuestions.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-10">No questions added yet.</p>
                  ) : (
                    newQuestions.map((q, idx) => (
                      <div key={q.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>Q{idx + 1}. {q.questionText}</span>
                          <button
                            onClick={() => setNewQuestions((prev) => prev.filter((item) => item.id !== q.id))}
                            className="text-rose-600 hover:text-rose-800 font-bold ml-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-emerald-800 font-semibold">
                          Correct: {q.options.find((o) => o.id === q.correctOptionId)?.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveView('list')}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveExam}
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs"
                >
                  Publish CBT Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: LIVE CBT TEST TAKING PORTAL (STUDENT / PREVIEW) */}
      {activeView === 'live_test' && selectedExam && (
        <div className="space-y-4 max-w-5xl mx-auto">
          {/* Top Exam Header */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-900 font-black text-[10px] uppercase">
                  {selectedExam.className}
                </span>
                <span className="text-xs text-slate-300 font-bold">{selectedExam.subjectName}</span>
              </div>
              <h2 className="font-extrabold text-lg sm:text-xl text-white">{selectedExam.title}</h2>
            </div>

            {/* Countdown Timer Widget */}
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 shrink-0">
              <Clock className={`w-5 h-5 ${timeLeftSeconds < 120 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`} />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Time Remaining</span>
                <span className={`font-mono text-xl font-black ${timeLeftSeconds < 120 ? 'text-rose-400' : 'text-white'}`}>
                  {formatTime(timeLeftSeconds)}
                </span>
              </div>
            </div>
          </div>

          {/* Main Test Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Question Box */}
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-emerald-800 text-xs uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} of {selectedExam.questions.length}
                </span>

                <button
                  onClick={() => {
                    const qId = selectedExam.questions[currentQuestionIndex].id;
                    setMarkedForReview((prev) => ({ ...prev, [qId]: !prev[qId] }));
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    markedForReview[selectedExam.questions[currentQuestionIndex].id]
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  {markedForReview[selectedExam.questions[currentQuestionIndex].id] ? 'Marked for Review' : 'Mark for Review'}
                </button>
              </div>

              {/* Question Text */}
              <div className="space-y-4">
                <p className="text-base font-bold text-slate-900 leading-relaxed">
                  {selectedExam.questions[currentQuestionIndex].questionText}
                </p>

                {/* Options List */}
                <div className="space-y-2.5 pt-2">
                  {selectedExam.questions[currentQuestionIndex].options.map((opt) => {
                    const qId = selectedExam.questions[currentQuestionIndex].id;
                    const isSelected = userAnswers[qId] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setUserAnswers((prev) => ({ ...prev, [qId]: opt.id }))}
                        className={`w-full text-left p-3.5 rounded-xl border font-semibold text-xs transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-2xs'
                            : 'bg-slate-50/50 border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs uppercase ${
                              isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 text-slate-500'
                            }`}
                          >
                            {opt.id.replace('opt-', '').replace('popt-', '')}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-700" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition disabled:opacity-40 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                {currentQuestionIndex < selectedExam.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition flex items-center gap-1 shadow-xs"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs rounded-xl shadow-xs transition"
                  >
                    Submit Test
                  </button>
                )}
              </div>
            </div>

            {/* Right Question Palette */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Question Palette</h4>

              <div className="grid grid-cols-4 gap-2">
                {selectedExam.questions.map((q, idx) => {
                  const isAnswered = !!userAnswers[q.id];
                  const isMarked = !!markedForReview[q.id];
                  const isCurrent = currentQuestionIndex === idx;

                  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
                  if (isAnswered) bgClass = 'bg-emerald-600 text-white border-emerald-600';
                  if (isMarked) bgClass = 'bg-amber-400 text-slate-900 border-amber-400';

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-9 h-9 rounded-xl font-bold text-xs border transition flex items-center justify-center relative ${bgClass} ${
                        isCurrent ? 'ring-2 ring-slate-900 ring-offset-2' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Palette Legend */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-emerald-600"></span>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-amber-400"></span>
                  <span>Marked for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-slate-100 border border-slate-300"></span>
                  <span>Unanswered</span>
                </div>
              </div>

              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full mt-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition shadow-xs"
              >
                Finish & Submit Test
              </button>
            </div>
          </div>

          {/* Submit Modal */}
          {showSubmitModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center font-bold text-xl">
                  ?
                </div>
                <h3 className="font-extrabold text-lg text-slate-900">Confirm CBT Examination Submission</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You have answered <strong>{Object.keys(userAnswers).length}</strong> of{' '}
                  <strong>{selectedExam.questions.length}</strong> questions. Are you sure you want to finalize your submission?
                </p>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs transition"
                  >
                    Return to Test
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition"
                  >
                    Yes, Submit Test Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: INSTANT CBT RESULT & DETAILED REVIEW */}
      {activeView === 'results_review' && activeAttempt && selectedExam && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Result Banner */}
          <div
            className={`p-6 sm:p-8 rounded-2xl shadow-lg border text-white flex flex-col sm:flex-row items-center justify-between gap-6 ${
              activeAttempt.passed
                ? 'bg-gradient-to-r from-emerald-800 to-teal-900 border-emerald-700'
                : 'bg-gradient-to-r from-rose-900 to-slate-900 border-rose-800'
            }`}
          >
            <div>
              <span className="px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider">
                {activeAttempt.passed ? 'PASSED TEST' : 'NEEDS IMPROVEMENT'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-2">{activeAttempt.studentName}</h2>
              <p className="text-emerald-100 text-xs mt-1">{activeAttempt.examTitle}</p>
            </div>

            <div className="text-center sm:text-right shrink-0 bg-white/10 p-4 rounded-2xl border border-white/20">
              <span className="text-[10px] text-emerald-200 uppercase font-bold block">Final Score</span>
              <span className="text-3xl sm:text-4xl font-black text-amber-300">
                {activeAttempt.percentageScore}%
              </span>
              <p className="text-xs text-white font-semibold mt-1">
                {activeAttempt.scoreObtained} / {activeAttempt.totalPossibleMarks} Marks
              </p>
            </div>
          </div>

          {/* Question-by-Question Detailed Review */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 pb-3 border-b border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              Detailed CBT Answers Review
            </h3>

            <div className="space-y-4">
              {selectedExam.questions.map((q, idx) => {
                const ansLog = activeAttempt.answers.find((a) => a.questionId === q.id);
                const selectedOpt = q.options.find((o) => o.id === ansLog?.selectedOptionId);
                const correctOpt = q.options.find((o) => o.id === q.correctOptionId);

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      ansLog?.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Q{idx + 1}. {q.questionText}</span>
                      <span className={ansLog?.isCorrect ? 'text-emerald-700' : 'text-rose-600'}>
                        {ansLog?.isCorrect ? `+${ansLog.marksObtained} Marks` : '0 Marks'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-slate-400 font-bold block">Your Selected Option:</span>
                        <span className={ansLog?.isCorrect ? 'font-bold text-emerald-800' : 'font-bold text-rose-700'}>
                          {selectedOpt ? selectedOpt.text : 'Not Answered'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block">Correct Option:</span>
                        <span className="font-bold text-slate-900">{correctOpt?.text}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 font-medium">
                {currentUser.role === 'STUDENT'
                  ? 'Click OK to finish your examination session and log out from the student portal.'
                  : 'Finished reviewing student CBT examination result.'}
              </div>
              <button
                onClick={handleOkLogout}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                {currentUser.role === 'STUDENT' ? 'OK (Log Out & Finish Exam)' : 'OK (Return to Examination Hub)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
