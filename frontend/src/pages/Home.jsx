import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '5rem 1.5rem 4rem',
          textAlign: 'center',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, var(--glow-color) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '1.25rem',
              color: 'var(--text-heading)',
            }}
          >
            Implementation of{' '}
            <span className="gradient-text">Bit Stuffing</span>{' '}
            Using Python & Full-Stack Web Development
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-body)',
              maxWidth: 600,
              margin: '0 auto 2rem',
              lineHeight: 1.7,
            }}
          >
            An interactive full-stack application that demonstrates bit stuffing and
            bit destuffing — core techniques used in HDLC and other bit-oriented
            data link layer protocols.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/playground" className="btn-primary">
              Open Playground <ArrowRight size={16} />
            </Link>
            <Link to="/visualizer" className="btn-secondary">
              Step Visualizer
            </Link>
          </div>
        </div>
      </section>

      {/* Theory section */}
      <section style={{ padding: '0 1.5rem 4rem' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Bit Stuffing */}
          <div className="glass-card" style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb', flexShrink: 0 }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>Bit Stuffing</h3>
            </div>
            <p style={{ color: 'var(--text-body)', fontSize: '0.875rem', lineHeight: 1.75, margin: 0 }}>
              In bit-oriented protocols like <strong style={{ color: 'var(--text-heading)' }}>HDLC</strong>, frames are
              delimited by the flag <code style={{ color: 'var(--code-text)', fontFamily: 'monospace' }}>01111110</code>.
              If this pattern appears in the payload data, the receiver misinterprets it as a frame boundary.
              Bit stuffing solves this by inserting a <code style={{ color: 'var(--code-text)', fontFamily: 'monospace' }}>'0'</code> bit
              after every <strong style={{ color: 'var(--link-active)' }}>five consecutive '1' bits</strong> in the data stream —
              preventing the flag pattern from ever appearing unintentionally.
            </p>
          </div>

          {/* Bit Destuffing */}
          <div className="glass-card" style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c3aed', flexShrink: 0 }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>Bit Destuffing</h3>
            </div>
            <p style={{ color: 'var(--text-body)', fontSize: '0.875rem', lineHeight: 1.75, margin: 0 }}>
              The receiver performs the reverse. It scans the incoming stream and counts consecutive
              <code style={{ color: 'var(--accent-green)', fontFamily: 'monospace' }}> '1'</code> bits. Whenever exactly
              <strong style={{ color: 'var(--link-active)' }}> five consecutive '1's</strong> are counted, the very next bit
              is a stuffed zero — so it is <strong style={{ color: 'var(--text-heading)' }}>discarded</strong> and the counter
              resets. This perfectly reconstructs the original payload without any data loss.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
