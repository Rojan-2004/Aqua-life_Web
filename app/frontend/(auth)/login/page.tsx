"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
.root{font-family:'Outfit',sans-serif;background:#0a0e1a;min-height:100vh;display:flex;flex-direction:column}
.main{flex:1;display:flex;max-width:1100px;margin:0 auto;width:100%;padding:32px;gap:0}
.left{flex:1;position:relative;border-radius:20px 0 0 20px;overflow:hidden;min-height:500px}
.left img{width:100%;height:100%;object-fit:cover}
.ov{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.1) 40%,rgba(5,20,40,.9) 100%)}
.lc{position:absolute;bottom:32px;left:28px;right:28px}
.brand{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.bn{font-size:22px;font-weight:700;color:#4dd9e8}
.bt{color:rgba(255,255,255,.75);font-size:14px}
.dots{display:flex;gap:6px;margin-top:14px}
.dot{height:3px;border-radius:2px}
.dot.a{width:28px;background:#4dd9e8}
.dot:not(.a){width:10px;background:rgba(255,255,255,.3)}
.right{width:360px;background:#111827;border-radius:0 20px 20px 0;padding:44px 36px;display:flex;flex-direction:column;justify-content:center}
h1{font-size:26px;font-weight:700;color:#fff;margin-bottom:4px}
.sub{font-size:13px;color:rgba(255,255,255,.4);margin-bottom:26px}
.fl{font-size:10px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:rgba(255,255,255,.45);display:block;margin-bottom:5px}
input[type=email],input[type=password],input[type=text]{width:100%;padding:11px 14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#fff;font-size:14px;font-family:'Outfit',sans-serif;outline:none;margin-bottom:14px;transition:border-color .2s}
input[type=email]:focus,input[type=password]:focus,input[type=text]:focus{border-color:#4dd9e8}
input::placeholder{color:rgba(255,255,255,.22)}
.row{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;font-size:13px;color:rgba(255,255,255,.5)}
.row label{display:flex;align-items:center;gap:6px;cursor:pointer}
.row a{color:rgba(255,255,255,.5);text-decoration:none}
.row a:hover{color:#4dd9e8}
input[type=checkbox]{accent-color:#4dd9e8}
.btn{width:100%;padding:12px;background:linear-gradient(135deg,#2d9cdb,#4dd9e8);border:none;border-radius:8px;color:#fff;font-size:15px;font-weight:600;font-family:'Outfit',sans-serif;cursor:pointer;transition:opacity .2s,transform .15s}
.btn:hover{opacity:.9;transform:translateY(-1px)}
.div{display:flex;align-items:center;gap:10px;margin:18px 0}
.dl{flex:1;height:1px;background:rgba(255,255,255,.08)}
.dt{font-size:11px;color:rgba(255,255,255,.28);text-transform:uppercase;letter-spacing:.5px;white-space:nowrap}
.soc{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:22px}
.sb{padding:10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:rgba(255,255,255,.65);font-size:13px;font-family:'Outfit',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;transition:background .2s}
.sb:hover{background:rgba(255,255,255,.09)}
.pt{text-align:center;font-size:13px;color:rgba(255,255,255,.38)}
.pt a{color:#4dd9e8;text-decoration:none;font-weight:500}
footer{background:#0d1424;border-top:1px solid rgba(255,255,255,.06);padding:36px 32px 20px}
.fg{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1.6fr 1fr 1fr 1.4fr;gap:28px;margin-bottom:24px}
.fbn{color:#4dd9e8;font-size:15px;font-weight:700;margin-bottom:8px}
.fbd{color:rgba(255,255,255,.3);font-size:12px;line-height:1.6;margin-bottom:12px}
.fct{font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.45);margin-bottom:12px}
.fl-list{list-style:none;display:flex;flex-direction:column;gap:8px}
.fl-list a{color:rgba(255,255,255,.3);text-decoration:none;font-size:13px}
.fl-list a:hover{color:rgba(255,255,255,.7)}
.nt{color:rgba(255,255,255,.3);font-size:12px;line-height:1.5;margin-bottom:10px}
.ni{display:flex;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,.09)}
.ni input{flex:1;padding:8px 12px;background:rgba(255,255,255,.04);border:none;color:#fff;font-size:12px;font-family:'Outfit',sans-serif;outline:none}
.ni button{padding:8px 13px;background:#2d9cdb;border:none;color:#fff;cursor:pointer;font-size:12px;transition:background .2s}
.ni button:hover{background:#4dd9e8}
.fb{max-width:1100px;margin:0 auto;padding-top:16px;border-top:1px solid rgba(255,255,255,.05);text-align:center;color:rgba(255,255,255,.18);font-size:11px}
@media(max-width:760px){.main{flex-direction:column;padding:16px}.left{border-radius:16px 16px 0 0;min-height:200px}.right{width:100%;border-radius:0 0 16px 16px;padding:28px 20px}.fg{grid-template-columns:1fr 1fr}}
`;

const GIcon = () => <svg width="15" height="15" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.27 9.76A7.08 7.08 0 0 1 19.07 12H12v-2.22h7.5A7.08 7.08 0 0 0 5.27 9.76z"/><path fill="#4285F4" d="M12 19.08a7.06 7.06 0 0 1-6.73-4.84l-3.27 2.54A11.93 11.93 0 0 0 12 24c3.24 0 5.95-1.18 7.94-3.09l-3.1-2.41A7.07 7.07 0 0 1 12 19.08z"/><path fill="#FBBC05" d="M5.27 14.24A7.1 7.1 0 0 1 4.92 12c0-.77.13-1.52.35-2.24L2 7.22A11.94 11.94 0 0 0 0 12c0 1.93.46 3.76 1.27 5.37l4-3.13z"/><path fill="#34A853" d="M12 4.92c1.77 0 3.36.61 4.61 1.8l3.45-3.45C18.08 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.27 6.63l4 3.13A7.08 7.08 0 0 1 12 4.92z"/></svg>;
const AIcon = () => <svg width="13" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-2.17 1.28-2.15 3.81 0 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>;

const Footer = () => (
  <footer>
    <div className="fg">
      <div><p className="fbn">AquaLife</p><p className="fbd">The ultimate platform for premium aquarium management, AI identification, and high-end aquatic supplies.</p></div>
      <div><p className="fct">Experience</p><ul className="fl-list"><li><a href="#">Catalog</a></li><li><a href="#">AI Identifier</a></li><li><a href="#">Marine Ecosystems</a></li><li><a href="#">Freshwater Guides</a></li></ul></div>
      <div><p className="fct">Legal</p><ul className="fl-list"><li><a href="#">Shipping Policy</a></li><li><a href="#">Return Policy</a></li><li><a href="#">Terms of Service</a></li><li><a href="#">Privacy Policy</a></li></ul></div>
      <div><p className="fct">Newsletter</p><p className="nt">Get the latest updates on rare species and exclusive offers.</p><div className="ni"><input type="email" placeholder="Your Email" /><button>▶</button></div></div>
    </div>
    <div className="fb">© 2026 AquaLife Premium Aquatics. All rights reserved.</div>
  </footer>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, remember });
    alert("Login Successful");
    router.push("/");
  };

  return (
    <>
      <style>{S}</style>
      <div className="root">
        <main className="main">
          <div className="left">
            <img src="https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&q=80" alt="Coral reef" />
            <div className="ov" />
            <div className="lc">
              <div className="brand"><span style={{color:"#4dd9e8",fontSize:22}}>〜</span><span className="bn">AquaLife</span></div>
              <p className="bt">Dive into your aquatic ecosystem</p>
              <div className="dots"><div className="dot a"/><div className="dot"/><div className="dot"/></div>
            </div>
          </div>
          <div className="right">
            <h1>Welcome Back</h1>
            <p className="sub">Log in to manage your premium aquatics.</p>
            <form onSubmit={handleLogin}>
              <label className="fl">Email Address</label>
              <input type="email" placeholder="name@company.com" value={email} onChange={e=>setEmail(e.target.value)} required />
              <label className="fl">Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required />
              <div className="row">
                <label><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} /> Remember device</label>
                <a href="#">Forgot?</a>
              </div>
              <button type="submit" className="btn">Sign in →</button>
            </form>
            <div className="div"><div className="dl"/><span className="dt">or continue with</span><div className="dl"/></div>
            <div className="soc">
              <button className="sb"><GIcon/>Google</button>
              <button className="sb"><AIcon/>Apple</button>
            </div>
            <p className="pt">Don&apos;t have an account? <Link href="/frontend/register">Create one</Link></p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}