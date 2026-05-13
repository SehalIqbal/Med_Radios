import React, { useState } from 'react';
import '../styles/auth.css';

function LoginPage({ onLoginSuccess }) {
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [error,     setError]     = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400));

    if (email === 'aman' && password === 'aman123') {
      onLoginSuccess();
    } else {
      setError('Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="auth-container animate-fadeInUp">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="brand-heading">RADIOS</h1>
            <p className="brand-tagline">Medical AI Diagnostic Platform</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email / Username</label>
              <input
                id="email"
                type="text"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="username"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="auth-error animate-scaleIn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7S11.866 1 8 1zm0 9a.5.5 0 010-1 .5.5 0 010 1zm.5-3.5a.5.5 0 01-1 0v-2a.5.5 0 011 0v2z" fill="currentColor"/>
                </svg>
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
              {isLoading ? <><span className="spinner"></span>Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="auth-hint">
            <p className="hint-text">
              Demo credentials: <span className="hint-credential">aman</span> / <span className="hint-credential">aman123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
