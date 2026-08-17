'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { Student } from '@/lib/types';
import {
  GraduationCap,
  Search,
  Plus,
  ArrowUpRight,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  FileText,
  Filter,
} from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const { students, classes, addStudent, updateStudent, deleteStudent, promoteStudents } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // New Student Form State
  const [newFullName, setNewFullName] = useState('');
  const [newGender, setNewGender] = useState<'Male' | 'Female'>('Male');
  const [newClassId, setNewClassId] = useState(classes[0]?.id || '');
  const [newDob, setNewDob] = useState('2012-01-01');
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianPhone, setNewGuardianPhone] = useState('');
  const [newGuardianEmail, setNewGuardianEmail] = useState('');
  const [newAddress, setNewAddress] = useState('Okene, Kogi State');
  const [newPassword, setNewPassword] = useState('student123');

  // Class Promotion Form State
  const [fromClassId, setFromClassId] = useState(classes[0]?.id || '');
  const [toClassId, setToClassId] = useState(classes[1]?.id || '');

  // Filtered Students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.guardianName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClassFilter === 'ALL' || student.classId === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim()) return;

    const targetClass = classes.find((c) => c.id === newClassId);
    const className = targetClass ? targetClass.name : 'JSS1 A';

    addStudent({
      fullName: newFullName.trim(),
      gender: newGender,
      dateOfBirth: newDob,
      classId: newClassId,
      className,
      guardianName: newGuardianName.trim() || 'Parent/Guardian',
      guardianPhone: newGuardianPhone.trim() || '+234 803 000 0000',
      guardianEmail: newGuardianEmail.trim() || 'guardian@gmail.com',
      address: newAddress.trim() || 'Okene, Kogi State',
      status: 'Active',
      passportUrl: `https://picsum.photos/seed/${newFullName.toLowerCase().replace(/\s+/g, '-')}/200/200`,
      password: newPassword.trim() || 'student123',
    });

    // Reset Form
    setNewFullName('');
    setShowAddModal(false);
  };

  const handlePromote = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromClassId === toClassId) {
      alert('Target class must be different from source class.');
      return;
    }
    promoteStudents(fromClassId, toClassId);
    setShowPromoteModal(false);
    alert('Students promoted successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-700" />
            Student Directory & Enrollment
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Divine Academy student records, class assignments, and session promotions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowPromoteModal(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs transition flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            Promote Class
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Register Student
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name, admission no, or guardian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-800 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 w-full sm:w-auto"
          >
            <option value="ALL">All Classes ({students.length})</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Student Name & Adm. No</th>
                <th className="p-4">Class</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Guardian Details</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No student records matching your query.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-xs text-emerald-900 overflow-hidden">
                          {st.passportUrl ? (
                            <img src={st.passportUrl} alt={st.fullName} className="w-full h-full object-cover" />
                          ) : (
                            st.fullName.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{st.fullName}</p>
                          <p className="text-[10px] font-mono text-emerald-800">{st.admissionNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[11px]">
                        {st.className}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{st.gender}</td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{st.guardianName}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {st.guardianPhone}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        {st.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(st)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] transition"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-700" />
                Register New Student (Divine Academy)
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Divine Johnson"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold text-slate-900"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Class *</label>
                  <select
                    value={newClassId}
                    onChange={(e) => setNewClassId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold text-slate-900"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guardian Name</label>
                  <input
                    type="text"
                    placeholder="Parent / Guardian Name"
                    value={newGuardianName}
                    onChange={(e) => setNewGuardianName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guardian Phone</label>
                  <input
                    type="text"
                    placeholder="+234 803 000 0000"
                    value={newGuardianPhone}
                    onChange={(e) => setNewGuardianPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Home Address</label>
                  <input
                    type="text"
                    placeholder="Okene, Kogi State"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign Student Password *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pass123!"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition shadow-xs"
                >
                  Save Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promote Class Modal */}
      {showPromoteModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-emerald-700" />
                Academic Session Student Promotion
              </h3>
              <button onClick={() => setShowPromoteModal(false)} className="text-slate-400 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handlePromote} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">From Current Class</label>
                <select
                  value={fromClassId}
                  onChange={(e) => setFromClassId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.studentCount} students)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Promote To Target Class</label>
                <select
                  value={toClassId}
                  onChange={(e) => setToClassId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                <p className="font-bold">⚠️ Promotion Notice:</p>
                All active students in the selected source class will be transferred to the target class for the next session.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPromoteModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition shadow-xs"
                >
                  Confirm Class Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Profile Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-600 overflow-hidden flex items-center justify-center font-bold text-xl text-emerald-900">
                {selectedStudent.passportUrl ? (
                  <img src={selectedStudent.passportUrl} alt={selectedStudent.fullName} className="w-full h-full object-cover" />
                ) : (
                  selectedStudent.fullName.charAt(0)
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{selectedStudent.fullName}</h3>
                <p className="text-xs font-mono font-bold text-emerald-800">{selectedStudent.admissionNo}</p>
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[11px] mt-1">
                  {selectedStudent.className}
                </span>
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Gender</span>
                  <span className="font-bold text-slate-900">{selectedStudent.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Enrolled Date</span>
                  <span className="font-bold text-slate-900">{selectedStudent.enrolledDate}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                <div>
                  <span className="text-emerald-800 text-[10px] uppercase font-bold block">Assigned CBT Login Password</span>
                  <span className="font-mono font-black text-slate-900 text-xs">{selectedStudent.password || 'student123'}</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-white text-emerald-800 border border-emerald-300 rounded-md">
                  Active Pass
                </span>
              </div>

              <div className="space-y-1.5">
                <p className="font-bold text-slate-800">Guardian Contact:</p>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  <span>{selectedStudent.guardianName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{selectedStudent.guardianPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{selectedStudent.address}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  if (confirm(`Remove ${selectedStudent.fullName} from school database?`)) {
                    deleteStudent(selectedStudent.id);
                    setSelectedStudent(null);
                  }
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-700"
              >
                Delete Student
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
