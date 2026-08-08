import { motion } from 'framer-motion'
import { PanelLeftClose, PanelLeftOpen, TerminalSquare } from 'lucide-react'
import { useAppContext } from '../../contexts/AppContext'

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useAppContext()

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 280 : 86 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className="sidebar"
    >
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-2">
          <div className="rounded-3 p-2" style={{ background: '#ecfdf5' }}>
            <TerminalSquare size={20} color="#10A37F" />
          </div>
          {sidebarOpen && <span className="fw-semibold">Playground</span>}
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="btn btn-link p-0 text-light"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
      </div>
{/* 
      {sidebarOpen && (
        <div className="mt-3">
          <div className="rounded-3 p-3" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
            <p className="small text-secondary mb-1">Current workspace</p>
            <h6 className="mb-0">SIEM Assistant</h6>
            <p className="small text-muted mt-2">Wazuh query generation and execution</p>
          </div>
        </div>
      )} */}
    </motion.aside>
  )
}

export default Sidebar
