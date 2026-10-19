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
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import api, { API_URL } from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { io } from "socket.io-client";
import { money, date, initials } from "../utils/formatters.js";
import { statuses, categories, priorities } from "../utils/constants.js";
import { PageHeading } from "../components/common/index.js";
import AppShell from "../components/layout/AppShell.jsx";

function NewTicket() {
  const [books, setBooks] = useState([]),
    [bookId, setBookId] = useState(""),
    [subject, setSubject] = useState(""),
    [description, setDescription] = useState(""),
    [attachmentName, setAttachmentName] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const nav = useNavigate(),
    loc = useLocation();
  useEffect(() => {
    api
      .get("/api/books")
      .then((r) => setBooks(r.data.books || []))
      .catch(() => {});
    const q = new URLSearchParams(loc.search);
    setBookId(q.get("bookId") || "");
    if (q.get("title")) setSubject(`Question about ${q.get("title")}`);
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await api.post("/api/tickets", {
        bookId,
        subject,
        description,
        attachmentName,
      });
      nav(`/tickets/${r.data.ticket._id}`, { state: { created: true } });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not create ticket. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <button className="back-link" onClick={() => nav("/tickets")}>
        <ArrowLeft size={16} /> Back to support tickets
      </button>
      <PageHeading
        eyebrow="AUTHOR SUPPORT"
        title="How can we help?"
        description="Tell us what’s happening. We’ll get your question to the right team."
      />
      <div className="ticket-form-layout">
        <div className="panel ticket-form-panel">
          <form className="form-stack" onSubmit={submit}>
            <div className="form-section-title">
              <span>01</span>
              <div>
                <h3>Tell us about your request</h3>
                <p>Start with the book or topic you need help with.</p>
              </div>
            </div>
            <label>
              Related book <span className="optional">(optional)</span>
              <select
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
              >
                <option value="">General / Account Level</option>
                {books.map((b) => (
                  <option key={b._id} value={b.bookId}>
                    {b.title}
                  </option>
                ))}
              </select>
              <span className="field-hint">
                Choose a title to help us understand your request faster.
              </span>
            </label>
            <label>
              Subject
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                minLength={3}
                maxLength={160}
                placeholder="e.g. Incorrect ISBN on my book listing"
              />
              <span className="field-hint">
                A short, clear summary of the issue.
              </span>
            </label>
            <label>
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                minLength={5}
                maxLength={10000}
                rows={7}
                placeholder="Please share the details. Include any steps you’ve tried or information that might help us resolve this."
              />
              <span className="field-hint">
                Please don’t include passwords or sensitive banking details.
              </span>
            </label>
            <label>
              Attachment <span className="optional">(optional)</span>
              <div className="attachment-control">
                <Paperclip size={18} />
                <div>
                  <strong>{attachmentName || "Add an attachment"}</strong>
                  <span>
                    {attachmentName
                      ? "Filename will be included with the ticket"
                      : "Attach a filename for reference (actual file uploads are not enabled yet)."}
                  </span>
                </div>
                <label className="btn btn-outline btn-sm attach-button">
                  Browse
                  <input
                    type="file"
                    onChange={(e) =>
                      setAttachmentName(e.target.files?.[0]?.name || "")
                    }
                    hidden
                  />
                </label>
              </div>
            </label>
            {error && (
              <div className="form-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => nav("/tickets")}
              >
                Cancel
              </button>
              <button className="btn btn-primary" disabled={busy}>
                {busy ? "Submitting…" : "Submit request"}{" "}
                <ArrowUpRight size={17} />
              </button>
            </div>
          </form>
        </div>
        <aside className="ticket-side">
          <div className="side-info-card">
            <div className="side-info-icon">
              <Sparkles size={19} />
            </div>
            <h3>We’ll route it for you</h3>
            <p>
              Your request is automatically categorised and prioritised so it
              reaches the right support team.
            </p>
          </div>
          <div className="side-info-card light">
            <div className="side-info-icon">
              <Clock3 size={19} />
            </div>
            <h3>What happens next?</h3>
            <ul>
              <li>
                <span>1</span>Your ticket is created
              </li>
              <li>
                <span>2</span>Our team reviews the details
              </li>
              <li>
                <span>3</span>You’ll see replies here
              </li>
            </ul>
          </div>
          <div className="knowledge-note">
            <CircleHelp size={16} />
            <p>
              For royalty questions, please include the book title and the
              payout period you’re asking about.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

export default NewTicket;
