import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Footer from "./components/Footer";
import { TimerProvider } from "./context/TimerContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TodoProvider } from "./context/TodoContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <AuthProvider>
        <TimerProvider>
          <TodoProvider>
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
          </TodoProvider>
        </TimerProvider>
      </AuthProvider>
      <Toaster />
    </Router>
  )
}

export default App;
