import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import PlaygroundPage from './pages/Playground/PlaygroundPage'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/playground" replace />} />
          <Route path="/playground" element={<PlaygroundPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
