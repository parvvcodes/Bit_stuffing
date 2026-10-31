export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-nav)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        marginTop: 'auto',
      }}
    >
      <p style={{ color: 'var(--text-body)', fontSize: '0.85rem', margin: '0 0 0.3rem' }}>
        Built with by <strong style={{ color: 'var(--text-heading)' }}>Parv Shah</strong>
      </p>
      <p style={{ color: 'var(--text-faint)', fontSize: '0.78rem', margin: 0 }}>
        Computer Networks Project &nbsp;·&nbsp; Bit Stuffing &amp; Destuffing &nbsp;·&nbsp; HDLC Protocol
      </p>
    </footer>
  );
}
