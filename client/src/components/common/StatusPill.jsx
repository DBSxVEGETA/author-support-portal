import React from "react";

function StatusPill({ status }) {
  return (
    <span
      className={`status-pill ${(status || "open").toLowerCase().replaceAll(" ", "-")}`}
    >
      <i />
      {status || "Open"}
    </span>
  );
}

export default StatusPill;
