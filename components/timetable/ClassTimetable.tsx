'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { Clock3, Calendar, BookOpen } from 'lucide-react';

export const ClassTimetable: React.FC = () => {
  const { classes, timetable } = useSchool();
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [
    '08:00 AM - 08:45 AM',
    '08:45 AM - 09:30 AM',
    '09:30 AM - 10:15 AM',
    '10:15 AM - 10:45 AM (Short Break)',
    '10:45 AM - 11:30 AM',
    '11:30 AM - 12:15 PM',
  ];

  const classTimetableEntries = timetable.filter((t) => t.classId === selectedClassId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock3 className="w-6 h-6 text-emerald-700" />
            Class Academic Timetable
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Weekly subject schedule, classroom locations, and teaching periods.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Class</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-900"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timetable Table Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3 border-r border-slate-800">Time Period</th>
                {days.map((day) => (
                  <th key={day} className="p-3 text-center border-r border-slate-800">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {periods.map((period, idx) => {
                const isBreak = period.includes('Break');
                return (
                  <tr key={idx} className={isBreak ? 'bg-amber-50/80 font-bold' : 'hover:bg-slate-50'}>
                    <td className="p-3 border-r border-slate-200 font-mono text-[11px] font-bold text-slate-600">
                      {period}
                    </td>

                    {days.map((day) => {
                      if (isBreak) {
                        return (
                          <td key={day} className="p-3 text-center text-amber-900 font-bold italic text-[11px]">
                            BREAK & SNACKS
                          </td>
                        );
                      }

                      const periodIndex = idx + 1;
                      const entry = classTimetableEntries.find(
                        (t) => t.day === day && (t.periodNumber === periodIndex || t.timeRange.includes(period.split(' ')[0]))
                      );

                      return (
                        <td key={day} className="p-3 text-center border-r border-slate-200">
                          {entry ? (
                            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                              <p className="font-bold text-emerald-900">{entry.subjectName}</p>
                              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{entry.teacherName}</p>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-300 italic">Free Period</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
