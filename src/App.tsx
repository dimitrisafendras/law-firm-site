import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import DesignSystem from './pages/DesignSystem';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AccountPage from './pages/AccountPage';
import './App.css';

// The hash carries anchors (#practice) as well as routes, and an OAuth redirect
// can append its own payload (#access_token=… on the implicit flow). Strip
// everything after the route name so those never break routing.
function routeOf(hash: string): string {
  return hash.replace(/^#/, '').split(/[?&]/)[0];
}

const ROUTES: Record<string, () => ReactElement> = {
  'design-system': DesignSystem,
  login: LoginPage,
  signup: SignupPage,
  account: AccountPage,
};

function App() {
  const [route, setRoute] = useState(() => routeOf(window.location.hash));

  useEffect(() => {
    const onHash = () => setRoute(routeOf(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const Page = ROUTES[route];
  if (Page) return <Page />;

  return <HomePage />;
}

export default App;
