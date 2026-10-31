/**
 * BitDisplay – renders a sequence of bits as colored cells.
 *
 * Props:
 *   bits         – string of '0'/'1'
 *   stuffedPositions – Set of indices that are stuffed zeros (highlighted red)
 *   removedPositions – Set of indices that were removed (highlighted amber)
 *   activeIndex  – index of currently active bit (highlighted with ring)
 *   maxPerRow    – how many bits per wrapping row (default 32)
 */
export default function BitDisplay({
  bits = '',
  stuffedPositions = new Set(),
  removedPositions = new Set(),
  activeIndex = -1,
  maxPerRow = 32,
}) {
  if (!bits) return null;

  const cells = bits.split('').map((bit, i) => {
    let cellClass = bit === '1' ? 'bit-cell bit-cell-one' : 'bit-cell bit-cell-zero';
    if (stuffedPositions.has(i)) cellClass = 'bit-cell bit-cell-stuffed';
    if (removedPositions.has(i)) cellClass = 'bit-cell bit-cell-removed';
    if (activeIndex === i) cellClass += ' bit-cell-active';

    return (
      <div key={i} className={cellClass} title={`Bit ${i}: ${bit}`}>
        {bit}
      </div>
    );
  });

  // Break into rows
  const rows = [];
  for (let i = 0; i < cells.length; i += maxPerRow) {
    rows.push(cells.slice(i, i + maxPerRow));
  }

  return (
    <div>
      {rows.map((row, ri) => (
        <div
          key={ri}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.25rem',
            marginBottom: '0.375rem',
          }}
        >
          {row}
        </div>
      ))}
    </div>
  );
}

/**
 * BitLegend – explains the color coding.
 */
export function BitLegend({ showStuffed = false, showRemoved = false }) {
  const items = [
    { className: 'bit-cell bit-cell-zero', label: "Original '0' bit" },
    { className: 'bit-cell bit-cell-one', label: "Original '1' bit" },
  ];
  if (showStuffed) {
    items.push({ className: 'bit-cell bit-cell-stuffed', label: 'Stuffed zero (inserted)' });
  }
  if (showRemoved) {
    items.push({ className: 'bit-cell bit-cell-removed', label: 'Stuffed zero (removed)' });
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem' }}>
      {items.map(({ className, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className={className} style={{ width: 28, height: 28, fontSize: '0.8rem' }}>
            {className.includes('one') ? '1' : '0'}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</span>
        </div>
      ))}
    </div>
  );
}
