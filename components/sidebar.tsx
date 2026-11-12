'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Learn', href: '/', key: 'learn' },
  { label: 'Notes', href: '/notes', key: 'notes' },
  { label: 'Practice', href: '/practice', key: 'practice' },
  { label: 'Progress', href: '/progress', key: 'progress' },
  { label: 'Settings', href: '/settings', key: 'settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand" aria-label="Hagwon home">
        <div className="brand-mark">H</div>
        <span>HAGWON</span>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/' && pathname === '/');
          return (
            <Link key={item.label} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`} aria-current={isActive ? 'page' : undefined}>
              <span className="nav-item-label">
                <span className="nav-dot" aria-hidden="true" />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="student-mode-card">
          <span className="student-mode-label">0.1% Student mode</span>
          <strong>Deep understanding. Strong recall. Exam-ready thinking.</strong>
        </div>
      </div>
    </aside>
  );
}
