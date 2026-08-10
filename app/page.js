"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Archive,
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  FileImage,
  Filter,
  Fingerprint,
  Globe2,
  Grid2X2,
  HelpCircle,
  Image as ImageIcon,
  LoaderCircle,
  Menu,
  MoreHorizontal,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { brandPoliceService } from "../lib/brand-police-service";

const tabs = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "reviewed", label: "Reviewed" },
  { id: "approved", label: "Approved" },
  { id: "dismissed", label: "Dismissed" },
];

const navigation = [
  { label: "Overview", icon: Grid2X2 },
  { label: "Brand Police", icon: ShieldCheck, active: true },
  { label: "Assets", icon: ImageIcon },
  { label: "Guidelines", icon: Archive },
  { label: "Analytics", icon: BarChart3 },
];

function Logo() {
  return (
    <div className="brand-logo" aria-label="Brandy">
      <span className="brand-mark"><span /></span>
      <span>Brandy</span>
    </div>
  );
}

function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <button className="sidebar-scrim" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <Logo />
          <button className="icon-button mobile-close" onClick={onClose} aria-label="Close navigation"><X size={18} /></button>
        </div>

        <button className="space-switcher">
          <span className="space-avatar">B</span>
          <span><strong>Brandy</strong><small>Brand Space</small></span>
          <ChevronDown size={15} />
        </button>

        <nav aria-label="Primary navigation">
          <p className="nav-label">Workspace</p>
          {navigation.map(({ label, icon: Icon, active }) => (
            <button key={label} className={`nav-item ${active ? "active" : ""}`}>
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {label === "Brand Police" && <span className="new-count">7</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item"><HelpCircle size={17} /><span>Help & support</span></button>
          <button className="nav-item"><Settings size={17} /><span>Settings</span></button>
          <div className="account">
            <span className="account-avatar">AK</span>
            <span><strong>Akshay Kumar</strong><small>Workspace admin</small></span>
            <MoreHorizontal size={16} />
          </div>
        </div>
      </aside>
    </>
  );
}

function StatCard({ icon: Icon, label, value, note, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={18} /></div>
      <div><span>{label}</span><strong>{value}</strong><small>{note}</small></div>
    </div>
  );
}

function FindingArtwork({ tone, domain }) {
  return (
    <div className={`finding-artwork ${tone}`}>
      <span className="mini-mark"><span /></span>
      <small>{domain.split(".")[0]}</small>
    </div>
  );
}

function StatusPill({ status }) {
  const labels = { new: "New", reviewed: "Reviewed", approved: "Approved", dismissed: "Dismissed" };
  return <span className={`status-pill ${status}`}><span />{labels[status]}</span>;
}

function FindingCard({ finding, busy, onStatusChange }) {
  return (
    <article className="finding-card">
      <FindingArtwork tone={finding.tone} domain={finding.domain} />
      <div className="finding-body">
        <div className="finding-heading">
          <div>
            <div className="domain-line"><Globe2 size={13} />{finding.domain}<StatusPill status={finding.status} /></div>
            <h3>{finding.pageTitle}</h3>
          </div>
          <a href={finding.sourceUrl} target="_blank" rel="noreferrer" className="icon-button" aria-label={`Open ${finding.domain}`}>
            <ExternalLink size={16} />
          </a>
        </div>
        <div className="finding-details">
          <span><FileImage size={14} />{finding.matchedAsset}</span>
          <span><Fingerprint size={14} />{finding.matchType}</span>
          <span><Activity size={14} />{finding.discoveredAt}</span>
        </div>
        <div className="finding-footer">
          <span className="source-label">Found on {finding.source}</span>
          <div className="finding-actions">
            {finding.status !== "approved" && (
              <button disabled={busy} className="secondary-button success" onClick={() => onStatusChange(finding.id, "approved")}>
                <Check size={15} />Approve
              </button>
            )}
            {finding.status !== "dismissed" && (
              <button disabled={busy} className="secondary-button" onClick={() => onStatusChange(finding.id, "dismissed")}>
                <X size={15} />Dismiss
              </button>
            )}
            {(finding.status === "approved" || finding.status === "dismissed") && (
              <button disabled={busy} className="secondary-button" onClick={() => onStatusChange(finding.id, "reviewed")}>
                Mark reviewed
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function Toast({ message, tone = "success", onClose }) {
  return (
    <div className={`toast ${tone}`} role="status">
      {tone === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      <span>{message}</span>
      <button onClick={onClose} aria-label="Dismiss notification"><X size={15} /></button>
    </div>
  );
}

export default function BrandPolicePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [findings, setFindings] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    brandPoliceService.listFindings()
      .then(({ findings: loaded }) => setFindings(loaded))
      .catch(() => setToast({ tone: "error", message: "Findings could not be loaded." }))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => findings.reduce((result, finding) => {
    result[finding.status] = (result[finding.status] || 0) + 1;
    return result;
  }, {}), [findings]);

  const filteredFindings = useMemo(() => findings.filter((finding) => {
    const matchesTab = activeTab === "all" || finding.status === activeTab;
    const searchable = `${finding.domain} ${finding.pageTitle} ${finding.matchedAsset}`.toLowerCase();
    return matchesTab && searchable.includes(query.toLowerCase().trim());
  }), [findings, activeTab, query]);

  async function updateStatus(id, status) {
    const previous = findings;
    setBusyId(id);
    setFindings((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    try {
      await brandPoliceService.updateFinding(id, status);
      const label = status === "approved" ? "Finding approved" : status === "dismissed" ? "Finding dismissed" : "Finding marked as reviewed";
      setToast({ tone: "success", message: label });
    } catch {
      setFindings(previous);
      setToast({ tone: "error", message: "That change could not be saved." });
    } finally {
      setBusyId(null);
    }
  }

  async function runScan() {
    setScanning(true);
    try {
      const result = await brandPoliceService.runScan();
      setToast({ tone: "success", message: `Scan complete. ${result.newFindings} new matches found.` });
    } catch {
      setToast({ tone: "error", message: "The scan could not be started." });
    } finally {
      setScanning(false);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={19} /></button>
          <div className="topbar-spacer" />
          {brandPoliceService.isDemo && <span className="demo-pill"><Sparkles size={13} />Demo mode</span>}
          <button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><span /></button>
          <span className="top-avatar">AK</span>
        </header>

        <div className="page-wrap">
          <section className="page-heading">
            <div>
              <div className="heading-kicker"><ShieldCheck size={15} />Brand monitoring</div>
              <h1>Brand Police</h1>
              <p>Discover where your brand assets appear online and review every match in one place.</p>
            </div>
            <button className="primary-button" onClick={runScan} disabled={scanning}>
              {scanning ? <LoaderCircle className="spin" size={17} /> : <RefreshCw size={17} />}
              {scanning ? "Scanning the web" : "Scan now"}
            </button>
          </section>

          <section className="monitor-card">
            <div className="monitor-icon"><ShieldCheck size={25} /></div>
            <div className="monitor-copy">
              <div><h2>Monitoring is active</h2><span className="live-dot">Live</span></div>
              <p>4 brand assets are being checked across indexed public web pages.</p>
            </div>
            <div className="monitor-meta">
              <div><span>Last scan</span><strong>Today, 10:42 AM</strong></div>
              <div><span>Next scan</span><strong>Monday, 9:00 AM</strong></div>
            </div>
          </section>

          <section className="stats-grid" aria-label="Finding summary">
            <StatCard icon={Globe2} label="Total findings" value={findings.length || 5} note="Across 5 domains" tone="purple" />
            <StatCard icon={AlertCircle} label="Needs review" value={counts.new || 0} note="New since last scan" tone="red" />
            <StatCard icon={CheckCircle2} label="Approved" value={counts.approved || 0} note="Known and permitted" tone="green" />
            <StatCard icon={Archive} label="Reviewed" value={(counts.reviewed || 0) + (counts.dismissed || 0)} note="Already processed" tone="blue" />
          </section>

          <section className="findings-section">
            <div className="section-heading">
              <div><h2>Findings</h2><p>Review matches and teach Brand Police which uses are legitimate.</p></div>
              <button className="secondary-button"><Filter size={15} />Filters</button>
            </div>

            <div className="findings-toolbar">
              <div className="tabs" role="tablist" aria-label="Finding status">
                {tabs.map((tab) => (
                  <button key={tab.id} className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)} role="tab" aria-selected={activeTab === tab.id}>
                    {tab.label}{tab.id !== "all" && counts[tab.id] ? <span>{counts[tab.id]}</span> : null}
                  </button>
                ))}
              </div>
              <label className="search-box">
                <Search size={16} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search findings" aria-label="Search findings" />
                {query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}
              </label>
            </div>

            <div className="findings-list">
              {loading && [1, 2, 3].map((item) => <div className="finding-skeleton" key={item}><span /><div><i /><i /><i /></div></div>)}
              {!loading && filteredFindings.map((finding) => <FindingCard key={finding.id} finding={finding} busy={busyId === finding.id} onStatusChange={updateStatus} />)}
              {!loading && filteredFindings.length === 0 && (
                <div className="empty-state"><Search size={24} /><h3>No findings here</h3><p>Try another status or clear your search.</p><button className="secondary-button" onClick={() => { setActiveTab("all"); setQuery(""); }}>View all findings</button></div>
              )}
            </div>
          </section>
        </div>
      </main>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
