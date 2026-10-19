import React from "react";
import { NavLink } from "react-router-dom";
import { date, initials } from "../../utils/formatters.js";
import { ArrowUpRight } from "lucide-react";
import StatusPill from "./StatusPill.jsx";
import PriorityPill from "./PriorityPill.jsx";

function TicketTable({ tickets, admin = false }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Ticket</th>
            {admin && <th>Author</th>}
            <th>Subject</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Last activity</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t._id}>
              <td>
                <span className="ticket-number">
                  {t.ticketNumber || `BL-${t._id?.slice(-6).toUpperCase()}`}
                </span>
              </td>
              {admin && (
                <td>
                  <div className="author-cell">
                    <div className="avatar tiny">
                      {initials(t.author?.name)}
                    </div>
                    <span>{t.author?.name || "Author"}</span>
                  </div>
                </td>
              )}
              <td>
                <NavLink
                  className="ticket-subject"
                  to={admin ? `/admin/tickets/${t._id}` : `/tickets/${t._id}`}
                >
                  {t.subject}
                </NavLink>
                <span className="ticket-book">
                  {t.bookTitle || "General / Account Level"}
                </span>
              </td>
              <td>
                <span className="category-text">
                  {t.category || "General Inquiry"}
                </span>
              </td>
              <td>
                <PriorityPill priority={t.priority} />
              </td>
              <td>
                <StatusPill status={t.status} />
              </td>
              <td className="activity-date">
                {date(t.lastActivityAt || t.updatedAt)}
              </td>
              <td>
                <NavLink
                  className="table-arrow"
                  to={admin ? `/admin/tickets/${t._id}` : `/tickets/${t._id}`}
                >
                  <ArrowUpRight size={16} />
                </NavLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TicketTable;
