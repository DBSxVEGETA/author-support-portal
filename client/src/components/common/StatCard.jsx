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

function StatCard({ label, value, detail, icon: Icon, tone = "green" }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={19} />
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-detail">{detail}</div>
    </div>
  );
}

export default StatCard;
