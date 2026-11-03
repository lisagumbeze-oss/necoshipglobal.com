export type BlogCategory = "Shipping Tips" | "Customs Guides" | "Industry News" | "Company Updates";

export type BlogPost = {
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  readMinutes: number;
  author: { name: string; role: string };
  publishedAt: string;
  headings: string[];
  body: string[];
  relatedSlugs: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "hs-codes-made-simple",
    title: "HS Codes Made Simple for Cross-Border Shipping",
    category: "Customs Guides",
    excerpt: "A practical framework for classifying goods and avoiding clearance delays.",
    readMinutes: 6,
    author: { name: "Elena Voss", role: "Customs Strategy Lead" },
    publishedAt: "2026-04-18",
    headings: ["Why HS codes matter", "Common pitfalls", "Checklist before you ship"],
    body: [
      "Harmonized System (HS) codes determine duties, restrictions, and documentation requirements. A mismatch between the commercial invoice and the physical goods is one of the fastest ways to trigger a customs hold.",
      "Start with the finished product, not the component list. Focus on function and material composition at import — customs authorities classify based on what arrives at the border.",
      "Before you ship: confirm HS code with your broker for the destination country, align packing list descriptions with the invoice, and attach supporting technical sheets for electronics and blended materials."
    ],
    relatedSlugs: ["pack-like-a-pro", "ddp-vs-dap"]
  },
  {
    slug: "pack-like-a-pro",
    title: "Pack Like a Pro: Reduce Damage Claims by 40%",
    category: "Shipping Tips",
    excerpt: "Cushioning, bracing, and labeling patterns that survive international sort facilities.",
    readMinutes: 5,
    author: { name: "Marcus Reed", role: "Operations Director" },
    publishedAt: "2026-04-10",
    headings: ["Think in G-forces", "Labeling that survives scans", "Insurance alignment"],
    body: [
      "International hubs sort at speed. Double-box high-value electronics, use edge protectors on frames, and avoid loose fill that migrates during vibration.",
      "Place labels on the largest face and add a duplicate inside the box. Barcodes should have quiet zones and avoid seam tape.",
      "Declared value, packaging quality, and commodity description should tell one consistent story to carriers and underwriters."
    ],
    relatedSlugs: ["hs-codes-made-simple", "peak-season-playbook"]
  },
  {
    slug: "peak-season-playbook",
    title: "Peak Season Playbook: Capacity Without Surprises",
    category: "Industry News",
    excerpt: "How leading shippers secure lane capacity and protect SLAs when demand spikes.",
    readMinutes: 7,
    author: { name: "Priya Nair", role: "Network Planning" },
    publishedAt: "2026-03-28",
    headings: ["Forecast early", "Diversify modes", "Exception workflows"],
    body: [
      "Share a rolling 8-week forecast with your freight partner. Even directional accuracy helps secure allocations on priority lanes.",
      "Blend air and ocean for non-critical SKUs while protecting hero products with express uplift.",
      "Define escalation paths for address issues, customs holds, and weather delays before the surge hits."
    ],
    relatedSlugs: ["pack-like-a-pro", "product-update-apr-2026"]
  },
  {
    slug: "ddp-vs-dap",
    title: "DDP vs DAP: Choosing the Right Incoterm",
    category: "Customs Guides",
    excerpt: "A decision matrix for controlling landed cost and buyer experience.",
    readMinutes: 8,
    author: { name: "Elena Voss", role: "Customs Strategy Lead" },
    publishedAt: "2026-03-12",
    headings: ["Who pays duties?", "When DDP wins", "When DAP wins"],
    body: [
      "Incoterms allocate cost and risk between buyer and seller. DDP places maximum obligation on the seller, including import clearance and duties.",
      "DDP shines for e-commerce brands that want a predictable, all-in buyer experience and already have a broker network in the destination country.",
      "DAP can be preferable when the buyer has favorable importer-of-record status or when duties are volatile and should remain with the buyer."
    ],
    relatedSlugs: ["hs-codes-made-simple", "product-update-apr-2026"]
  },
  {
    slug: "product-update-apr-2026",
    title: "Product Update: Smarter Exceptions and SLA Timers",
    category: "Company Updates",
    excerpt: "What changed in the NecoShip control tower for operations teams and shippers.",
    readMinutes: 4,
    author: { name: "Jordan Lee", role: "Product" },
    publishedAt: "2026-04-02",
    headings: ["Exceptions queue", "Customer notifications", "What’s next"],
    body: [
      "Operations teams now see SLA timers from first exception scan, with suggested owners based on region and carrier.",
      "Shippers receive a single digest for multi-piece holds, reducing alert fatigue while preserving urgency for customs actions.",
      "Next up: deeper carrier health panels and webhook replay controls for enterprise API users."
    ],
    relatedSlugs: ["peak-season-playbook", "ddp-vs-dap"]
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slugs: string[]): BlogPost[] {
  return slugs.map((s) => getPostBySlug(s)).filter(Boolean) as BlogPost[];
}
