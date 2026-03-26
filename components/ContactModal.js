"use client";
// components/ContactModal.js
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ContactModal({ agent, propTitle, propId }) {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("call"); // "call" | "whatsapp" | "visit"
  const [form, setForm] = useState({ name: session?.user?.name || "", phone: "", reason: "Investment", timeline: "3 months", siteVisit: true, homeLoan: false, terms: false });
  const [submitted, setSubmitted] = useState(false);

  // Dummy agent phone (in real app this would come from DB)
  const AGENT_PHONE = "9876543210";

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (!form.name || !form.phone) return;
    if (modalType === "call") {
      window.location.href = `tel:+91${AGENT_PHONE}`;
    } else if (modalType === "whatsapp") {
      const msg = encodeURIComponent(`Hi, I'm interested in the property: ${propTitle} (ID: RLT-${String(propId).padStart(5,"0")}). Please share more details.`);
      window.open(`https://wa.me/91${AGENT_PHONE}?text=${msg}`, "_blank");
    } else {
      setSubmitted(true);
    }
  };

  return (
    <>
      {/* Action buttons */}
      <button
        onClick={() => openModal("call")}
        className="action-btn"
        style={{ width: "100%", background: "#E03A3C", border: "none", color: "white", padding: "13px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.5 9.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012.41 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.4a16 16 0 006.29 6.29l1.75-1.75a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        Call Agent
      </button>

      <button
        onClick={() => openModal("whatsapp")}
        className="action-btn"
        style={{ width: "100%", background: "#25D366", border: "none", color: "white", padding: "11px", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.118.553 4.111 1.52 5.84L.057 23.428a.5.5 0 00.606.607l5.588-1.464A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.95 9.95 0 01-5.087-1.392l-.364-.215-3.77.988.989-3.77-.215-.364A9.951 9.951 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
        WhatsApp
      </button>

      <button
        onClick={() => openModal("visit")}
        className="action-btn"
        style={{ width: "100%", background: "white", border: "1.5px solid #E03A3C", color: "#E03A3C", padding: "11px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Request Site Visit
      </button>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "white", borderRadius: 12, width: "100%", maxWidth: 560, maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>

            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>
                {modalType === "call" ? "View Agent Number" : modalType === "whatsapp" ? "Contact via WhatsApp" : "Request Site Visit"}
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 22, lineHeight: 1 }}>×</button>
            </div>

            {submitted ? (
              <div style={{ padding: "40px 24px", textAlign: "center" }}>
                <div style={{ width: 60, height: 60, background: "#E0F2F1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00897B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>Site Visit Requested!</div>
                <p style={{ fontSize: 14, color: "#717171", marginBottom: 20 }}>The agent will contact you within 24 hours to confirm your visit.</p>
                <button onClick={() => setShowModal(false)} style={{ background: "#E03A3C", color: "white", border: "none", padding: "10px 28px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Done</button>
              </div>
            ) : (
              <div style={{ padding: "20px 24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 14 }}>BASIC INFORMATION</div>
                    {modalType === "visit" && (
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>Your reason to buy is</div>
                        <div style={{ display: "flex", gap: 16 }}>
                          {["Investment", "Self Use"].map(r => (
                            <label key={r} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                              <input type="radio" name="reason" checked={form.reason === r} onChange={() => setForm({...form, reason: r})} style={{ accentColor: "#E03A3C" }} />
                              {r}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>Name</div>
                      <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: "100%", border: "none", borderBottom: "1px solid #e0e0e0", padding: "6px 0", fontSize: 14, fontFamily: "inherit", outline: "none" }} placeholder="Your name" />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>Phone</div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 13, color: "#E03A3C", fontWeight: 600 }}>+91 IND</span>
                        <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ flex: 1, border: "none", borderBottom: "1px solid #e0e0e0", padding: "6px 0", fontSize: 14, fontFamily: "inherit", outline: "none" }} placeholder="Mobile number" type="tel" />
                      </div>
                      <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>This number would be verified</div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 14 }}>OPTIONAL INFORMATION</div>
                    {modalType === "visit" && (
                      <>
                        <div style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>By when are you planning?</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                          {["3 months", "6 months", "More than 6 months"].map(t => (
                            <label key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                              <input type="radio" name="timeline" checked={form.timeline === t} onChange={() => setForm({...form, timeline: t})} style={{ accentColor: "#E03A3C" }} />
                              {t}
                            </label>
                          ))}
                        </div>
                      </>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                        <input type="checkbox" checked={form.homeLoan} onChange={e => setForm({...form, homeLoan: e.target.checked})} style={{ accentColor: "#E03A3C", width: 16, height: 16 }} />
                        I am interested in home loan
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                        <input type="checkbox" checked={form.siteVisit} onChange={e => setForm({...form, siteVisit: e.target.checked})} style={{ accentColor: "#E03A3C", width: 16, height: 16 }} />
                        I am interested in site visits.
                      </label>
                      <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, cursor: "pointer", color: "#555" }}>
                        <input type="checkbox" checked={form.terms} onChange={e => setForm({...form, terms: e.target.checked})} style={{ accentColor: "#E03A3C", width: 16, height: 16, marginTop: 1 }} />
                        I agree to the <span style={{ color: "#E03A3C" }}>Terms & Conditions</span> and <span style={{ color: "#E03A3C" }}>Privacy Policy</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!form.name || !form.phone}
                  style={{ width: "100%", background: !form.name || !form.phone ? "#ccc" : "#E03A3C", color: "white", border: "none", padding: "13px", borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: !form.name || !form.phone ? "not-allowed" : "pointer", fontFamily: "inherit" }}
                >
                  {modalType === "call" ? "View Number" : modalType === "whatsapp" ? "Open WhatsApp" : "Request Visit"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}