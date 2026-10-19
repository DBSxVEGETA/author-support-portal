import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Search,
  Clock3,
  SlidersHorizontal,
  Inbox,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import api, { API_URL } from "../api/axios.js";
import { io } from "socket.io-client";
import { statuses, categories, priorities } from "../utils/constants.js";
import {
  PageHeading,
  StatCard,
  Loading,
  EmptyState,
  TicketTable,
} from "../components/common/index.js";

function AdminInbox() {
  const [tickets, setTickets] = useState([]),
    [loading, setLoading] = useState(true),
    [status, setStatus] = useState("All"),
    [priority, setPriority] = useState("All"),
    [category, setCategory] = useState("All"),
    [search, setSearch] = useState("");
  const load = () =>
    api
      .get("/api/admin/tickets")
      .then((r) => setTickets(r.data.tickets || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    if (!localStorage.getItem("bl_token")) return;
    const socket = io(API_URL, {
      auth: { token: localStorage.getItem("bl_token") },
    });
    socket.on("ticket:created", load);
    socket.on("ticket:updated", load);
    return () => socket.disconnect();
  }, []);
  const filtered = tickets.filter(
    (t) =>
      (status === "All" || t.status === status) &&
      (priority === "All" || t.priority === priority) &&
      (category === "All" || t.category === category) &&
      `${t.ticketNumber} ${t.subject} ${t.author?.name || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const open = tickets.filter(
      (t) => !["Resolved", "Closed"].includes(t.status),
    ).length,
    critical = tickets.filter(
      (t) =>
        t.priority === "Critical" &&
        t.status !== "Resolved" &&
        t.status !== "Closed",
    ).length,
    high = tickets.filter(
      (t) =>
        t.priority === "High" &&
        t.status !== "Resolved" &&
        t.status !== "Closed",
    ).length;
  return (
    <>
      <PageHeading
        eyebrow="SUPPORT OPERATIONS"
        title="Support inbox"
        description="Every author request, in one organised queue."
        action={
          <button className="btn btn-outline" onClick={load}>
            <RefreshCw size={16} /> Refresh
          </button>
        }
      />
      <div className="stats-grid admin-stats">
        <StatCard
          label="Active tickets"
          value={open}
          detail="Awaiting resolution"
          icon={Inbox}
        />
        <StatCard
          label="Critical priority"
          value={critical}
          detail="Needs immediate attention"
          icon={AlertCircle}
          tone="red"
        />
        <StatCard
          label="High priority"
          value={high}
          detail="Elevated attention needed"
          icon={Clock3}
          tone="gold"
        />
        <StatCard
          label="All requests"
          value={tickets.length}
          detail="Tickets in the system"
          icon={MessageSquare}
          tone="blue"
        />
      </div>
      <section className="panel inbox-panel">
        <div className="inbox-title-row">
          <div>
            <h2>
              All tickets <span className="count-badge">{filtered.length}</span>
            </h2>
            <p>Review, prioritise, and respond to author questions.</p>
          </div>
          <div className="live-label">
            <span className="online-dot" /> Live updates
          </div>
        </div>
        <div className="filter-toolbar">
          <div className="search-field">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets or authors…"
            />
          </div>
          <div className="filter-select">
            <SlidersHorizontal size={15} />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>All</option>
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="filter-select">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>All</option>
              {priorities.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="filter-select category-filter">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>All</option>
              {categories.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : filtered.length ? (
          <TicketTable tickets={filtered} admin />
        ) : (
          <EmptyState
            icon={Inbox}
            title="Inbox is clear"
            body="No tickets match your current filters."
            action={
              <button
                className="btn btn-outline"
                onClick={() => {
                  setStatus("All");
                  setPriority("All");
                  setCategory("All");
                  setSearch("");
                }}
              >
                Clear filters
              </button>
            }
          />
        )}
      </section>
    </>
  );
}

export default AdminInbox;
