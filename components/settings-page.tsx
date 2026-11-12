'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';

export function SettingsPage() {
  const [enabled, setEnabled] = useState(true);
  const [examMode, setExamMode] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-frame">
          <div className="topbar">
            <div className="title-group">
              <h1>Settings</h1>
              <div className="subtitle">Study environment and tutor preferences.</div>
            </div>
          </div>

          <div className="page-card card">
            <div className="settings-list">
              <div className="setting-item">
                <div>
                  <strong>Adaptive explanations</strong>
                  <div style={{ color: '#5f625d', marginTop: 4 }}>Adjust depth to your current level.</div>
                </div>
                <button type="button" className={`toggle ${enabled ? 'active' : ''}`} aria-label="Toggle adaptive explanations" onClick={() => setEnabled((prev) => !prev)} />
              </div>

              <div className="setting-item">
                <div>
                  <strong>Exam mode</strong>
                  <div style={{ color: '#5f625d', marginTop: 4 }}>Prioritize test traps and high-value concepts.</div>
                </div>
                <button type="button" className={`toggle ${examMode ? 'active' : ''}`} aria-label="Toggle exam mode" onClick={() => setExamMode((prev) => !prev)} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
