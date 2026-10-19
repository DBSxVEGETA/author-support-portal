import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Protected from "./Protected.jsx";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Books from "../pages/Books.jsx";
import NewTicket from "../pages/NewTicket.jsx";
import Tickets from "../pages/Tickets.jsx";
import TicketDetail from "../pages/TicketDetail.jsx";
import AdminInbox from "../pages/AdminInbox.jsx";
import NotFound from "../pages/NotFound.jsx";
import AppShell from "../components/layout/AppShell.jsx";

function Root() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Protected>
            <AppShell>
              <Dashboard />
            </AppShell>
          </Protected>
        }
      />
      <Route
        path="/books"
        element={
          <Protected>
            <AppShell>
              <Books />
            </AppShell>
          </Protected>
        }
      />
      <Route
        path="/tickets"
        element={
          <Protected>
            <AppShell>
              <Tickets />
            </AppShell>
          </Protected>
        }
      />
      <Route
        path="/tickets/new"
        element={
          <Protected>
            <AppShell>
              <NewTicket />
            </AppShell>
          </Protected>
        }
      />
      <Route
        path="/tickets/:id"
        element={
          <Protected>
            <AppShell>
              <TicketDetail />
            </AppShell>
          </Protected>
        }
      />
      <Route
        path="/admin"
        element={
          <Protected admin>
            <AppShell>
              <AdminInbox />
            </AppShell>
          </Protected>
        }
      />
      <Route
        path="/admin/tickets/:id"
        element={
          <Protected admin>
            <AppShell>
              <TicketDetail admin />
            </AppShell>
          </Protected>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Root;
