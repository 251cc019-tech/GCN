import React, { useState, useEffect } from 'react';
import TopNav from './components/layout/TopNav.jsx';
import Footer from './components/layout/Footer.jsx';
import LandingPage from './pages/LandingPage.jsx';
import WorkspaceUploadPage from './pages/WorkspaceUploadPage.jsx';
import ComparisonPage from './pages/ComparisonPage.jsx';
import AuditReportPage from './pages/AuditReportPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

function AppContent() {
  // Navigation state: 'landing' | 'workspace' | 'comparison' | 'report' | 'history' | 'login'
  const [currentView, setCurrentView] = useState('landing');
  const [activeAuditId, setActiveAuditId] = useState(null);

  // Sync with browser URL hash or path for bookmarking/reload
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash.startsWith('/workspace/')) {
        const parts = hash.split('/');
        const id = parts[2];
        if (parts[3] === 'report') {
          setActiveAuditId(id);
          setCurrentView('report');
        } else if (id) {
          setActiveAuditId(id);
          setCurrentView('comparison');
        } else {
          setCurrentView('workspace');
        }
      } else if (hash === '/workspace') {
        setCurrentView('workspace');
      } else if (hash === '/history') {
        setCurrentView('history');
      } else if (hash === '/login' || hash === 'login') {
        setCurrentView('login');
      } else {
        setCurrentView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view, auditId = null) => {
    if (auditId) setActiveAuditId(auditId);
    setCurrentView(view);

    if (view === 'landing') {
      window.location.hash = '/';
    } else if (view === 'workspace') {
      window.location.hash = '/workspace';
    } else if (view === 'comparison') {
      const id = auditId || activeAuditId || 'sample';
      window.location.hash = `/workspace/${id}`;
    } else if (view === 'report') {
      const id = auditId || activeAuditId || 'sample';
      window.location.hash = `/workspace/${id}/report`;
    } else if (view === 'history') {
      window.location.hash = '/history';
    } else if (view === 'login') {
      window.location.hash = '/login';
    }
  };

  const handleAuditCreated = (auditId) => {
    setActiveAuditId(auditId);
    navigateTo('comparison', auditId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)] font-sans antialiased">
      
      {/* Top Header Navigation */}
      <TopNav
        currentView={currentView}
        onNavigate={navigateTo}
        activeAuditId={activeAuditId}
      />

      {/* Main Page Body */}
      <main className="flex-1 flex flex-col">
        {currentView === 'landing' && (
          <LandingPage
            onStartAudit={() => navigateTo('workspace')}
            onViewHistory={() => navigateTo('history')}
            onLogin={() => navigateTo('login')}
          />
        )}

        {currentView === 'login' && (
          <LoginPage
            onSuccess={() => navigateTo('workspace')}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'workspace' && (
          <WorkspaceUploadPage
            onAuditCreated={handleAuditCreated}
          />
        )}

        {currentView === 'comparison' && (
          <ComparisonPage
            auditId={activeAuditId || 'audit-iso-9001-sample'}
            onOpenReport={(id) => navigateTo('report', id)}
            onBackToWorkspace={() => navigateTo('workspace')}
          />
        )}

        {currentView === 'report' && (
          <AuditReportPage
            auditId={activeAuditId || 'audit-iso-9001-sample'}
            onBackToComparison={() => navigateTo('comparison', activeAuditId)}
            onBackToWorkspace={() => navigateTo('workspace')}
          />
        )}

        {currentView === 'history' && (
          <HistoryPage
            onOpenComparison={(id) => navigateTo('comparison', id)}
            onOpenReport={(id) => navigateTo('report', id)}
            onNewAudit={() => navigateTo('workspace')}
          />
        )}
      </main>

      {/* Footer */}
      {currentView !== 'comparison' && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
