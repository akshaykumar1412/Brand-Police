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
  FolderKanban,
  Globe2,
  HelpCircle,
  LoaderCircle,
  Menu,
  MoreHorizontal,
  RefreshCw,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  SquareSlash,
  Trash2,
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

function BrandWordmark() {
  return (
    <svg className="brandy-wordmark" viewBox="0 0 126 29" aria-label="Brandy">
      <g fill="currentColor">
        <path d="M2 9h24V2H2v7Zm-2-9h28v27H0V0Zm2 11v14h24V11H2Z" />
        <path d="M6 15v7h7v-7H6Zm-2-2h11v11H4V13Z" transform="rotate(-65 9.5 18.5)" />
        <path d="M39 23V4h9c3.5 0 6 2.1 6 5.2 0 2.2-1.6 4-4 4.3 2.8.3 4.6 2.2 4.6 4.7 0 3-2.5 5.1-6.1 5.1H39Zm2.7-10.7h5.6c2.2 0 3.7-1.4 3.7-3.3s-1.5-3.2-3.7-3.2h-5.6v6.5Zm0 8.7h6.2c2.2 0 3.7-1.4 3.7-3.3s-1.5-3.4-3.7-3.4h-6.2V21ZM57 23V9.5h2.6l-.1 3.9h.1c.5-2.5 2.2-4 4.5-4h.9v2.4h-1.2c-2.5 0-4.2 1.6-4.2 5V23H57Zm13 .3c-2.8 0-4.6-1.4-4.6-3.7 0-2.6 2.2-4.2 6.4-4.5l3-.2v-.6c0-2.1-1.2-3.3-3.2-3.3-1.8 0-3.1 1-3.3 3h-2.5c.1-3.1 2.6-5 5.8-5 3.7 0 5.8 2.1 5.8 5.5v4.7c0 1.5.2 3 .4 4h-2.6c-.2-.8-.3-1.9-.3-3.2h-.1c-.4 2-2.4 3.3-4.8 3.3Zm.9-1.7c2.3 0 4-1.7 4-4.1v-1.2l-2.7.2c-2.7.2-4.1 1.1-4.1 2.9 0 1.3 1.2 2.2 2.8 2.2ZM87.5 9c3.2 0 5.1 2.2 5.1 5.7V23H90v-8c0-2.6-1.2-4-3.4-4-2.4 0-3.7 1.8-3.7 5v7h-2.7V9.5h2.7l-.1 3.6c.5-2.5 2.2-4.1 4.7-4.1Zm19.1-5h2.6v19h-2.6v-2.3c-1.1 1.7-2.8 2.7-5 2.7-4.1 0-6.9-3-6.9-7.2 0-4.3 2.8-7.3 6.9-7.3 2.2 0 3.9 1 5 2.8V4Zm-4.5 17.3c2.8 0 4.7-2 4.7-5s-1.9-5.2-4.7-5.2-4.7 2.1-4.7 5.2 1.9 5 4.7 5Zm11.2 7.7c-.6 0-1.1 0-1.6-.2v-2.2c.4.1.8.1 1.2.1 1.5 0 2.6-.5 3.5-2.4l.6-1.4-6.1-13.4h2.8l4.7 10.5 4.4-10.5h2.7l-6.4 14.8c-1.3 3.2-3.2 4.7-5.8 4.7Z" />
      </g>
    </svg>
  );
}
const railItems = [
  { label: "Collections", icon: FolderKanban },
  { label: "Checklist", icon: CheckCircle2 },
  { label: "Brand Police", icon: ShieldCheck, active: true },
  { label: "Insights", icon: BarChart3 },
];

function RailItem({ label, icon: Icon, active, bordered, badge }) {
  return (
    <button className={`rail-item ${active ? "active" : ""} ${bordered ? "bordered" : ""}`} title={label} aria-label={label}>
      <span className="rail-icon"><Icon size={17} strokeWidth={1.8} />{badge && <i>{badge}</i>}</span>
      {!bordered && <span>{label}</span>}
    </button>
  );
}

function BrandRail({ open, onClose }) {
  return (
    <>
      {open && <button className="rail-scrim" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`brand-rail ${open ? "open" : ""}`}>
        <div className="rail-top">
          <button className="brand-switch" title="Switch brand"><span>B</span><ChevronDown size={11} /></button>
          {railItems.map((item) => <RailItem key={item.label} {...item} badge={item.active ? "7" : null} />)}
          <div className="rail-divider" />
          <RailItem label="Share brand" icon={Share2} />
          <RailItem label="Brand settings" icon={Settings} />
          <RailItem label="Trash" icon={Trash2} />
        </div>
        <div className="rail-bottom">
          <RailItem label="Preview" icon={Globe2} bordered />
          <RailItem label="Command bar" icon={SquareSlash} bordered />
          <RailItem label="AI chat" icon={Sparkles} bordered />
          <button className="rail-avatar" title="Akshay Kumar">AK</button>
        </div>
        <button className="rail-close" onClick={onClose} aria-label="Close navigation"><X size={18} /></button>
      </aside>
    </>
  );
}

function StatusPill({ status }) {
  const labels = { new: "New", reviewed: "Reviewed", approved: "Approved", dismissed: "Dismissed" };
  return <span className={`status-pill ${status}`}><span />{labels[status]}</span>;
}

function SummaryItem({ label, value, icon: Icon, tone }) {
  return (
    <div className="summary-item">
      <span className={`summary-icon ${tone}`}><Icon size={16} /></span>
      <span><small>{label}</small><strong>{value}</strong></span>
    </div>
  );
}

function FindingCard({ finding, busy, onStatusChange }) {
  return (
    <article className="finding-card">
      <div className={`finding-thumb ${finding.tone}`}>
        <span className="asset-mark">B</span>
        <small>{finding.domain.split(".")[0]}</small>
      </div>
      <div className="finding-body">
        <div className="finding-heading">
          <div>
            <div className="domain-line"><Globe2 size={13} />{finding.domain}<StatusPill status={finding.status} /></div>
            <h3>{finding.pageTitle}</h3>
          </div>
          <a href={finding.sourceUrl} target="_blank" rel="noreferrer" className="icon-button" aria-label={`Open ${finding.domain}`}><ExternalLink size={15} /></a>
        </div>
        <div className="finding-details">
          <span><FileImage size={13} />{finding.matchedAsset}</span>
          <span><Fingerprint size={13} />{finding.matchType}</span>
          <span><Activity size={13} />{finding.discoveredAt}</span>
        </div>
        <div className="finding-footer">
          <span>Found via {finding.source}</span>
          <div className="finding-actions">
            {finding.status !== "approved" && <button disabled={busy} className="button outline" onClick={() => onStatusChange(finding.id, "approved")}><Check size={14} />Approve</button>}
            {finding.status !== "dismissed" && <button disabled={busy} className="button ghost" onClick={() => onStatusChange(finding.id, "dismissed")}><X size={14} />Dismiss</button>}
            {(finding.status === "approved" || finding.status === "dismissed") && <button disabled={busy} className="button ghost" onClick={() => onStatusChange(finding.id, "reviewed")}>Mark reviewed</button>}
          </div>
        </div>
      </div>
    </article>
  );
}

function Toast({ message, tone = "success", onClose }) {
  return (
    <div className={`toast ${tone}`} role="status">
      {tone === "success" ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
      <span>{message}</span>
      <button onClick={onClose} aria-label="Dismiss notification"><X size={14} /></button>
    </div>
  );
}

export default function BrandPolicePage() {
  const [railOpen, setRailOpen] = useState(false);
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
      <div className="accent-glow" />
      <BrandRail open={railOpen} onClose={() => setRailOpen(false)} />
      <main className="workspace">
        <header className="mobile-header">
          <button className="icon-button" onClick={() => setRailOpen(true)} aria-label="Open navigation"><Menu size={19} /></button>
          <BrandWordmark />
          <button className="rail-avatar">AK</button>
        </header>

        <header className="workspace-header">
          <div className="workspace-brand"><BrandWordmark /><span>Brand Police</span></div>
          <div className="header-actions">
            {brandPoliceService.isDemo && <span className="demo-pill"><Sparkles size={12} />Demo mode</span>}
            <button className="icon-button" title="Help"><HelpCircle size={17} /></button>
            <button className="icon-button notification" title="Notifications"><Bell size={17} /><i /></button>
            <button className="icon-button" title="More options"><MoreHorizontal size={18} /></button>
          </div>
        </header>

        <div className="page-wrap">
          <section className="page-heading">
            <div>
              <div className="eyebrow"><ShieldCheck size={14} />Brand governance</div>
              <h1>Brand Police</h1>
              <p>Find where your brand assets appear online and review potentially unauthorized use.</p>
            </div>
            <button className="button primary" onClick={runScan} disabled={scanning}>
              {scanning ? <LoaderCircle className="spin" size={15} /> : <RefreshCw size={15} />}
              {scanning ? "Scanning" : "Scan now"}
            </button>
          </section>

          <section className="monitor-panel">
            <div className="monitor-status"><span className="monitor-icon"><ShieldCheck size={18} /></span><span><strong>Monitoring is active</strong><small>4 assets checked across indexed public web pages</small></span></div>
            <div className="scan-meta"><span><small>Last scan</small><strong>Today, 10:42 AM</strong></span><span><small>Next scan</small><strong>Monday, 9:00 AM</strong></span></div>
          </section>

          <section className="summary-row" aria-label="Finding summary">
            <SummaryItem icon={Globe2} label="Total findings" value={findings.length || 5} tone="blue" />
            <SummaryItem icon={AlertCircle} label="Needs review" value={counts.new || 0} tone="red" />
            <SummaryItem icon={CheckCircle2} label="Approved" value={counts.approved || 0} tone="green" />
            <SummaryItem icon={Archive} label="Processed" value={(counts.reviewed || 0) + (counts.dismissed || 0)} tone="gray" />
          </section>

          <section className="findings-panel">
            <div className="panel-header">
              <div><h2>Findings</h2><span>{findings.length} matches</span></div>
              <div className="panel-actions">
                <button className="button outline"><Filter size={14} />Filter</button>
                <label className="search-box"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search findings" aria-label="Search findings" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={13} /></button>}</label>
              </div>
            </div>

            <div className="tabs" role="tablist" aria-label="Finding status">
              {tabs.map((tab) => <button key={tab.id} className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)} role="tab" aria-selected={activeTab === tab.id}>{tab.label}{tab.id !== "all" && counts[tab.id] ? <span>{counts[tab.id]}</span> : null}</button>)}
            </div>

            <div className="findings-list">
              {loading && [1, 2, 3].map((item) => <div className="finding-skeleton" key={item}><span /><div><i /><i /><i /></div></div>)}
              {!loading && filteredFindings.map((finding) => <FindingCard key={finding.id} finding={finding} busy={busyId === finding.id} onStatusChange={updateStatus} />)}
              {!loading && filteredFindings.length === 0 && <div className="empty-state"><Search size={22} /><h3>No findings here</h3><p>Try another status or clear your search.</p><button className="button outline" onClick={() => { setActiveTab("all"); setQuery(""); }}>View all findings</button></div>}
            </div>
          </section>
        </div>
      </main>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
