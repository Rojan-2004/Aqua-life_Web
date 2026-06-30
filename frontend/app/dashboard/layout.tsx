export const metadata = {
  title: "Aqua Life Dashboard",
  description: "Aqua Life Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: "#0a0e1a", minHeight: "100vh", color: "#fff" }}>
      {children}
    </div>
  );
}