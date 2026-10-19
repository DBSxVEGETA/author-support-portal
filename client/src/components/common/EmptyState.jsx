import React from "react";
import { CircleHelp } from "lucide-react";

function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={23} />
      </div>
      <strong>{title}</strong>
      <p>{body}</p>
      {action}
    </div>
  );
}

export default EmptyState;
