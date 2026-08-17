'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { CurriculumSubject, LessonPlanWeek } from '@/lib/types';
import { BookMarked, Sparkles, Plus, Search, BookOpen, Layers, CheckCircle2, ChevronRight } from 'lucide-react';

export const CurriculumCentre: React.FC = () => {
  const { curriculum, subjects, updateLessonPlan } = useSchool();

  const [selectedLevelFilter, setSelectedLevelFilter] = useState('ALL');
  const [selectedPlan, setSelectedPlan] = useState<CurriculumSubject | null>(null);

  // AI Generator Modal
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiLevel, setAiLevel] = useState<'JSS1' | 'JSS2' | 'JSS3' | 'SS1' | 'SS2' | 'SS3'>('JSS1');
  const [aiSubjectId, setAiSubjectId] = useState(subjects[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredPlans = curriculum.filter((plan) => {
    if (selectedLevelFilter === 'ALL') return true;
    return plan.level === selectedLevelFilter;
  });

  const handleGenerateLessonPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    const sub = subjects.find((s) => s.id === aiSubjectId);
    const subjectName = sub ? sub.name : 'Mathematics';

    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_lesson_plan',
          topic: aiTopic,
          subject: subjectName,
          classLevel: aiLevel,
        }),
      });

      const data = await res.json();
      if (data.lessonPlan && Array.isArray(data.lessonPlan.weeks)) {
        data.lessonPlan.weeks.forEach((wk: any, idx: number) => {
          updateLessonPlan(aiLevel, subjectName, '1st Term', {
            weekNumber: wk.weekNumber || idx + 1,
            topic: wk.topic || aiTopic,
            subTopics: wk.subTopics || [aiTopic],
            objectives: wk.objectives || ['Understand core principles'],
            instructionalMaterials: wk.instructionalMaterials || ['Chalkboard', 'Textbook'],
            previousKnowledge: wk.previousKnowledge || 'Basic concepts',
            teacherActivities: wk.teacherActivities || 'Explains topic and leads exercises',
            learnerActivities: wk.learnerActivities || 'Takes notes and solves practice questions',
            boardSummary: wk.boardSummary || aiTopic,
            evaluationQuestions: wk.evaluationQuestions || ['Explain the key concept.'],
            homework: wk.homework || 'Read Chapter 1',
          });
        });

        setShowAiModal(false);
        setAiTopic('');
        alert('Gemini AI created & saved lesson plan successfully!');
      } else if (data.error) {
        alert(`AI Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to Gemini AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-emerald-700" />
            Curriculum Centre & Lesson Notes (JSS1 – SS3)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Divine Academy schemes of work, lesson plans, and teaching aids alignment.
          </p>
        </div>

        <button
          onClick={() => setShowAiModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          AI Lesson Note Generator
        </button>
      </div>

      {/* Class Level Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {['ALL', 'JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevelFilter(lvl)}
            className={`px-4 py-2 rounded-xl font-bold transition shrink-0 ${
              selectedLevelFilter === lvl
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {lvl === 'ALL' ? 'All Classes' : lvl}
          </button>
        ))}
      </div>

      {/* Curriculum Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlans.length === 0 ? (
          <div className="col-span-full p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No curriculum plans found for this filter. Click &quot;AI Lesson Note Generator&quot; to create one.
          </div>
        ) : (
          filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-extrabold text-[11px]">
                    {plan.level}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{plan.subjectName}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900">
                  {plan.weeks[0]?.topic || plan.subjectName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {plan.term} Scheme • {plan.weeks.length} Academic Weeks Covered
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-purple-700 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Divine Scheme Approved
                </span>

                <button
                  onClick={() => setSelectedPlan(plan)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition flex items-center gap-1"
                >
                  View Scheme <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* AI Lesson Note Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Gemini AI Lesson Plan Builder
              </h3>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateLessonPlan} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lesson Topic *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Algebraic Processes & Factorization"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class Level</label>
                  <select
                    value={aiLevel}
                    onChange={(e) => setAiLevel(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  >
                    <option value="JSS1">JSS1</option>
                    <option value="JSS2">JSS2</option>
                    <option value="JSS3">JSS3</option>
                    <option value="SS1">SS1</option>
                    <option value="SS2">SS2</option>
                    <option value="SS3">SS3</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={aiSubjectId}
                    onChange={(e) => setAiSubjectId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 text-[11px] leading-relaxed">
                <p className="font-bold">✨ Gemini AI Automation:</p>
                Generates complete 4-week teaching schemes, instructional objectives, teacher/student activities, and evaluation tests tailored to the Nigerian curriculum.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 bg-purple-800 hover:bg-purple-900 text-white rounded-xl font-bold transition shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  {isGenerating ? 'Drafting Lesson...' : 'Generate Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scheme Detail View Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-extrabold text-[10px]">
                  {selectedPlan.level} • {selectedPlan.subjectName}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">{selectedPlan.term} Scheme of Work</h3>
              </div>
              <button onClick={() => setSelectedPlan(null)} className="text-slate-400 font-bold text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {selectedPlan.weeks.map((wk, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-emerald-900">
                    <span className="text-sm">Week {wk.weekNumber}: {wk.topic}</span>
                  </div>

                  {wk.subTopics && wk.subTopics.length > 0 && (
                    <div className="text-slate-700 font-medium">
                      <strong>Sub-topics: </strong> {wk.subTopics.join(', ')}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200/60">
                    <div>
                      <strong className="text-slate-900 block">Objectives:</strong>
                      <span className="text-slate-600">
                        {Array.isArray(wk.objectives) ? wk.objectives.join(' ') : wk.objectives}
                      </span>
                    </div>
                    <div>
                      <strong className="text-slate-900 block">Instructional Materials:</strong>
                      <span className="text-slate-600">
                        {Array.isArray(wk.instructionalMaterials)
                          ? wk.instructionalMaterials.join(', ')
                          : wk.instructionalMaterials}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end mt-4">
              <button
                onClick={() => setSelectedPlan(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs"
              >
                Close Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
