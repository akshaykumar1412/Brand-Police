"use client";

import { useEffect, useMemo, useState } from "react";
import { brandPoliceService } from "../lib/brand-police-service";

const filters = [
  { id: "all", label: "All findings" },
  { id: "new", label: "Needs review" },
  { id: "reviewed", label: "Reviewed" },
  { id: "approved", label: "Approved" },
  { id: "dismissed", label: "Dismissed" },
];

const navigation = [
  ["bi-house", "Home"],
  ["bi-bar-chart", "Analytics"],
  ["bi-activity", "Activity"],
  ["bi-inbox", "Download Requests", "Off"],
  ["bi-people", "Team"],
  ["bi-collection", "Content"],
  ["bi-shield-check", "Brand Police", null, true],
  ["bi-gear", "Settings"],
];

function Sidebar({ open, onClose }) {
  return (
    <>
      <button className={`mobile-backdrop ${open ? "show" : ""}`} onClick={onClose} aria-label="Close navigation" />
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="brand-header">
          <span className="brand-avatar">B</span>
          <span className="brand-name">Brandy</span>
          <button className="header-icon" aria-label="Open brand page"><i className="bi bi-box-arrow-up-right" /></button>
        </div>
        <nav className="admin-nav" aria-label="Brand administration">
          {navigation.map(([icon, label, badge, active]) => (
            <button key={label} className={`admin-nav-item ${active ? "active" : ""}`} onClick={onClose}>
              <i className={`bi ${icon}`} />
              <span>{label}</span>
              {badge && <small>{badge}</small>}
            </button>
          ))}
        </nav>
        <div className="profile-bar">
          <span className="profile-avatar">AK</span>
          <span className="profile-copy"><strong>Akshay Kumar</strong><small>akshay@brandyhq.com</small></span>
          <i className="bi bi-chevron-up" />
        </div>
      </aside>
    </>
  );
}

function MetricCard({ label, value, icon, tone, loading }) {
  return (
    <div className="metric-card">
      <span className={`metric-icon ${tone}`}><i className={`bi ${icon}`} /></span>
      <span><small>{label}</small><strong>{loading ? "–" : value}</strong></span>
    </div>
  );
}

function StatusBadge({ status }) {
  const labels = { new: "Needs review", reviewed: "Reviewed", approved: "Approved", dismissed: "Dismissed" };
  return <span className={`status-badge ${status}`}>{labels[status]}</span>;
}

function FindingRow({ finding, busy, onStatusChange }) {
  return (
    <tr>
      <td>
        <div className="source-cell">
          <span className={`source-preview ${finding.tone || "blue"}`}>B</span>
          <span className="source-copy">
            <strong>{finding.pageTitle}</strong>
            <a href={finding.sourceUrl} target="_blank" rel="noreferrer">
              {finding.domain}<i className="bi bi-box-arrow-up-right" />
            </a>
          </span>
        </div>
      </td>
      <td><span className="asset-name"><i className="bi bi-image" />{finding.matchedAsset}</span></td>
      <td><span className="muted-cell">{finding.matchType}</span></td>
      <td><StatusBadge status={finding.status} /></td>
      <td><span className="muted-cell">{finding.discoveredAt}</span></td>
      <td className="actions-cell">
        <div className="row-actions">
          {finding.status !== "approved" && (
            <button disabled={busy} className="small-button" onClick={() => onStatusChange(finding.id, "approved")}>Approve</button>
          )}
          {finding.status !== "dismissed" && (
            <button disabled={busy} className="icon-only" onClick={() => onStatusChange(finding.id, "dismissed")} title="Dismiss"><i className="bi bi-x-lg" /></button>
          )}
          {(finding.status === "approved" || finding.status === "dismissed") && (
            <button disabled={busy} className="icon-only" onClick={() => onStatusChange(finding.id, "reviewed")} title="Mark reviewed"><i className="bi bi-arrow-counterclockwise" /></button>
          )}
        </div>
      </td>
    </tr>
  );
}

function Toast({ message, tone, onClose }) {
  return (
    <div className={`toast ${tone || "success"}`} role="status">
      <i className={`bi ${tone === "error" ? "bi-exclamation-circle" : "bi-check-circle"}`} />
      <span>{message}</span>
      <button onClick={onClose} aria-label="Dismiss notification"><i className="bi bi-x" /></button>
    </div>
  );
}

export default function BrandPolicePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [findings, setFindings] = useState([]);
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
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

  const filtered = useMemo(() => findings.filter((finding) => {
    const matchesStatus = status === "all" || finding.status === status;
    const searchable = `${finding.domain} ${finding.pageTitle} ${finding.matchedAsset} ${finding.matchType}`.toLowerCase();
    return matchesStatus && searchable.includes(query.trim().toLowerCase());
  }), [findings, query, status]);

  async function updateStatus(id, nextStatus) {
    const previous = findings;
    setBusyId(id);
    setFindings((current) => current.map((item) => item.id === id ? { ...item, status: nextStatus } : item));
    try {
      await brandPoliceService.updateFinding(id, nextStatus);
      const message = nextStatus === "approved" ? "Finding approved" : nextStatus === "dismissed" ? "Finding dismissed" : "Finding marked as reviewed";
      setToast({ tone: "success", message });
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

  const needsReview = counts.new || 0;
  const processed = (counts.reviewed || 0) + (counts.dismissed || 0);

  return (
    <div className="admin-app">
      <header className="mobile-header">
        <span><span className="brand-avatar">B</span><strong>Brandy</strong></span>
        <button onClick={() => setNavOpen((open) => !open)} aria-label="Toggle navigation"><i className={`bi ${navOpen ? "bi-x-lg" : "bi-list"}`} /></button>
      </header>
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

      <main className="admin-main">
        <header className="page-header">
          <h1>Brand Police</h1>
          <div className="header-actions">
            {brandPoliceService.isDemo && <span className="demo-label">Demo mode</span>}
            <button className="scan-button" onClick={runScan} disabled={scanning}>
              <i className={`bi ${scanning ? "bi-arrow-repeat spinning" : "bi-search"}`} />
              {scanning ? "Scanning..." : "Scan now"}
            </button>
          </div>
        </header>

        <div className="admin-content">
          <section className="intro-row">
            <div><h2>Brand monitoring</h2><p>Find where your brand assets appear online and review potentially unauthorized use.</p></div>
            <div className="scan-status"><span className="live-dot" /><span><small>Last scan</small><strong>Today, 10:42 AM</strong></span></div>
          </section>

          <section className="metrics-grid" aria-label="Findings summary">
            <MetricCard label="Total findings" value={findings.length} icon="bi-globe2" tone="blue" loading={loading} />
            <MetricCard label="Needs review" value={needsReview} icon="bi-exclamation-circle" tone="amber" loading={loading} />
            <MetricCard label="Approved" value={counts.approved || 0} icon="bi-check-circle" tone="green" loading={loading} />
            <MetricCard label="Processed" value={processed} icon="bi-archive" tone="gray" loading={loading} />
          </section>

          <section className="table-card">
            <div className="table-toolbar">
              <label className="search-input">
                <i className="bi bi-search" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by page, domain or asset..." />
              </label>
              <div className="filter-wrap">
                <button className="filter-button" onClick={() => setFilterOpen((open) => !open)}>
                  <i className="bi bi-filter" />Filter{status !== "all" && <span>1</span>}
                </button>
                {filterOpen && (
                  <div className="filter-menu">
                    <strong>Filters</strong>
                    <small>Status</small>
                    {filters.map((item) => (
                      <button key={item.id} onClick={() => { setStatus(item.id); setFilterOpen(false); }}>
                        <i className={`bi ${status === item.id ? "bi-record-circle-fill active" : "bi-circle"}`} />{item.label}
                      </button>
                    ))}
                    <button className="clear-filter" disabled={status === "all"} onClick={() => { setStatus("all"); setFilterOpen(false); }}>Clear filters</button>
                  </div>
                )}
              </div>
              <span className="result-count">{filtered.length} result{filtered.length === 1 ? "" : "s"}</span>
            </div>

            <div className="table-scroll">
              <table>
                <thead><tr><th>Page</th><th>Matched asset</th><th>Match type</th><th>Status</th><th>Discovered</th><th><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {loading && Array.from({ length: 4 }).map((_, index) => <tr className="loading-row" key={index}><td colSpan="6"><span /></td></tr>)}
                  {!loading && filtered.map((finding) => <FindingRow key={finding.id} finding={finding} busy={busyId === finding.id} onStatusChange={updateStatus} />)}
                  {!loading && filtered.length === 0 && (
                    <tr><td colSpan="6"><div className="empty-state"><i className="bi bi-shield-check" /><strong>No findings found</strong><span>Try another filter or clear your search.</span><button onClick={() => { setStatus("all"); setQuery(""); }}>View all findings</button></div></td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <footer className="table-footer"><span>1–{filtered.length} of {filtered.length}</span><span><button disabled><i className="bi bi-chevron-left" /></button>Page 1 of 1<button disabled><i className="bi bi-chevron-right" /></button></span></footer>
          </section>
        </div>
      </main>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
