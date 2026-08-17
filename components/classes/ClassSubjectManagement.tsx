'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { Subject } from '@/lib/types';
import { BookOpenCheck, Plus, School, BookMarked, Layers, Pencil, Trash2 } from 'lucide-react';

export const ClassSubjectManagement: React.FC = () => {
  const { classes, subjects, teachers, addClass, addSubject, updateSubject, deleteSubject } = useSchool();
  const [activeTab, setActiveTab] = useState<'classes' | 'subjects'>('classes');

  // Modals
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // New Class Form
  const [className, setClassName] = useState('');
  const [level, setLevel] = useState<'JSS1' | 'JSS2' | 'JSS3' | 'SS1' | 'SS2' | 'SS3'>('JSS1');
  const [arm, setArm] = useState<'A' | 'B' | 'Science' | 'Arts' | 'Commercial'>('A');

  // Subject Form
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [category, setCategory] = useState<'Core' | 'Science' | 'Arts' | 'Commercial' | 'General'>('Core');
  const [levelGroup, setLevelGroup] = useState<'JSS' | 'SSS' | 'ALL'>('ALL');

  const openAddSubjectModal = () => {
    setEditingSubject(null);
    setSubjectCode('');
    setSubjectName('');
    setCategory('Core');
    setLevelGroup('ALL');
    setShowSubjectModal(true);
  };

  const openEditSubjectModal = (sub: Subject) => {
    setEditingSubject(sub);
    setSubjectCode(sub.code);
    setSubjectName(sub.name);
    setCategory(sub.category);
    setLevelGroup(sub.levelGroup);
    setShowSubjectModal(true);
  };

  const handleDeleteSubject = (sub: Subject) => {
    if (window.confirm(`Are you sure you want to delete the subject "${sub.name}" (${sub.code})?`)) {
      deleteSubject(sub.id);
    }
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;

    addClass({
      name: className.trim(),
      level,
      arm,
    });

    setClassName('');
    setShowClassModal(false);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim() || !subjectCode.trim()) return;

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        code: subjectCode.trim().toUpperCase(),
        name: subjectName.trim(),
        category,
        levelGroup,
      });
    } else {
      addSubject({
        code: subjectCode.trim().toUpperCase(),
        name: subjectName.trim(),
        category,
        levelGroup,
      });
    }

    setSubjectCode('');
    setSubjectName('');
    setEditingSubject(null);
    setShowSubjectModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpenCheck className="w-6 h-6 text-emerald-700" />
            Class Arms & Subject Catalog
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Divine Academy secondary school structure (Junior & Senior Secondary Arms).
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'classes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Class Arms ({classes.length})
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'subjects' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Subjects ({subjects.length})
          </button>
        </div>
      </div>

      {/* Classes View */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowClassModal(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Class Arm
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((c) => {
              const formTeacher = teachers.find((t) => t.id === c.formTeacherId);
              return (
                <div
                  key={c.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-extrabold text-xs">
                        {c.level}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">{c.studentCount} Students</span>
                    </div>

                    <h3 className="font-black text-lg text-slate-900">{c.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Arm Type: <strong className="text-slate-700">{c.arm}</strong></p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-bold">Form Teacher:</span>
                    <span className="font-bold text-slate-900">
                      {formTeacher ? formTeacher.fullName : 'Unassigned'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subjects View */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={openAddSubjectModal}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Subject
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Subject Code</th>
                  <th className="p-4">Subject Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Applicable Level</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {subjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono font-bold text-emerald-800">{sub.code}</td>
                    <td className="p-4 font-bold text-slate-900">{sub.name}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[11px]">
                        {sub.category}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-600">{sub.levelGroup}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditSubjectModal(sub)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] rounded-lg border border-amber-200 transition inline-flex items-center gap-1"
                        title="Edit Subject"
                      >
                        <Pencil className="w-3 h-3 text-amber-600" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(sub)}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] rounded-lg border border-rose-200 transition inline-flex items-center gap-1"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showClassModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Create Class Arm</h3>
              <button onClick={() => setShowClassModal(false)} className="text-slate-400 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Class Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JSS1 A or SS2 Science"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
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
                  <label className="block font-bold text-slate-700 mb-1">Arm Type</label>
                  <select
                    value={arm}
                    onChange={(e) => setArm(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  >
                    <option value="A">Arm A</option>
                    <option value="B">Arm B</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition shadow-xs"
                >
                  Create Class Arm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">
                {editingSubject ? `Edit Subject: ${editingSubject.name}` : 'Add New Subject'}
              </h3>
              <button onClick={() => setShowSubjectModal(false)} className="text-slate-400 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MTH101"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Further Mathematics"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  >
                    <option value="Core">Core</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commercial">Commercial</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Applicable Level</label>
                  <select
                    value={levelGroup}
                    onChange={(e) => setLevelGroup(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  >
                    <option value="ALL">ALL (JSS & SSS)</option>
                    <option value="JSS">JSS Only</option>
                    <option value="SSS">SSS Only</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition shadow-xs"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
