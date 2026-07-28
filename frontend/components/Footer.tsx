import Link from "next/link";

export default function Footer() {
    return (
        <footer style={{ background: "#070b14", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "64px 48px 32px" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48, marginBottom: 48 }}>

                    {/* Brand column */}
                    <div>
                        <img src="/assets/logo/Aqua_life_logo.png" alt="AquaLife" style={{ height: 40, objectFit: "contain", marginBottom: 16 }} />
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
                            Premium aquatic systems and life support for the modern hobbyist.<br />
                            Lazimpat, Kathmandu, Nepal
                        </p>
                        <div style={{ display: "flex", gap: 12 }}>
                            {["Instagram", "Facebook", "YouTube", "TikTok"].map((s) => (
                                <Link key={s} href="#" style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textDecoration: "none", transition: "color 0.15s" }}>{s}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Shop column */}
                    <div>
                        <p style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Shop</p>
                        {["Fish", "Plants", "Equipment", "Food", "Decoration"].map((l) => (
                            <Link key={l} href={`/catalogue?category=${l}`} style={{ display: "block", color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 10, textDecoration: "none" }}>{l}</Link>
                        ))}
                    </div>

                    {/* Policies column */}
                    <div>
                        <p style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Policies</p>
                        {["Privacy Policy", "Refund Policy", "Shipping Policy", "Terms of Service"].map((l) => (
                            <p key={l} style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 10, cursor: "pointer" }}>{l}</p>
                        ))}
                    </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                    <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>© 2024 AquaLife. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
