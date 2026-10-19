import React from "react";
import { RefreshCw } from "lucide-react";

function Loading() {
  return (
    <div className="loading-block">
      <RefreshCw size={20} className="spin" /> Loading your workspace…
    </div>
  );
}

export default Loading;
