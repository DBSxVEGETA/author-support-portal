import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  Search,
  Bell,
  ChevronDown,
  Plus,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  CircleHelp,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Send,
  Sparkles,
  Filter,
  Paperclip,
  SlidersHorizontal,
  Inbox,
  UserRound,
  BookMarked,
  Wallet,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { initials } from "../../utils/formatters.js";

function AppShell({ children }) {
  const { user, logout } = useAuth();
  const [mobile, setMobile] = useState(false);
  const admin = user?.role === "admin";
  const links = admin
    ? [
        { to: "/admin", label: "Support inbox", icon: Inbox },
        {
          to: "/admin?view=insights",
          label: "Overview",
          icon: LayoutDashboard,
        },
      ]
    : [
        { to: "/", label: "Overview", icon: LayoutDashboard },
        { to: "/books", label: "My books", icon: BookOpen },
        { to: "/tickets", label: "Support tickets", icon: MessageSquare },
      ];
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobile ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <BookOpen size={21} />
          </div>
          <div>
            <div className="brand-name">
              bookleaf<span>.</span>
            </div>
            <div className="brand-sub">AUTHOR SUPPORT</div>
          </div>
          <button
            className="icon-btn sidebar-close"
            onClick={() => setMobile(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setMobile(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <l.icon size={18} />
              <span>{l.label}</span>
              {l.label === "Support tickets" && <span className="nav-dot" />}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <CircleHelp size={18} />
            </div>
            <strong>Need a hand?</strong>
            <p>Our support team is here to help you.</p>
            {!admin && (
              <NavLink to="/tickets/new" className="help-link">
                Create a ticket <ArrowUpRight size={14} />
              </NavLink>
            )}
          </div>
          <div className="user-mini">
            <div className="avatar">{initials(user?.name)}</div>
            <div className="user-mini-copy">
              <strong>{user?.name || "User"}</strong>
              <span>{admin ? "Support administrator" : "Author account"}</span>
            </div>
            <button title="Sign out" className="icon-btn" onClick={logout}>
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
      {mobile && (
        <div className="mobile-scrim" onClick={() => setMobile(false)} />
      )}
      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-btn menu-toggle"
            onClick={() => setMobile(true)}
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumbs">
            {admin ? "Support desk" : "Author workspace"} <span>/</span>{" "}
            <strong>{admin ? "Inbox" : "My account"}</strong>
          </div>
          <div className="top-actions">
            <div className="secure-label">
              <span className="online-dot" /> All systems operational
            </div>
            <button className="icon-btn notification-btn" title="Notifications">
              <Bell size={18} />
              <i />
            </button>
            <div className="top-avatar">{initials(user?.name)}</div>
          </div>
        </header>
        <div className="page-content">{children}</div>
        <footer className="footer">
          <span>
            Made for authors, built for stories{" "}
            <span className="footer-heart">♥</span>
          </span>
        </footer>
      </main>
    </div>
  );
}

export default AppShell;
