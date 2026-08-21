import { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Fingerprint, 
  Sparkles,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export function LoginPage({ onSuccess, onNavigate }) {
  const { login, register, selectDemoPersona, personas, isLoading } = useAuth();

  // Mode: 'signin' | 'register' | 'sso'
  const [authMode, setAuthMode] = useState('signin');
  
  // Form fields
  const [email, setEmail] = useState('elena.rostova@clausenova.gov');
  const [password, setPassword] = useState('Auditor2026!Secure');
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [auditorId, setAuditorId] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Feedback states
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Selected persona badge for quick autofill
  const [selectedPersonaId, setSelectedPersonaId] = useState('auditor-01');

  // Password strength calculation for registration mode
  const calculatePasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const passwordStrength = calculatePasswordStrength(password);

  const getStrengthLabel = (score) => {
    if (score <= 25) return { label: 'Weak', color: 'var(--flagged)' };
    if (score <= 50) return { label: 'Fair', color: 'var(--pending)' };
    if (score <= 75) return { label: 'Good', color: '#3B82F6' };
    return { label: 'Strong (FDA Part 11 Compliant)', color: 'var(--verified)' };
  };

  const handlePersonaSelect = (persona) => {
    setSelectedPersonaId(persona.id);
    setEmail(persona.email);
    setPassword('Auditor2026!Secure');
    setError(null);
    setSuccessMessage(`Auto-filled credentials for ${persona.name} (${persona.role})`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleQuickLoginAsPersona = async (persona) => {
    setSelectedPersonaId(persona.id);
    const result = selectDemoPersona(persona.id);
    setSuccessMessage(`Signed in as ${result.name}`);
    setTimeout(() => {
      if (onSuccess) onSuccess();
      else if (onNavigate) onNavigate('workspace');
    }, 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setError('Please provide both official email and security credentials.');
      return;
    }

    try {
      if (authMode === 'signin') {
        await login(email, password, { rememberMe });
        setSuccessMessage('Authentication verified. Loading regulatory workspace...');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else if (onNavigate) onNavigate('workspace');
        }, 500);
      } else if (authMode === 'register') {
        if (!name) {
          setError('Auditor full legal name is required.');
          return;
        }
        if (password.length < 8) {
          setError('Password must meet minimum 8 characters requirement.');
          return;
        }
        await register({
          name,
          email,
          password,
          org: org || 'Quality & Regulatory Services',
          auditorId: auditorId || `AUD-${Math.floor(100000 + Math.random() * 900000)}`,
        });
        setSuccessMessage('Auditor credentials generated. Welcome to ClauseNova!');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else if (onNavigate) onNavigate('workspace');
        }, 500);
      }
    } catch (err) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleSsoLogin = (provider) => {
    selectDemoPersona(personas[0]?.id || 'auditor-01');
    setSuccessMessage(`Authenticated via ${provider} SSO gateway. Redirecting...`);
    setTimeout(() => {
      if (onSuccess) onSuccess();
      else if (onNavigate) onNavigate('workspace');
    }, 600);
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSent(true);
    setTimeout(() => {
      setForgotPasswordOpen(false);
      setResetSent(false);
      setSuccessMessage(`Password recovery link dispatched to ${resetEmail}`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 1500);
  };

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col justify-center">
      
      {/* Top Breadcrumb & Return Link */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('landing')}
          className="text-xs font-mono uppercase tracking-wider text-[var(--slate)] hover:text-[var(--ink)] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>← Back to Overview</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--slate)]">
          <span className="w-2 h-2 rounded-full bg-[var(--verified)]"></span>
          <span>FDA 21 CFR Part 11 & ISO 27001 Secure Gateway</span>
        </div>
      </div>

      {/* Main Two-Column Card Container */}
      <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-sm shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* LEFT COLUMN: Regulatory Auditor Verification Panel */}
        <div className="lg:col-span-5 bg-[#F9F7F2] p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-[var(--rule)] flex flex-col justify-between relative">
          
          {/* Subtle Watermark Stamp */}
          <div className="absolute top-6 right-6 opacity-10 pointer-events-none select-none">
            <ShieldCheck className="w-36 h-36 text-[var(--ink)]" />
          </div>

          <div>
            {/* Regulatory Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--surface)] border border-[var(--rule)] rounded-full text-xs font-mono text-[var(--ink)] mb-6 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--verified)]" />
              <span>Certified Auditor Portal</span>
            </div>

            {/* Official Heading */}
            <h1 className="font-display text-3xl font-bold text-[var(--ink)] leading-tight">
              Clause<span className="text-[var(--verified)]">Nova</span> Auditor Authentication
            </h1>

            <p className="mt-3 text-sm text-[var(--slate)] font-sans leading-relaxed">
              Secure gateway for notified bodies, QA leads, and regulatory compliance officers conducting automated clause redline evaluations.
            </p>

            {/* Compliance Guarantee Badges */}
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-3 p-2.5 bg-[var(--surface)] border border-[var(--rule)] rounded-sm text-xs font-mono text-[var(--ink)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--verified)] shrink-0" />
                <span>FDA 21 CFR Part 11 Electronic Records & Signatures</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 bg-[var(--surface)] border border-[var(--rule)] rounded-sm text-xs font-mono text-[var(--ink)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--verified)] shrink-0" />
                <span>ISO 9001 / MDR Annex IX Tamper-Evident Audit Trails</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 bg-[var(--surface)] border border-[var(--rule)] rounded-sm text-xs font-mono text-[var(--ink)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--verified)] shrink-0" />
                <span>256-Bit TLS In-Transit & At-Rest Cryptographic Shield</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Auditor Persona Switcher */}
          <div className="mt-8 pt-6 border-t border-[var(--rule)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase font-mono tracking-widest text-[var(--slate)] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--pending)]" />
                <span>Instant Demo Auditor Personas</span>
              </span>
              <span className="text-[10px] font-mono text-[var(--slate)]">1-Click Fill</span>
            </div>

            <div className="space-y-2">
              {personas.map((persona) => {
                const isSelected = selectedPersonaId === persona.id;
                return (
                  <div
                    key={persona.id}
                    className={`p-2.5 rounded-sm border transition-all flex items-center justify-between text-left ${
                      isSelected
                        ? 'bg-[var(--surface)] border-[var(--ink)] ring-1 ring-[var(--ink)] shadow-2xs'
                        : 'bg-[var(--surface)] border-[var(--rule)] hover:border-[var(--slate)]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handlePersonaSelect(persona)}
                      className="flex-1 text-left mr-2 focus:outline-hidden cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-xs bg-[var(--ink)] text-[var(--paper)] text-[10px] font-mono font-bold flex items-center justify-center">
                          {persona.avatarInitials}
                        </span>
                        <div>
                          <p className="font-mono text-xs font-semibold text-[var(--ink)] leading-tight">
                            {persona.name}
                          </p>
                          <p className="text-[11px] text-[var(--slate)] font-sans">
                            {persona.role}
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLoginAsPersona(persona)}
                      className="px-2.5 py-1 bg-[var(--paper)] hover:bg-[var(--ink)] hover:text-[var(--paper)] text-[var(--ink)] border border-[var(--rule)] rounded-xs text-[10px] font-mono uppercase tracking-wider font-semibold transition-colors shrink-0 cursor-pointer"
                      title={`Instant Login as ${persona.name}`}
                    >
                      Log In
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Authentication Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-[var(--surface)]">
          
          <div>
            {/* Mode Switcher Tabs */}
            <div className="flex items-center border-b border-[var(--rule)] mb-8">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setError(null); }}
                className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
                  authMode === 'signin'
                    ? 'border-[var(--ink)] text-[var(--ink)]'
                    : 'border-transparent text-[var(--slate)] hover:text-[var(--ink)]'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('register'); setError(null); }}
                className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'border-[var(--ink)] text-[var(--ink)]'
                    : 'border-transparent text-[var(--slate)] hover:text-[var(--ink)]'
                }`}
              >
                New Auditor Registration
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('sso'); setError(null); }}
                className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
                  authMode === 'sso'
                    ? 'border-[var(--ink)] text-[var(--ink)]'
                    : 'border-transparent text-[var(--slate)] hover:text-[var(--ink)]'
                }`}
              >
                Enterprise SSO
              </button>
            </div>

            {/* Error Notification */}
            {error && (
              <div 
                role="alert"
                className="mb-6 p-3.5 bg-[#FBF0EF] border border-[#F5D5D1] text-[var(--flagged)] rounded-sm text-xs font-mono flex items-center gap-2.5 animate-in fade-in duration-200"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div 
                role="status"
                className="mb-6 p-3.5 bg-[#EBF4EF] border border-[#D0E5D9] text-[var(--verified)] rounded-sm text-xs font-mono flex items-center gap-2.5 animate-in fade-in duration-200"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* SSO MODE VIEW */}
            {authMode === 'sso' ? (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--ink)]">
                    Single Sign-On (SAML 2.0 / OIDC)
                  </h2>
                  <p className="text-xs text-[var(--slate)] font-sans mt-1">
                    Connect using your certified regulatory institution or enterprise identity provider.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSsoLogin('Microsoft Entra ID')}
                    className="w-full p-3.5 bg-[var(--paper)] hover:bg-[#ECE8DC] border border-[var(--rule)] rounded-sm text-xs font-mono font-semibold text-[var(--ink)] flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-[#00A4EF] rounded-xs flex items-center justify-center text-white text-[10px] font-bold">
                        M
                      </div>
                      <span>Microsoft Entra ID / Azure AD (Enterprise)</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--slate)] group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSsoLogin('Okta Workforce')}
                    className="w-full p-3.5 bg-[var(--paper)] hover:bg-[#ECE8DC] border border-[var(--rule)] rounded-sm text-xs font-mono font-semibold text-[var(--ink)] flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-[#007DC1] rounded-xs flex items-center justify-center text-white text-[10px] font-bold">
                        O
                      </div>
                      <span>Okta Identity Cloud</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--slate)] group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSsoLogin('Google Workspace')}
                    className="w-full p-3.5 bg-[var(--paper)] hover:bg-[#ECE8DC] border border-[var(--rule)] rounded-sm text-xs font-mono font-semibold text-[var(--ink)] flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-[#EA4335] rounded-xs flex items-center justify-center text-white text-[10px] font-bold">
                        G
                      </div>
                      <span>Google Workspace (Regulatory Domains)</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--slate)] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                <div className="pt-4 border-t border-[var(--rule)] text-xs text-[var(--slate)] leading-relaxed">
                  <p>
                    Need dedicated SAML metadata or custom IdP integration for your notified body? Contact your IT compliance administrator or email <span className="font-mono text-[var(--ink)]">sec-ops@clausenova.gov</span>.
                  </p>
                </div>
              </div>
            ) : (
              /* SIGN IN & REGISTRATION FORM */
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                
                {/* Full Name (Registration only) */}
                {authMode === 'register' && (
                  <div>
                    <label 
                      htmlFor="auditor-name" 
                      className="block text-xs font-mono uppercase tracking-wider text-[var(--slate)] mb-1.5 font-semibold"
                    >
                      Auditor Full Name *
                    </label>
                    <div className="relative">
                      <input
                        id="auditor-name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Dr. Jane Doe, RAC"
                        className="w-full px-3.5 py-2.5 bg-[var(--paper)] border border-[var(--rule)] rounded-sm text-xs font-mono text-[var(--ink)] placeholder:text-[var(--slate)]/60 focus:outline-hidden focus:border-[var(--ink)] focus:bg-[var(--surface)] transition-colors"
                      />
                      <UserCheck className="w-4 h-4 text-[var(--slate)] absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Organization / Regulatory Body (Registration only) */}
                {authMode === 'register' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label 
                        htmlFor="auditor-org" 
                        className="block text-xs font-mono uppercase tracking-wider text-[var(--slate)] mb-1.5 font-semibold"
                      >
                        Organization / Body
                      </label>
                      <input
                        id="auditor-org"
                        name="organization"
                        type="text"
                        autoComplete="organization"
                        value={org}
                        onChange={(e) => setOrg(e.target.value)}
                        placeholder="e.g., Notified Body 0123"
                        className="w-full px-3.5 py-2.5 bg-[var(--paper)] border border-[var(--rule)] rounded-sm text-xs font-mono text-[var(--ink)] placeholder:text-[var(--slate)]/60 focus:outline-hidden focus:border-[var(--ink)] focus:bg-[var(--surface)] transition-colors"
                      />
                    </div>

                    <div>
                      <label 
                        htmlFor="auditor-license" 
                        className="block text-xs font-mono uppercase tracking-wider text-[var(--slate)] mb-1.5 font-semibold"
                      >
                        Auditor License ID
                      </label>
                      <input
                        id="auditor-license"
                        name="auditorId"
                        type="text"
                        value={auditorId}
                        onChange={(e) => setAuditorId(e.target.value)}
                        placeholder="e.g., AUD-98421"
                        className="w-full px-3.5 py-2.5 bg-[var(--paper)] border border-[var(--rule)] rounded-sm text-xs font-mono text-[var(--ink)] placeholder:text-[var(--slate)]/60 focus:outline-hidden focus:border-[var(--ink)] focus:bg-[var(--surface)] transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label 
                    htmlFor="auditor-email" 
                    className="block text-xs font-mono uppercase tracking-wider text-[var(--slate)] mb-1.5 font-semibold"
                  >
                    Official Email Address *
                  </label>
                  <div className="relative">
                    <input
                      id="auditor-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      required
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="auditor@clausenova.gov"
                      className="w-full px-3.5 py-2.5 pl-10 bg-[var(--paper)] border border-[var(--rule)] rounded-sm text-xs font-mono text-[var(--ink)] placeholder:text-[var(--slate)]/60 focus:outline-hidden focus:border-[var(--ink)] focus:bg-[var(--surface)] transition-colors"
                    />
                    <Mail className="w-4 h-4 text-[var(--slate)] absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label 
                      htmlFor="auditor-password" 
                      className="block text-xs font-mono uppercase tracking-wider text-[var(--slate)] font-semibold"
                    >
                      {authMode === 'register' ? 'Set Master Passphrase *' : 'Security Passphrase *'}
                    </label>

                    {authMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => { setForgotPasswordOpen(true); setResetEmail(email); }}
                        className="text-[11px] font-mono text-[var(--slate)] hover:text-[var(--ink)] underline underline-offset-2 transition-colors cursor-pointer"
                      >
                        Forgot passphrase?
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      id="auditor-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••••••"
                      className="w-full px-3.5 py-2.5 pl-10 pr-10 bg-[var(--paper)] border border-[var(--rule)] rounded-sm text-xs font-mono text-[var(--ink)] placeholder:text-[var(--slate)]/60 focus:outline-hidden focus:border-[var(--ink)] focus:bg-[var(--surface)] transition-colors"
                    />
                    <Lock className="w-4 h-4 text-[var(--slate)] absolute left-3 top-3 pointer-events-none" />
                    
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide security passphrase' : 'Show security passphrase'}
                      aria-pressed={showPassword}
                      className="absolute right-3 top-2.5 p-0.5 text-[var(--slate)] hover:text-[var(--ink)] focus:outline-hidden cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator for Registration */}
                  {authMode === 'register' && password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="text-[var(--slate)]">Passphrase Strength:</span>
                        <span style={{ color: getStrengthLabel(passwordStrength).color }} className="font-semibold">
                          {getStrengthLabel(passwordStrength).label}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--paper)] border border-[var(--rule)] rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-300"
                          style={{ 
                            width: `${passwordStrength}%`,
                            backgroundColor: getStrengthLabel(passwordStrength).color 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Remember Station & Policy Agreement */}
                <div className="pt-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-sans text-[var(--slate)] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[var(--ink)] rounded-xs border-[var(--rule)]"
                    />
                    <span>Remember this audit workstation (30 days)</span>
                  </label>
                </div>

                {/* Primary Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-[var(--ink)] hover:opacity-90 active:scale-[0.99] text-[var(--paper)] rounded-sm text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-3 h-3 border-2 border-[var(--paper)] border-t-transparent rounded-full animate-spin"></span>
                        <span>Verifying Security Certificate...</span>
                      </span>
                    ) : (
                      <>
                        <span>{authMode === 'register' ? 'Create Auditor Credentials' : 'Authenticate & Enter Workspace'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* Footer Security Stamp */}
          <div className="pt-8 mt-8 border-t border-[var(--rule)] flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-[var(--slate)]">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-[var(--verified)]" />
              <span>Biometric & MFA Ready</span>
            </div>

            <div className="flex items-center gap-3">
              <span>ClauseNova Trust v2.4</span>
              <span>•</span>
              <span className="text-[var(--verified)]">Status: Normal</span>
            </div>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal Dialog */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-sm p-6 max-w-md w-full shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[var(--ink)]" />
                <h3 className="font-display text-lg font-bold text-[var(--ink)]">
                  Auditor Passphrase Recovery
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                className="text-xs font-mono text-[var(--slate)] hover:text-[var(--ink)] cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {resetSent ? (
              <div className="p-4 bg-[#EBF4EF] border border-[#D0E5D9] rounded-sm text-xs font-mono text-[var(--verified)]">
                <p className="font-bold">Recovery Dispatch Completed</p>
                <p className="mt-1 text-[var(--slate)]">
                  An encrypted verification link has been sent to <span className="font-bold text-[var(--ink)]">{resetEmail}</span>. Please verify via your hardware key or official inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <p className="text-xs text-[var(--slate)] font-sans">
                  Enter your certified auditor email address. We will generate a cryptographic one-time recovery token.
                </p>

                <div>
                  <label htmlFor="reset-email" className="block text-xs font-mono uppercase tracking-wider text-[var(--slate)] mb-1 font-semibold">
                    Auditor Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="auditor@clausenova.gov"
                    className="w-full px-3 py-2 bg-[var(--paper)] border border-[var(--rule)] rounded-sm text-xs font-mono text-[var(--ink)] focus:outline-hidden focus:border-[var(--ink)]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="px-3 py-2 bg-[var(--paper)] border border-[var(--rule)] text-xs font-mono uppercase rounded-sm text-[var(--slate)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--ink)] text-[var(--paper)] text-xs font-mono uppercase rounded-sm font-semibold hover:opacity-90 cursor-pointer"
                  >
                    Send Recovery Token
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default LoginPage;
