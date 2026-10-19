import React from "react";
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
