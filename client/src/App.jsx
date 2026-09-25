import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import LoadingScreen from './components/LoadingScreen';

// Lazy load heavy components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const IntakeSession = lazy(() => import('./pages/IntakeSession'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Authenticated App Routes */}
          <Route
            path="/app"
            element={
              <>
                <SignedIn>
                  <Dashboard />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn redirectUrl="/app" />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/app/intake/:id"
            element={
              <>
                <SignedIn>
                  <IntakeSession />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn redirectUrl="/app" />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
