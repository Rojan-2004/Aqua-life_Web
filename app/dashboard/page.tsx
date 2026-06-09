import { getUserData } from "@/lib/cookies";

export default async function DashboardPage() {
    const user = await getUserData();
    const name = user?.firstName || user?.username || user?.name || user?.email || "User";

    return (
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
    );
}