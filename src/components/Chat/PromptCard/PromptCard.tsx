import { motion } from 'framer-motion'

interface PromptCardProps {
  label: string
  onClick: () => void
}

const PromptCard = ({ label, onClick }: PromptCardProps) => {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      type="button"
      onClick={onClick}
      className="btn text-start rounded-4 px-3 py-2"
      style={{ borderColor: '#d1d5db', background: '#ffffff', color: '#111827' }}
    >
      {label}
    </motion.button>
  )
}

export default PromptCard
