import { Copy, PencilLine, Play } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  code: string
  onCopy: () => void
  onRun: () => void
  onEdit: () => void
}

const CodeBlock = ({ code, onCopy, onRun, onEdit }: CodeBlockProps) => {
  return (
    <div className="rounded-4 p-3 mt-3" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="small" style={{ color: '#4b5563' }}>Generated Wazuh Query</span>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onCopy}><Copy size={14} /></button>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onEdit}><PencilLine size={14} /></button>
          <button type="button" className="btn btn-sm btn-success" onClick={onRun}><Play size={14} /></button>
        </div>
      </div>
      <SyntaxHighlighter language="sql" style={oneDark as never} customStyle={{ margin: 0, borderRadius: 12, fontSize: 13 }}>
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default CodeBlock
