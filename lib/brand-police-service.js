const API_URL = process.env.NEXT_PUBLIC_BRAND_POLICE_API_URL?.replace(/\/$/, "");

const seedFindings = [
  {
    id: "finding-1",
    domain: "brandfetch.com",
    sourceUrl: "https://brandfetch.com/brandyhq.com",
    pageTitle: "Brandy brand assets and logo",
    matchedAsset: "Primary logo",
    matchType: "Exact match",
    status: "new",
    discoveredAt: "Today, 10:42 AM",
    source: "Brand directory",
    tone: "violet",
  },
  {
    id: "finding-2",
    domain: "saasframe.io",
    sourceUrl: "https://www.saasframe.io/brand/brandy",
    pageTitle: "Brandy product inspiration",
    matchedAsset: "Symbol mark",
    matchType: "Visual match",
    status: "new",
    discoveredAt: "Today, 8:16 AM",
    source: "Design gallery",
    tone: "blue",
  },
  {
    id: "finding-3",
    domain: "seahawkmedia.com",
    sourceUrl: "https://seahawkmedia.com/partners/brandy",
    pageTitle: "Brandy partner profile",
    matchedAsset: "Primary logo",
    matchType: "Exact match",
    status: "approved",
    discoveredAt: "Yesterday",
    source: "Partner website",
    tone: "green",
  },
  {
    id: "finding-4",
    domain: "producthunt.com",
    sourceUrl: "https://www.producthunt.com/products/brandy",
    pageTitle: "Brandy: Build and share brand guidelines",
    matchedAsset: "App icon",
    matchType: "Partial match",
    status: "reviewed",
    discoveredAt: "Aug 8, 2026",
    source: "Product directory",
    tone: "orange",
  },
  {
    id: "finding-5",
    domain: "startupstash.com",
    sourceUrl: "https://startupstash.com/tools/brandy",
    pageTitle: "Brand management tools for growing teams",
    matchedAsset: "Wordmark",
    matchType: "Visual match",
    status: "dismissed",
    discoveredAt: "Aug 7, 2026",
    source: "Software directory",
    tone: "pink",
  },
];

const STORAGE_KEY = "brandy-brand-police-demo-findings";

function delay(ms = 450) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function readDemoFindings() {
  if (typeof window === "undefined") return seedFindings;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return seedFindings;
  try {
    return JSON.parse(saved);
  } catch {
    return seedFindings;
  }
}

function writeDemoFindings(findings) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(findings));
}

export const brandPoliceService = {
  isDemo: !API_URL,

  async listFindings() {
    if (API_URL) {
      const response = await fetch(`${API_URL}/findings`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Could not load findings");
      return response.json();
    }
    await delay(350);
    return { findings: readDemoFindings() };
  },

  async updateFinding(id, status) {
    if (API_URL) {
      const response = await fetch(`${API_URL}/findings/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Could not update finding");
      return response.json();
    }
    await delay(250);
    const findings = readDemoFindings().map((finding) =>
      finding.id === id ? { ...finding, status } : finding,
    );
    writeDemoFindings(findings);
    return { finding: findings.find((finding) => finding.id === id) };
  },

  async runScan() {
    if (API_URL) {
      const response = await fetch(`${API_URL}/scans`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Could not start scan");
      return response.json();
    }
    await delay(1800);
    return { scanned: 3, newFindings: 2, completedAt: new Date().toISOString() };
  },
};
