'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { Megaphone, Plus, Bell, Calendar, Tag } from 'lucide-react';

export const AnnouncementBoard: React.FC = () => {
  const { announcements, addAnnouncement, currentUser } = useSchool();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'General' | 'Academic' | 'Exam' | 'PTA' | 'Urgent'>('General');
  const [targetRole, setTargetRole] = useState<'ALL' | 'TEACHER' | 'STUDENT' | 'PARENT'>('ALL');
  const [content, setContent] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addAnnouncement({
      title: title.trim(),
      category,
      targetRole,
      content: content.trim(),
      author: currentUser.name,
    });

    setTitle('');
    setContent('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-amber-500" />
            School Circulars & Announcement Board
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official notices broadcast to teachers, students, and parents of Divine Academy.
          </p>
        </div>

        {(currentUser.role === 'ADMIN' || currentUser.role === 'TEACHER') && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            New Broadcast Notice
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((anc) => (
          <div
            key={anc.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase">
                  {anc.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                  Target: {anc.targetRole}
                </span>
              </div>

              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {anc.createdAt}
              </span>
            </div>

            <h3 className="font-extrabold text-base text-slate-900">{anc.title}</h3>
            <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">{anc.content}</p>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-semibold">
              Posted by: <strong className="text-slate-700">{anc.author}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* New Notice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Broadcast New Circular</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handlePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Resumption & Mid-Term Exam Schedule"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  >
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Exam">Exam</option>
                    <option value="PTA">PTA</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Audience</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  >
                    <option value="ALL">ALL (Everyone)</option>
                    <option value="TEACHER">Teachers Only</option>
                    <option value="STUDENT">Students Only</option>
                    <option value="PARENT">Parents Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Body *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type official broadcast details..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition shadow-xs"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
