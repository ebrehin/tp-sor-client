import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router";
import Index from "./pages/index.tsx";
import Poll from "./pages/Poll.tsx";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/polls/:selectedPoll" element={<Poll />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
