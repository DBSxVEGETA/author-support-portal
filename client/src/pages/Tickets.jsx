import React, { useEffect, useState } from "react";
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
import { NavLink } from "react-router-dom";
import api, { API_URL } from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { io } from "socket.io-client";
import { money, date, initials } from "../utils/formatters.js";
import { statuses, categories, priorities } from "../utils/constants.js";
import {
  PageHeading,
  Loading,
  EmptyState,
  TicketTable,
  StatusPill,
  PriorityPill,
} from "../components/common/index.js";
import AppShell from "../components/layout/AppShell.jsx";

function Tickets() {
  const [tickets, setTickets] = useState([]),
    [loading, setLoading] = useState(true),
    [status, setStatus] = useState("All"),
    [search, setSearch] = useState("");
  const load = () =>
    api
      .get("/api/tickets")
      .then((r) => setTickets(r.data.tickets || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);
  const filtered = tickets.filter(
    (t) =>
      (status === "All" || t.status === status) &&
      `${t.ticketNumber} ${t.subject} ${t.category}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow="YOUR CONVERSATIONS"
        title="Support tickets"
        description="Questions, answers, and updates — all in one place."
        action={
          <NavLink to="/tickets/new" className="btn btn-primary">
            <Plus size={17} /> New ticket
          </NavLink>
        }
      />
      <div className="toolbar ticket-toolbar">
        <div className="search-field">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets…"
          />
        </div>
        <div className="filter-select">
          <Filter size={16} />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All</option>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <span className="result-count">{filtered.length} requests</span>
      </div>
      {loading ? (
        <Loading />
      ) : filtered.length ? (
        <div className="panel table-panel">
          <TicketTable tickets={filtered} />
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No matching tickets"
          body="Try a different filter or create a new support request."
          action={
            <NavLink className="btn btn-primary" to="/tickets/new">
              <Plus size={16} /> Create ticket
            </NavLink>
          }
        />
      )}
    </>
  );
}

export default Tickets;
