'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { CalendarCheck2, Check, X, Clock, Filter, Save } from 'lucide-react';

export const AttendanceRegister: React.FC = () => {
  const { students, classes, attendance, markAttendance } = useSchool();
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [attendanceDate, setAttendanceDate] = useState('2026-03-02');

  const classStudents = students.filter((s) => s.classId === selectedClassId);
  const [localStatuses, setLocalStatuses] = useState<
    Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'>
  >({});

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late' | 'Excused') => {
    setLocalStatuses((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    const records = classStudents.map((st) => ({
      date: attendanceDate,
      classId: selectedClassId,
      className: selectedClass?.name || '',
      studentId: st.id,
      studentName: st.fullName,
      status: localStatuses[st.id] || ('Present' as const),
    }));

    markAttendance(records);
    alert('Attendance register updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck2 className="w-6 h-6 text-emerald-700" />
            Daily Attendance Register
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track daily morning roll calls and student presence across class arms.
          </p>
        </div>

        <button
          onClick={handleSaveAttendance}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          Save Roll Call
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 text-xs">
        <div className="w-full sm:w-1/2">
          <label className="block font-bold text-slate-700 mb-1">Select Class Arm</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.studentCount} Students)
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/2">
          <label className="block font-bold text-slate-700 mb-1">Date</label>
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
          />
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-4">Adm. No</th>
              <th className="p-4">Student Name</th>
              <th className="p-4 text-center">Status Selection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {classStudents.map((st) => {
              const currentStatus = localStatuses[st.id] || 'Present';
              return (
                <tr key={st.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-mono font-bold text-emerald-800">{st.admissionNo}</td>
                  <td className="p-4 font-bold text-slate-900">{st.fullName}</td>

                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(st.id, 'Present')}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1 ${
                          currentStatus === 'Present'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" /> Present
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(st.id, 'Absent')}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1 ${
                          currentStatus === 'Absent'
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" /> Absent
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(st.id, 'Late')}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1 ${
                          currentStatus === 'Late'
                            ? 'bg-amber-500 text-slate-900 shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" /> Late
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
