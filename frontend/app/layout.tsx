import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Aqua Life",
  description: "Aqua Life Web Project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <ToastContainer position="top-right" theme="dark" />
        </AuthProvider>
      </body>
    </html>
  );
}