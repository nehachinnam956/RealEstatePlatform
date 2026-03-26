// app/property/[id]/page.js
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import InquiryForm from "@/components/InquiryForm";
import EMICalculator from "@/components/EMICalculator";
import ContactModal from "@/components/ContactModal";
import PropertyImages from "@/components/PropertyImages";

const IMGS = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=90",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=90",
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=900&q=90",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=90",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=90",
];

const fmtPrice = (n) =>
  n >= 10000000 ? `₹${(n/10000000).toFixed(1)} Cr` :
  n >= 100000   ? `₹${(n/100000).toFixed(0)} L`    :
  `₹${n?.toLocaleString()}`;

const RISK_SCORES = [82,74,68,55,61,70,58,65,72,48];
const PROP_AGES   = [15, 1, 8, 0, 3, 0, 5, 4,10,12];
const getRisk = (id) => RISK_SCORES[(id-1) % RISK_SCORES.length] || 60;
const getAge  = (id) => PROP_AGES[(id-1) % PROP_AGES.length] || 5;

export async function generateMetadata({ params }) {
  const prop = await prisma.property.findUnique({ where: { id: parseInt(params.id) } });
  if (!prop) return { title: "Not Found — REALTA" };
  return { title: `${prop.title} in ${prop.location} — REALTA`, description: prop.description };
}

export default async function PropertyPage({ params }) {
  const id = parseInt(params.id);
  const prop = await prisma.property.findUnique({ where: { id } });
  if (!prop) notFound();

  const similar = await prisma.property.findMany({
    where: { id: { not: id }, status: "available" },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const mainImg = prop.imageUrl || IMGS[(id-1) % IMGS.length];
  const risk    = getRisk(id);
  const age     = getAge(id);
  const riskColor = risk >= 70 ? "#00897B" : risk >= 50 ? "#F59E0B" : "#E03A3C";
  const pricePerSqft = prop.area > 0 ? Math.round(prop.price / prop.area) : 0;

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", background: "#F5F5F5", minHeight: "100vh", color: "#1a1a1a" }}>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #ddd; }
        .sim-card { transition: all 0.2s; }
        .sim-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
      `}</style>

      <Navbar />

      {/* Breadcrumb */}
      <div style={{ background: "white", borderBottom: "1px solid #e8e8e8", padding: "10px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", fontSize: 12, color: "#999", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#999", textDecoration: "none" }}>Home</Link>
          <span>›</span>
          <Link href="/listings" style={{ color: "#999", textDecoration: "none" }}>Properties in Mumbai</Link>
          <span>›</span>
          <Link href={`/listings?search=${encodeURIComponent(prop.location)}`} style={{ color: "#999", textDecoration: "none" }}>{prop.location}</Link>
          <span>›</span>
          <span style={{ color: "#1a1a1a", fontWeight: 500 }}>{prop.title}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 40px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

        {/* LEFT */}
        <div>

          {/* Images — client component handles onError */}
          <PropertyImages mainImg={mainImg} title={prop.title} fallbackImgs={IMGS} propId={id} type={prop.type} status={prop.status} featured={prop.featured} />

          {/* Price & Title */}
          <div style={{ background: "white", borderRadius: 10, border: "1px solid #e8e8e8", padding: "20px 24px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#E03A3C", marginBottom: 4, lineHeight: 1 }}>{fmtPrice(prop.price)}</div>
                {pricePerSqft > 0 && <div style={{ fontSize: 13, color: "#999", marginBottom: 10 }}>₹{pricePerSqft.toLocaleString()} per sqft</div>}
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>{prop.title}</div>
                <div style={{ fontSize: 14, color: "#717171", display: "flex", alignItems: "center", gap: 5 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E03A3C" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {prop.location}, {prop.city}, Maharashtra
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ background: "white", border: "1.5px solid #e0e0e0", color: "#555", padding: "8px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
                <button style={{ background: "white", border: "1.5px solid #e0e0e0", color: "#555", padding: "8px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Share</button>
              </div>
            </div>
          </div>

          {/* Key Details */}
          <div style={{ background: "white", borderRadius: 10, border: "1px solid #e8e8e8", padding: "20px 24px", marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>Property Details</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {[
                ["Built-up Area", `${prop.area} sqft`],
                ["Property Type", prop.type],
                ["Transaction", prop.listing],
                ["Status", prop.status.charAt(0).toUpperCase() + prop.status.slice(1)],
                ["City", prop.city],
                ["Locality", prop.location],
              ].map(([l, v]) => (
                <div key={l} style={{ background: "#F9F9F9", borderRadius: 6, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", textTransform: "capitalize" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Score Cards */}
          <div style={{ background: "white", borderRadius: 10, border: "1px solid #e8e8e8", padding: "20px 24px", marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>Property Score</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              {[
                { l: "Risk Score",     v: `${risk}/100`,  pct: risk,                 color: riskColor },
                { l: "Property Age",   v: `${age} Years`, pct: Math.min(age*5, 100), color: "#717171" },
                { l: "Match Score",    v: "92/100",        pct: 92,                   color: "#00897B" },
              ].map(({ l, v, pct, color }) => (
                <div key={l} style={{ background: "#F9F9F9", borderRadius: 8, padding: "14px" }}>
                  <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{l}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color, marginBottom: 10 }}>{v}</div>
                  <div style={{ height: 6, background: "#E0E0E0", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ background: "white", borderRadius: 10, border: "1px solid #e8e8e8", padding: "20px 24px", marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>About This Property</div>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.85 }}>
              {prop.description || `This ${prop.type} located in ${prop.location}, ${prop.city} offers ${prop.area} sqft of prime commercial space. Strategically located with excellent connectivity and high footfall, ideal for ${prop.type === "Shop" ? "retail businesses" : "office use"}. Available for ${prop.listing.toLowerCase()} at ${fmtPrice(prop.price)}.`}
            </p>
          </div>

          {/* EMI Calculator */}
          <EMICalculator price={prop.price} />

          {/* Similar Properties */}
          {similar.length > 0 && (
            <div style={{ background: "white", borderRadius: 10, border: "1px solid #e8e8e8", padding: "20px 24px", marginTop: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>Similar Properties</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
                {similar.map((p, i) => (
                  <Link key={p.id} href={`/property/${p.id}`} style={{ textDecoration: "none" }}>
                    <div className="sim-card" style={{ border: "1px solid #e8e8e8", borderRadius: 8, overflow: "hidden", background: "white" }}>
                      <PropertyImages
                        mainImg={p.imageUrl || IMGS[i % IMGS.length]}
                        title={p.title}
                        fallbackImgs={IMGS}
                        propId={p.id}
                        type={p.type}
                        status={p.status}
                        featured={false}
                        thumbnail
                      />
                      <div style={{ padding: "10px 12px" }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#E03A3C", marginBottom: 3 }}>{fmtPrice(p.price)}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                        <div style={{ fontSize: 11, color: "#999", marginTop: 3 }}>{p.location}, {p.city}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ position: "sticky", top: 80 }}>

          {/* Agent Card */}
          <div style={{ background: "white", borderRadius: 10, border: "1px solid #e8e8e8", padding: "20px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ width: 52, height: 52, background: "#E03A3C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
                {(prop.agent || "R")[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>{prop.agent || "REALTA Agent"}</div>
                <div style={{ fontSize: 12, color: "#999" }}>{prop.type} Specialist · Mumbai</div>
                <div style={{ display: "flex", gap: 2, marginTop: 3 }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                  <span style={{ fontSize: 11, color: "#999", marginLeft: 3 }}>4.8 (23 reviews)</span>
                </div>
              </div>
            </div>
            <ContactModal agent={prop.agent || "REALTA Agent"} propTitle={prop.title} propId={prop.id} />
          </div>

          {/* Inquiry Form */}
          <div style={{ background: "white", borderRadius: 10, border: "1px solid #e8e8e8", padding: "20px", marginBottom: 14 }}>
            <InquiryForm propertyId={prop.id} />
          </div>

          {/* Property Info */}
          <div style={{ background: "white", borderRadius: 10, border: "1px solid #e8e8e8", padding: "16px 20px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Property Info</div>
            {[
              ["Property ID", `RLT-${prop.id.toString().padStart(5,"0")}`],
              ["Listed",      new Date(prop.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })],
              ["Type",        prop.type],
              ["Area",        `${prop.area} sqft`],
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "7px 0", borderBottom: "1px solid #f5f5f5" }}>
                <span style={{ color: "#999" }}>{l}</span>
                <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
