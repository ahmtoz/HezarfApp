import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";
import { TimerProvider } from "./context/TimerContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

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
              <main className="mx-auto py-10 px-5 md:px-40" style={{ maxWidth: "1440px" }}>
                <Home />
              </main>
            } />
            <Route path="/analytics" element={<Dashboard />} />
          </Routes>
          <Footer />
        </TimerProvider>
      </AuthProvider>
      <Toaster />
    </Router>
  )
}

export default App;
