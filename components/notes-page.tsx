'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { EmptyState } from '@/components/lesson-card';

export type SavedLesson = {
  id: string;
  title: string;
  subject: string;
  notes: string;
  lesson: Record<string, any>;
  createdAt: string;
  lastStudied: string;
};

export function NotesPage() {
  const [lessons, setLessons] = useState<SavedLesson[]>([]);
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('hagwon-lessons') || '[]');
    setLessons(stored);
  }, []);

  const subjects = useMemo(() => ['All', ...new Set(lessons.map((lesson) => lesson.subject))], [lessons]);

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesText = lesson.title.toLowerCase().includes(query.toLowerCase()) || lesson.notes.toLowerCase().includes(query.toLowerCase());
      const matchesSubject = subjectFilter === 'All' || lesson.subject === subjectFilter;
      return matchesText && matchesSubject;
    });
  }, [lessons, query, subjectFilter]);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-frame">
          <div className="topbar">
            <div className="title-group">
              <h1>Notes</h1>
              <div className="subtitle">Saved lessons and study records.</div>
            </div>
          </div>

          <div className="page-card card">
            <div className="search-row">
              <input
                className="search-input"
                placeholder="Search saved lessons…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {subjects.map((subject) => (
                <button
                  type="button"
                  key={subject}
                  className={`filter-pill ${subjectFilter === subject ? 'active' : ''}`}
                  onClick={() => setSubjectFilter(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>

            {filteredLessons.length === 0 ? (
              <EmptyState title="No saved lessons yet" description="Generate your first lesson from the Learn page to build your notes library." />
            ) : (
              <div className="notes-list">
                {filteredLessons.map((lesson) => (
                  <div className="note-item" key={lesson.id}>
                    <div className="note-meta">
                      <strong>{lesson.title}</strong>
                      <span>{lesson.subject}</span>
                      <small>Created {new Date(lesson.createdAt).toLocaleDateString()} · Last studied {new Date(lesson.lastStudied).toLocaleDateString()}</small>
                    </div>
                    <div className="note-actions">
                      <button type="button" className="ghost-button">Open</button>
                      <button type="button" className="secondary-button">Review</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
