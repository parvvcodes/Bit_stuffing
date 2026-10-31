import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RefreshCw,
  Loader2,
  AlertCircle,
  Binary,
} from 'lucide-react';
import { api } from '../api/client';
import BitDisplay from '../components/BitDisplay';

const EXAMPLES = [
  { label: '6 ones', bits: '111111' },
  { label: 'Mixed',  bits: '1011111010' },
  { label: '10 ones', bits: '1111111111' },
];

function StepDetail({ step, mode }) {
  if (!step) return null;
  const isSpecialAction = step.action === 'stuff' || step.action === 'remove_stuffed';
  const actionColor = isSpecialAction ? 'var(--accent-red)' : 'var(--accent-green)';

  return (
    <div
      className="glass-card animate-fade-in"
      style={{ padding: '1.25rem', marginBottom: '1rem' }}
    >
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Step</div>
          <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-heading)' }}>{step.step_index + 1}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Input bit</div>
          <div
            style={{
              fontWeight: 800,
              fontSize: '1.25rem',
              fontFamily: 'var(--font-family-mono)',
              color: step.input_bit === '' ? 'var(--text-faint)' : 'var(--link-active)',
            }}
          >
            {step.input_bit === '' ? '—' : step.input_bit}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ones counter</div>
          <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--accent-amber)' }}>
            {step.ones_count_before} → {step.ones_count_after}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Action</div>
          <span
            className={`badge ${
              step.action === 'stuff' || step.action === 'remove_stuffed'
                ? 'badge-red'
                : 'badge-green'
            }`}
            style={{ fontSize: '0.72rem' }}
          >
            {step.action === 'stuff'
              ? 'INSERT 0'
              : step.action === 'remove_stuffed'
              ? 'REMOVE 0'
              : 'COPY'}
          </span>
        </div>
      </div>

      <div
        style={{
          background: 'var(--bg-card-subtle)',
          border: '1px solid var(--border-card)',
          borderRadius: 8,
          padding: '0.75rem 1rem',
          fontSize: '0.83rem',
          color: 'var(--text-body)',
          marginBottom: '0.875rem',
          borderLeft: `4px solid ${actionColor}`,
        }}
      >
        {step.explanation}
      </div>

      <div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Output so far
        </div>
        <div style={{ fontFamily: 'var(--font-family-mono)', fontSize: '1rem', letterSpacing: 2, color: 'var(--link-active)', wordBreak: 'break-all', marginBottom: '0.5rem' }}>
          {step.output_so_far || <span style={{ color: 'var(--text-faint)' }}>(empty)</span>}
        </div>
        {step.output_so_far && (
          <BitDisplay bits={step.output_so_far} maxPerRow={32} />
        )}
      </div>
    </div>
  );
}

export default function Visualizer() {
  const [mode, setMode] = useState('stuff');
  const [input, setInput] = useState('111111');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(false);
  const [result, setResult] = useState(null);
  const intervalRef = useRef(null);

  const inputError = input && !/^[01]*$/.test(input)
    ? 'Only 0 and 1 are allowed.'
    : '';

  const handleLoad = useCallback(async () => {
    if (!input || inputError) return;
    setLoading(true);
    setError('');
    setSteps([]);
    setCurrentStep(-1);
    setResult(null);
    setPlaying(false);
    clearInterval(intervalRef.current);
    try {
      const data = mode === 'stuff' ? await api.stuff(input) : await api.destuff(input);
      setSteps(data.steps || []);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [input, mode, inputError]);

  const stop = useCallback(() => {
    setPlaying(false);
    clearInterval(intervalRef.current);
  }, []);

  const play = useCallback(() => {
    if (steps.length === 0) return;
    setPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(intervalRef.current);
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
  }, [steps]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const step = currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null;

  // Compute active bit index in input for display.
  // The backend doesn't expose input_index; we derive it dynamically because
  // synthetic "stuff" steps (with empty input_bit) do not consume a new input bit.
  const activeInputIndex = (() => {
    if (!step) return -1;
    let inputIdx = -1;
    for (let i = 0; i <= currentStep && i < steps.length; i++) {
      if (steps[i].input_bit !== '') inputIdx++;
    }
    return inputIdx;
  })();

  return (
    <div className="page-container">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Step-by-Step Visualizer
          </h1>
          <p style={{ color: 'var(--text-body)', fontSize: '0.9rem' }}>
            Walk through the exact algorithm execution.
          </p>
        </div>

        {/* Config */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {/* Mode */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-faint)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Mode
              </label>
              <select
                value={mode}
                onChange={(e) => { setMode(e.target.value); setSteps([]); setCurrentStep(-1); }}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-input)',
                  borderRadius: 8,
                  color: 'var(--text-heading)',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                <option value="stuff">Bit Stuffing</option>
                <option value="destuff">Bit Destuffing</option>
              </select>
            </div>
            {/* Input */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <label htmlFor="viz-input" style={{ fontSize: '0.75rem', color: 'var(--text-faint)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Binary Input
              </label>
              <input
                id="viz-input"
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value.replace(/\s/g, '')); setSteps([]); setCurrentStep(-1); }}
                style={{
                  background: 'var(--bg-input)',
                  border: inputError ? '1px solid var(--error-text)' : '1px solid var(--border-input)',
                  borderRadius: 8,
                  color: 'var(--text-heading)',
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-family-mono)',
                  width: '100%',
                }}
                spellCheck={false}
                aria-label="Binary input for visualizer"
              />
              {inputError && <div style={{ color: 'var(--error-text)', fontSize: '0.75rem', marginTop: 4 }}>{inputError}</div>}
            </div>
            {/* Examples */}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.bits}
                  onClick={() => { setInput(ex.bits); setSteps([]); setCurrentStep(-1); }}
                  style={{
                    padding: '0.4rem 0.7rem',
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
            <button
              className="btn-primary"
              onClick={handleLoad}
              disabled={!input || !!inputError || loading}
            >
              {loading ? <Loader2 size={15} className="spin" /> : <Binary size={15} />}
              Load
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: 'var(--bit-stuffed-bg)', border: '1px solid var(--bit-stuffed-border)', borderRadius: 8, padding: '0.75rem 1rem', color: 'var(--error-text)', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            {error}
          </div>
        )}

        {steps.length > 0 && (
          <>
            {/* Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  className="btn-secondary"
                  onClick={() => { stop(); setCurrentStep(0); }}
                  aria-label="Reset"
                >
                  <RefreshCw size={15} /> Reset
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => { stop(); setCurrentStep((p) => Math.max(-1, p - 1)); }}
                  disabled={currentStep <= 0}
                  aria-label="Previous step"
                >
                  <SkipBack size={15} /> Prev
                </button>
                {playing ? (
                  <button className="btn-primary" onClick={stop} aria-label="Pause">
                    <Pause size={15} /> Pause
                  </button>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={play}
                    disabled={currentStep >= steps.length - 1}
                    aria-label="Play"
                  >
                    <Play size={15} /> Play
                  </button>
                )}
                <button
                  className="btn-secondary"
                  onClick={() => { stop(); setCurrentStep((p) => Math.min(steps.length - 1, p + 1)); }}
                  disabled={currentStep >= steps.length - 1}
                  aria-label="Next step"
                >
                  Next <SkipForward size={15} />
                </button>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>
                Step {currentStep < 0 ? 0 : currentStep + 1} / {steps.length}
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 6, background: 'var(--bg-card-subtle)', border: '1px solid var(--border-card)', borderRadius: 3, marginBottom: '1.25rem', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                  width: `${steps.length ? ((currentStep + 1) / steps.length) * 100 : 0}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            {/* Input display with active highlight */}
            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Input stream — current bit highlighted
              </div>
              <BitDisplay bits={input} activeIndex={activeInputIndex} maxPerRow={32} />
            </div>

            {/* Step detail */}
            {currentStep >= 0 ? (
              <StepDetail step={step} mode={mode} />
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: 'var(--text-faint)',
                  fontSize: '0.875rem',
                  border: '1px dashed var(--border-input)',
                  borderRadius: 12,
                }}
              >
                Press <strong style={{ color: 'var(--link-active)' }}>Play</strong> or <strong style={{ color: 'var(--link-active)' }}>Next</strong> to begin stepping through the algorithm.
              </div>
            )}

            {/* Final result */}
            {result && currentStep === steps.length - 1 && (
              <div
                style={{
                  background: 'var(--result-success-bg, rgba(16,185,129,0.08))',
                  border: '1px solid var(--result-success-border, rgba(16,185,129,0.25))',
                  borderRadius: 10,
                  padding: '1.25rem',
                  marginTop: '1rem',
                }}
                className="animate-fade-in"
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  ✓ Algorithm Complete
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--text-body)' }}>
                  <span>Final output: <code style={{ color: 'var(--link-active)', fontFamily: 'var(--font-family-mono)' }}>
                    {mode === 'stuff' ? result.stuffed_bits : result.destuffed_bits}
                  </code></span>
                  <span>Zeros {mode === 'stuff' ? 'inserted' : 'removed'}:{' '}
                    <strong style={{ color: 'var(--accent-red)' }}>
                      {mode === 'stuff' ? result.stuffed_zero_count : result.removed_zero_count}
                    </strong>
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
