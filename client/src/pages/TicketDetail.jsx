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
import { NavLink, useNavigate, useParams } from "react-router-dom";
import api, { API_URL } from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { io } from "socket.io-client";
import { money, date, initials } from "../utils/formatters.js";
import { statuses, categories, priorities } from "../utils/constants.js";
import {
  Loading,
  StatusPill,
  PriorityPill,
} from "../components/common/index.js";
import AppShell from "../components/layout/AppShell.jsx";

function TicketDetail({ admin = false }) {
  const { id } = useParams(),
    nav = useNavigate(),
    [ticket, setTicket] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [draftBusy, setDraftBusy] = useState(false),
    [draft, setDraft] = useState(""),
    [note, setNote] = useState("");
  const load = () =>
    api
      .get(`/api/tickets/${id}`)
      .then((r) => {
        setTicket(r.data.ticket);
        setDraft(r.data.ticket.aiDraft || "");
        setError("");
      })
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load this ticket."),
      )
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, [id]);
  const send = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setBusy(true);
    try {
      const r = await api.post(`/api/tickets/${id}/replies`, { message });
      setTicket(r.data.ticket);
      setMessage("");
    } catch (e) {
      setError(e.response?.data?.message || "Unable to send reply.");
    } finally {
      setBusy(false);
    }
  };
  const update = async (patch) => {
    try {
      const r = await api.patch(`/api/admin/tickets/${id}`, patch);
      setTicket(r.data.ticket);
    } catch (e) {
      setError(e.response?.data?.message || "Could not update ticket.");
    }
  };
  const generate = async () => {
    setDraftBusy(true);
    try {
      const r = await api.post(`/api/admin/tickets/${id}/draft-response`);
      setDraft(r.data.draft);
      setTicket((t) => ({ ...t, aiDraft: r.data.draft }));
    } catch (e) {
      setError(e.response?.data?.message || "Could not generate a draft.");
    } finally {
      setDraftBusy(false);
    }
  };
  const sendDraft = async () => {
    if (!draft.trim()) return;
    setDraftBusy(true);
    try {
      const r = await api.post(`/api/admin/tickets/${id}/send-response`, {
        message: draft,
      });
      setTicket(r.data.ticket);
      setDraft("");
    } catch (e) {
      setError(e.response?.data?.message || "Could not send the response.");
    } finally {
      setDraftBusy(false);
    }
  };
  const internalNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    await update({ internalNote: note });
    setNote("");
  };
  if (loading) return <Loading />;
  if (!ticket)
    return (
      <div className="error-banner">
        {error || "Ticket not found."}
        <button onClick={() => nav(admin ? "/admin" : "/tickets")}>
          Go back
        </button>
      </div>
    );
  return (
    <>
      <button
        className="back-link"
        onClick={() => nav(admin ? "/admin" : "/tickets")}
      >
        <ArrowLeft size={16} /> Back to {admin ? "inbox" : "support tickets"}
      </button>
      {error && (
        <div className="error-banner">
          <AlertCircle size={17} />
          {error}
          <button onClick={() => setError("")}>Dismiss</button>
        </div>
      )}
      <div className="detail-heading">
        <div>
          <div className="eyebrow">
            {ticket.ticketNumber || "SUPPORT REQUEST"}{" "}
            <span className="eyebrow-sep">/</span> {ticket.category}
          </div>
          <h1>{ticket.subject}</h1>
          <div className="detail-subline">
            Opened {date(ticket.createdAt)} <span>·</span>{" "}
            {ticket.bookTitle || "General / Account Level"}{" "}
            {admin && ticket.author && (
              <>
                <span>·</span> by {ticket.author.name}
              </>
            )}
          </div>
        </div>
        <div className="detail-pills">
          <StatusPill status={ticket.status} />
          <PriorityPill priority={ticket.priority} />
        </div>
      </div>
      <div className="detail-layout">
        <div className="detail-main">
          <section className="panel conversation-panel">
            <div className="conversation-header">
              <div>
                <h2>Conversation</h2>
                <p>
                  {(ticket.replies || []).length + 1} message
                  {(ticket.replies || []).length === 0 ? "" : "s"} in this
                  thread
                </p>
              </div>
              <span className="ticket-id-label">{ticket.ticketNumber}</span>
            </div>
            <div className="conversation-body">
              <div className="message-item">
                <div className="avatar message-avatar">
                  {initials(
                    admin && ticket.author ? ticket.author.name : "You",
                  )}
                </div>
                <div className="message-content">
                  <div className="message-meta">
                    <strong>
                      {admin && ticket.author ? ticket.author.name : "You"}
                    </strong>
                    <span className="role-chip">Author</span>
                    <time>{date(ticket.createdAt)}</time>
                  </div>
                  <div className="message-bubble">{ticket.description}</div>
                  {ticket.attachmentName && (
                    <div className="attachment-chip">
                      <Paperclip size={14} />
                      {ticket.attachmentName}
                    </div>
                  )}
                </div>
              </div>
              {(ticket.replies || [])
                .filter((r) => !r.internal || admin)
                .map((r, i) => (
                  <div className="message-item" key={r._id || i}>
                    <div
                      className={`avatar message-avatar ${r.role === "admin" ? "admin-avatar" : ""}`}
                    >
                      {initials(r.authorName)}
                    </div>
                    <div className="message-content">
                      <div className="message-meta">
                        <strong>{r.authorName}</strong>
                        <span
                          className={`role-chip ${r.role === "admin" ? "support-role" : ""}`}
                        >
                          {r.internal
                            ? "Internal note"
                            : r.role === "admin"
                              ? "BookLeaf Support"
                              : "Author"}
                        </span>
                        <time>{date(r.createdAt)}</time>
                      </div>
                      <div
                        className={`message-bubble ${r.internal ? "internal-bubble" : ""}`}
                      >
                        {r.message}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {!admin && (
              <form className="reply-composer" onSubmit={send}>
                <label htmlFor="reply">Add a reply</label>
                <textarea
                  id="reply"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message…"
                  rows={3}
                />
                <div className="composer-footer">
                  <span>Replies are visible to the support team.</span>
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={busy || !message.trim()}
                  >
                    {busy ? "Sending…" : "Send reply"} <Send size={14} />
                  </button>
                </div>
              </form>
            )}
          </section>
          {admin && (
            <section className="panel admin-reply-panel">
              <div className="panel-head">
                <div>
                  <h2>
                    <Sparkles size={18} /> AI-assisted response
                  </h2>
                  <p>Generate a draft, review it, and edit before sending.</p>
                </div>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={generate}
                  disabled={draftBusy}
                >
                  <RefreshCw size={14} className={draftBusy ? "spin" : ""} />
                  {draftBusy ? "Working…" : "Generate draft"}
                </button>
              </div>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={5}
                placeholder="Generate a suggested response or write your own…"
              />
              <div className="composer-footer">
                <span>Always review AI-generated text before sending.</span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={sendDraft}
                  disabled={draftBusy || !draft.trim()}
                >
                  Send to author <Send size={14} />
                </button>
              </div>
            </section>
          )}
          {admin && (
            <section className="panel admin-reply-panel">
              <div className="panel-head">
                <div>
                  <h2>
                    <MessageSquare size={18} /> Internal note
                  </h2>
                  <p>Visible only to the support team.</p>
                </div>
              </div>
              <form onSubmit={internalNote}>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Add an internal note…"
                />
                <div className="composer-footer">
                  <span>Not shared with the author.</span>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={!note.trim()}
                  >
                    Add note
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
        <aside className="detail-side">
          <section className="panel properties-panel">
            <div className="panel-head">
              <h2>Ticket details</h2>
            </div>
            <div className="property">
              <span>Status</span>
              {admin ? (
                <select
                  value={ticket.status}
                  onChange={(e) => update({ status: e.target.value })}
                >
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <StatusPill status={ticket.status} />
              )}
            </div>
            <div className="property">
              <span>Priority</span>
              {admin ? (
                <select
                  value={ticket.priority}
                  onChange={(e) => update({ priority: e.target.value })}
                >
                  {priorities.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <PriorityPill priority={ticket.priority} />
              )}
            </div>
            <div className="property">
              <span>Category</span>
              {admin ? (
                <select
                  value={ticket.category}
                  onChange={(e) => update({ category: e.target.value })}
                >
                  {categories.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <strong>{ticket.category}</strong>
              )}
            </div>
            <div className="property">
              <span>Related book</span>
              <strong>{ticket.bookTitle || "General / Account Level"}</strong>
            </div>
            <div className="property">
              <span>Created</span>
              <strong>{date(ticket.createdAt)}</strong>
            </div>
            <div className="property">
              <span>Last activity</span>
              <strong>{date(ticket.lastActivityAt || ticket.updatedAt)}</strong>
            </div>
            {admin && (
              <button
                className="btn btn-outline btn-full assign-button"
                onClick={() => update({ assignToMe: true })}
              >
                <UserRound size={16} /> Assign to me
              </button>
            )}
          </section>
          <div className="detail-tip">
            <div className="side-info-icon">
              <CircleHelp size={17} />
            </div>
            <strong>{admin ? "Support tip" : "Need to add context?"}</strong>
            <p>
              {admin
                ? "Check the knowledge base guidance before responding. Confirm details before promising a payout or reprint."
                : "You can reply to this ticket anytime. If the issue is resolved, let the team know in a reply."}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

export default TicketDetail;
