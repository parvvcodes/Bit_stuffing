import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  FlaskConical,
  ArrowLeftRight,
} from 'lucide-react';
import { api } from '../api/client';
import BitDisplay, { BitLegend } from '../components/BitDisplay';

const EXAMPLES = [
  { label: '6 ones',    bits: '111111' },
  { label: '10 ones',   bits: '1111111111' },
  { label: 'Mixed',     bits: '1011111010' },
  { label: 'Two runs',  bits: '11111011111' },
  { label: 'No stuff',  bits: '101010' },
];

function StatCard({ label, value, color }) {
  return (
    <div className="stat-card">
      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: color || 'var(--link-active)' }}>{value}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    </div>
  );
}

export default function Playground() {
  const [mode, setMode] = useState('stuff'); // 'stuff' | 'destuff'
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const inputError = input && !/^[01]*$/.test(input) ? 'Only 0 and 1 characters are allowed.' : '';

  const handleProcess = useCallback(async () => {
    if (!input || inputError) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = mode === 'stuff' ? await api.stuff(input) : await api.destuff(input);
      setResult({ ...data, mode });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [input, mode, inputError]);

  const handleClear = () => {
    setInput('');
    setResult(null);
    setError('');
  };

  const handleCopy = async () => {
    const text = mode === 'stuff' ? result?.stuffed_bits : result?.destuffed_bits;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Compute stuffed zero positions for display
  const getStuffedPositions = () => {
    if (!result || result.mode !== 'stuff') return new Set();
    const positions = new Set();
    let ones = 0;
    let outIdx = 0;
    for (const b of result.original_bits) {
      if (b === '1') {
        ones++;
        outIdx++;
        if (ones === 5) {
          positions.add(outIdx);
          outIdx++;
          ones = 0;
        }
      } else {
        ones = 0;
        outIdx++;
      }
    }
    return positions;
  };

  const outputBits = result
    ? result.mode === 'stuff'
      ? result.stuffed_bits
      : result.destuffed_bits
    : '';

  const stuffedPos = getStuffedPositions();

  return (
    <div className="page-container">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Interactive Playground
          </h1>
        </div>

        {/* Mode toggle */}
        <div
          style={{
            display: 'inline-flex',
            background: 'var(--bg-surface)',
            borderRadius: 10,
            padding: 4,
            marginBottom: '1.5rem',
            border: '1px solid var(--border-card)',
          }}
        >
          {[
            { value: 'stuff', label: 'Bit Stuffing' },
            { value: 'destuff', label: 'Bit Destuffing' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setMode(opt.value); setResult(null); setError(''); }}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: 'all 0.15s',
                background: mode === opt.value ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'transparent',
                color: mode === opt.value ? 'white' : 'var(--text-faint)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="playground-grid">
          {/* Input */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-heading)', margin: 0 }}>
                {mode === 'stuff' ? 'Original Bits' : 'Stuffed Bits'}
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                {input.length} bits
              </span>
            </div>

            <textarea
              id="bit-input"
              className={`input-field${inputError ? ' error' : ''}`}
              rows={4}
              value={input}
              onChange={(e) => {
                setInput(e.target.value.replace(/\s/g, ''));
                setResult(null);
                setError('');
              }}
              placeholder="Enter binary string e.g. 111111"
              spellCheck={false}
              aria-label="Binary input"
            />
            {inputError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', color: 'var(--error-text)', fontSize: '0.8rem' }}>
                <AlertCircle size={14} /> {inputError}
              </div>
            )}

            {/* Example chips */}
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Quick examples
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.bits}
                    onClick={() => { setInput(ex.bits); setResult(null); setError(''); }}
                    style={{
                      padding: '0.25rem 0.6rem',
                      fontSize: '0.72rem',
                      background: 'var(--chip-bg)',
                      border: '1px solid var(--chip-border)',
                      borderRadius: 6,
                      color: 'var(--chip-text)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-family-mono)',
                    }}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input bit display */}
            {input && !inputError && (
              <div style={{ marginTop: '1rem' }}>
                <BitDisplay bits={input} maxPerRow={24} />
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button
                id="process-btn"
                className="btn-primary"
                onClick={handleProcess}
                disabled={!input || !!inputError || loading}
                style={{ flex: 1 }}
              >
                {loading ? (
                  <><Loader2 size={15} className="spin" /> Processing…</>
                ) : (
                  <><Play size={15} /> {mode === 'stuff' ? 'Stuff Bits' : 'Destuff Bits'}</>
                )}
              </button>
              <button
                className="btn-secondary"
                onClick={handleClear}
                disabled={!input}
                aria-label="Clear input"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-heading)', margin: 0 }}>
                {mode === 'stuff' ? 'Stuffed Bits' : 'Destuffed Bits'}
              </h2>
              {outputBits && (
                <button
                  onClick={handleCopy}
                  className="btn-secondary"
                  style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
                  aria-label="Copy output"
                >
                  {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                </button>
              )}
            </div>

            {error && (
              <div
                style={{
                  background: 'var(--bit-stuffed-bg)',
                  border: '1px solid var(--bit-stuffed-border)',
                  borderRadius: 8,
                  padding: '0.75rem 1rem',
                  color: 'var(--error-text)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'flex-start',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{error}</span>
              </div>
            )}

            {!result && !error && !loading && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 140,
                  color: 'var(--text-faint)',
                  fontSize: '0.875rem',
                  gap: '0.5rem',
                }}
              >
                <FlaskConical size={32} />
                <span>Output will appear here</span>
              </div>
            )}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 140, gap: '0.75rem', color: 'var(--link-active)' }}>
                <Loader2 size={24} className="spin" />
                <span>Running Python algorithm…</span>
              </div>
            )}

            {result && (
              <div className="animate-fade-in">
                {/* Bit display */}
                <div
                  style={{
                    background: 'var(--bg-card-subtle)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 8,
                    padding: '1rem',
                    marginBottom: '1rem',
                    overflowX: 'auto',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-family-mono)', fontSize: '1rem', letterSpacing: 2, color: 'var(--link-active)', wordBreak: 'break-all', marginBottom: '0.75rem' }}>
                    {outputBits}
                  </div>
                  <BitDisplay
                    bits={outputBits}
                    stuffedPositions={result.mode === 'stuff' ? stuffedPos : new Set()}
                    maxPerRow={24}
                  />
                  <BitLegend showStuffed={result.mode === 'stuff' && result.stuffed_zero_count > 0} />
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <StatCard label="Input length" value={result.mode === 'stuff' ? result.original_length : result.stuffed_length} />
                  <StatCard label="Output length" value={result.mode === 'stuff' ? result.stuffed_length : result.destuffed_length} />
                  <StatCard
                    label={result.mode === 'stuff' ? 'Zeros stuffed' : 'Zeros removed'}
                    value={result.mode === 'stuff' ? result.stuffed_zero_count : result.removed_zero_count}
                    color="var(--accent-red)"
                  />
                  {result.mode === 'stuff' && (
                    <StatCard
                      label="Overhead"
                      value={`${result.overhead_percentage}%`}
                      color="var(--accent-amber)"
                    />
                  )}
                  {result.mode === 'destuff' && (
                    <StatCard
                      label="Size reduction"
                      value={`${result.stuffed_length - result.destuffed_length} bits`}
                      color="var(--accent-green)"
                    />
                  )}
                </div>

                {/* Steps count */}
                <div style={{ fontSize: '0.78rem', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ArrowLeftRight size={13} />
                  {result.steps?.length} execution steps generated by Python backend.
                  <Link to="/visualizer" style={{ color: 'var(--link-active)', textDecoration: 'none', marginLeft: 4 }}>
                    View step-by-step →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 700px) {
          .playground-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
