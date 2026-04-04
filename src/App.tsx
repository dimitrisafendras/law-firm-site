import { useState, useEffect } from 'react';
import DesignSystem from './pages/DesignSystem';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  const [page, setPage] = useState(window.location.hash);

  useEffect(() => {
    const onHash = () => setPage(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (page === '#design-system') return <DesignSystem />;

  return <HomePage />;
}

export default App;
