import {
  Code2,
  Server,
  Binary,
  Layers,
  Zap,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Shield,
  Workflow,
  Sparkles,
  Terminal,
} from 'lucide-react';

const FRONTEND_TECHS = [
  {
    name: 'React',
    role: 'Frontend Framework',
    desc: 'Component-based single page application architecture.',
    icon: Code2,
    color: 'var(--link-active)',
    bg: 'var(--link-active-bg)',
  },
  {
    name: 'Vite',
    role: 'Build Tool & Dev Server',
    desc: 'Lightning-fast hot module replacement and optimized bundling.',
    icon: Zap,
    color: 'var(--accent-amber)',
    bg: 'rgba(217, 119, 6, 0.12)',
  },
  {
    name: 'Tailwind CSS',
    role: 'Styling & Design',
    desc: 'Utility-first modern styling with custom glassmorphic components.',
    icon: Layers,
    color: 'var(--link-active)',
    bg: 'var(--link-active-bg)',
  },
];

const BACKEND_TECHS = [
  {
    name: 'FastAPI',
    role: 'REST API Framework',
    desc: 'High-performance asynchronous Python REST endpoints.',
    icon: Server,
    color: 'var(--accent-green)',
    bg: 'rgba(5, 150, 105, 0.12)',
  },
  {
    name: 'Python',
    role: 'Core Algorithm Engine',
    desc: 'Pure implementation of bit stuffing and destuffing logic.',
    icon: Binary,
    color: 'var(--accent-amber)',
    bg: 'rgba(217, 119, 6, 0.12)',
  },
  {
    name: 'Pydantic',
    role: 'Data Validation',
    desc: 'Strict schema enforcement and type checking for API payloads.',
    icon: Shield,
    color: 'var(--accent-red)',
    bg: 'rgba(220, 38, 38, 0.12)',
  },
  {
    name: 'Uvicorn & Pytest',
    role: 'Server & Testing',
    desc: 'ASGI production server with comprehensive automated test suites.',
    icon: Terminal,
    color: 'var(--accent-purple)',
    bg: 'rgba(124, 58, 237, 0.12)',
  },
];

const ARCHITECTURE_STEPS = [
  {
    step: '01',
    title: 'Client Layer',
    subtitle: 'React SPA · Port 5173',
    desc: 'Accepts raw binary input, validates allowed characters, and dispatches API calls.',
    icon: Code2,
    color: 'var(--link-active)',
    bg: 'var(--link-active-bg)',
  },
  {
    step: '02',
    title: 'API Gateway',
    subtitle: 'FastAPI · Port 8000',
    desc: 'Parses payload via Pydantic schemas and routes requests to algorithm handlers.',
    icon: Server,
    color: 'var(--accent-purple)',
    bg: 'rgba(124, 58, 237, 0.12)',
  },
  {
    step: '03',
    title: 'Algorithm Core',
    subtitle: 'Python 3.13 Engine',
    desc: 'Counts consecutive 1s, inserts or drops stuffed zeros, and generates step records.',
    icon: Binary,
    color: 'var(--accent-green)',
    bg: 'rgba(5, 150, 105, 0.12)',
  },
  {
    step: '04',
    title: 'Visual Output',
    subtitle: 'Dynamic UI Renderer',
    desc: 'Renders colored bit matrices, highlights modified bit positions, and animates playback.',
    icon: Layers,
    color: 'var(--link-active)',
    bg: 'var(--link-active-bg)',
  },
];

export default function About() {
  return (
    <div style={{ minHeight: '100%', padding: '3.5rem 1.5rem 6rem' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>

        {/* ─── Hero Section ─── */}
        <div style={{ textAlign: 'center', marginBottom: '4.5rem', position: 'relative' }}>
          {/* Subtle Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 550,
              height: 240,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, var(--glow-color) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <h1
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
              fontWeight: 900,
              lineHeight: 1.2,
              color: 'var(--text-heading)',
              marginBottom: '1rem',
            }}
          >
            About <span className="gradient-text">BitStuff</span>
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-body)',
              maxWidth: 680,
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            BitStuff is an interactive full-stack web application that demonstrates bit stuffing and bit destuffing using Python, React, and FastAPI, helping users understand data framing in computer networks.
          </p>
        </div>

        {/* ─── Technology Stack Section ─── */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'rgba(59, 130, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Cpu size={18} color="#60a5fa" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                Technology Stack
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-faint)', margin: 0 }}>
                Modern tools power both the interactive client and python execution engine
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Frontend Group */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 16,
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--link-active)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Frontend Ecosystem
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {FRONTEND_TECHS.map((tech) => {
                  const Icon = tech.icon;
                  return (
                    <div
                      key={tech.name}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.85rem',
                        padding: '0.75rem',
                        borderRadius: 10,
                        background: 'var(--bg-card-subtle)',
                        border: '1px solid var(--border-card)',
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: tech.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} color={tech.color} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.9rem' }}>{tech.name}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>· {tech.role}</span>
                        </div>
                        <div style={{ color: 'var(--text-body)', fontSize: '0.8rem', marginTop: '0.2rem', lineHeight: 1.5 }}>
                          {tech.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Backend Group */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 16,
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Backend & Algorithm
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {BACKEND_TECHS.map((tech) => {
                  const Icon = tech.icon;
                  return (
                    <div
                      key={tech.name}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.85rem',
                        padding: '0.75rem',
                        borderRadius: 10,
                        background: 'var(--bg-card-subtle)',
                        border: '1px solid var(--border-card)',
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: tech.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} color={tech.color} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.9rem' }}>{tech.name}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>· {tech.role}</span>
                        </div>
                        <div style={{ color: 'var(--text-body)', fontSize: '0.8rem', marginTop: '0.2rem', lineHeight: 1.5 }}>
                          {tech.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ─── System Architecture Section ─── */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'rgba(124, 58, 237, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Workflow size={18} color="var(--accent-purple)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                System Architecture
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-faint)', margin: 0 }}>
                End-to-end data flow between React client and FastAPI server
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              position: 'relative',
            }}
          >
            {ARCHITECTURE_STEPS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 14,
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    boxShadow: 'var(--card-shadow)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: 'var(--text-faint)',
                          fontFamily: 'var(--font-family-mono)',
                          background: 'var(--bg-card-subtle)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 6,
                        }}
                      >
                        {item.step}
                      </span>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: item.bg || 'var(--bg-card-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={16} color={item.color} />
                      </div>
                    </div>

                    <div style={{ fontWeight: 800, color: 'var(--text-heading)', fontSize: '1rem', marginBottom: '0.25rem' }}>
                      {item.title}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: item.color, fontWeight: 600, fontFamily: 'var(--font-family-mono)', marginBottom: '0.85rem' }}>
                      {item.subtitle}
                    </div>

                    <div style={{ color: 'var(--text-body)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Algorithm Overview Section ─── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'rgba(5, 150, 105, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Binary size={18} color="var(--accent-green)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                Algorithm Overview
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-faint)', margin: 0 }}>
                Core bit stuffing and destuffing logic executed on every request
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Bit Stuffing Card */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: 16,
                padding: '2rem',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--link-active)', margin: 0 }}>
                  Bit Stuffing
                </h3>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'var(--link-active)',
                    background: 'var(--link-active-bg)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 6,
                    textTransform: 'uppercase',
                  }}
                >
                  Transmitter
                </span>
              </div>

              <p style={{ color: 'var(--text-body)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Inserts a '0' bit after every 5 consecutive '1' bits to ensure the HDLC flag sequence (<code style={{ color: 'var(--code-text)' }}>01111110</code>) never occurs accidentally within data.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  'Scan the input binary payload from left to right.',
                  'Maintain a running counter of consecutive 1s.',
                  'When the counter reaches 5, immediately insert a stuffed 0.',
                  'Reset the counter to 0 after stuffing.',
                  'Emit the stuffed bit sequence to the receiver.',
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: 'var(--link-active)',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {i + 1}
                    </div>
                    <span style={{ color: 'var(--text-body)', fontSize: '0.85rem', lineHeight: 1.5 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bit Destuffing Card */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid rgba(124, 58, 237, 0.25)',
                borderRadius: 16,
                padding: '2rem',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-purple)', margin: 0 }}>
                  Bit Destuffing
                </h3>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'var(--accent-purple)',
                    background: 'rgba(124, 58, 237, 0.12)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 6,
                    textTransform: 'uppercase',
                  }}
                >
                  Receiver
                </span>
              </div>

              <p style={{ color: 'var(--text-body)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Detects 5 consecutive '1' bits and strips the subsequent stuffed '0' bit, seamlessly reconstructing the original bitstream with zero data corruption.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  'Receive and inspect the stuffed bit sequence bit by bit.',
                  'Track consecutive 1 bits encountered in the stream.',
                  'Upon counting 5 consecutive 1s, verify the next bit is 0.',
                  'Discard the stuffed 0 bit and reset the counter.',
                  'Reconstruct and return the exact original payload.',
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: 'rgba(124, 58, 237, 0.2)',
                        color: 'var(--accent-purple)',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {i + 1}
                    </div>
                    <span style={{ color: 'var(--text-body)', fontSize: '0.85rem', lineHeight: 1.5 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
