import { Outfit } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-outfit",
    display: "swap",
});

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
    <html lang="en" className={outfit.variable}>
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <AuthProvider>
            {children}
            <ToastContainer position="top-right" theme="dark" />
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}