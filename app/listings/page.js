"use client";
// app/listings/page.js
import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { fmtPrice, getImg, getRisk, getAge } from "@/lib/constants";

// ── Leaflet Map ───────────────────────────────────────────────────────────
function MapView({ properties }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const MUMBAI_COORDS = {
    "Dahisar East":   [19.2515, 72.8681],
    "Lower Parel":    [18.9978, 72.8282],
    "Dahisar West":   [19.2558, 72.8530],
    "Andheri West":   [19.1364, 72.8296],
    "Ghatkopar West": [19.0913, 72.9050],
    "Borivali East":  [19.2264, 72.8650],
    "Borivali West":  [19.2332, 72.8416],
    "Malad East":     [19.1824, 72.8641],
  };

  useEffect(() => {
    if (!document.querySelector("#leaflet-css")) {
      const l = document.createElement("link");
      l.id = "leaflet-css"; l.rel = "stylesheet";
      l.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(l);
    }

    const init = async () => {
      if (!window.L) {
        await new Promise(resolve => {
          const s = document.createElement("script");
          s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          s.onload = resolve;
          document.head.appendChild(s);
        });
      }
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
      if (!mapRef.current) return;

      const L = window.L;
      const map = L.map(mapRef.current, { zoomControl: false }).setView([19.15, 72.87], 11);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap © CARTO", subdomains: "abcd", maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      mapInstanceRef.current = map;
      addMarkers(properties, map);
    };

    init();
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, []);

  const addMarkers = (props, map) => {
    if (!window.L || !map) return;
    const L = window.L;
    markersRef.current.forEach(m => { try { m.remove(); } catch(e) {} });
    markersRef.current = [];

    props.forEach((prop, i) => {
      const base = MUMBAI_COORDS[prop.location] || [19.076 + (Math.random()-0.5)*0.1, 72.877 + (Math.random()-0.5)*0.1];
      const lat = base[0] + (i * 0.003);
      const lng = base[1] + (i * 0.002);

      const icon = L.divIcon({
        className: "",
        html: `<div style="background:#E03A3C;color:white;padding:5px 10px;border-radius:6px;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 3px 12px rgba(224,58,60,0.4);cursor:pointer;">${fmtPrice(prop.price)}</div>`,
        iconAnchor: [30, 14],
      });

      const marker = L.marker([lat, lng], { icon })
        .addTo(map)
        .on("click", () => { window.location.href = `/property/${prop.id}`; });

      marker.bindPopup(`
        <div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:180px;padding:4px;">
          <img src="${prop.imageUrl || getImg(prop.id)}" onerror="this.src='https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300'" style="width:100%;height:80px;object-fit:cover;border-radius:6px;margin-bottom:8px;display:block;"/>
          <div style="font-weight:700;font-size:13px;color:#1A1A1A;margin-bottom:2px;">${fmtPrice(prop.price)}</div>
          <div style="font-size:12px;color:#1A1A1A;margin-bottom:2px;">${prop.title}</div>
          <div style="font-size:11px;color:#717171;">${prop.location}, ${prop.city}</div>
          <a href="/property/${prop.id}" style="display:block;margin-top:8px;background:#E03A3C;color:white;text-align:center;padding:6px;border-radius:4px;text-decoration:none;font-size:12px;font-weight:700;">View Details</a>
        </div>
      `, { maxWidth: 220 });

      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    if (window.L && mapInstanceRef.current) addMarkers(properties, mapInstanceRef.current);
  }, [properties]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      <style>{`.leaflet-container{background:#f0efe9!important}.leaflet-popup-content-wrapper{border-radius:10px!important;border:1px solid #E0E0E0!important;box-shadow:0 8px 32px rgba(0,0,0,0.1)!important}.leaflet-popup-tip{display:none}`}</style>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function ListingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [showMap, setShowMap] = useState(false);
  const [filters, setFilters] = useState({
    search:   searchParams.get("search")  || "",
    type:     searchParams.get("type")    || "",
    listing:  searchParams.get("listing") || "",
    minPrice: searchParams.get("minPrice")|| "",
    maxPrice: searchParams.get("maxPrice")|| "",
    sortBy:   "createdAt",
    sortOrder:"desc",
    page:     1,
  });

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    params.set("limit", "20");
    try {
      const res = await fetch(`/api/properties?${params}`);
      const data = await res.json();
      setProperties(data.properties || []);
      setPagination(data.pagination || { total: 0, pages: 1 });
    } catch(e) { console.error(e); }
    setLoading(false);
  }, [filters]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v, page: 1 }));
  const clearFilters = () => setFilters({ search: "", type: "", listing: "", minPrice: "", maxPrice: "", sortBy: "createdAt", sortOrder: "desc", page: 1 });

  const inp = { border: "1px solid #E0E0E0", borderRadius: 6, padding: "8px 12px", fontSize: 13, fontFamily: "inherit", outline: "none", background: "white", color: "#1A1A1A", width: "100%" };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", background: "#F5F5F5", minHeight: "100vh" }}>
      <style suppressHydrationWarning>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #E0E0E0; }
        select option { background: white; }
        .filter-input:focus { border-color: #E03A3C !important; }
      `}</style>

      <Navbar />

      {/* Search bar */}
      <div style={{ background: "white", borderBottom: "1px solid #E0E0E0", padding: "12px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#F9F9F9", borderRadius: 6, padding: "8px 14px", border: "1px solid #E0E0E0" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2" style={{ marginRight: 8, flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              className="filter-input"
              style={{ border: "none", outline: "none", background: "transparent", fontSize: 14, flex: 1, fontFamily: "inherit" }}
              placeholder="Search by locality, project or landmark..."
              value={filters.search}
              onChange={e => setFilter("search", e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchProperties()}
            />
            {filters.search && <button onClick={() => setFilter("search", "")} style={{ border: "none", background: "none", cursor: "pointer", color: "#aaa", fontSize: 18, lineHeight: 1 }}>×</button>}
          </div>
          <select className="filter-input" style={{ ...inp, width: 160 }} value={filters.type} onChange={e => setFilter("type", e.target.value)}>
            <option value="">All Types</option>
            <option value="Shop">Shop</option>
            <option value="Office Space">Office Space</option>
          </select>
          <select className="filter-input" style={{ ...inp, width: 140 }} value={filters.listing} onChange={e => setFilter("listing", e.target.value)}>
            <option value="">Buy & Rent</option>
            <option value="Buy">Buy</option>
            <option value="Rent">Rent</option>
          </select>
          <select className="filter-input" style={{ ...inp, width: 160 }} value={filters.maxPrice} onChange={e => setFilter("maxPrice", e.target.value)}>
            <option value="">Any Budget</option>
            <option value="5000000">Under ₹50 L</option>
            <option value="10000000">Under ₹1 Cr</option>
            <option value="30000000">Under ₹3 Cr</option>
            <option value="50000000">Under ₹5 Cr</option>
          </select>
          <button onClick={clearFilters} style={{ background: "white", border: "1px solid #E0E0E0", color: "#717171", padding: "8px 14px", borderRadius: 6, fontSize: 13, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
            Clear
          </button>
          <button
            onClick={() => setShowMap(!showMap)}
            style={{ background: showMap ? "#E03A3C" : "white", color: showMap ? "white" : "#E03A3C", border: "1.5px solid #E03A3C", padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
            {showMap ? "Hide Map" : "Map View"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", maxWidth: showMap ? "100%" : 1200, margin: "0 auto" }}>

        {/* Sidebar filters */}
        {!showMap && (
          <div style={{ width: 260, flexShrink: 0, padding: "20px 0", position: "sticky", top: 108, height: "calc(100vh - 108px)", overflowY: "auto" }}>
            <div style={{ background: "white", border: "1px solid #E0E0E0", borderRadius: 8, margin: "0 16px", padding: "16px" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 16 }}>Filters</div>

              {/* Property type */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#717171", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Property Type</div>
                {[["", "All Types"], ["Shop", "Shop"], ["Office Space", "Office Space"]].map(([v, l]) => (
                  <label key={v} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
                    <input type="radio" name="type" checked={filters.type === v} onChange={() => setFilter("type", v)} style={{ accentColor: "#E03A3C" }} />
                    <span style={{ fontSize: 13, color: "#1A1A1A" }}>{l}</span>
                  </label>
                ))}
              </div>

              {/* Listing type */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#717171", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Listing Type</div>
                {[["", "Buy & Rent"], ["Buy", "Buy"], ["Rent", "Rent"]].map(([v, l]) => (
                  <label key={v} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
                    <input type="radio" name="listing" checked={filters.listing === v} onChange={() => setFilter("listing", v)} style={{ accentColor: "#E03A3C" }} />
                    <span style={{ fontSize: 13, color: "#1A1A1A" }}>{l}</span>
                  </label>
                ))}
              </div>

              {/* Budget */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#717171", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Max Budget</div>
                <input className="filter-input" type="number" placeholder="Enter max price (₹)" value={filters.maxPrice} onChange={e => setFilter("maxPrice", e.target.value)} style={{ ...inp, fontSize: 13 }} />
              </div>

              {/* Status */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#717171", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Status</div>
                {[["", "All"], ["available", "Available"], ["sold", "Sold"]].map(([v, l]) => (
                  <label key={v} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
                    <input type="radio" name="status" checked={(filters.status || "") === v} onChange={() => setFilter("status", v)} style={{ accentColor: "#E03A3C" }} />
                    <span style={{ fontSize: 13, color: "#1A1A1A" }}>{l}</span>
                  </label>
                ))}
              </div>

              <button onClick={clearFilters} style={{ width: "100%", background: "#F5F5F5", border: "1px solid #E0E0E0", borderRadius: 6, padding: "8px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: "#717171" }}>
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Main content */}
        <div style={{ flex: 1, padding: "20px 16px" }}>
          {/* Toolbar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, background: "white", border: "1px solid #E0E0E0", borderRadius: 8, padding: "10px 16px" }}>
            <div style={{ fontSize: 14, color: "#717171" }}>
              <strong style={{ color: "#1A1A1A" }}>{pagination.total}</strong> properties found
              {filters.search && <span> for "<strong>{filters.search}</strong>"</span>}
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 4 }}>
                <span style={{ fontSize: 13, color: "#717171" }}>Sort:</span>
                <select style={{ border: "none", outline: "none", fontSize: 13, color: "#1A1A1A", fontFamily: "inherit", cursor: "pointer" }} value={filters.sortBy} onChange={e => setFilter("sortBy", e.target.value)}>
                  <option value="createdAt">Newest</option>
                  <option value="price">Price: Low to High</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 4, borderLeft: "1px solid #E0E0E0", paddingLeft: 12 }}>
                {["list", "grid"].map(v => (
                  <button key={v} onClick={() => setView(v)} style={{ background: view === v ? "#E03A3C" : "white", color: view === v ? "white" : "#717171", border: "1px solid #E0E0E0", borderRadius: 4, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    {v === "list" ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Properties */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[...Array(4)].map((_, i) => <div key={i} style={{ background: "white", borderRadius: 8, height: 160, border: "1px solid #E0E0E0", opacity: 0.5 }} />)}
            </div>
          ) : properties.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", background: "white", borderRadius: 8, border: "1px solid #E0E0E0" }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E0E0E0" strokeWidth="1.5" style={{ margin: "0 auto 16px", display: "block" }}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>No properties found</div>
              <div style={{ fontSize: 14, color: "#717171", marginBottom: 20 }}>Try adjusting your search or filters</div>
              <button onClick={clearFilters} style={{ background: "#E03A3C", color: "white", border: "none", padding: "10px 24px", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Clear Filters</button>
            </div>
          ) : view === "list" ? (
            <div>{properties.map(p => <PropertyCard key={p.id} prop={p} view="list" />)}</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
              {properties.map(p => <PropertyCard key={p.id} prop={p} view="grid" />)}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 32 }}>
              {[...Array(pagination.pages)].map((_, i) => (
                <button key={i} onClick={() => setFilter("page", i + 1)} style={{ background: filters.page === i + 1 ? "#E03A3C" : "white", color: filters.page === i + 1 ? "white" : "#1A1A1A", border: "1px solid #E0E0E0", borderRadius: 6, width: 36, height: 36, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13 }}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map panel */}
        {showMap && (
          <div style={{ flex: 1, position: "sticky", top: 108, height: "calc(100vh - 108px)", borderLeft: "1px solid #E0E0E0" }}>
            {!loading && properties.length > 0 && <MapView properties={properties} />}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", background: "#f0efe9" }}>
                <div style={{ fontSize: 14, color: "#717171" }}>Loading map...</div>
              </div>
            )}
            <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 999, background: "white", border: "1px solid #E0E0E0", borderRadius: 20, padding: "8px 18px", fontSize: 12, color: "#717171", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", whiteSpace: "nowrap", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Click a price pin to view property details
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
