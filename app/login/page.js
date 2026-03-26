"use client";
// app/login/page.js
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") === "register" ? "register" : "login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError("Please fill all fields"); return; }
    setLoading(true); setError("");
    const res = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    setLoading(false);
    if (res?.error) { setError("Invalid email or password"); }
    else { router.push("/"); }
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) { setError("Please fill all fields"); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); setLoading(false); return; }
      setSuccess("Account created! Logging you in...");
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push("/");
    } catch { setError("Something went wrong"); }
    setLoading(false);
  };

  const inp = { width: "100%", border: "1px solid #E0E0E0", borderRadius: 6, padding: "12px 14px", fontSize: 14, fontFamily: "inherit", outline: "none", color: "#1A1A1A", background: "white", display: "block" };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", background: "#F5F5F5", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style suppressHydrationWarning>{`* { box-sizing: border-box; margin: 0; padding: 0; } input:focus { border-color: #E03A3C !important; }`}</style>

      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #E0E0E0", padding: "0 40px", height: 60, display: "flex", alignItems: "center" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "#E03A3C", width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#E03A3C" }}>REALTA</span>
        </Link>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>

          {/* Card */}
          <div style={{ background: "white", borderRadius: 10, border: "1px solid #E0E0E0", padding: "32px 36px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

            {/* Tabs */}
            <div style={{ display: "flex", marginBottom: 28, borderBottom: "2px solid #F0F0F0" }}>
              {[["login","Login"],["register","Register"]].map(([t, l]) => (
                <button key={t} onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                  style={{ flex: 1, padding: "10px", fontSize: 15, fontWeight: 700, border: "none", background: "transparent", cursor: "pointer", color: tab === t ? "#E03A3C" : "#717171", borderBottom: tab === t ? "2px solid #E03A3C" : "2px solid transparent", marginBottom: -2, fontFamily: "inherit", transition: "color 0.2s" }}>
                  {l}
                </button>
              ))}
            </div>

            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", marginBottom: 6 }}>
              {tab === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p style={{ fontSize: 13, color: "#717171", marginBottom: 24 }}>
              {tab === "login" ? "Login to access your account" : "Join thousands of property seekers"}
            </p>

            {error && (
              <div style={{ background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: 6, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#E03A3C", fontWeight: 500 }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ background: "#E0F2F1", border: "1px solid #B2DFDB", borderRadius: 6, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#00897B", fontWeight: 500 }}>
                {success}
              </div>
            )}

            {/* Demo credentials */}
            {tab === "login" && (
              <div style={{ background: "#F9F9F9", border: "1px solid #E0E0E0", borderRadius: 6, padding: "12px 14px", marginBottom: 20, fontSize: 12, color: "#717171", lineHeight: 1.8 }}>
                <div style={{ fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>Demo Credentials:</div>
                <div><span style={{ color: "#E03A3C", fontWeight: 600 }}>Admin:</span> admin@realty.com / admin123</div>
                <div><span style={{ color: "#00897B", fontWeight: 600 }}>User:</span> john@example.com / john123</div>
              </div>
            )}

            {/* Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {tab === "register" && (
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", display: "block", marginBottom: 6 }}>Full Name</label>
                  <input style={inp} type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
                </div>
              )}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", display: "block", marginBottom: 6 }}>Email Address</label>
                <input style={inp} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", display: "block", marginBottom: 6 }}>Password</label>
                <input style={inp} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && (tab === "login" ? handleLogin() : handleRegister())} />
              </div>
              {tab === "register" && (
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", display: "block", marginBottom: 6 }}>Confirm Password</label>
                  <input style={inp} type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleRegister()} />
                </div>
              )}
            </div>

            <button
              onClick={tab === "login" ? handleLogin : handleRegister}
              disabled={loading}
              style={{ width: "100%", background: loading ? "#ccc" : "#E03A3C", border: "none", color: "white", padding: "14px", borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", marginTop: 20, transition: "background 0.2s" }}
            >
              {loading ? "Please wait..." : tab === "login" ? "Login" : "Create Account"}
            </button>

            <div style={{ textAlign: "center", fontSize: 13, color: "#717171", marginTop: 16 }}>
              {tab === "login" ? "Don't have an account? " : "Already have an account? "}
              <span onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); setSuccess(""); }} style={{ color: "#E03A3C", fontWeight: 600, cursor: "pointer" }}>
                {tab === "login" ? "Register" : "Login"}
              </span>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link href="/" style={{ fontSize: 13, color: "#717171", textDecoration: "none" }}>← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
