"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div style={{ background: "#0a0e1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif" }}>
                <p style={{ color: "#4dd9e8", fontSize: 18, fontWeight: 600 }}>Loading dashboard...</p>
            </div>
        );
    }

    if (!user) {
        router.push("/frontend/login");
        return null;
    }

    const name = user.firstName || user.username || user.name || user.email || "User";
    const userInitials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() || "U";
    const hasProfilePic = user.profilePicture && user.profilePicture !== "default-profile.png";
    const profilePicUrl = hasProfilePic ? `/profile_pictures/${user.profilePicture}` : null;

    const handleLogout = async () => {
        await logout();
        router.push("/frontend/login");
    };

    return (
        <div style={{ fontFamily: "'Outfit', sans-serif", background: "#0a0e1a", minHeight: "100vh" }}>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet" />

            {/* Header Navigation Bar */}
            <header style={{ 
                background: "rgba(17, 24, 39, 0.8)", 
                backdropFilter: "blur(12px)", 
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)", 
                position: "sticky", 
                top: 0, 
                zIndex: 100 
            }}>
                <div style={{ maxWidth: 1440, margin: "0 auto", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 24, fontWeight: 800, background: "linear-gradient(135deg, #2d9cdb, #4dd9e8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🌊 AquaLife</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <Link 
                            href="/dashboard/profile" 
                            style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                gap: 10, 
                                textDecoration: "none", 
                                background: "rgba(255,255,255,0.04)", 
                                border: "1px solid rgba(255,255,255,0.08)",
                                padding: "6px 14px", 
                                borderRadius: 30,
                                transition: "0.2s all"
                            }}
                        >
                            <div style={{ 
                                width: 28, 
                                height: 28, 
                                borderRadius: "50%", 
                                background: "linear-gradient(135deg, #2d9cdb, #4dd9e8)", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                overflow: "hidden" 
                            }}>
                                {profilePicUrl ? (
                                    <img src={profilePicUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{userInitials}</span>
                                )}
                            </div>
                            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600 }}>Profile Settings</span>
                        </Link>

                        <button 
                            onClick={handleLogout}
                            style={{ 
                                background: "transparent", 
                                border: "none", 
                                color: "rgba(255,255,255,0.5)", 
                                fontSize: 13, 
                                fontWeight: 600, 
                                cursor: "pointer", 
                                fontFamily: "inherit",
                                transition: "0.2s hover"
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <section style={{ maxWidth: 1440, margin: "0 auto", padding: "64px 32px" }}>
                <div style={{ marginBottom: 40 }}>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                        AquaLife Dashboard
                    </p>
                    <h1 style={{ color: "#fff", fontSize: 36, fontWeight: 700 }}>
                        Welcome, {name}
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 8 }}>
                        Manage your aquarium ecosystem and explore premium aquatic supplies.
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                    <div style={{ background: "linear-gradient(135deg, #2d9cdb, #4dd9e8)", borderRadius: 12, padding: 24, cursor: "pointer" }}>
                        <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 12 }}>My Aquarium</h3>
                        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>Monitor tank conditions, track parameters, and manage your aquatic environment.</p>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24, cursor: "pointer" }}>
                        <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Species Catalog</h3>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Browse and identify rare species with our AI-powered identification tool.</p>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24, cursor: "pointer" }}>
                        <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Orders & Supplies</h3>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Track your orders and restock premium aquarium supplies.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}