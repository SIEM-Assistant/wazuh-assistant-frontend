interface ExecutionResultProps {
  result: unknown
}

const ExecutionResult = ({ result }: ExecutionResultProps) => {
  const formatted = typeof result === 'string' ? result : JSON.stringify(result, null, 2)

  return (
    <div className="rounded-4 p-3 mt-3" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
      <div className="small mb-2" style={{ color: '#4b5563' }}>Execution Result</div>
      <pre className="mb-0 small" style={{ whiteSpace: 'pre-wrap', color: '#111827' }}>{formatted}</pre>
    </div>
  )
}

export default ExecutionResult
