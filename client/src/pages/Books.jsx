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
  StatusPill,
} from "../components/common/index.js";
import AppShell from "../components/layout/AppShell.jsx";

function Books() {
  const [books, setBooks] = useState([]),
    [loading, setLoading] = useState(true),
    [search, setSearch] = useState("");
  useEffect(() => {
    api
      .get("/api/books")
      .then((r) => setBooks(r.data.books || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  const filtered = books.filter((b) =>
    `${b.title} ${b.isbn} ${b.genre}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow="YOUR CATALOGUE"
        title="My books"
        description="All your titles, their publication status, and how they’re performing."
      />
      <div className="toolbar">
        <div className="search-field">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, ISBN, or genre…"
          />
        </div>
        <span className="result-count">
          {filtered.length} {filtered.length === 1 ? "book" : "books"}
        </span>
      </div>
      {loading ? (
        <Loading />
      ) : filtered.length ? (
        <div className="book-grid">
          {filtered.map((b, i) => (
            <div className="book-card" key={b._id}>
              <div className={`book-card-art cover-${i % 5}`}>
                <div className="art-top">BOOKLEAF PUBLISHING</div>
                <BookOpen size={34} />
                <strong>{b.title}</strong>
                <span>{b.genre || "A book by you"}</span>
                <div className="art-bottom">YOUR STORY. YOUR LEGACY.</div>
              </div>
              <div className="book-card-body">
                <div className="book-card-title">
                  <div>
                    <h3>{b.title}</h3>
                    <p>{b.genre || "Uncategorised"}</p>
                  </div>
                  <StatusPill status={b.status || "In Production"} />
                </div>
                <div className="book-details">
                  <div>
                    <span>ISBN</span>
                    <strong>{b.isbn || "Not assigned"}</strong>
                  </div>
                  <div>
                    <span>Published</span>
                    <strong>{date(b.publicationDate)}</strong>
                  </div>
                  <div>
                    <span>MRP</span>
                    <strong>{money(b.mrp)}</strong>
                  </div>
                  <div>
                    <span>Copies sold</span>
                    <strong>
                      {(b.totalCopiesSold || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>
                <div className="book-royalty-row">
                  <div>
                    <span>Royalty earned</span>
                    <strong>{money(b.totalRoyaltyEarned)}</strong>
                  </div>
                  <div>
                    <span>Pending</span>
                    <strong>{money(b.royaltyPending)}</strong>
                  </div>
                </div>
                <NavLink
                  className="book-help-link"
                  to={`/tickets/new?bookId=${encodeURIComponent(b.bookId)}&title=${encodeURIComponent(b.title)}`}
                >
                  Get help with this book <ArrowUpRight size={15} />
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No books found"
          body={
            search
              ? "Try a different search term."
              : "Your books will appear here when linked to your account."
          }
        />
      )}
    </>
  );
}

export default Books;
