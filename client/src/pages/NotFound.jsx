import React from "react";
import { CircleHelp } from "lucide-react";
import { NavLink } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found">
      <div className="empty-icon">
        <CircleHelp size={25} />
      </div>
      <h2>Page not found</h2>
      <p>That page may have moved or the link may be incorrect.</p>
      <NavLink to="/" className="btn btn-primary">
        Go to dashboard
      </NavLink>
    </div>
  );
}

export default NotFound;
