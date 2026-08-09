// import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import { AppProvider } from './contexts/AppContext'
// import PlaygroundPage from './pages/Playground/PlaygroundPage'
// import FrontPage from './components/Header/FrontPage' 
// import MainPage from './components/Header/MainPage'
// import Chatbot from './pages/Playground/Chatbot'
// function App() {
//   return (
//     <AppProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* <Route path="/" element={} /> */}
//           <Route path="/" element={<FrontPage/>}/>
//           <Route path="/main" element={<MainPage/>}/>
//           <Route path="/playground" element={<PlaygroundPage />} />
//           <Route path="/chatbot" element={<Chatbot/>} />
//         </Routes>
//       </BrowserRouter>
//     </AppProvider>
//   )
// }

// export default App
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";

import PlaygroundPage from "./pages/Playground/PlaygroundPage";
import FrontPage from "./components/Header/FrontPage";
import MainPage from "./components/Header/MainPage";
import Chatbot from "./pages/Playground/Chatbot";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<FrontPage/>}/>
          <Route path="/main" element={<MainPage/>}/>
          <Route path="/playground" element={<PlaygroundPage />} />

          <Route path="/" element={<FrontPage />} />

          <Route path="/main" element={<MainPage />} />

          <Route
            path="/playground"
            element={<PlaygroundPage />}
          />

          <Route
            path="/chatbot"
            element={<Chatbot />}
          />


        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;