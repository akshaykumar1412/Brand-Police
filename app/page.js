"use client";

import { useEffect, useMemo, useState } from "react";
import { brandPoliceService } from "../lib/brand-police-service";

const productNav = [
  ["bi-grid", "Overview", "overview"],
  ["bi-search", "Findings", "findings", 3],
  ["bi-radar", "New scan", "scan"],
  ["bi-globe2", "Domains & rules", "domains"],
];

const domainsSeed = [
  { domain:"brandyhq.com", type:"Owned", status:"Monitoring", frequency:"Daily", findings:0 },
  { domain:"seahawkmedia.com", type:"Approved partner", status:"Monitoring", frequency:"Weekly", findings:1 },
  { domain:"brandfetch.com", type:"Unknown", status:"Monitoring", frequency:"Weekly", findings:1 },
  { domain:"saasframe.io", type:"Unknown", status:"Monitoring", frequency:"Weekly", findings:1 },
];

const rulesSeed = [
  { id:1, title:"Current logo only", description:"Flag retired or unapproved logo versions", category:"Logo", severity:"High", enabled:true },
  { id:2, title:"Protect logo proportions", description:"Detect stretched, compressed, or rotated logos", category:"Logo", severity:"High", enabled:true },
  { id:3, title:"Approved brand colors", description:"Flag recolored marks outside approved variants", category:"Color", severity:"Medium", enabled:true },
  { id:4, title:"Minimum clear space", description:"Check spacing around the primary logo", category:"Layout", severity:"Medium", enabled:true },
  { id:5, title:"Minimum asset resolution", description:"Flag blurry assets below 240 px wide", category:"Quality", severity:"Low", enabled:false },
];

function Logo(){ return <span className="brandy-logo"><span>b</span></span>; }

function ShellNav({ active, onNavigate, mobileOpen, setMobileOpen }){
  return <>
    <button className={`backdrop ${mobileOpen?"show":""}`} onClick={()=>setMobileOpen(false)} aria-label="Close navigation" />
    <aside className={`shell-nav ${mobileOpen?"open":""}`}>
      <div className="brand-bar"><Logo/><strong>Brandy</strong><button aria-label="Open Brand Space"><i className="bi bi-box-arrow-up-right"/></button></div>
      <nav className="main-nav" aria-label="Brandy admin navigation">
        <button><i className="bi bi-house"/><span>Home</span></button>
        <button><i className="bi bi-bar-chart"/><span>Analytics</span></button>
        <button><i className="bi bi-activity"/><span>Activity</span></button>
        <button><i className="bi bi-inbox"/><span>Download Requests</span></button>
        <button><i className="bi bi-people"/><span>Team</span></button>
        <button><i className="bi bi-collection"/><span>Content</span></button>
        <button className="active"><i className="bi bi-shield-check"/><span>Brand Police</span><b>3</b></button>
        <button><i className="bi bi-gear"/><span>Settings</span></button>
      </nav>
      <div className="user-bar"><span>AK</span><span><strong>Akshay Kumar</strong><small>akshay@brandyhq.com</small></span><i className="bi bi-chevron-up"/></div>
    </aside>
  </>;
}

function PageHeader({ active, onNavigate, onScan, mobileOpen, setMobileOpen }){
  return <>
    <header className="page-header">
      <button className="mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)}><i className="bi bi-list"/></button>
      <h2>Brand Police</h2>
      <div className="header-actions"><span className="demo-chip">Demo mode</span>{active!=="scan"&&<button className="primary" onClick={onScan}><i className="bi bi-radar"/>New scan</button>}</div>
    </header>
    <nav className="product-tabs" aria-label="Brand Police sections">
      {productNav.map(([icon,label,id,count])=><button key={id} className={active===id?"active":""} onClick={()=>onNavigate(id)}><i className={`bi ${icon}`}/><span>{label}</span>{count?<b>{count}</b>:null}</button>)}
    </nav>
  </>;
}

function Metric({label,value,change,icon,tone,onClick}){ return <button className="metric" onClick={onClick}><span className={`metric-icon ${tone}`}><i className={`bi ${icon}`}/></span><small>{label}</small><span className="metric-value"><strong>{value}</strong>{change&&<em>{change}</em>}</span></button>; }
function Badge({children,tone="gray"}){ return <span className={`badge ${tone}`}>{children}</span>; }
function Status({status}){ const map={new:["Needs review","amber"],reviewing:["Reviewing","blue"],approved:["Approved","green"],dismissed:["Dismissed","gray"],resolved:["Resolved","purple"]}; const [label,tone]=map[status]||[status,"gray"]; return <Badge tone={tone}>{label}</Badge>; }
function Severity({value}){ return <span className={`severity ${value}`}><i/>{value}</span>; }

function EmptyChart(){ return <div className="trend-chart" aria-label="Compliance trend over seven days">
  <div className="chart-labels"><span>100</span><span>75</span><span>50</span><span>25</span></div>
  <div className="chart-grid"><i/><i/><i/><i/><svg viewBox="0 0 700 150" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#525252" stopOpacity=".16"/><stop offset="1" stopColor="#525252" stopOpacity="0"/></linearGradient></defs><path d="M0,118 C75,112 92,92 155,99 S250,86 310,76 S410,83 470,54 S580,61 700,26 L700,150 L0,150 Z" fill="url(#fill)"/><path d="M0,118 C75,112 92,92 155,99 S250,86 310,76 S410,83 470,54 S580,61 700,26" fill="none" stroke="#525252" strokeWidth="3"/></svg></div>
  <div className="chart-days"><span>Aug 5</span><span>Aug 6</span><span>Aug 7</span><span>Aug 8</span><span>Aug 9</span><span>Aug 10</span><span>Today</span></div>
  </div>;
}

function Overview({findings,onNavigate,onOpen}){
  const urgent=findings.filter(x=>x.status==="new").slice(0,3);
  return <div className="page-content">
    <div className="title-row"><div><h1>Brand health at a glance</h1><p>Monitor external brand usage, prioritise violations, and track resolution.</p></div><div className="scan-meta"><span className="live-dot"/><span><small>Monitoring active</small><strong>4 domains · Last scan 12 min ago</strong></span></div></div>
    <section className="metrics-grid">
      <Metric label="Compliance score" value="84%" change="↑ 6% this month" icon="bi-shield-check" tone="purple"/>
      <Metric label="Needs review" value={findings.filter(x=>x.status==="new").length} change="3 new today" icon="bi-exclamation-triangle" tone="amber" onClick={()=>onNavigate("findings")}/>
      <Metric label="Active violations" value="4" change="2 high severity" icon="bi-flag" tone="red"/>
      <Metric label="Resolved this month" value="18" change="Avg. 2.4 days" icon="bi-check2-circle" tone="green"/>
    </section>
    <div className="overview-grid">
      <section className="panel trend-panel"><div className="panel-heading"><div><h2>Compliance trend</h2><p>Score across monitored domains</p></div><select aria-label="Trend range"><option>Last 7 days</option><option>Last 30 days</option></select></div><EmptyChart/></section>
      <section className="panel activity-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Latest Brand Police events</p></div></div><div className="activity-list">
        <div><span className="activity-icon red"><i className="bi bi-flag"/></span><p><strong>High severity finding detected</strong><small>brandfetch.com · 12 min ago</small></p></div>
        <div><span className="activity-icon green"><i className="bi bi-check2"/></span><p><strong>Violation marked resolved</strong><small>designmodo.com · Yesterday</small></p></div>
        <div><span className="activity-icon blue"><i className="bi bi-person"/></span><p><strong>Finding assigned to Himanshi</strong><small>producthunt.com · Yesterday</small></p></div>
        <div><span className="activity-icon gray"><i className="bi bi-radar"/></span><p><strong>Scheduled scan completed</strong><small>248 pages checked · Aug 9</small></p></div>
      </div></section>
    </div>
    <section className="panel urgent-panel"><div className="panel-heading"><div><h2>Priority findings</h2><p>Items that need attention first</p></div><button className="text-button" onClick={()=>onNavigate("findings")}>View all <i className="bi bi-arrow-right"/></button></div><div className="compact-table"><table><thead><tr><th>Finding</th><th>Issue</th><th>Severity</th><th>Owner</th><th>Last seen</th><th/></tr></thead><tbody>{urgent.map(f=><tr key={f.id} onClick={()=>onOpen(f)}><td><SourceCell finding={f}/></td><td>{f.issue}</td><td><Severity value={f.severity}/></td><td>{f.owner}</td><td className="muted">{f.lastSeen}</td><td><i className="bi bi-chevron-right muted"/></td></tr>)}</tbody></table></div></section>
  </div>;
}

function SourceCell({finding}){ return <div className="source-cell"><span className={`source-thumb ${finding.tone}`}>b</span><span><strong>{finding.page}</strong><small>{finding.domain} · {finding.id}</small></span></div>; }

function Findings({findings,onOpen,onUpdate}){
  const [query,setQuery]=useState(""); const [status,setStatus]=useState("all"); const [severity,setSeverity]=useState("all");
  const filtered=useMemo(()=>findings.filter(f=>(status==="all"||f.status===status)&&(severity==="all"||f.severity===severity)&&`${f.page} ${f.domain} ${f.asset} ${f.issue}`.toLowerCase().includes(query.toLowerCase())),[findings,query,status,severity]);
  return <div className="page-content">
    <div className="title-row"><div><h1>Findings</h1><p>Review detected brand usage and move each finding to resolution.</p></div><button className="secondary"><i className="bi bi-download"/>Export</button></div>
    <section className="panel findings-panel"><div className="toolbar"><label className="search"><i className="bi bi-search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search findings, domains or assets"/></label><select value={status} onChange={e=>setStatus(e.target.value)}><option value="all">All statuses</option><option value="new">Needs review</option><option value="reviewing">Reviewing</option><option value="approved">Approved</option><option value="resolved">Resolved</option><option value="dismissed">Dismissed</option></select><select value={severity} onChange={e=>setSeverity(e.target.value)}><option value="all">All severity</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select><span className="result-count">{filtered.length} findings</span></div>
      <div className="table-scroll"><table className="findings-table"><thead><tr><th>Finding</th><th>Issue</th><th>Severity</th><th>Status</th><th>Owner</th><th>Last seen</th><th/></tr></thead><tbody>{filtered.map(f=><tr key={f.id} onClick={()=>onOpen(f)}><td><SourceCell finding={f}/></td><td><span className="issue-cell"><strong>{f.issue}</strong><small>{f.asset} · {f.match}</small></span></td><td><Severity value={f.severity}/></td><td><Status status={f.status}/></td><td>{f.owner}</td><td className="muted">{f.lastSeen}</td><td><button className="row-menu" onClick={e=>{e.stopPropagation();onUpdate(f.id,{status:"reviewing"});}} title="Start review"><i className="bi bi-three-dots"/></button></td></tr>)}</tbody></table></div>
      {filtered.length===0&&<div className="empty"><i className="bi bi-search"/><strong>No findings match these filters</strong><button onClick={()=>{setQuery("");setStatus("all");setSeverity("all");}}>Clear filters</button></div>}
      <footer className="table-footer"><span>Showing {filtered.length} of {findings.length}</span><span><button disabled><i className="bi bi-chevron-left"/></button>Page 1 of 1<button disabled><i className="bi bi-chevron-right"/></button></span></footer>
    </section>
  </div>;
}

function FindingDrawer({finding,onClose,onUpdate}){
  const [comment,setComment]=useState(""); const [notes,setNotes]=useState([]);
  if(!finding) return null;
  const act=(status)=>onUpdate(finding.id,{status});
  return <div className="drawer-layer"><button className="drawer-backdrop" onClick={onClose} aria-label="Close finding"/><aside className="drawer">
    <header><div><small>{finding.id}</small><h2>{finding.issue}</h2></div><button onClick={onClose}><i className="bi bi-x-lg"/></button></header>
    <div className="drawer-body"><div className="evidence"><div className={`mock-page ${finding.tone}`}><div className="browser-bar"><i/><i/><i/><span>{finding.domain}</span></div><div className="mock-content"><span>BRAND</span><strong>b Brandy</strong><div className="detection-box"><b>Detected asset</b></div></div></div><div className="evidence-meta"><span><i className="bi bi-camera"/>Captured {finding.lastSeen}</span><a href={finding.url} target="_blank" rel="noreferrer">Open source <i className="bi bi-box-arrow-up-right"/></a></div></div>
      <section className="detail-section"><div className="detail-head"><h3>Assessment</h3><Severity value={finding.severity}/></div><p>{finding.context}</p><div className="confidence"><span><strong>{finding.confidence}%</strong> match confidence</span><div><i style={{width:`${finding.confidence}%`}}/></div></div></section>
      <section className="rule-callout"><i className="bi bi-journal-check"/><div><small>RELATED BRAND RULE</small><strong>{finding.rule}</strong></div></section>
      <section className="detail-section"><h3>Finding details</h3><dl><div><dt>Status</dt><dd><Status status={finding.status}/></dd></div><div><dt>Matched asset</dt><dd>{finding.asset}</dd></div><div><dt>First seen</dt><dd>{finding.firstSeen}</dd></div><div><dt>Owner</dt><dd><select value={finding.owner} onChange={e=>onUpdate(finding.id,{owner:e.target.value})}><option>Unassigned</option><option>Akshay Kumar</option><option>Himanshi</option></select></dd></div></dl></section>
      <section className="detail-section"><h3>Activity</h3><div className="notes">{notes.map((n,i)=><div key={i}><span>AK</span><p><strong>Akshay Kumar</strong><small>Just now</small>{n}</p></div>)}<div><span className="system-avatar"><i className="bi bi-shield-check"/></span><p><strong>Brand Police</strong><small>{finding.firstSeen}</small>Finding created from scheduled scan.</p></div></div><div className="comment-box"><input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add a comment..."/><button disabled={!comment.trim()} onClick={()=>{setNotes([...notes,comment]);setComment("");}}><i className="bi bi-send"/></button></div></section>
    </div>
    <footer><button className="secondary" onClick={()=>act("dismissed")}>Dismiss</button><button className="secondary" onClick={()=>act("approved")}>Approve use</button><button className="primary" onClick={()=>act(finding.status==="resolved"?"reviewing":"resolved")}><i className="bi bi-check2-circle"/>{finding.status==="resolved"?"Reopen":"Mark resolved"}</button></footer>
  </aside></div>;
}

function NewScan({onRun}){
  const [target,setTarget]=useState("domain"); const [url,setUrl]=useState("https://"); const [assets,setAssets]=useState(["Primary logo","Symbol mark"]); const [running,setRunning]=useState(false); const [done,setDone]=useState(null);
  const assetOptions=["Primary logo","Symbol mark","Wordmark","App icon","Retired 2024 logo"];
  const toggle=a=>setAssets(x=>x.includes(a)?x.filter(v=>v!==a):[...x,a]);
  const submit=async()=>{setRunning(true);const result=await onRun({target,url,assets});setDone(result);setRunning(false);};
  if(done) return <div className="page-content narrow"><section className="success-state"><span><i className="bi bi-check2"/></span><h1>Scan queued successfully</h1><p>Brand Police will check {done.pages} pages against {assets.length} selected assets. New findings will appear as they are processed.</p><div><strong>{done.newFindings}</strong><small>potential matches in demo result</small></div><button className="primary" onClick={()=>setDone(null)}>Start another scan</button></section></div>;
  return <div className="page-content narrow"><div className="title-row"><div><h1>Start a new scan</h1><p>Choose where to scan and which Brand Space assets to monitor.</p></div></div><section className="panel form-panel">
    <div className="form-section"><span className="step">1</span><div><h2>What should Brand Police scan?</h2><p>Scan a full domain, its sitemap, or one exact page.</p><div className="choice-grid">{[["domain","bi-globe2","Full domain","Crawl public pages on one domain"],["sitemap","bi-diagram-3","Sitemap","Use a supplied XML sitemap"],["url","bi-file-earmark","Single URL","Check one exact webpage"]].map(([id,icon,title,desc])=><button key={id} className={target===id?"selected":""} onClick={()=>setTarget(id)}><i className={`bi ${icon}`}/><strong>{title}</strong><small>{desc}</small><span><i className={`bi ${target===id?"bi-record-circle-fill":"bi-circle"}`}/></span></button>)}</div><label className="field"><span>{target==="domain"?"Domain URL":target==="sitemap"?"Sitemap URL":"Page URL"}</span><input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com"/><small>Only publicly accessible pages can be scanned.</small></label></div></div>
    <div className="form-section"><span className="step">2</span><div><h2>Select Brand Space assets</h2><p>Choose the approved and retired assets Brand Police should look for.</p><div className="asset-picker">{assetOptions.map((a,i)=><button key={a} className={assets.includes(a)?"selected":""} onClick={()=>toggle(a)}><span className={`asset-preview a${i}`}>b</span><span><strong>{a}</strong><small>{i===4?"Retired asset":"Approved asset"}</small></span><i className={`bi ${assets.includes(a)?"bi-check-circle-fill":"bi-circle"}`}/></button>)}</div></div></div>
    <div className="form-section"><span className="step">3</span><div><h2>Scan options</h2><div className="option-row"><span><strong>Only report new or changed findings</strong><small>Hide unchanged matches from previous scans</small></span><input type="checkbox" defaultChecked/></div><div className="option-row"><span><strong>Capture evidence screenshots</strong><small>Save a timestamped screenshot with every finding</small></span><input type="checkbox" defaultChecked/></div></div></div>
    <footer className="form-footer"><span><i className="bi bi-info-circle"/>Demo mode uses a simulated scan</span><button className="primary" disabled={running||assets.length===0||url.length<9} onClick={submit}><i className={`bi ${running?"bi-arrow-repeat spinning":"bi-radar"}`}/>{running?"Starting scan...":"Start scan"}</button></footer>
  </section></div>;
}

function DomainsRules(){
  const [tab,setTab]=useState("domains"); const [domains,setDomains]=useState(domainsSeed); const [rules,setRules]=useState(rulesSeed); const [adding,setAdding]=useState(false); const [newDomain,setNewDomain]=useState("");
  return <div className="page-content"><div className="title-row"><div><h1>Domains & rules</h1><p>Define where your brand is allowed and how violations should be evaluated.</p></div><button className="primary" onClick={()=>setAdding(true)}><i className="bi bi-plus-lg"/>{tab==="domains"?"Add domain":"Create rule"}</button></div>
    <div className="section-tabs"><button className={tab==="domains"?"active":""} onClick={()=>setTab("domains")}>Monitored domains <b>{domains.length}</b></button><button className={tab==="rules"?"active":""} onClick={()=>setTab("rules")}>Compliance rules <b>{rules.length}</b></button></div>
    {tab==="domains"?<section className="panel domains-panel"><div className="panel-heading"><div><h2>Monitored domains</h2><p>Classify domains so known use is separated from suspicious use.</p></div></div><div className="table-scroll"><table><thead><tr><th>Domain</th><th>Classification</th><th>Status</th><th>Scan frequency</th><th>Open findings</th><th/></tr></thead><tbody>{domains.map((d,i)=><tr key={d.domain}><td><span className="domain-cell"><i className="bi bi-globe2"/><strong>{d.domain}</strong></span></td><td><Badge tone={d.type==="Owned"?"purple":d.type==="Approved partner"?"green":"amber"}>{d.type}</Badge></td><td><span className="monitoring"><i/> {d.status}</span></td><td>{d.frequency}</td><td>{d.findings}</td><td><button className="row-menu"><i className="bi bi-three-dots"/></button></td></tr>)}</tbody></table></div></section>:
    <section className="rules-list">{rules.map(r=><article className="panel rule-card" key={r.id}><span className={`rule-icon ${r.category.toLowerCase()}`}><i className="bi bi-shield-check"/></span><span><strong>{r.title}</strong><small>{r.description}</small><em>{r.category} · {r.severity} severity</em></span><label className="switch"><input type="checkbox" checked={r.enabled} onChange={()=>setRules(x=>x.map(v=>v.id===r.id?{...v,enabled:!v.enabled}:v))}/><i/></label><button className="row-menu"><i className="bi bi-three-dots"/></button></article>)}</section>}
    {adding&&<div className="modal-layer"><button className="modal-backdrop" onClick={()=>setAdding(false)}/><div className="modal"><header><h2>{tab==="domains"?"Add monitored domain":"Create compliance rule"}</h2><button onClick={()=>setAdding(false)}><i className="bi bi-x-lg"/></button></header><div className="modal-body">{tab==="domains"?<><label className="field"><span>Domain</span><input value={newDomain} onChange={e=>setNewDomain(e.target.value)} placeholder="example.com"/></label><label className="field"><span>Classification</span><select><option>Owned</option><option>Approved partner</option><option>Unknown</option></select></label></>:<><label className="field"><span>Rule name</span><input placeholder="e.g. Approved logo colors"/></label><label className="field"><span>What should Brand Police detect?</span><textarea placeholder="Describe the allowed and prohibited use..."/></label></>}</div><footer><button className="secondary" onClick={()=>setAdding(false)}>Cancel</button><button className="primary" onClick={()=>{if(tab==="domains"&&newDomain.trim())setDomains([...domains,{domain:newDomain.trim(),type:"Unknown",status:"Monitoring",frequency:"Weekly",findings:0}]);setAdding(false);setNewDomain("");}}>Save</button></footer></div></div>}
  </div>;
}

function Toast({toast,onClose}){ if(!toast)return null; return <div className={`toast ${toast.tone||"success"}`}><i className={`bi ${toast.tone==="error"?"bi-exclamation-circle":"bi-check-circle"}`}/><span>{toast.message}</span><button onClick={onClose}><i className="bi bi-x"/></button></div>; }

export default function BrandPolicePage(){
  const [active,setActive]=useState("overview"); const [mobileOpen,setMobileOpen]=useState(false); const [findings,setFindings]=useState([]); const [loading,setLoading]=useState(true); const [selectedId,setSelectedId]=useState(null); const [toast,setToast]=useState(null);
  useEffect(()=>{brandPoliceService.listFindings().then(r=>setFindings(r.findings)).catch(()=>setToast({tone:"error",message:"Findings could not be loaded."})).finally(()=>setLoading(false));},[]);
  const selected=findings.find(f=>f.id===selectedId);
  const update=async(id,patch)=>{const before=findings;setFindings(x=>x.map(f=>f.id===id?{...f,...patch}:f));try{await brandPoliceService.updateFinding(id,patch);setToast({message:"Finding updated."});}catch{setFindings(before);setToast({tone:"error",message:"That update could not be saved."});}};
  const run=async payload=>{try{return await brandPoliceService.runScan(payload);}catch{setToast({tone:"error",message:"The scan could not be started."});throw new Error();}};
  const navigate=id=>{setActive(id);window.scrollTo({top:0,behavior:"smooth"});};
  return <div className="app-shell"><ShellNav active={active} onNavigate={navigate} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/><main className="workspace"><PageHeader active={active} onNavigate={navigate} onScan={()=>navigate("scan")} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>{loading?<div className="loading-screen"><i className="bi bi-arrow-repeat spinning"/><span>Loading Brand Police</span></div>:<>{active==="overview"&&<Overview findings={findings} onNavigate={navigate} onOpen={f=>setSelectedId(f.id)}/>} {active==="findings"&&<Findings findings={findings} onOpen={f=>setSelectedId(f.id)} onUpdate={update}/>} {active==="scan"&&<NewScan onRun={run}/>} {active==="domains"&&<DomainsRules/>}</>} </main><FindingDrawer finding={selected} onClose={()=>setSelectedId(null)} onUpdate={update}/><Toast toast={toast} onClose={()=>setToast(null)}/></div>;
}
