export const theme = {
    bg: "#0a0e1a",
    bgCard: "rgba(255,255,255,0.04)",
    bgCardHover: "rgba(255,255,255,0.07)",
    border: "rgba(255,255,255,0.08)",
    borderHover: "rgba(77,217,232,0.25)",
    accent: "linear-gradient(135deg, #2d9cdb, #4dd9e8)",
    accentSolid: "#2d9cdb",
    accentLight: "rgba(77,217,232,0.1)",
    textPrimary: "#ffffff",
    textSub: "rgba(255,255,255,0.55)",
    textMuted: "rgba(255,255,255,0.3)",
    radius: { sm: 8, md: 12, lg: 16, xl: 20, pill: 30 },
    shadow: "0 4px 24px rgba(0,0,0,0.35)",
    shadowGlow: "0 0 24px rgba(45,156,219,0.15)",
    fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
};

export const card = {
    background: theme.bgCard,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.radius.lg,
    backdropFilter: "blur(12px)",
    transition: "border-color 0.2s, background 0.2s, transform 0.15s, box-shadow 0.2s",
};

export const btnPrimary = {
    background: theme.accent,
    border: "none",
    borderRadius: theme.radius.pill,
    color: "#fff",
    fontWeight: 700,
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "opacity 0.15s, transform 0.15s",
};

export const btnGhost = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: theme.radius.pill,
    color: "rgba(255,255,255,0.7)",
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "background 0.2s, border-color 0.2s",
};

export const input = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: theme.radius.md,
    padding: "11px 16px",
    color: "#fff",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
};

export const type = {
    hero: { fontSize: 42, fontWeight: 800, color: "#fff", lineHeight: 1.15 },
    h1: { fontSize: 32, fontWeight: 700, color: "#fff" },
    h2: { fontSize: 22, fontWeight: 700, color: "#fff" },
    h3: { fontSize: 17, fontWeight: 600, color: "#fff" },
    body: { fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 },
    small: { fontSize: 12, color: "rgba(255,255,255,0.35)" },
    label: {
        fontSize: 11,
        color: "rgba(255,255,255,0.45)",
        textTransform: "uppercase" as const,
        letterSpacing: 1,
        display: "block",
        marginBottom: 7,
    },
    price: {
        fontSize: 22,
        fontWeight: 800,
        background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    accent: { color: "#4dd9e8", fontWeight: 600 },
};

// Returns the inline-style object for a card given its hover state.
export function cardStyle(hovered: boolean) {
    return {
        background: hovered ? theme.bgCardHover : theme.bgCard,
        border: `1px solid ${hovered ? theme.borderHover : theme.border}`,
        borderRadius: theme.radius.lg,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
            ? "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(77,217,232,0.1)"
            : "none",
        transition: "all 0.2s ease",
    };
}
