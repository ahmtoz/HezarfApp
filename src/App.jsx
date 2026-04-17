import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
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
      <footer>

      </footer>
    </Router>
  )
}

export default App;
