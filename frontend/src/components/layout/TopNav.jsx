import { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  History, 
  FolderOpen, 
  Sparkles, 
  LogIn, 
  LogOut, 
  ChevronDown, 
  Check, 
  Shield
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';

export function TopNav({ currentView, onNavigate, activeAuditId }) {
  const { currentUser, isAuthenticated, logout, personas, selectDemoPersona } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelectPersona = (personaId) => {
    selectDemoPersona(personaId);
    setProfileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    onNavigate('landing');
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--surface)] border-b border-[var(--rule)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-md bg-[var(--ink)] flex items-center justify-center text-[var(--paper)] shadow-xs transition-transform group-hover:scale-105">
            <ShieldCheck className="w-5 h-5 text-[var(--paper)]" />
          </div>
          <div>
            <span className="font-display font-bold text-xl tracking-tight text-[var(--ink)]">
              Clause<span className="text-[var(--verified)]">Nova</span>
            </span>
            <span className="block text-[10px] uppercase font-mono tracking-widest text-[var(--slate)]">
              Regulatory Audit Engine
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onNavigate('workspace')}
            className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2 cursor-pointer ${
              currentView === 'workspace'
                ? 'bg-[var(--ink)] text-[var(--paper)] font-semibold'
                : 'text-[var(--slate)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>

          {activeAuditId && (
            <>
              <button
                onClick={() => onNavigate('comparison', activeAuditId)}
                className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2 cursor-pointer ${
                  currentView === 'comparison'
                    ? 'bg-[var(--ink)] text-[var(--paper)] font-semibold'
                    : 'text-[var(--slate)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Comparison</span>
              </button>

              <button
                onClick={() => onNavigate('report', activeAuditId)}
                className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2 cursor-pointer ${
                  currentView === 'report'
                    ? 'bg-[var(--ink)] text-[var(--paper)] font-semibold'
                    : 'text-[var(--slate)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Audit Report</span>
              </button>
            </>
          )}

          <button
            onClick={() => onNavigate('history')}
            className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2 cursor-pointer ${
              currentView === 'history'
                ? 'bg-[var(--ink)] text-[var(--paper)] font-semibold'
                : 'text-[var(--slate)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Past Audits</span>
          </button>
        </nav>

        {/* User Auth Section */}
        <div className="flex items-center gap-3 pl-4 border-l border-[var(--rule)]" ref={menuRef}>
          {isAuthenticated && currentUser ? (
            <div className="relative">
              {/* Profile Pill Button */}
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-sm bg-[var(--paper)] hover:bg-[#ECE8DC] border border-[var(--rule)] transition-all text-left group cursor-pointer"
                aria-expanded={profileMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-6 h-6 rounded-xs bg-[var(--ink)] text-[var(--paper)] text-[10px] font-mono font-bold flex items-center justify-center">
                  {currentUser.avatarInitials || 'AU'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-mono font-semibold text-[var(--ink)] leading-none truncate max-w-[130px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-[var(--verified)] font-mono leading-tight mt-0.5">
                    {currentUser.badge || 'CERTIFIED'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--slate)] group-hover:text-[var(--ink)] transition-transform" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[var(--surface)] border border-[var(--rule)] rounded-sm shadow-md py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* User Details */}
                  <div className="px-4 py-2.5 border-b border-[var(--rule)]">
                    <p className="font-mono text-xs font-bold text-[var(--ink)]">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-[var(--slate)] font-mono truncate">
                      {currentUser.email}
                    </p>
                    <p className="text-[10px] text-[var(--slate)] font-sans mt-0.5">
                      {currentUser.org}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#EBF4EF] text-[var(--verified)] rounded-xs text-[10px] font-mono">
                      <Shield className="w-3 h-3" />
                      <span>{currentUser.clearanceLevel || 'Level 3 Clearance'}</span>
                    </div>
                  </div>

                  {/* Switch Demo Persona */}
                  <div className="px-4 py-2 border-b border-[var(--rule)]">
                    <p className="text-[10px] uppercase font-mono tracking-widest text-[var(--slate)] font-semibold mb-1.5">
                      Switch Auditor Profile:
                    </p>
                    <div className="space-y-1">
                      {personas.map((persona) => {
                        const isCurrent = currentUser.email === persona.email;
                        return (
                          <button
                            key={persona.id}
                            type="button"
                            onClick={() => handleSelectPersona(persona.id)}
                            className={`w-full text-left px-2 py-1.5 rounded-xs text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-[var(--paper)] text-[var(--ink)] font-semibold'
                                : 'text-[var(--slate)] hover:bg-[var(--paper)] hover:text-[var(--ink)]'
                            }`}
                          >
                            <span className="truncate">{persona.name}</span>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-[var(--verified)]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sign Out Action */}
                  <div className="px-2 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full px-2.5 py-1.5 text-left text-xs font-mono text-[var(--flagged)] hover:bg-[#FBF0EF] rounded-xs flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === 'login'
                  ? 'bg-[var(--ink)] text-[var(--paper)] shadow-xs'
                  : 'bg-[var(--paper)] hover:bg-[var(--ink)] hover:text-[var(--paper)] text-[var(--ink)] border border-[var(--rule)]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}

export default TopNav;
