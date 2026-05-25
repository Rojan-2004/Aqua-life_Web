"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
.root{font-family:'Outfit',sans-serif;background:#0a0e1a;min-height:100vh;display:flex;flex-direction:column}
.main{flex:1;display:flex;max-width:1060px;margin:0 auto;width:100%;padding:32px;gap:0}
.left{flex:1;position:relative;border-radius:20px 0 0 20px;overflow:hidden;min-height:520px}
.left img{width:100%;height:100%;object-fit:cover}
.ov{position:absolute;inset:0;background:linear-gradient(160deg,rgba(5,15,35,.55) 0%,rgba(5,20,40,.7) 60%,rgba(5,15,30,.92) 100%)}
.lc{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:40px 36px}
.headline{font-size:42px;font-weight:800;line-height:1.1;color:#fff;margin-bottom:14px;letter-spacing:-1px}
.headline span{color:#f4a93a}
.body{font-size:14px;color:rgba(255,255,255,.6);line-height:1.6;margin-bottom:24px;max-width:280px}
.feats{display:flex;gap:16px;flex-wrap:wrap}
.feat{display:flex;align-items:center;gap:7px;font-size:12px;color:rgba(255,255,255,.6)}
.fi{width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:13px}
.right{width:380px;background:#111827;border-radius:0 20px 20px 0;padding:44px 38px;display:flex;flex-direction:column;justify-content:center}
h1{font-size:26px;font-weight:700;color:#fff;margin-bottom:4px}
.sub{font-size:13px;color:rgba(255,255,255,.4);margin-bottom:26px}
.fl{font-size:10px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:rgba(255,255,255,.45);display:block;margin-bottom:5px}
input[type=email],input[type=password],input[type=text]{width:100%;padding:11px 14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#fff;font-size:14px;font-family:'Outfit',sans-serif;outline:none;margin-bottom:14px;transition:border-color .2s}
input[type=email]:focus,input[type=password]:focus,input[type=text]:focus{border-color:#4dd9e8}
input::placeholder{color:rgba(255,255,255,.22)}
input[type=checkbox]{accent-color:#4dd9e8}
.terms{display:flex;align-items:flex-start;gap:8px;margin:4px 0 20px;font-size:12px;color:rgba(255,255,255,.4);line-height:1.5}
.terms a{color:rgba(255,255,255,.6);text-decoration:underline}
.btn{width:100%;padding:12px;background:linear-gradient(135deg,#2d9cdb,#4dd9e8);border:none;border-radius:8px;color:#fff;font-size:15px;font-weight:600;font-family:'Outfit',sans-serif;cursor:pointer;margin-bottom:18px;transition:opacity .2s,transform .15s}
.btn:hover{opacity:.9;transform:translateY(-1px)}
.div{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.dl{flex:1;height:1px;background:rgba(255,255,255,.08)}
.dt{font-size:11px;color:rgba(255,255,255,.28);text-transform:uppercase;letter-spacing:.5px;white-space:nowrap}
.soc{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:22px}
.sb{padding:10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:rgba(255,255,255,.65);font-size:13px;font-family:'Outfit',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;transition:background .2s}
.sb:hover{background:rgba(255,255,255,.09)}
.pt{text-align:center;font-size:13px;color:rgba(255,255,255,.38)}
.pt a{color:#4dd9e8;text-decoration:none;font-weight:500}
footer{background:#0d1424;border-top:1px solid rgba(255,255,255,.06);padding:36px 32px 20px}
.fg{max-width:1060px;margin:0 auto;display:grid;grid-template-columns:1.6fr 1fr 1fr 1.4fr;gap:28px;margin-bottom:24px}
.fbn{color:#4dd9e8;font-size:15px;font-weight:700;margin-bottom:8px}
.fbd{color:rgba(255,255,255,.3);font-size:12px;line-height:1.6}
.fct{font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.45);margin-bottom:12px}
.fl-list{list-style:none;display:flex;flex-direction:column;gap:8px}
.fl-list a{color:rgba(255,255,255,.3);text-decoration:none;font-size:13px}
.fl-list a:hover{color:rgba(255,255,255,.7)}
.nt{color:rgba(255,255,255,.3);font-size:12px;line-height:1.5;margin-bottom:10px}
.ni{display:flex;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,.09)}
.ni input{flex:1;padding:8px 12px;background:rgba(255,255,255,.04);border:none;color:#fff;font-size:12px;font-family:'Outfit',sans-serif;outline:none;margin-bottom:0}
.ni button{padding:8px 14px;background:#2d9cdb;border:none;color:#fff;cursor:pointer;font-size:12px;font-weight:600;font-family:'Outfit',sans-serif;transition:background .2s}
.ni button:hover{background:#4dd9e8}
.fb{max-width:1060px;margin:0 auto;padding-top:16px;border-top:1px solid rgba(255,255,255,.05);display:flex;justify-content:space-between;color:rgba(255,255,255,.18);font-size:11px}
@media(max-width:760px){.main{flex-direction:column;padding:16px}.left{border-radius:16px 16px 0 0;min-height:240px}.right{width:100%;border-radius:0 0 16px 16px;padding:28px 20px}.fg{grid-template-columns:1fr 1fr}.fb{flex-direction:column;gap:6px;text-align:center}.headline{font-size:28px}}
`;

const GIcon = () => <svg width="15" height="15" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.27 9.76A7.08 7.08 0 0 1 19.07 12H12v-2.22h7.5A7.08 7.08 0 0 0 5.27 9.76z"/><path fill="#4285F4" d="M12 19.08a7.06 7.06 0 0 1-6.73-4.84l-3.27 2.54A11.93 11.93 0 0 0 12 24c3.24 0 5.95-1.18 7.94-3.09l-3.1-2.41A7.07 7.07 0 0 1 12 19.08z"/><path fill="#FBBC05" d="M5.27 14.24A7.1 7.1 0 0 1 4.92 12c0-.77.13-1.52.35-2.24L2 7.22A11.94 11.94 0 0 0 0 12c0 1.93.46 3.76 1.27 5.37l4-3.13z"/><path fill="#34A853" d="M12 4.92c1.77 0 3.36.61 4.61 1.8l3.45-3.45C18.08 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.27 6.63l4 3.13A7.08 7.08 0 0 1 12 4.92z"/></svg>;
const AIcon = () => <svg width="13" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-2.17 1.28-2.15 3.81 0 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>;

const SocialBtns = () => (
  <div className="soc">
    <button className="sb"><GIcon/>Google</button>
    <button className="sb"><AIcon/>Apple</button>
  </div>
);

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { alert("Please agree to the Terms of Service."); return; }
    console.log({ name, email, password });
    alert("Registration Successful");
    router.push("/frontend/login");
  };

  return (
    <>
      <style>{S}</style>
      <div className="root">
        <main className="main">
          <div className="left">
            <img src="https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=800&q=80" alt="Underwater" />
            <div className="ov" />
            <div className="lc">
              <h2 className="headline">Dive Into<br /><span>Excellence.</span></h2>
              <p className="body">Join the premier community for aquatic enthusiasts. Manage your tank, explore rare species, and order premium supplies fast with AquaLife.</p>
              <div className="feats">
                <div className="feat"><div className="fi">🐠</div>Curated Species</div>
                <div className="feat"><div className="fi">🚀</div>Express Shipping</div>
              </div>
            </div>
          </div>
          <div className="right">
            <h1>Create Account</h1>
            <p className="sub">Start your aquatic journey today.</p>
            <form onSubmit={handleRegister}>
              <label className="fl">Full Name</label>
              <input type="text" placeholder="Your full name" value={name} onChange={e=>setName(e.target.value)} required />
              <label className="fl">Email</label>
              <input type="email" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)} required />
              <label className="fl">Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required />
              <div className="terms">
                <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:2,flexShrink:0}} />
                <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</span>
              </div>
              <button type="submit" className="btn">Create Account</button>
            </form>
            <div className="div"><div className="dl"/><span className="dt">or continue with</span><div className="dl"/></div>
            <SocialBtns />
            <p className="pt">Already have an account? <Link href="/frontend/login">Log in</Link></p>
          </div>
        </main>
        <footer>
          <div className="fg">
            <div><p className="fbn">AquaLife</p><p className="fbd">Premium aquatics and life support systems for the modern aquarist. Specializing in rare species and tech-forward reef management.</p></div>
            <div><p className="fct">Navigation</p><ul className="fl-list"><li><a href="#">About Us</a></li><li><a href="#">Contact</a></li><li><a href="#">Shipping Policy</a></li></ul></div>
            <div><p className="fct">Support</p><ul className="fl-list"><li><a href="#">Return Policy</a></li><li><a href="#">Terms of Service</a></li><li><a href="#">Privacy Policy</a></li></ul></div>
            <div><p className="fct">Newsletter</p><p className="nt">Stay updated on new arrivals and seasonal offers.</p><div className="ni"><input type="email" placeholder="Your Email" /><button>JOIN</button></div></div>
          </div>
          <div className="fb"><span>© 2026 AquaLife Premium Aquatics. All rights reserved.</span><span>14699 CARIAD OPTIMIZED · GLACIER UI V2.0</span></div>
        </footer>
      </div>
    </>
  );
}