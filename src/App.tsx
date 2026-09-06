import { useState, useEffect, lazy, Suspense } from 'react';
import type { ReactElement } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AccountPage from './pages/AccountPage';
import AdminUsersPage from './pages/AdminUsersPage';
import PartnerDetailPage from './pages/PartnerDetailPage';
import PracticeDetailPage from './pages/PracticeDetailPage';
import { partnerFromRoute } from './components/sections/PartnerEthos/partners';
import { practiceFromRoute } from './components/sections/PracticeGrid/practiceAreas';
import './App.css';

// Dev-only design-system page. Gated on import.meta.env.DEV, which Vite
// replaces with a literal `false` in production so Rollup prunes the dead
// branch — dropping the dynamic-import chunk from the prod build entirely
// (no DesignSystem-*.js in dist). Still lazy-loaded on demand in dev.
const DesignSystem = import.meta.env.DEV
  ? lazy(() => import('./pages/DesignSystem'))
  : null;

// The hash carries anchors (#practice) as well as routes, and an OAuth redirect
// can append its own payload (#access_token=… on the implicit flow, ?code=… on
// PKCE). Strip everything after the route name so those never break routing.
function routeOf(hash: string): string {
  return hash.replace(/^#/, '').split(/[?&]/)[0];
}

const ROUTES: Record<string, () => ReactElement> = {
  login: LoginPage,
  signup: SignupPage,
  account: AccountPage,
  'admin-users': AdminUsersPage,
};

function App() {
  // Guard for SSR/prerender: `window` is undefined during renderToString, so
  // fall back to an empty hash (HomePage) on the server. The client hydrates
  // with the same empty value, then the effect below syncs the real hash.
  const [route, setRoute] = useState(() =>
    typeof window !== 'undefined' ? routeOf(window.location.hash) : '',
  );

  useEffect(() => {
    const onHash = () => setRoute(routeOf(window.location.hash));
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (DesignSystem && route === 'design-system') {
    return (
      <Suspense fallback={null}>
        <DesignSystem />
      </Suspense>
    );
  }

  const Page = ROUTES[route];
  if (Page) return <Page />;

  // The parameterised routes: `#partner/1` and `#practice/real-estate`. A slash
  // rather than a query in both, so `routeOf()`'s `[?&]` split leaves the
  // parameter intact. Each resolver returns null for a parameter with nothing
  // behind it, which falls through to the home page below rather than rendering
  // a page of missing copy.
  //
  // `#practice` itself is the home page's practice-section anchor, and it stays
  // one: `routeOf('#practice')` is `practice`, which does not start with
  // `practice/`, so it falls through here exactly as it always did.
  const partner = partnerFromRoute(route);
  if (partner) return <PartnerDetailPage partner={partner} />;

  const practiceArea = practiceFromRoute(route);
  if (practiceArea) return <PracticeDetailPage area={practiceArea} />;

  return <HomePage />;
}

export default App;
