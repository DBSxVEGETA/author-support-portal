import React from "react";

function PriorityPill({ priority }) {
  return (
    <span className={`priority-pill ${(priority || "medium").toLowerCase()}`}>
      <span />
      {priority || "Medium"}
    </span>
  );
}

export default PriorityPill;
