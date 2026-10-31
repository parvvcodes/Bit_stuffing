import { NavLink } from 'react-router-dom';
import { Binary, Home, Lightbulb, Info, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/playground', label: 'Playground', icon: Binary },
  { to: '/visualizer', label: 'Visualizer', icon: Lightbulb },
  { to: '/about', label: 'About', icon: Info },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <nav
      style={{
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-nav)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '4rem', gap: '1.5rem', position: 'relative' }}>
          {/* Logo — pinned left */}
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', position: 'absolute', left: 0 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Binary size={20} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-heading)' }}>
              Bit<span style={{ color: 'var(--link-active)' }}>Stuff</span>
            </span>
          </NavLink>

          {/* Desktop nav — centred */}
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} className="desktop-nav">
            {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.4rem 0.875rem',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: isActive ? 'var(--link-active)' : 'var(--text-body)',
                  background: isActive ? 'var(--link-active-bg)' : 'transparent',
                  transition: 'all 0.15s ease',
                })}
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Top-Rightmost Controls: Theme Toggle & Mobile hamburger */}
          <div style={{ position: 'absolute', right: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="theme-toggle-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                borderRadius: 9,
                border: '1px solid var(--border-card)',
                background: 'var(--bg-toggle)',
                color: isDark ? '#fbbf24' : '#6366f1',
                cursor: 'pointer',
                boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
              }}
            >
              {isDark ? (
                <Moon size={18} style={{ color: '#818cf8' }} />
              ) : (
                <Sun size={18} style={{ color: '#d97706' }} />
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-body)',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'none',
              }}
              className="mobile-menu-btn"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              paddingBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
            className="mobile-nav"
          >
            {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 0.75rem',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: isActive ? 'var(--link-active)' : 'var(--text-body)',
                  background: isActive ? 'var(--link-active-bg)' : 'transparent',
                })}
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
