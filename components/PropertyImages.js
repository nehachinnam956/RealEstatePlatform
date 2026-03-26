"use client";
// components/PropertyImages.js
import { useState } from "react";

const THUMB_IMGS = [
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=80",
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
];

export default function PropertyImages({ mainImg, title, fallbackImgs, propId, type, status, featured, thumbnail = false }) {
  const [activeImg, setActiveImg] = useState(mainImg);
  const [imgError, setImgError] = useState(false);

  const fallback = fallbackImgs ? fallbackImgs[(propId - 1) % fallbackImgs.length] : mainImg;

  // Generate unique thumbnails for this property
  const propertyThumbs = [];
  for (let i = 0; i < 4; i++) {
    propertyThumbs.push(THUMB_IMGS[(propId + i) % THUMB_IMGS.length]);
  }

  // Thumbnail mode — for similar properties
  if (thumbnail) {
    return (
      <img
        src={imgError ? fallback : (mainImg || fallback)}
        alt={title}
        style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div style={{ marginBottom: 16, borderRadius: 10, overflow: "hidden", border: "1px solid #e8e8e8" }}>
      {/* Main image */}
      <div style={{ position: "relative" }}>
        <img
          src={imgError ? fallback : activeImg}
          alt={title}
          style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }}
          onError={() => { setImgError(true); setActiveImg(fallback); }}
        />
        {/* Badges */}
        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 8 }}>
          <span style={{ background: "#E03A3C", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 4, textTransform: "uppercase" }}>{type}</span>
          {status === "available" && (
            <span style={{ background: "#00897B", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 4 }}>Available</span>
          )}
          {featured && (
            <span style={{ background: "#F59E0B", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 4 }}>Featured</span>
          )}
        </div>
        {/* Photo count */}
        <div style={{ position: "absolute", bottom: 14, right: 14, background: "rgba(0,0,0,0.6)", color: "white", fontSize: 12, fontWeight: 500, padding: "5px 12px", borderRadius: 4, display: "flex", alignItems: "center", gap: 5 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          {propertyThumbs.length + 1} Photos
        </div>
      </div>

      {/* Thumbnails */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2, background: "#1a1a1a" }}>
        {propertyThumbs.map((img, i) => (
          <ThumbnailImg
            key={i}
            src={img}
            alt={`view ${i+2}`}
            fallback={fallbackImgs[i % fallbackImgs.length]}
            active={activeImg === img}
            onClick={() => { setActiveImg(img); setImgError(false); }}
          />
        ))}
      </div>
    </div>
  );
}

function ThumbnailImg({ src, alt, fallback, active, onClick }) {
  const [error, setError] = useState(false);
  return (
    <img
      src={error ? fallback : src}
      alt={alt}
      onClick={onClick}
      style={{ width: "100%", height: 80, objectFit: "cover", display: "block", opacity: active ? 1 : 0.7, cursor: "pointer", outline: active ? "3px solid #E03A3C" : "none", transition: "opacity 0.2s" }}
      onError={() => setError(true)}
      onMouseEnter={e => { if (!active) e.target.style.opacity = "1"; }}
      onMouseLeave={e => { if (!active) e.target.style.opacity = "0.7"; }}
    />
  );
}
