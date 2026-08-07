import { Search, Sparkles } from 'lucide-react'

const Header = () => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <Sparkles size={18} color="#10A37F" />
        <span className="fw-semibold" style={{ color: '#111827' }}>SIEM Playground</span>
      </div>
      <div className="topbar-right">
        <Search size={16} />
        <span className="topbar-description">Natural language to Wazuh</span>
      </div>
    </header>
  )
}

export default Header
