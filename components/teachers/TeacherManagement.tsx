'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { Teacher } from '@/lib/types';
import { Users, Plus, BookOpen, Mail, Phone, Award, ShieldCheck } from 'lucide-react';

export const TeacherManagement: React.FC = () => {
  const { teachers, subjects, classes, addTeacher, updateTeacher } = useSchool();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // New Teacher State
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [qualification, setQualification] = useState('B.Sc. Ed.');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [allocatedSubjects, setAllocatedSubjects] = useState<
    { subjectId: string; subjectName: string; classId: string; className: string }[]
  >([]);

  const handleAddAllocation = () => {
    const sub = subjects.find((s) => s.id === selectedSubjectId);
    const cls = classes.find((c) => c.id === selectedClassId);
    if (!sub || !cls) return;

    // Avoid duplicates
    const exists = allocatedSubjects.some(
      (a) => a.subjectId === sub.id && a.classId === cls.id
    );
    if (!exists) {
      setAllocatedSubjects((prev) => [
        ...prev,
        { subjectId: sub.id, subjectName: sub.name, classId: cls.id, className: cls.name },
      ]);
    }
  };

  const handleRemoveAllocation = (index: number) => {
    setAllocatedSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    let finalAssignments = [...allocatedSubjects];
    if (finalAssignments.length === 0) {
      const sub = subjects.find((s) => s.id === selectedSubjectId);
      const cls = classes.find((c) => c.id === selectedClassId);
      if (sub && cls) {
        finalAssignments = [{ subjectId: sub.id, subjectName: sub.name, classId: cls.id, className: cls.name }];
      }
    }

    addTeacher({
      fullName: fullName.trim(),
      gender,
      qualification: qualification.trim(),
      email: email.trim(),
      phone: phone.trim() || '+234 802 000 0000',
      subjectsTaught: finalAssignments,
      status: 'Active',
    });

    setFullName('');
    setEmail('');
    setPhone('');
    setAllocatedSubjects([]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-700" />
            Teacher Directory & Staff Assignments
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage academic staff qualifications, form teacher roles, and subject teaching allocations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Teacher
        </button>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center font-bold text-sm text-emerald-900 overflow-hidden shrink-0">
                    {teacher.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{teacher.fullName}</h3>
                    <p className="text-[10px] font-mono text-emerald-800 font-semibold">{teacher.staffNo}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {teacher.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="line-clamp-1 font-medium">{teacher.qualification}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="line-clamp-1 font-mono">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{teacher.phone}</span>
                </div>
              </div>

              {/* Subject Allocations */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-emerald-700" />
                  Allocated Subject Classes:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {teacher.subjectsTaught.length === 0 ? (
                    <span className="text-[11px] text-slate-400 italic">No subject allocated</span>
                  ) : (
                    teacher.subjectsTaught.map((st, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-800"
                      >
                        {st.subjectName} ({st.className})
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {teacher.isFormTeacherOf && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-emerald-800 text-xs font-bold bg-emerald-50/80 p-2 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Form Teacher: {teacher.isFormTeacherOf}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-700" />
                Add New Staff Member
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Ibrahim Sule"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Academic Qualification</label>
                <input
                  type="text"
                  placeholder="e.g. B.Sc. Ed. Mathematics"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="teacher@divineacademy.edu.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+234 802 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
              </div>

              {/* Subject & Class Allocation Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-700">Subjects & Classes Taught *</label>
                <div className="grid grid-cols-5 gap-2 items-center">
                  <div className="col-span-2">
                    <select
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs"
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddAllocation}
                    className="col-span-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition"
                  >
                    + Add
                  </button>
                </div>

                {/* Allocated list */}
                {allocatedSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {allocatedSubjects.map((st, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold rounded-lg text-[11px]"
                      >
                        {st.subjectName} ({st.className})
                        <button
                          type="button"
                          onClick={() => handleRemoveAllocation(i)}
                          className="text-emerald-700 hover:text-rose-600 font-extrabold ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition shadow-xs"
                >
                  Save Teacher Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
