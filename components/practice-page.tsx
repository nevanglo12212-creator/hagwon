'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { EmptyState, LoadingState } from '@/components/lesson-card';

type QuizQuestion = {
  question: string;
  type: string;
  choices?: string[];
  answer: string;
  explanation: string;
  difficulty: string;
  whyWrong?: string[];
};

export function PracticePage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('hagwon-lessons') || '[]');
    setLessons(stored);
    if (stored[0]) setSelectedLessonId(stored[0].id);
  }, []);

  const selectedLesson = useMemo(() => lessons.find((item) => item.id === selectedLessonId), [lessons, selectedLessonId]);

  const generateQuiz = async () => {
    if (!selectedLesson) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson: selectedLesson.lesson }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Unable to generate quiz.');
      setQuestions(data.questions || []);
      setSelectedAnswers({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while generating your quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (index: number, value: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const score = Object.keys(selectedAnswers).length;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-frame">
          <div className="topbar">
            <div className="title-group">
              <h1>Practice</h1>
              <div className="subtitle">Quiz mode built from saved lessons.</div>
            </div>
          </div>

          <div className="notes-grid">
            <div className="page-card card">
              <div className="subject-row">
                <label className="select-wrap" aria-label="Select lesson for practice">
                  <select value={selectedLessonId} onChange={(e) => setSelectedLessonId(e.target.value)}>
                    {lessons.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                    ))}
                  </select>
                </label>
                <button type="button" className="primary-button" onClick={generateQuiz} disabled={loading || !selectedLesson}>
                  {loading ? 'Generating…' : 'Generate Quiz'}
                </button>
              </div>

              {error && <div className="error-box">{error}</div>}

              {loading && <LoadingState label="Generating quiz…" />}

              {!loading && questions.length === 0 && (
                <EmptyState title="No practice quiz yet" description="Select a saved lesson and generate a quiz to begin practice." />
              )}

              {questions.length > 0 && (
                <div className="quiz-list" style={{ marginTop: 18 }}>
                  {questions.map((question, index) => {
                    const selected = selectedAnswers[index];
                    const isCorrect = selected && selected === question.answer;
                    return (
                      <div className="quiz-card" key={`${question.question}-${index}`}>
                        <h5>
                          {index + 1}. {question.question}
                        </h5>
                        <div className="quiz-options">
                          {question.choices?.map((choice) => {
                            const isSelected = selected === choice;
                            const isAnswer = question.answer === choice;
                            const classNames = ['quiz-option'];
                            if (selected) {
                              if (isAnswer) classNames.push('correct');
                              else if (isSelected) classNames.push('incorrect');
                            }
                            if (isSelected && !selected) classNames.push('selected');

                            return (
                              <button
                                type="button"
                                key={choice}
                                className={classNames.join(' ')}
                                onClick={() => selectAnswer(index, choice)}
                              >
                                {choice}
                              </button>
                            );
                          })}
                        </div>

                        {selected && (
                          <div className="quiz-feedback">
                            <strong>{isCorrect ? 'Correct' : 'Not quite'}</strong>
                            <p>
                              {question.explanation}
                              {question.whyWrong && question.whyWrong.length > 0 && (
                                <>
                                  <br />
                                  <br />
                                  {question.whyWrong.join(' ')}
                                </>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="page-card card">
              <div className="section-label">Progress snapshot</div>
              <div style={{ marginTop: 14 }}>
                <strong>{score}</strong> answered
                <div style={{ marginTop: 8, color: '#5f625d' }}>
                  {questions.length > 0 ? `Focus on ${Math.max(questions.length - score, 0)} remaining review items.` : 'No quiz generated yet.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
