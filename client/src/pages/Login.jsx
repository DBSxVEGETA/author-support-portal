import React, { useState } from "react";
import {
  BookOpen,
  MessageSquare,
  ArrowUpRight,
  BookMarked,
  AlertCircle,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const { login, user } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [show, setShow] = useState(false);
  if (user)
    return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const u = await login(email, password);
      nav(u.role === "admin" ? "/admin" : "/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to sign in. Check your details and try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="login-page">
      <div className="login-left">
        <div className="brand login-brand">
          <div className="brand-icon">
            <BookOpen size={21} />
          </div>
          <div>
            <div className="brand-name">
              bookleaf<span>.</span>
            </div>
            <div className="brand-sub">AUTHOR SUPPORT</div>
          </div>
        </div>
        <div className="login-message">
          <div className="login-kicker">
            <span /> YOUR STORIES MATTER
          </div>
          <h1>
            Every great story
            <br />
            deserves <em>great support.</em>
          </h1>
          <p>
            Your author workspace for book performance, royalties, production
            updates, and personalised support — all in one place.
          </p>
          <div className="login-feature">
            <div className="feature-symbol">
              <BookMarked size={18} />
            </div>
            <div>
              <strong>Your books, at a glance</strong>
              <span>Track performance and royalty earnings</span>
            </div>
          </div>
          <div className="login-feature">
            <div className="feature-symbol">
              <MessageSquare size={18} />
            </div>
            <div>
              <strong>Support that follows through</strong>
              <span>Stay in the loop from question to resolution</span>
            </div>
          </div>
        </div>
        <div className="login-bottom">
          A little more support for the stories you share. <span>✳</span>
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
          <div className="mobile-login-brand">
            <div className="brand-icon">
              <BookOpen size={20} />
            </div>
            <strong>
              bookleaf<span>.</span>
            </strong>
          </div>
          <div className="eyebrow">WELCOME BACK</div>
          <h2>Sign in to your account</h2>
          <p className="login-intro">
            Pick up right where your story left off.
          </p>
          <form onSubmit={submit} className="form-stack">
            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="username"
              />
            </label>
            <label>
              Password
              <div className="password-wrap">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShow(!show)}
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </label>
            {error && (
              <div className="form-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            <button className="btn btn-primary btn-full" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"} <ArrowUpRight size={17} />
            </button>
          </form>
          <div className="login-note">
            <span className="lock-icon">✓</span> Secure access to your author
            account
          </div>
          <div className="login-help">
            Having trouble signing in?{" "}
            <a href="mailto:support@bookleafpublishing.com">Contact support</a>
          </div>
        </div>
        <div className="login-legal">
          By continuing, you agree to BookLeaf’s terms of service and privacy
          policy.
        </div>
      </div>
    </div>
  );
}

export default Login;
