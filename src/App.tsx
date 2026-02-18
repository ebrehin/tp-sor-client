import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import { RestrictedRoute } from "./pages/Restricted.tsx";
import Index from "./pages/index.tsx";
import Poll from "./pages/Poll.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import User from "./pages/User.tsx";
import CreatePoll from "./pages/CreatePoll.tsx";
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/polls/create" element={<CreatePoll />} />
          <Route path="/polls/:selectedPoll" element={<Poll />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/me"
            element={
              <RestrictedRoute>
                <User />
              </RestrictedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
