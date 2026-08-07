const TypingAnimation = () => {
  return (
    <div className="d-flex gap-1 align-items-center px-3 py-2 rounded-4" style={{ background: '#2A2B32', width: 'fit-content' }}>
      <span className="rounded-circle" style={{ width: 8, height: 8, background: '#10A37F' }} />
      <span className="rounded-circle" style={{ width: 8, height: 8, background: '#10A37F', animation: 'pulse 1.2s infinite 0.2s' }} />
      <span className="rounded-circle" style={{ width: 8, height: 8, background: '#10A37F', animation: 'pulse 1.2s infinite 0.4s' }} />
    </div>
  )
}

export default TypingAnimation
