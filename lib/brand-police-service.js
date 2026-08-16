const API_URL = process.env.NEXT_PUBLIC_BRAND_POLICE_API_URL?.replace(/\/$/, "");
const STORAGE_KEY = "brandy-brand-police-demo-findings-v2";

export const seedFindings = [
  { id:"BP-1048", domain:"brandfetch.com", url:"https://brandfetch.com/brandyhq.com", page:"Brandy brand assets and logo", asset:"Primary logo", match:"Exact match", issue:"Retired logo detected", severity:"high", status:"new", firstSeen:"Today, 10:42 AM", lastSeen:"12 min ago", owner:"Unassigned", confidence:98, approved:false, rule:"Use the current horizontal lockup on light backgrounds.", context:"A retired 2024 wordmark is being offered as the current downloadable logo.", tone:"violet" },
  { id:"BP-1047", domain:"saasframe.io", url:"https://saasframe.io/brand/brandy", page:"Brandy product inspiration", asset:"Symbol mark", match:"Visual match", issue:"Incorrect brand color", severity:"medium", status:"new", firstSeen:"Today, 8:16 AM", lastSeen:"2 hr ago", owner:"Akshay Kumar", confidence:91, approved:false, rule:"The symbol must use Brandy Purple #6548E8 or approved monochrome variants.", context:"The symbol is displayed in blue and does not match an approved asset variation.", tone:"blue" },
  { id:"BP-1046", domain:"seahawkmedia.com", url:"https://seahawkmedia.com/partners/brandy", page:"Brandy partner profile", asset:"Primary logo", match:"Exact match", issue:"Approved partner use", severity:"low", status:"approved", firstSeen:"Yesterday", lastSeen:"4 hr ago", owner:"Akshay Kumar", confidence:99, approved:true, rule:"Approved partners may use the current primary logo.", context:"This domain is an approved partner and the asset is current.", tone:"green" },
  { id:"BP-1045", domain:"producthunt.com", url:"https://producthunt.com/products/brandy", page:"Brandy: Build and share brand guidelines", asset:"App icon", match:"Partial match", issue:"Insufficient clear space", severity:"medium", status:"reviewing", firstSeen:"Aug 8, 2026", lastSeen:"Yesterday", owner:"Himanshi", confidence:86, approved:false, rule:"Maintain clear space equal to 25% of the icon width.", context:"Adjacent interface elements enter the minimum clear-space area.", tone:"orange" },
  { id:"BP-1044", domain:"startupstash.com", url:"https://startupstash.com/tools/brandy", page:"Brand management tools for growing teams", asset:"Wordmark", match:"Visual match", issue:"False positive", severity:"low", status:"dismissed", firstSeen:"Aug 7, 2026", lastSeen:"Aug 7", owner:"Akshay Kumar", confidence:67, approved:false, rule:"Review visual matches below 75% confidence manually.", context:"The mark belongs to another company and was dismissed as a false positive.", tone:"rose" },
  { id:"BP-1043", domain:"designmodo.com", url:"https://designmodo.com/brandy-review", page:"Tools for managing brand identity", asset:"Primary logo", match:"Exact match", issue:"Logo stretched horizontally", severity:"high", status:"resolved", firstSeen:"Aug 4, 2026", lastSeen:"Aug 9", owner:"Akshay Kumar", confidence:96, approved:false, rule:"Never alter the logo proportions.", context:"The logo was stretched by approximately 18%. The publisher replaced it on Aug 9.", tone:"amber" },
];

function delay(ms=350){ return new Promise(resolve => window.setTimeout(resolve, ms)); }
function read(){ if(typeof window==="undefined") return seedFindings; try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || seedFindings; } catch { return seedFindings; } }
function write(findings){ localStorage.setItem(STORAGE_KEY, JSON.stringify(findings)); }

export const brandPoliceService = {
  isDemo: !API_URL,
  async listFindings(){
    if(API_URL){ const response=await fetch(`${API_URL}/findings`,{credentials:"include"}); if(!response.ok) throw new Error(); return response.json(); }
    await delay(); return {findings:read()};
  },
  async updateFinding(id, patch){
    if(API_URL){ const response=await fetch(`${API_URL}/findings/${id}`,{method:"PATCH",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(patch)}); if(!response.ok) throw new Error(); return response.json(); }
    await delay(180); const findings=read().map(item=>item.id===id?{...item,...patch}:item); write(findings); return {finding:findings.find(item=>item.id===id)};
  },
  async runScan(payload){
    if(API_URL){ const response=await fetch(`${API_URL}/scans`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}); if(!response.ok) throw new Error(); return response.json(); }
    await delay(1400); return {scanId:"scan-demo-18",pages:248,newFindings:3};
  }
};
