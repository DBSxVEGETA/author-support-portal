import { useEffect, useState } from "react";
import {
  BookOpen,
  LifeBuoy,
  MessageSquare,
  Plus,
  ArrowUpRight,
  CircleHelp,
  BookMarked,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { money } from "../utils/formatters.js";
import {
  PageHeading,
  StatCard,
  StatusPill,
  Loading,
  EmptyState,
  TicketTable,
} from "../components/common/index.js";

function Dashboard() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]),
    [tickets, setTickets] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const load = () => {
    setLoading(true);
    Promise.all([api.get("/api/books"), api.get("/api/tickets")])
      .then(([b, t]) => {
        setBooks(b.data.books || []);
        setTickets(t.data.tickets || []);
        setError("");
      })
      .catch((e) =>
        setError(
          e.response?.data?.message ||
            "Could not load your dashboard. Check the API connection.",
        ),
      )
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);
  const totalEarned = books.reduce(
      (s, b) => s + (b.totalRoyaltyEarned || 0),
      0,
    ),
    pending = books.reduce((s, b) => s + (b.royaltyPending || 0), 0),
    sold = books.reduce((s, b) => s + (b.totalCopiesSold || 0), 0),
    open = tickets.filter(
      (t) => !["Resolved", "Closed"].includes(t.status),
    ).length;
  return (
    <>
      <PageHeading
        eyebrow="YOUR AUTHOR SPACE"
        title={`Good to see you, ${(user?.name || "Author").split(" ")[0]}.`}
        description="Here’s what’s happening with your books and support requests."
        action={
          <NavLink to="/tickets/new" className="btn btn-primary">
            <Plus size={17} /> New support ticket
          </NavLink>
        }
      />
      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          {error}
          <button onClick={load}>Try again</button>
        </div>
      )}
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              label="Your books"
              value={books.length}
              detail="Across your catalogue"
              icon={BookOpen}
            />
            <StatCard
              label="Total copies sold"
              value={sold.toLocaleString("en-IN")}
              detail="All-time book sales"
              icon={BookMarked}
              tone="blue"
            />
            <StatCard
              label="Royalty earned"
              value={money(totalEarned)}
              detail="Total recorded earnings"
              icon={Wallet}
              tone="gold"
            />
            <StatCard
              label="Pending support"
              value={open}
              detail="Tickets awaiting resolution"
              icon={LifeBuoy}
              tone="violet"
            />
          </div>
          <div className="dashboard-grid">
            <section className="panel books-panel">
              <div className="panel-head">
                <div>
                  <h2>Your books</h2>
                  <p>Your published and in-progress titles</p>
                </div>
                <NavLink className="text-link" to="/books">
                  View all <ArrowUpRight size={15} />
                </NavLink>
              </div>
              {books.length ? (
                <div className="book-list">
                  {books.slice(0, 4).map((b, i) => (
                    <div className="book-row" key={b._id}>
                      <div className={`book-cover cover-${i % 5}`}>
                        <BookOpen size={22} />
                        <span>BOOKLEAF</span>
                      </div>
                      <div className="book-info">
                        <strong>{b.title}</strong>
                        <span>
                          {b.genre || "Book"} · ISBN {b.isbn || "Pending"}
                        </span>
                        <div className="book-meta">
                          <span>
                            {(b.totalCopiesSold || 0).toLocaleString("en-IN")}{" "}
                            sold
                          </span>
                          <span>•</span>
                          <span>{money(b.royaltyPending)} pending</span>
                        </div>
                      </div>
                      <div className="book-row-right">
                        <StatusPill status={b.status || "In Production"} />
                        <span className="book-mrp">MRP {money(b.mrp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title="Your bookshelf is waiting"
                  body="Books linked to your author account will appear here."
                />
              )}
            </section>
            <section className="panel royalty-panel">
              <div className="panel-head">
                <div>
                  <h2>Royalty snapshot</h2>
                  <p>Your earnings at a glance</p>
                </div>
                <div className="royalty-icon">
                  <Wallet size={18} />
                </div>
              </div>
              <div className="royalty-total">
                {money(totalEarned)}
                <span>total earned</span>
              </div>
              <div className="royalty-bar">
                <div
                  style={{
                    width: `${totalEarned ? Math.min(100, Math.max(0, ((totalEarned - pending) / totalEarned) * 100)) : 0}%`,
                  }}
                />
              </div>
              <div className="royalty-breakdown">
                <div>
                  <span className="legend-dot paid" />
                  Paid to date
                  <strong>{money(Math.max(0, totalEarned - pending))}</strong>
                </div>
                <div>
                  <span className="legend-dot pending" />
                  Pending balance<strong>{money(pending)}</strong>
                </div>
              </div>
              <div className="royalty-footnote">
                <CircleHelp size={15} /> Royalties are processed quarterly,
                subject to the ₹1,000 minimum payout threshold.
              </div>
            </section>
          </div>
          <section className="panel recent-panel">
            <div className="panel-head">
              <div>
                <h2>Recent support activity</h2>
                <p>Keep track of your conversations with BookLeaf</p>
              </div>
              <NavLink className="text-link" to="/tickets">
                All tickets <ArrowUpRight size={15} />
              </NavLink>
            </div>
            {tickets.length ? (
              <TicketTable tickets={tickets.slice(0, 5)} />
            ) : (
              <EmptyState
                icon={MessageSquare}
                title="Nothing in your inbox yet"
                body="Need help with a book, royalty, or production update? We’re one ticket away."
                action={
                  <NavLink to="/tickets/new" className="btn btn-outline">
                    Create a ticket
                  </NavLink>
                }
              />
            )}
          </section>
        </>
      )}
    </>
  );
}

export default Dashboard;
