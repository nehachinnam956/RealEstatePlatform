"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

function PropertyComparison({ properties }) {
  if (properties.length === 0) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Compare Properties</h1>
          <p style={{ color: "#666", marginBottom: 30 }}>Select properties from the listings page to compare</p>
          <Link href="/listings">
            <button style={{
              background: "#E03A3C",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}>
              Browse Properties
            </button>
          </Link>
        </div>
      </>
    );
  }

  const fmtPrice = (n) =>
    n >= 10000000 ? `₹${(n / 10000000).toFixed(1)} Cr` :
      n >= 100000 ? `₹${(n / 100000).toFixed(0)} L` :
        `₹${n?.toLocaleString()}`;

  const fields = [
    { key: "title", label: "Property Name" },
    { key: "type", label: "Type" },
    { key: "listing", label: "Listing Type" },
    { key: "location", label: "Location" },
    { key: "price", label: "Price", format: fmtPrice },
    { key: "area", label: "Area (sqft)" },
    { key: "beds", label: "Bedrooms" },
    { key: "baths", label: "Bathrooms" },
    { key: "status", label: "Status" },
  ];

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Compare Properties</h1>
        <p style={{ color: "#666", marginBottom: 30 }}>Side-by-side comparison of {properties.length} properties</p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #E03A3C" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700 }}>Feature</th>
                {properties.map((prop, i) => (
                  <th key={i} style={{ padding: "12px", textAlign: "center", fontWeight: 700, minWidth: 200 }}>
                    <div style={{ marginBottom: 10 }}>
                      <img
                        src={prop.imageUrl || "https://via.placeholder.com/150"}
                        alt={prop.title}
                        style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 6, marginBottom: 10 }}
                      />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{prop.title}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((field, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #e0e0e0", background: idx % 2 === 0 ? "white" : "#f9f9f9" }}>
                  <td style={{ padding: "12px", fontWeight: 600, color: "#333" }}>{field.label}</td>
                  {properties.map((prop, i) => (
                    <td key={i} style={{ padding: "12px", textAlign: "center", color: "#555" }}>
                      {field.format
                        ? field.format(prop[field.key])
                        : field.key === "status"
                          ? (
                            <span style={{
                              background: prop.status === "available" ? "#E0F2F1" : "#FEE2E2",
                              color: prop.status === "available" ? "#00897B" : "#E03A3C",
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: 12,
                              fontWeight: 600,
                            }}>
                              {prop.status?.toUpperCase()}
                            </span>
                          )
                          : prop[field.key]}
                    </td>
                  ))}
                </tr>
              ))}
              <tr style={{ background: "#f9f9f9" }}>
                <td style={{ padding: "12px", fontWeight: 600 }}>Actions</td>
                {properties.map((prop, i) => (
                  <td key={i} style={{ padding: "12px", textAlign: "center" }}>
                    <Link href={`/property/${prop.id}`}>
                      <button style={{
                        background: "#E03A3C",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                      }}>
                        View Details
                      </button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function ComparePage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = searchParams.get("ids");
    if (!ids) {
      setLoading(false);
      return;
    }

    const idArray = ids.split(",").map(Number);
    Promise.all(
      idArray.map(id =>
        fetch(`/api/properties/${id}`).then(r => r.json()).catch(() => null)
      )
    ).then(results => {
      setProperties(results.filter(p => p !== null));
      setLoading(false);
    });
  }, [searchParams]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  return <PropertyComparison properties={properties} />;
}
