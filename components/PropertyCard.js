"use client";
// components/PropertyCard.js
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { getImg, fmtPrice, getRisk, getAge } from "@/lib/constants";

export default function PropertyCard({ prop, view = "grid" }) {
  if (!prop) return null;
  
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);
  const img = prop.imageUrl || getImg(prop.id);
  const risk = getRisk(prop.id);
  const age  = getAge(prop.id);
  const riskColor = risk >= 70 ? "#00897B" : risk >= 50 ? "#F59E0B" : "#E03A3C";

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      alert("Please login to save properties");
      return;
    }

    try {
      if (saved) {
        // Unsave
        const res = await fetch(`/api/saved-properties?propertyId=${prop.id}`, { method: "DELETE" });
        if (res.ok) {
          setSaved(false);
        }
      } else {
        // Save
        const res = await fetch("/api/saved-properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId: prop.id }),
        });
        console.log("Save response:", res.status, res.statusText);
        
        if (res.ok) {
          setSaved(true);
          alert("Property saved successfully!");
        } else if (res.status === 401) {
          alert("Please login to save properties");
        } else if (res.status === 409) {
          alert("Already saved!");
          setSaved(true);
        } else {
          const errorData = await res.json();
          console.error("Save error response:", errorData);
          alert(`Failed to save: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error("Save error:", error);
      alert(`Error saving property: ${error.message}`);
    }
  };

  if (view === "list") {
    return (
      <Link href={`/property/${prop.id}`} style={{ textDecoration: "none" }}>
        <div style={{ background: "white", border: "1px solid #E0E0E0", borderRadius: 8, display: "flex", overflow: "hidden", transition: "box-shadow 0.2s, border-color 0.2s", marginBottom: 12 }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = "#E03A3C"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#E0E0E0"; }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img src={img} alt={prop.title} style={{ width: 220, height: 160, objectFit: "cover", display: "block" }}
            onError={e => { e.target.src = getImg(prop.id); }} />
            <div style={{ position: "absolute", top: 8, left: 8, background: "#E03A3C", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>{prop.type}</div>
            <button onClick={handleSave} style={{ position: "absolute", top: 8, right: 8, background: "white", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "#E03A3C" : "none"} stroke={saved ? "#E03A3C" : "#aaa"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </button>
          </div>
          <div style={{ padding: "14px 18px", flex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#E03A3C", marginBottom: 4 }}>{fmtPrice(prop.price)}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A", marginBottom: 4 }}>{prop.title}</div>
              <div style={{ fontSize: 12, color: "#717171", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {prop.location}, {prop.city}
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#717171", flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                  {prop.area} sqft
                </span>
                <span style={{ color: riskColor, fontWeight: 600 }}>Risk: {risk}/100</span>
                <span>Age: {age}Y</span>
                <span style={{ background: prop.status === "available" ? "#E0F2F1" : "#FEE2E2", color: prop.status === "available" ? "#00897B" : "#E03A3C", fontWeight: 600, padding: "2px 8px", borderRadius: 4 }}>
                  {prop.status === "available" ? "Available" : "Sold"}
                </span>
              </div>
            </div>
            <div style={{ marginLeft: 16, flexShrink: 0 }}>
              <div style={{ background: "#E03A3C", color: "white", padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "center" }}>
                View Details
              </div>
              {prop.agent && <div style={{ fontSize: 11, color: "#717171", marginTop: 8, textAlign: "center" }}>{prop.agent}</div>}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/property/${prop.id}`} style={{ textDecoration: "none" }}>
      <div style={{ background: "white", border: "1px solid #E0E0E0", borderRadius: 8, overflow: "hidden", transition: "all 0.2s", height: "100%" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = "#E03A3C"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#E0E0E0"; }}>
        <div style={{ position: "relative" }}>
          <img src={img} alt={prop.title} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
            onError={e => { e.target.src = getImg(prop.id); }} />
          <div style={{ position: "absolute", top: 8, left: 8, background: "#E03A3C", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase" }}>{prop.type}</div>
          <button onClick={handleSave} style={{ position: "absolute", top: 8, right: 8, background: "white", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "#E03A3C" : "none"} stroke={saved ? "#E03A3C" : "#aaa"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </button>
        </div>
        <div style={{ padding: "14px" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#E03A3C", marginBottom: 4 }}>{fmtPrice(prop.price)}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prop.title}</div>
          <div style={{ fontSize: 12, color: "#717171", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {prop.location}, {prop.city}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid #F0F0F0", fontSize: 12 }}>
            <span style={{ color: "#717171" }}>{prop.area} sqft</span>
            <span style={{ color: riskColor, fontWeight: 600 }}>Risk: {risk}/100</span>
            <span style={{ background: prop.status === "available" ? "#E0F2F1" : "#FEE2E2", color: prop.status === "available" ? "#00897B" : "#E03A3C", fontWeight: 600, padding: "2px 6px", borderRadius: 3, fontSize: 11 }}>
              {prop.status === "available" ? "Available" : "Sold"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
