import { useState, useEffect, lazy, Suspense } from 'react';
import HomePage from './pages/HomePage';
import './App.css';

// Dev-only design-system page. Gated on import.meta.env.DEV, which Vite
// replaces with a literal `false` in production so Rollup prunes the dead
// branch — dropping the dynamic-import chunk from the prod build entirely
// (no DesignSystem-*.js in dist). Still lazy-loaded on demand in dev.
const DesignSystem = import.meta.env.DEV
  ? lazy(() => import('./pages/DesignSystem'))
  : null;

function App() {
  // Guard for SSR/prerender: `window` is undefined during renderToString, so
  // fall back to an empty hash (HomePage) on the server. The client hydrates
  // with the same empty value, then the effect below syncs the real hash.
  const [page, setPage] = useState(
    typeof window !== 'undefined' ? window.location.hash : '',
  );

  useEffect(() => {
    const onHash = () => setPage(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (DesignSystem && page === '#design-system') {
    return (
      <Suspense fallback={null}>
        <DesignSystem />
      </Suspense>
    );
  }

  return <HomePage />;
}

export default App;
