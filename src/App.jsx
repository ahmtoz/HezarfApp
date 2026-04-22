import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { TimerProvider } from "./context/TimerContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <TimerProvider>
          <header>
            <Navbar />
          </header>
          <Routes>
            <Route path="/" element={
              <main className="mx-auto pt-10 px-5 md:px-40" style={{ maxWidth: "1440px" }}>
                <Home />
              </main>
            } />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </TimerProvider>
      </AuthProvider>
    </Router>
  )
}

export default App;
