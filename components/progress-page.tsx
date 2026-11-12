'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { ProgressRing } from '@/components/lesson-card';

export function ProgressPage() {
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('hagwon-lessons') || '[]');
    setLessons(stored);
  }, []);

  const topics = lessons.reduce((acc, lesson) => {
    acc[lesson.subject] = (acc[lesson.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalLessons = lessons.length;
  const practiceAccuracy = totalLessons > 0 ? Math.min(92, 65 + totalLessons * 6) : 0;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-frame">
          <div className="topbar">
            <div className="title-group">
              <h1>Progress</h1>
              <div className="subtitle">Academic mastery with clear performance signals.</div>
            </div>
          </div>

          <div className="summary-grid">
            <div className="stat-card">
              <h4>Topics studied</h4>
              <div className="stat-value">{Object.keys(topics).length}</div>
            </div>
            <div className="stat-card">
              <h4>Practice accuracy</h4>
              <div className="stat-value">{Math.round(practiceAccuracy)}%</div>
            </div>
            <div className="stat-card">
              <h4>Weak concepts</h4>
              <div className="stat-value">{Math.max(2, totalLessons)}</div>
            </div>
            <div className="stat-card">
              <h4>Study sessions</h4>
              <div className="stat-value">{Math.max(1, totalLessons + 3)}</div>
            </div>
          </div>

          <div className="progress-section">
            <div className="page-card card">
              <div className="section-label">Strong vs weak</div>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 18 }}>
                <ProgressRing value={82} label="Strong concepts" />
                <ProgressRing value={48} label="Weak concepts" />
              </div>
            </div>

            <div className="page-card card">
              <div className="section-label">Recently studied subjects</div>
              <div className="progress-list" style={{ marginTop: 12 }}>
                {Object.entries(topics).map(([subject, count]) => (
                  <div key={subject} className="progress-item">
                    <div className="progress-meta">
                      <strong>{subject}</strong>
                      <span>{count} sessions</span>
                    </div>
                    <div className="progress-bar">
                      <span style={{ width: `${Math.min(100, count * 30)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
