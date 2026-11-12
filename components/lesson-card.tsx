'use client';

import { useMemo, useState } from 'react';

export type LessonSection = {
  title: string;
  content: string;
  bullets?: string[];
};

export type PracticeQuestion = {
  question: string;
  type: string;
  choices?: string[];
  answer: string;
  explanation: string;
  difficulty: string;
  whyWrong?: string[];
};

export type GeneratedLesson = {
  title: string;
  subject: string;
  mode: string;
  summary: string;
  sections: LessonSection[];
  practice: PracticeQuestion[];
  keyTakeaways: string[];
};

export function LessonCard({ lesson }: { lesson: GeneratedLesson | null }) {
  if (!lesson) {
    return (
      <div className="empty-state card">
        <div className="empty-state-inner">
          <h3>Your lesson appears here.</h3>
          <p>Paste notes and let Hagwon turn them into a coherent study lesson.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-card card">
      <div className="lesson-header">
        <div className="lesson-title-wrap">
          <div className="section-label">02 — Hagwon Lesson</div>
          <h3>{lesson.title}</h3>
          <div className="pill-row">
            <span className="meta-pill">0.1% MODE</span>
            <span className="meta-pill">{lesson.subject}</span>
            <span className="meta-pill">{lesson.mode}</span>
          </div>
        </div>
      </div>

      <p className="lesson-summary">{lesson.summary}</p>

      <div className="lesson-sections">
        {lesson.sections.map((section, index) => (
          <div className="lesson-section" key={`${section.title}-${index}`}>
            <h4>{section.title}</h4>
            {section.content && <p>{section.content}</p>}
            {section.bullets && section.bullets.length > 0 && (
              <ul>
                {section.bullets.map((bullet, bulletIndex) => (
                  <li key={`${section.title}-${bulletIndex}`}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {lesson.practice && lesson.practice.length > 0 && (
        <div className="practice-panel">
          <h4>Practice</h4>
          <div className="quiz-list">
            {lesson.practice.map((question, index) => (
              <div className="quiz-card" key={`${question.question}-${index}`}>
                <h5>
                  {index + 1}. {question.question}
                </h5>
                <div className="quiz-options">
                  {question.choices?.map((choice) => (
                    <button key={choice} type="button" className="quiz-option" aria-label={choice}>
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function LoadingState({ label = 'Building your lesson...' }: { label?: string }) {
  return (
    <div className="loading-box">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state card">
      <div className="empty-state-inner">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export function ProgressRing({ value, label }: { value: number; label: string }) {
  const pct = Math.min(Math.max(value, 0), 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: `conic-gradient(#111111 ${pct * 3.6}deg, #ecece8 0deg)`,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div style={{ width: 78, height: 78, borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
          {pct}%
        </div>
      </div>
      <small style={{ color: '#5f625d' }}>{label}</small>
    </div>
  );
}
