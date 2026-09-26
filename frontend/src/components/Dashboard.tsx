import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { AnimatedProgressBar } from "./personal-ui/AnimatedProgressBar";
import { toast } from "./ui/toast";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";
  createdAt: string;
  updatedAt: string;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("leads-view");

  // Lead State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Create Lead State
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  // Edit / Manage Lead State
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editStatus, setEditStatus] = useState<Lead["status"]>("NEW");

  // Profile State
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Fetch Leads
  const fetchLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm && searchTerm.trim()) queryParams.append("search", searchTerm.trim());
      if (selectedStatus && selectedStatus !== "ALL") queryParams.append("status", selectedStatus);

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/leads${queryString ? `?${queryString}` : ""}`;

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLeads(data.data || []);
      } else {
        toast.error("Failed to load leads", data.error?.message);
      }
    } catch (err: any) {
      toast.error("Fetch error", err.message || "Failed to fetch leads");
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [selectedStatus]);

  // Handle Search submit
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  // Create Lead Handler
  const handleCreateLead = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmittingCreate(true);

    try {
      const res = await fetch(`${API_BASE_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: createName,
          email: createEmail,
          phone: createPhone || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Lead created!", `${createName} has been added.`);
        setCreateName("");
        setCreateEmail("");
        setCreatePhone("");
        fetchLeads();
        setTimeout(() => setActiveTab("leads-view"), 600);
      } else {
        throw new Error(data.error?.message || "Failed to create lead");
      }
    } catch (err: any) {
      toast.error("Creation failed", err.message || "Error creating lead");
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  // Start Editing Lead
  const startEditing = (lead: Lead) => {
    setEditingLeadId(lead.id);
    setEditName(lead.name);
    setEditEmail(lead.email);
    setEditPhone(lead.phone || "");
    setEditStatus(lead.status);
    setActiveTab("leads-manage");
  };

  // Save Lead Update
  const handleUpdateLead = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingLeadId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/leads/${editingLeadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          phone: editPhone || undefined,
        }),
      });

      const resStatus = await fetch(`${API_BASE_URL}/leads/${editingLeadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: editStatus }),
      });

      const data = await res.json();
      if (res.ok && resStatus.ok && data.success) {
        toast.success("Lead updated!", `Updated details for ${editName}.`);
        setEditingLeadId(null);
        fetchLeads();
        setTimeout(() => setActiveTab("leads-view"), 600);
      } else {
        throw new Error(data.error?.message || "Failed to update lead");
      }
    } catch (err: any) {
      toast.error("Update failed", err.message || "Failed to update lead");
    }
  };

  // Update Status directly from list
  const handleQuickStatusChange = async (leadId: string, newStatus: Lead["status"]) => {
    try {
      const res = await fetch(`${API_BASE_URL}/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.info("Status updated", `Lead status changed to ${newStatus}`);
        fetchLeads();
      } else {
        const data = await res.json();
        toast.error("Status update failed", data.error?.message);
      }
    } catch (e: any) {
      toast.error("Error", e.message);
    }
  };

  // Delete Lead
  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Lead deleted", "The lead record was removed.");
        if (editingLeadId === leadId) setEditingLeadId(null);
        fetchLeads();
      } else {
        const data = await res.json();
        toast.error("Deletion failed", data.error?.message || "Failed to delete lead");
      }
    } catch (err: any) {
      toast.error("Error", err.message || "Failed to delete lead");
    }
  };

  // Profile Update
  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: profileName, email: profileEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Profile saved", "Your account information was updated.");
      } else {
        throw new Error(data.error?.message || "Profile update failed");
      }
    } catch (err: any) {
      toast.error("Profile error", err.message);
    }
  };

  // Change Password
  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Password changed", "Your password has been updated.");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        throw new Error(data.error?.message || "Password change failed");
      }
    } catch (err: any) {
      toast.error("Password error", err.message);
    }
  };

  // Analytics Calculation for Progress Bars (All Prisma Enum Statuses: NEW, CONTACTED, QUALIFIED, CONVERTED, LOST)
  const totalLeadsCount = leads.length;
  const newCount = leads.filter((l) => l.status === "NEW").length;
  const contactedCount = leads.filter((l) => l.status === "CONTACTED").length;
  const qualifiedCount = leads.filter((l) => l.status === "QUALIFIED").length;
  const convertedCount = leads.filter((l) => l.status === "CONVERTED").length;
  const lostCount = leads.filter((l) => l.status === "LOST").length;

  const newRatio = totalLeadsCount > 0 ? Math.round((newCount / totalLeadsCount) * 100) : 0;
  const contactedRatio = totalLeadsCount > 0 ? Math.round((contactedCount / totalLeadsCount) * 100) : 0;
  const qualifiedRatio = totalLeadsCount > 0 ? Math.round((qualifiedCount / totalLeadsCount) * 100) : 0;
  const convertedRatio = totalLeadsCount > 0 ? Math.round((convertedCount / totalLeadsCount) * 100) : 0;
  const lostRatio = totalLeadsCount > 0 ? Math.round((lostCount / totalLeadsCount) * 100) : 0;

  const getStatusBadge = (status: Lead["status"]) => {
    const styles: Record<Lead["status"], string> = {
      NEW: "bg-neutral-100 text-neutral-900 border-neutral-300 dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-800",
      CONTACTED: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
      QUALIFIED: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
      CONVERTED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
      LOST: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Header Greeting */}
      <div className="pb-4 border-b border-border">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Welcome back, {user?.name || user?.email || "User"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your leads, update status, track conversions, and update your account details.
        </p>
      </div>

      {/* Analytics Circular Progress Bar Section (All 5 Prisma Enum Statuses) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-6 rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col items-center justify-center p-3 border-r border-border/30 last:border-r-0">
          <AnimatedProgressBar value={newRatio} label="New Leads" gaugePrimaryColor="#a3a3a3" />
          <p className="text-xs text-muted-foreground mt-2 font-medium">{newCount} of {totalLeadsCount} leads</p>
        </div>
        <div className="flex flex-col items-center justify-center p-3 border-r border-border/30 last:border-r-0">
          <AnimatedProgressBar value={contactedRatio} label="Contacted" gaugePrimaryColor="#3b82f6" />
          <p className="text-xs text-muted-foreground mt-2 font-medium">{contactedCount} of {totalLeadsCount} leads</p>
        </div>
        <div className="flex flex-col items-center justify-center p-3 border-r border-border/30 last:border-r-0">
          <AnimatedProgressBar value={qualifiedRatio} label="Qualified" gaugePrimaryColor="#a855f7" />
          <p className="text-xs text-muted-foreground mt-2 font-medium">{qualifiedCount} of {totalLeadsCount} leads</p>
        </div>
        <div className="flex flex-col items-center justify-center p-3 border-r border-border/30 last:border-r-0">
          <AnimatedProgressBar value={convertedRatio} label="Converted" gaugePrimaryColor="#10b981" />
          <p className="text-xs text-muted-foreground mt-2 font-medium">{convertedCount} of {totalLeadsCount} leads</p>
        </div>
        <div className="flex flex-col items-center justify-center p-3">
          <AnimatedProgressBar value={lostRatio} label="Lost" gaugePrimaryColor="#f43f5e" />
          <p className="text-xs text-muted-foreground mt-2 font-medium">{lostCount} of {totalLeadsCount} leads</p>
        </div>
      </div>

      {/* Dashboard Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
          <TabsTrigger value="leads-view">All Leads Info</TabsTrigger>
          <TabsTrigger value="leads-create">Create Lead</TabsTrigger>
          <TabsTrigger value="leads-manage">Manage Lead</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>

        {/* ================= TAB 1: ALL LEADS INFO ================= */}
        <TabsContent value="leads-view">
          <Card className="border border-border bg-card">
            <CardHeader className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">All Leads Information</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    View, search, and filter all sales leads in your database.
                  </CardDescription>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("leads-create")}
                  className="px-4 py-2 rounded-lg bg-foreground text-background text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity w-max"
                >
                  + Add New Lead
                </button>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2 w-full">
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-lg border border-input bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg border border-border bg-muted text-foreground text-xs sm:text-sm font-medium hover:bg-accent"
                  >
                    Search
                  </button>
                </form>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-lg border border-input bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>
            </CardHeader>

            <div className="p-6 pt-0">
              {isLoadingLeads ? (
                <div className="py-12 text-center text-muted-foreground text-sm animate-pulse">loading...</div>
              ) : leads.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm space-y-3">
                  <p>No leads found matching your criteria.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("leads-create")}
                    className="px-4 py-2 rounded-lg border border-border bg-background text-foreground text-xs font-semibold hover:bg-accent"
                  >
                    Create First Lead
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-muted/60 text-muted-foreground border-b border-border uppercase text-[11px] tracking-wider font-semibold">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Created</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-accent/40 transition-colors">
                          <td className="px-4 py-3 font-semibold text-foreground">{lead.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{lead.email}</td>
                          <td className="px-4 py-3 text-muted-foreground">{lead.phone || "—"}</td>
                          <td className="px-4 py-3">
                            <select
                              value={lead.status}
                              onChange={(e) => handleQuickStatusChange(lead.id, e.target.value as Lead["status"])}
                              className="bg-transparent border border-border rounded-md text-xs font-semibold px-2 py-1 cursor-pointer focus:outline-none"
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="QUALIFIED">QUALIFIED</option>
                              <option value="CONVERTED">CONVERTED</option>
                              <option value="LOST">LOST</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => startEditing(lead)}
                              className="px-2.5 py-1 rounded border border-border text-xs font-medium hover:bg-accent"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLead(lead.id)}
                              className="px-2.5 py-1 rounded border border-destructive/30 text-destructive text-xs font-medium hover:bg-destructive/10"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* ================= TAB 2: LEAD CREATION ================= */}
        <TabsContent value="leads-create">
          <Card className="border border-border bg-card max-w-2xl mx-auto">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-bold text-foreground">Create New Lead</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Enter details to add a new prospect into your sales pipeline.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleCreateLead} className="p-6 pt-0 space-y-5">

              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Lead name"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="lead@company.com"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={createPhone}
                  onChange={(e) => setCreatePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("leads-view")}
                  className="px-4 py-2.5 rounded-lg border border-border text-xs sm:text-sm font-medium hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCreate}
                  className="px-5 py-2.5 rounded-lg bg-foreground text-background text-xs sm:text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {isSubmittingCreate ? "Creating..." : "Save Lead"}
                </button>
              </div>
            </form>
          </Card>
        </TabsContent>

        {/* ================= TAB 3: LEADS UPDATION & DELETION ================= */}
        <TabsContent value="leads-manage">
          <Card className="border border-border bg-card max-w-2xl mx-auto">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-bold text-foreground">Update or Delete Lead</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Modify details, update pipeline status, or delete existing leads.
              </CardDescription>
            </CardHeader>

            <div className="p-6 pt-0 space-y-6">

              {editingLeadId ? (
                <form onSubmit={handleUpdateLead} className="space-y-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">Lead Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">Pipeline Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as Lead["status"])}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="QUALIFIED">QUALIFIED</option>
                      <option value="CONVERTED">CONVERTED</option>
                      <option value="LOST">LOST</option>
                    </select>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteLead(editingLeadId)}
                      className="px-4 py-2.5 rounded-lg border border-destructive/30 text-destructive text-xs sm:text-sm font-semibold hover:bg-destructive/10"
                    >
                      Delete Lead
                    </button>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingLeadId(null)}
                        className="px-4 py-2.5 rounded-lg border border-border text-xs sm:text-sm font-medium hover:bg-accent"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-lg bg-foreground text-background text-xs sm:text-sm font-semibold hover:opacity-90"
                      >
                        Update Lead
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-muted-foreground">Select a lead from your database to edit or delete:</p>
                  <div className="divide-y divide-border border border-border rounded-lg max-h-96 overflow-y-auto">
                    {leads.map((lead) => (
                      <div key={lead.id} className="p-4 flex items-center justify-between hover:bg-accent/40 transition-colors">
                        <div>
                          <p className="font-semibold text-foreground text-xs sm:text-sm">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">{lead.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(lead.status)}
                          <button
                            type="button"
                            onClick={() => startEditing(lead)}
                            className="px-3 py-1.5 rounded border border-border text-xs font-semibold hover:bg-accent"
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* ================= TAB 4: PROFILE VIEW ================= */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Account Information */}
            <Card className="border border-border bg-card">
              <CardHeader className="p-6">
                <CardTitle className="text-lg font-bold text-foreground">Account Information</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                  Update your personal name and email address.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleProfileUpdate} className="p-6 pt-0 space-y-4">

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-foreground text-background text-xs sm:text-sm font-semibold hover:opacity-90"
                >
                  Save Profile
                </button>
              </form>
            </Card>

            {/* Change Password */}
            <Card className="border border-border bg-card">
              <CardHeader className="p-6">
                <CardTitle className="text-lg font-bold text-foreground">Change Password</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleChangePassword} className="p-6 pt-0 space-y-4">

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-foreground text-background text-xs sm:text-sm font-semibold hover:opacity-90"
                >
                  Update Password
                </button>
              </form>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
