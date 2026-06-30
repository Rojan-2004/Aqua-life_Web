import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div style={{
            background: "#0a0e1a",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Outfit', sans-serif",
            padding: "24px",
            textAlign: "center"
        }}>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet" />

            <div style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                padding: "48px 32px",
                borderRadius: "16px",
                maxWidth: "480px",
                width: "100%",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                backdropFilter: "blur(8px)"
            }}>
                <div style={{
                    fontSize: "64px",
                    marginBottom: "16px"
                }}>
                    🔒
                </div>
                
                <h1 style={{
                    color: "#ff4d4d",
                    fontSize: "32px",
                    fontWeight: 800,
                    marginBottom: "12px",
                    letterSpacing: "-0.5px"
                }}>
                    Access Denied
                </h1>

                <p style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "15px",
                    lineHeight: "1.6",
                    marginBottom: "32px"
                }}>
                    You do not have administrative privileges to access this area. If you believe this is an error, please contact support.
                </p>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                }}>
                    <Link
                        href="/dashboard"
                        style={{
                            background: "linear-gradient(135deg, #2d9cdb, #4dd9e8)",
                            color: "#fff",
                            textDecoration: "none",
                            fontWeight: 600,
                            padding: "12px 24px",
                            borderRadius: "8px",
                            fontSize: "14px",
                            transition: "all 0.2s"
                        }}
                    >
                        Return to Dashboard
                    </Link>

                    <Link
                        href="/frontend/login"
                        style={{
                            background: "transparent",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            color: "rgba(255, 255, 255, 0.8)",
                            textDecoration: "none",
                            fontWeight: 600,
                            padding: "12px 24px",
                            borderRadius: "8px",
                            fontSize: "14px",
                            transition: "all 0.2s"
                        }}
                    >
                        Sign in with another account
                    </Link>
                </div>
            </div>
        </div>
    );
}
