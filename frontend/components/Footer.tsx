export default function Footer() {
    return (
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 80, padding: "48px 32px 28px", background: "#0a0e1a" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40 }}>
                <div>
                    <p style={{ fontSize: 20, fontWeight: 800, background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 12 }}>🌊 AquaLife</p>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.8 }}>Premium aquatic systems and life support for the modern hobbyist. Engineered for excellence.</p>
                </div>
                {[
                    { title: "Company", links: ["About Us", "Sustainability", "Shipping Policy", "Privacy Policy"] },
                    { title: "Support", links: ["Returns", "Contact Support", "Privacy Policy"] },
                ].map((col) => (
                    <div key={col.title}>
                        <p style={{ color: "#fff", fontWeight: 600, marginBottom: 16, fontSize: 14 }}>{col.title}</p>
                        {col.links.map((l) => (
                            <p key={l} style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 10, cursor: "pointer", transition: "color 0.15s" }}>{l}</p>
                        ))}
                    </div>
                ))}
                <div>
                    <p style={{ color: "#fff", fontWeight: 600, marginBottom: 16, fontSize: 14 }}>Newsletter</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <input placeholder="your@email.com" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
                        <button style={{ background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)", border: "none", borderRadius: 10, padding: "10px 0", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Subscribe</button>
                    </div>
                </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, textAlign: "center", marginTop: 48 }}>© 2024 AquaLife Premium Aquatic Systems. All rights reserved.</p>
        </footer>
    );
}
