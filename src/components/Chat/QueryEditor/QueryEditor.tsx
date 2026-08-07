import { Save } from 'lucide-react'

interface QueryEditorProps {
  value: string
  onChange: (value: string) => void
  onSave: () => void
}

const QueryEditor = ({ value, onChange, onSave }: QueryEditorProps) => {
  return (
    <div className="rounded-4 p-3 mt-3" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="small" style={{ color: '#4b5563' }}>Edit Query</span>
        <button type="button" className="btn btn-sm btn-success" onClick={onSave}><Save size={14} className="me-1" />Save</button>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={10}
        className="form-control"
        style={{ background: '#ffffff', color: '#111827', borderColor: '#d1d5db' }}
      />
    </div>
  )
}

export default QueryEditor
