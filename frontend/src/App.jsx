import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Playground from './pages/Playground';
import Visualizer from './pages/Visualizer';
import About from './pages/About';

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
      <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--text-heading)' }}>404</div>
      <p style={{ color: 'var(--text-body)', marginBottom: '1.5rem' }}>Page not found.</p>
      <Link to="/" className="btn-primary" style={{ display: 'inline-flex' }}>Go Home</Link>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/"           element={<Home />} />
              <Route path="/playground" element={<Playground />} />
              <Route path="/visualizer" element={<Visualizer />} />
              <Route path="/about"      element={<About />} />
              <Route path="*"           element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
