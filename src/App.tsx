import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import PlaygroundPage from './pages/Playground/PlaygroundPage'
import FrontPage from './components/Header/FrontPage' 
function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={} /> */}
          <Route path="/" element={<FrontPage/>}/>
          <Route path="/playground" element={<PlaygroundPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
