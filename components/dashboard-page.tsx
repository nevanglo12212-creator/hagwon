'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { LessonCard, LoadingState, type GeneratedLesson } from '@/components/lesson-card';

const subjectOptions = ['General', 'Math', 'Science', 'English', 'History', 'Korean', 'Chinese', 'Custom'];
const modes = ['0.1% Student', 'Exam Mode', 'Deep Understanding', 'Quick Review', 'Beginner', 'Mistake Analysis'];

export function DashboardPage() {
  const [subject, setSubject] = useState('General');
  const [mode, setMode] = useState('0.1% Student');
  const [notes, setNotes] = useState('');
  const [lesson, setLesson] = useState<GeneratedLesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const saveLesson = (nextLesson: GeneratedLesson) => {
    const stored = JSON.parse(localStorage.getItem('hagwon-lessons') || '[]');
    const entry = {
      id: Date.now().toString(),
      title: nextLesson.title || 'Untitled lesson',
      subject: nextLesson.subject,
      notes,
      lesson: nextLesson,
      createdAt: new Date().toISOString(),
      lastStudied: new Date().toISOString(),
    };
    localStorage.setItem('hagwon-lessons', JSON.stringify([entry, ...stored].slice(0, 20)));
  };

  const handleGenerate = async () => {
    if (!notes.trim()) {
      setError('Please add some notes first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, subject, mode }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Something went wrong while generating your lesson. Please try again.');
      }

      setLesson(data);
      saveLesson(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while generating your lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-frame">
          <div className="topbar">
            <div className="title-group">
              <h1>AI HAGWON TUTOR</h1>
              <div className="subtitle">Turn messy notes into mastery.</div>
            </div>
            <div className="status-badge"><span className="status-dot" aria-hidden="true" /> Ready</div>
          </div>

          <div className="layout-grid">
            <section className="editor-card card">
              <div className="card-header">
                <div className="section-label">01 — Your Notes</div>
              </div>

              <div className="subject-row">
                <label className="select-wrap" aria-label="Select subject">
                  <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                    {subjectOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mode-row" aria-label="Study modes">
                {modes.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={`mode-pill ${mode === item ? 'active' : ''}`}
                    onClick={() => setMode(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <textarea
                className="notes-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your class notes here…"
                aria-label="Paste your notes here"
              />

              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={() => setNotes('')}>Clear</button>
                <button type="button" className="primary-button" onClick={handleGenerate} disabled={loading}>
                  {loading ? 'Teaching…' : 'Teach Me →'}
                </button>
              </div>

              {error && <div className="error-box">{error}</div>}
            </section>

            <section className="lesson-card card">
              {loading ? <LoadingState label="Building your lesson…" /> : <LessonCard lesson={lesson} />}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
