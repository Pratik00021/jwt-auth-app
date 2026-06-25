import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const API = "https://jwt-auth-app.onrender.com/api";
const getToken = () => localStorage.getItem("token");
const getUser = () => JSON.parse(localStorage.getItem("user") || "null");

const api = axios.create({ baseURL: API });
api.interceptors.request.use(cfg => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

const S = {
  app: { fontFamily: "'Inter', -apple-system, sans-serif", background: "#F0F2F5", minHeight: "100vh" },
  sidebar: { width: 240, background: "#1a1a2e", minHeight: "100vh", position: "fixed", left: 0, top: 0, padding: "0 0 2rem" },
  sidebarLogo: { padding: "1.5rem 1.5rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "0.5rem" },
  logoText: { color: "#fff", fontWeight: 700, fontSize: 18, margin: 0 },
  logoSub: { color: "#6B7DB3", fontSize: 11, margin: "2px 0 0" },
  navItem: (a) => ({ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", margin: "2px 12px", borderRadius: 8, cursor: "pointer", color: a ? "#fff" : "#8892B0", background: a ? "#2563EB" : "transparent", fontWeight: a ? 600 : 400, fontSize: 14, border: "none", width: "calc(100% - 24px)", textAlign: "left" }),
  main: { marginLeft: 240, padding: "2rem" },
  topbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" },
  pageTitle: { fontSize: 22, fontWeight: 700, color: "#1a1a2e", margin: 0 },
  pageSub: { fontSize: 13, color: "#6B7DB3", margin: "2px 0 0" },
  card: { background: "#fff", borderRadius: 12, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  statCard: (c) => ({ background: "#fff", borderRadius: 12, padding: "1.25rem 1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${c}` }),
  statVal: { fontSize: 28, fontWeight: 700, margin: "0 0 4px", color: "#1a1a2e" },
  statLabel: { fontSize: 13, color: "#6B7DB3", margin: 0 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "1rem", marginBottom: "1.5rem" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" },
  btn: (v="primary") => ({ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: v==="primary"?"#2563EB":v==="danger"?"#EF4444":v==="success"?"#10B981":v==="warning"?"#F59E0B":"#F0F2F5", color: v==="ghost"?"#374151":"#fff" }),
  input: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", boxSizing: "border-box" },
  label: { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6B7DB3", textTransform: "uppercase", borderBottom: "1.5px solid #F0F2F5" },
  td: { padding: "12px 14px", fontSize: 14, color: "#374151", borderBottom: "1px solid #F9FAFB" },
  badge: (c) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: c+"18", color: c }),
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" },
  modalBox: { background: "#fff", borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" },
  formGroup: { marginBottom: "1rem" },
  alert: (t) => ({ padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: "1rem", background: t==="error"?"#FEF2F2":"#F0FDF4", color: t==="error"?"#DC2626":"#16A34A", border: `1px solid ${t==="error"?"#FECACA":"#BBF7D0"}` }),
  emptyState: { textAlign: "center", padding: "3rem 1rem", color: "#9CA3AF" },
  searchBar: { display: "flex", gap: "0.75rem", marginBottom: "1rem", alignItems: "center", flexWrap: "wrap" },
};

// ── AUTH ─────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const handle = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await axios.post(`${API}/auth/login`, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) { setError(err.response?.data?.message || "Login failed"); }
    setLoading(false);
  };
  return (
    <div style={{ minHeight:"100vh", background:"#F0F2F5", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:420 }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ width:56, height:56, background:"#2563EB", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem", fontSize:24 }}>📦</div>
          <h1 style={{ fontSize:24, fontWeight:700, margin:"0 0 4px", color:"#1a1a2e" }}>StockMate</h1>
          <p style={{ color:"#6B7DB3", margin:0, fontSize:14 }}>Inventory Management System</p>
        </div>
        <div style={{ ...S.card, padding:"2rem" }}>
          <h2 style={{ margin:"0 0 1.5rem", fontSize:18, fontWeight:600 }}>Sign in</h2>
          {error && <div style={S.alert("error")}>{error}</div>}
          <form onSubmit={handle}>
            <div style={S.formGroup}><label style={S.label}>Email</label><input style={S.input} type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
            <div style={S.formGroup}><label style={S.label}>Password</label><input style={S.input} type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required /></div>
            <button type="submit" style={{ ...S.btn("primary"), width:"100%", padding:"11px", marginTop:"0.5rem" }} disabled={loading}>{loading?"Signing in...":"Sign in"}</button>
          </form>
          <p style={{ textAlign:"center", marginTop:"1rem", fontSize:13, color:"#6B7DB3" }}>No account? <span style={{ color:"#2563EB", cursor:"pointer", fontWeight:600 }} onClick={()=>window.location.hash="register"}>Create one</span></p>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ onLogin }) {
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const handle = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await axios.post(`${API}/auth/register`, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) { setError(err.response?.data?.message || "Registration failed"); }
    setLoading(false);
  };
  return (
    <div style={{ minHeight:"100vh", background:"#F0F2F5", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:420 }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ width:56, height:56, background:"#2563EB", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem", fontSize:24 }}>📦</div>
          <h1 style={{ fontSize:24, fontWeight:700, margin:"0 0 4px", color:"#1a1a2e" }}>StockMate</h1>
          <p style={{ color:"#6B7DB3", margin:0, fontSize:14 }}>Inventory Management System</p>
        </div>
        <div style={{ ...S.card, padding:"2rem" }}>
          <h2 style={{ margin:"0 0 1.5rem", fontSize:18, fontWeight:600 }}>Create account</h2>
          {error && <div style={S.alert("error")}>{error}</div>}
          <form onSubmit={handle}>
            <div style={S.formGroup}><label style={S.label}>Full Name</label><input style={S.input} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
            <div style={S.formGroup}><label style={S.label}>Email</label><input style={S.input} type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
            <div style={S.formGroup}><label style={S.label}>Password</label><input style={S.input} type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required /></div>
            <button type="submit" style={{ ...S.btn("primary"), width:"100%", padding:"11px", marginTop:"0.5rem" }} disabled={loading}>{loading?"Creating...":"Create account"}</button>
          </form>
          <p style={{ textAlign:"center", marginTop:"1rem", fontSize:13, color:"#6B7DB3" }}>Have account? <span style={{ color:"#2563EB", cursor:"pointer", fontWeight:600 }} onClick={()=>window.location.hash=""}>Sign in</span></p>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD WITH CHARTS ─────────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState({ total:0, totalValue:0, lowStock:0, categories:0, totalSales:0, totalPurchases:0, profit:0 });
  const [recent, setRecent] = useState([]);
  const [catData, setCatData] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    api.get("/products").then(r => {
      setStats(s=>({...s, total:r.data.count, totalValue:r.data.totalValue, lowStock:r.data.lowStockCount}));
      setRecent(r.data.products.slice(0,5));
    });
    api.get("/categories").then(r => {
      setStats(s=>({...s, categories:r.data.categories.length}));
      setCatData(r.data.categories.map(c=>({ name:c.name, value:c.productCount, color:c.color })).filter(c=>c.value>0));
    });
    api.get("/transactions").then(r => {
      setStats(s=>({...s, totalSales:r.data.totalSales, totalPurchases:r.data.totalPurchases, profit:r.data.profit}));
      const last7 = [];
      for(let i=6;i>=0;i--) {
        const d = new Date(); d.setDate(d.getDate()-i);
        const label = d.toLocaleDateString("en-IN",{month:"short",day:"numeric"});
        const dayTx = r.data.transactions.filter(t => new Date(t.createdAt).toDateString()===d.toDateString());
        last7.push({ date:label, sales:dayTx.filter(t=>t.type==="sale").reduce((s,t)=>s+t.total,0), purchases:dayTx.filter(t=>t.type==="purchase").reduce((s,t)=>s+t.total,0) });
      }
      setSalesData(last7);
    });
  }, []);

  const cards = [
    { label:"Total Products", value:stats.total, color:"#2563EB", icon:"📦" },
    { label:"Inventory Value", value:`₹${stats.totalValue.toLocaleString("en-IN")}`, color:"#10B981", icon:"💰" },
    { label:"Total Sales", value:`₹${stats.totalSales.toLocaleString("en-IN")}`, color:"#8B5CF6", icon:"🛒" },
    { label:"Net Profit", value:`₹${stats.profit.toLocaleString("en-IN")}`, color:stats.profit>=0?"#10B981":"#EF4444", icon:"📈" },
    { label:"Low Stock Alerts", value:stats.lowStock, color:"#EF4444", icon:"⚠️" },
    { label:"Categories", value:stats.categories, color:"#F59E0B", icon:"🏷️" },
  ];

  return (
    <div>
      <div style={S.topbar}><div><h1 style={S.pageTitle}>Dashboard</h1><p style={S.pageSub}>Welcome back! Here's your inventory overview.</p></div><span style={{ fontSize:13, color:"#6B7DB3" }}>{new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</span></div>
      <div style={{ ...S.grid4, gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))" }}>
        {cards.map(c=>(
          <div key={c.label} style={S.statCard(c.color)}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div><p style={S.statVal}>{c.value}</p><p style={S.statLabel}>{c.label}</p></div>
              <span style={{ fontSize:24 }}>{c.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={S.grid2}>
        <div style={S.card}>
          <h3 style={{ margin:"0 0 1rem", fontSize:15, fontWeight:600 }}>Sales vs Purchases (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salesData} margin={{ top:5, right:10, left:0, bottom:5 }}>
              <XAxis dataKey="date" tick={{ fontSize:11 }} />
              <YAxis tick={{ fontSize:11 }} />
              <Tooltip formatter={(v)=>`₹${v.toLocaleString("en-IN")}`} />
              <Legend />
              <Bar dataKey="sales" name="Sales" fill="#2563EB" radius={[4,4,0,0]} />
              <Bar dataKey="purchases" name="Purchases" fill="#10B981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={S.card}>
          <h3 style={{ margin:"0 0 1rem", fontSize:15, fontWeight:600 }}>Products by Category</h3>
          {catData.length===0 ? <div style={S.emptyState}>No category data yet</div> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={catData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                  {catData.map((c,i)=><Cell key={i} fill={c.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div style={S.card}>
        <h3 style={{ margin:"0 0 1rem", fontSize:15, fontWeight:600 }}>Recent Products</h3>
        {recent.length===0 ? <div style={S.emptyState}>No products yet. Add your first product!</div> : (
          <table style={S.table}>
            <thead><tr>{["Product","SKU","Category","Stock","Price","Status"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>{recent.map(p=>(
              <tr key={p._id}>
                <td style={S.td}><strong>{p.name}</strong></td>
                <td style={S.td}><code style={{ background:"#F0F2F5", padding:"2px 6px", borderRadius:4, fontSize:12 }}>{p.sku}</code></td>
                <td style={S.td}><span style={S.badge(p.category?.color||"#2563EB")}>{p.category?.name||"—"}</span></td>
                <td style={S.td}>{p.quantity} {p.unit}</td>
                <td style={S.td}>₹{p.price.toLocaleString("en-IN")}</td>
                <td style={S.td}><span style={S.badge(p.quantity<=p.minQuantity?"#EF4444":"#10B981")}>{p.quantity<=p.minQuantity?"Low Stock":"In Stock"}</span></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── PRODUCTS WITH SEARCH + FILTER + PAGINATION ────────────────────────
function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:"", sku:"", category:"", price:"", costPrice:"", quantity:"", minQuantity:10, unit:"pcs", description:"", supplier:"" });
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(() => {
    let q = `?search=${search}`; if(filterCat) q+=`&category=${filterCat}`; if(filterStock==="low") q+=`&lowStock=true`;
    api.get(`/products${q}`).then(r=>{ setProducts(r.data.products); setPage(1); });
  }, [search, filterCat, filterStock]);

  useEffect(()=>{fetchProducts();},[fetchProducts]);
  useEffect(()=>{api.get("/categories").then(r=>setCategories(r.data.categories));},[]);

  const paginated = products.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const totalPages = Math.ceil(products.length/PER_PAGE);

  const openAdd = () => { setEditing(null); setForm({name:"",sku:"",category:"",price:"",costPrice:"",quantity:"",minQuantity:10,unit:"pcs",description:"",supplier:""}); setError(""); setShowModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({...p,category:p.category?._id||""}); setError(""); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      if(editing) await api.put(`/products/${editing._id}`, form);
      else await api.post("/products", form);
      setShowModal(false); fetchProducts();
    } catch(err) { setError(err.response?.data?.message||"Error saving"); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`); fetchProducts();
  };

  const exportCSV = () => {
    const rows = [["Name","SKU","Category","Price","Cost","Quantity","Unit","Value"]];
    products.forEach(p=>rows.push([p.name,p.sku,p.category?.name,p.price,p.costPrice,p.quantity,p.unit,p.price*p.quantity]));
    const blob = new Blob([rows.map(r=>r.join(",")).join("\n")],{type:"text/csv"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="inventory.csv"; a.click();
  };

  return (
    <div>
      <div style={S.topbar}>
        <div><h1 style={S.pageTitle}>Products</h1><p style={S.pageSub}>{products.length} products total</p></div>
        <div style={{ display:"flex", gap:8 }}>
          <button style={S.btn("ghost")} onClick={exportCSV}>⬇ Export CSV</button>
          <button style={S.btn("primary")} onClick={openAdd}>+ Add Product</button>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.searchBar}>
          <input style={{ ...S.input, maxWidth:240 }} placeholder="🔍 Search by name..." value={search} onChange={e=>setSearch(e.target.value)} />
          <select style={{ ...S.input, maxWidth:160 }} value={filterCat} onChange={e=>setFilterCat(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select style={{ ...S.input, maxWidth:140 }} value={filterStock} onChange={e=>setFilterStock(e.target.value)}>
            <option value="">All Stock</option>
            <option value="low">Low Stock Only</option>
          </select>
          {(search||filterCat||filterStock) && <button style={S.btn("ghost")} onClick={()=>{setSearch("");setFilterCat("");setFilterStock("");}}>✕ Clear</button>}
        </div>

        {paginated.length===0 ? <div style={S.emptyState}><p style={{ fontSize:32, margin:"0 0 8px" }}>📦</p><p>No products found.</p></div> : (
          <table style={S.table}>
            <thead><tr>{["Product","SKU","Category","Price","Cost","Stock","Value","Status","Actions"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>{paginated.map(p=>(
              <tr key={p._id}>
                <td style={S.td}><div style={{ fontWeight:600 }}>{p.name}</div><div style={{ fontSize:12, color:"#9CA3AF" }}>{p.supplier}</div></td>
                <td style={S.td}><code style={{ background:"#F0F2F5", padding:"2px 6px", borderRadius:4, fontSize:12 }}>{p.sku}</code></td>
                <td style={S.td}><span style={S.badge(p.category?.color||"#6B7DB3")}>{p.category?.name||"—"}</span></td>
                <td style={S.td}>₹{p.price.toLocaleString("en-IN")}</td>
                <td style={S.td}>₹{p.costPrice.toLocaleString("en-IN")}</td>
                <td style={S.td}><span style={{ fontWeight:p.quantity<=p.minQuantity?700:400, color:p.quantity<=p.minQuantity?"#EF4444":"#374151" }}>{p.quantity} {p.unit}</span></td>
                <td style={S.td}>₹{(p.price*p.quantity).toLocaleString("en-IN")}</td>
                <td style={S.td}><span style={S.badge(p.quantity<=p.minQuantity?"#EF4444":"#10B981")}>{p.quantity<=p.minQuantity?"Low Stock":"In Stock"}</span></td>
                <td style={S.td}><div style={{ display:"flex", gap:6 }}><button style={S.btn("ghost")} onClick={()=>openEdit(p)}>Edit</button><button style={S.btn("danger")} onClick={()=>handleDelete(p._id)}>Del</button></div></td>
              </tr>
            ))}</tbody>
          </table>
        )}

        {totalPages>1 && (
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"1rem", paddingTop:"1rem", borderTop:"1px solid #F0F2F5" }}>
            <span style={{ fontSize:13, color:"#6B7DB3" }}>Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,products.length)} of {products.length}</span>
            <div style={{ display:"flex", gap:6 }}>
              <button style={S.btn("ghost")} onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>← Prev</button>
              {Array.from({length:totalPages},(_,i)=>(
                <button key={i} style={{ ...S.btn(page===i+1?"primary":"ghost"), padding:"8px 12px" }} onClick={()=>setPage(i+1)}>{i+1}</button>
              ))}
              <button style={S.btn("ghost")} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div style={S.modal} onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div style={S.modalBox}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
              <h2 style={{ margin:0, fontSize:18, fontWeight:600 }}>{editing?"Edit Product":"Add New Product"}</h2>
              <button style={{ ...S.btn("ghost"), padding:"4px 10px" }} onClick={()=>setShowModal(false)}>✕</button>
            </div>
            {error && <div style={S.alert("error")}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ display:"flex", gap:"1rem" }}>
                <div style={{ ...S.formGroup, flex:1 }}><label style={S.label}>Product Name *</label><input style={S.input} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
                <div style={{ ...S.formGroup, flex:1 }}><label style={S.label}>SKU *</label><input style={S.input} placeholder="PROD-001" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} required /></div>
              </div>
              <div style={S.formGroup}><label style={S.label}>Category *</label>
                <select style={S.input} value={form.category} onChange={e=>setForm({...form,category:e.target.value})} required>
                  <option value="">Select category</option>
                  {categories.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display:"flex", gap:"1rem" }}>
                <div style={{ ...S.formGroup, flex:1 }}><label style={S.label}>Selling Price (₹) *</label><input style={S.input} type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required /></div>
                <div style={{ ...S.formGroup, flex:1 }}><label style={S.label}>Cost Price (₹) *</label><input style={S.input} type="number" min="0" value={form.costPrice} onChange={e=>setForm({...form,costPrice:e.target.value})} required /></div>
              </div>
              <div style={{ display:"flex", gap:"1rem" }}>
                <div style={{ ...S.formGroup, flex:1 }}><label style={S.label}>Stock Quantity *</label><input style={S.input} type="number" min="0" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} required /></div>
                <div style={{ ...S.formGroup, flex:1 }}><label style={S.label}>Min Stock Alert</label><input style={S.input} type="number" min="0" value={form.minQuantity} onChange={e=>setForm({...form,minQuantity:e.target.value})} /></div>
                <div style={{ ...S.formGroup, width:90 }}><label style={S.label}>Unit</label>
                  <select style={S.input} value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}>
                    {["pcs","kg","g","L","mL","box","pack","set"].map(u=><option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div style={S.formGroup}><label style={S.label}>Supplier</label><input style={S.input} placeholder="Supplier name" value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})} /></div>
              <div style={S.formGroup}><label style={S.label}>Description</label><textarea style={{ ...S.input, height:70, resize:"vertical" }} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
              <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                <button type="button" style={S.btn("ghost")} onClick={()=>setShowModal(false)}>Cancel</button>
                <button type="submit" style={S.btn("primary")} disabled={loading}>{loading?"Saving...":editing?"Update":"Add Product"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CATEGORIES ────────────────────────────────────────────────────────
function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:"", description:"", color:"#2563EB" });
  const [error, setError] = useState("");
  const COLORS = ["#2563EB","#10B981","#EF4444","#F59E0B","#8B5CF6","#EC4899","#06B6D4","#84CC16"];
  const fetch = () => api.get("/categories").then(r=>setCategories(r.data.categories));
  useEffect(()=>{fetch();},[]);
  const openAdd = () => { setEditing(null); setForm({name:"",description:"",color:"#2563EB"}); setError(""); setShowModal(true); };
  const openEdit = (c) => { setEditing(c); setForm(c); setError(""); setShowModal(true); };
  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    try {
      if(editing) await api.put(`/categories/${editing._id}`, form);
      else await api.post("/categories", form);
      setShowModal(false); fetch();
    } catch(err) { setError(err.response?.data?.message||"Error"); }
  };
  const handleDelete = async (id) => {
    if(!window.confirm("Delete?")) return;
    try { await api.delete(`/categories/${id}`); fetch(); }
    catch(err) { alert(err.response?.data?.message||"Error"); }
  };
  return (
    <div>
      <div style={S.topbar}><div><h1 style={S.pageTitle}>Categories</h1><p style={S.pageSub}>{categories.length} categories</p></div><button style={S.btn("primary")} onClick={openAdd}>+ Add Category</button></div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"1rem" }}>
        {categories.length===0 ? <div style={{ ...S.card, ...S.emptyState }}>No categories yet!</div> : categories.map(c=>(
          <div key={c._id} style={{ ...S.card, borderTop:`4px solid ${c.color}` }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <div><h3 style={{ margin:"0 0 4px", fontSize:16, fontWeight:600 }}>{c.name}</h3><p style={{ margin:"0 0 8px", fontSize:13, color:"#6B7DB3" }}>{c.description||"No description"}</p><span style={S.badge(c.color)}>{c.productCount} products</span></div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <button style={{ ...S.btn("ghost"), padding:"5px 10px", fontSize:12 }} onClick={()=>openEdit(c)}>Edit</button>
                <button style={{ ...S.btn("danger"), padding:"5px 10px", fontSize:12 }} onClick={()=>handleDelete(c._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div style={S.modal} onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div style={{ ...S.modalBox, maxWidth:400 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
              <h2 style={{ margin:0, fontSize:18, fontWeight:600 }}>{editing?"Edit Category":"Add Category"}</h2>
              <button style={{ ...S.btn("ghost"), padding:"4px 10px" }} onClick={()=>setShowModal(false)}>✕</button>
            </div>
            {error && <div style={S.alert("error")}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={S.formGroup}><label style={S.label}>Name *</label><input style={S.input} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
              <div style={S.formGroup}><label style={S.label}>Description</label><input style={S.input} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
              <div style={S.formGroup}><label style={S.label}>Color</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {COLORS.map(col=><div key={col} onClick={()=>setForm({...form,color:col})} style={{ width:32, height:32, borderRadius:"50%", background:col, cursor:"pointer", border:form.color===col?"3px solid #1a1a2e":"3px solid transparent" }} />)}
                </div>
              </div>
              <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                <button type="button" style={S.btn("ghost")} onClick={()=>setShowModal(false)}>Cancel</button>
                <button type="submit" style={S.btn("primary")}>{editing?"Update":"Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SALES & PURCHASE PAGE ─────────────────────────────────────────────
function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [txType, setTxType] = useState("sale");
  const [form, setForm] = useState({ product:"", quantity:"", price:"", party:"", note:"" });
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalSales:0, totalPurchases:0, profit:0 });
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const fetchTx = useCallback(() => {
    let q = filterType ? `?type=${filterType}` : "";
    api.get(`/transactions${q}`).then(r => {
      setTransactions(r.data.transactions);
      setStats({ totalSales:r.data.totalSales, totalPurchases:r.data.totalPurchases, profit:r.data.profit });
      setPage(1);
    });
  }, [filterType]);

  useEffect(()=>{fetchTx();},[fetchTx]);
  useEffect(()=>{api.get("/products").then(r=>setProducts(r.data.products));},[]);

  const filtered = transactions.filter(t => !search || t.product?.name?.toLowerCase().includes(search.toLowerCase()) || t.party?.toLowerCase().includes(search.toLowerCase()));
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const totalPages = Math.ceil(filtered.length/PER_PAGE);

  const openModal = (type) => { setTxType(type); setForm({product:"",quantity:"",price:"",party:"",note:""}); setError(""); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await api.post("/transactions", { ...form, type:txType });
      setShowModal(false); fetchTx();
    } catch(err) { setError(err.response?.data?.message||"Error"); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this transaction? Stock will be reversed.")) return;
    await api.delete(`/transactions/${id}`); fetchTx();
  };

  const selectedProduct = products.find(p=>p._id===form.product);

  return (
    <div>
      <div style={S.topbar}>
        <div><h1 style={S.pageTitle}>Sales & Purchases</h1><p style={S.pageSub}>{transactions.length} transactions recorded</p></div>
        <div style={{ display:"flex", gap:8 }}>
          <button style={S.btn("success")} onClick={()=>openModal("purchase")}>+ New Purchase</button>
          <button style={S.btn("primary")} onClick={()=>openModal("sale")}>+ New Sale</button>
        </div>
      </div>

      <div style={{ ...S.grid4, gridTemplateColumns:"repeat(3,1fr)" }}>
        <div style={S.statCard("#10B981")}><p style={S.statVal}>₹{stats.totalPurchases.toLocaleString("en-IN")}</p><p style={S.statLabel}>Total Purchases</p></div>
        <div style={S.statCard("#2563EB")}><p style={S.statVal}>₹{stats.totalSales.toLocaleString("en-IN")}</p><p style={S.statLabel}>Total Sales</p></div>
        <div style={S.statCard(stats.profit>=0?"#8B5CF6":"#EF4444")}><p style={S.statVal}>₹{stats.profit.toLocaleString("en-IN")}</p><p style={S.statLabel}>Net Profit</p></div>
      </div>

      <div style={S.card}>
        <div style={S.searchBar}>
          <input style={{ ...S.input, maxWidth:240 }} placeholder="🔍 Search product or party..." value={search} onChange={e=>setSearch(e.target.value)} />
          <select style={{ ...S.input, maxWidth:160 }} value={filterType} onChange={e=>setFilterType(e.target.value)}>
            <option value="">All Transactions</option>
            <option value="sale">Sales Only</option>
            <option value="purchase">Purchases Only</option>
          </select>
          {(search||filterType) && <button style={S.btn("ghost")} onClick={()=>{setSearch("");setFilterType("");}}>✕ Clear</button>}
        </div>

        {paginated.length===0 ? (
          <div style={S.emptyState}><p style={{ fontSize:32, margin:"0 0 8px" }}>🧾</p><p>No transactions yet. Record your first sale or purchase!</p></div>
        ) : (
          <table style={S.table}>
            <thead><tr>{["Type","Product","Qty","Unit Price","Total","Party","Date","Action"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>{paginated.map(t=>(
              <tr key={t._id}>
                <td style={S.td}><span style={S.badge(t.type==="sale"?"#2563EB":"#10B981")}>{t.type==="sale"?"🛒 Sale":"📥 Purchase"}</span></td>
                <td style={S.td}><div style={{ fontWeight:600 }}>{t.product?.name||"—"}</div><div style={{ fontSize:11, color:"#9CA3AF" }}>{t.product?.sku}</div></td>
                <td style={S.td}>{t.quantity}</td>
                <td style={S.td}>₹{t.price.toLocaleString("en-IN")}</td>
                <td style={S.td}><strong>₹{t.total.toLocaleString("en-IN")}</strong></td>
                <td style={S.td}>{t.party||"—"}</td>
                <td style={S.td}>{new Date(t.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</td>
                <td style={S.td}><button style={S.btn("danger")} onClick={()=>handleDelete(t._id)}>Del</button></td>
              </tr>
            ))}</tbody>
          </table>
        )}

        {totalPages>1 && (
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"1rem", paddingTop:"1rem", borderTop:"1px solid #F0F2F5" }}>
            <span style={{ fontSize:13, color:"#6B7DB3" }}>Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length}</span>
            <div style={{ display:"flex", gap:6 }}>
              <button style={S.btn("ghost")} onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>← Prev</button>
              {Array.from({length:totalPages},(_,i)=>(
                <button key={i} style={{ ...S.btn(page===i+1?"primary":"ghost"), padding:"8px 12px" }} onClick={()=>setPage(i+1)}>{i+1}</button>
              ))}
              <button style={S.btn("ghost")} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div style={S.modal} onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div style={{ ...S.modalBox, maxWidth:460 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
              <h2 style={{ margin:0, fontSize:18, fontWeight:600 }}>{txType==="sale"?"🛒 New Sale":"📥 New Purchase"}</h2>
              <button style={{ ...S.btn("ghost"), padding:"4px 10px" }} onClick={()=>setShowModal(false)}>✕</button>
            </div>
            {error && <div style={S.alert("error")}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={S.formGroup}><label style={S.label}>Product *</label>
                <select style={S.input} value={form.product} onChange={e=>{ const p=products.find(x=>x._id===e.target.value); setForm({...form,product:e.target.value,price:p?p.price:""}); }} required>
                  <option value="">Select product</option>
                  {products.map(p=><option key={p._id} value={p._id}>{p.name} — Stock: {p.quantity} {p.unit}</option>)}
                </select>
              </div>
              {selectedProduct && (
                <div style={{ background:"#F0F9FF", border:"1px solid #BAE6FD", borderRadius:8, padding:"10px 12px", marginBottom:"1rem", fontSize:13 }}>
                  <strong>{selectedProduct.name}</strong> — Available: <strong>{selectedProduct.quantity} {selectedProduct.unit}</strong> | Price: <strong>₹{selectedProduct.price}</strong>
                </div>
              )}
              <div style={{ display:"flex", gap:"1rem" }}>
                <div style={{ ...S.formGroup, flex:1 }}><label style={S.label}>Quantity *</label><input style={S.input} type="number" min="1" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} required /></div>
                <div style={{ ...S.formGroup, flex:1 }}><label style={S.label}>Unit Price (₹) *</label><input style={S.input} type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required /></div>
              </div>
              {form.quantity && form.price && (
                <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:8, padding:"10px 12px", marginBottom:"1rem", fontSize:14 }}>
                  Total Amount: <strong>₹{(form.quantity*form.price).toLocaleString("en-IN")}</strong>
                </div>
              )}
              <div style={S.formGroup}><label style={S.label}>{txType==="sale"?"Customer Name":"Supplier Name"}</label><input style={S.input} placeholder={txType==="sale"?"Customer name":"Supplier name"} value={form.party} onChange={e=>setForm({...form,party:e.target.value})} /></div>
              <div style={S.formGroup}><label style={S.label}>Note</label><input style={S.input} placeholder="Optional note" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} /></div>
              <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                <button type="button" style={S.btn("ghost")} onClick={()=>setShowModal(false)}>Cancel</button>
                <button type="submit" style={S.btn(txType==="sale"?"primary":"success")} disabled={loading}>{loading?"Saving...":txType==="sale"?"Confirm Sale":"Confirm Purchase"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── LOW STOCK ─────────────────────────────────────────────────────────
function LowStockPage() {
  const [products, setProducts] = useState([]);
  useEffect(()=>{ api.get("/products?lowStock=true").then(r=>setProducts(r.data.products)); },[]);
  return (
    <div>
      <div style={S.topbar}><div><h1 style={S.pageTitle}>Low Stock Alerts</h1><p style={S.pageSub}>{products.length} products need restocking</p></div></div>
      <div style={S.card}>
        {products.length===0 ? <div style={S.emptyState}><p style={{ fontSize:32, margin:"0 0 8px" }}>✅</p><p>All products are well stocked!</p></div> : (
          <table style={S.table}>
            <thead><tr>{["Product","SKU","Category","Current Stock","Min Required","Shortage","Supplier"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>{products.map(p=>(
              <tr key={p._id}>
                <td style={S.td}><strong>{p.name}</strong></td>
                <td style={S.td}><code style={{ background:"#FEF2F2", padding:"2px 6px", borderRadius:4, fontSize:12, color:"#DC2626" }}>{p.sku}</code></td>
                <td style={S.td}><span style={S.badge(p.category?.color||"#6B7DB3")}>{p.category?.name}</span></td>
                <td style={S.td}><span style={{ color:"#EF4444", fontWeight:700 }}>{p.quantity} {p.unit}</span></td>
                <td style={S.td}>{p.minQuantity} {p.unit}</td>
                <td style={S.td}><span style={{ color:"#EF4444", fontWeight:600 }}>-{p.minQuantity-p.quantity} {p.unit}</span></td>
                <td style={S.td}>{p.supplier||"—"}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── PROFILE ───────────────────────────────────────────────────────────
function ProfilePage({ user, setUser }) {
  const [form, setForm] = useState({ name:user?.name||"", email:user?.email||"" });
  const [msg, setMsg] = useState("");
  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...user, ...form };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated); setMsg("Profile updated!"); setTimeout(()=>setMsg(""),3000);
  };
  return (
    <div>
      <div style={S.topbar}><div><h1 style={S.pageTitle}>Profile</h1><p style={S.pageSub}>Manage your account</p></div></div>
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:"1.5rem" }}>
        <div style={{ ...S.card, textAlign:"center", padding:"2rem 1.5rem" }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"#2563EB", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem", fontSize:32, color:"#fff", fontWeight:700 }}>{user?.name?.[0]?.toUpperCase()}</div>
          <h3 style={{ margin:"0 0 4px" }}>{user?.name}</h3>
          <p style={{ margin:0, fontSize:13, color:"#6B7DB3" }}>{user?.email}</p>
        </div>
        <div style={S.card}>
          <h3 style={{ margin:"0 0 1.5rem", fontSize:16, fontWeight:600 }}>Edit Profile</h3>
          {msg && <div style={S.alert("success")}>{msg}</div>}
          <form onSubmit={handleSave}>
            <div style={S.formGroup}><label style={S.label}>Full Name</label><input style={S.input} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
            <div style={S.formGroup}><label style={S.label}>Email</label><input style={S.input} type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
            <button type="submit" style={S.btn("primary")}>Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── LAYOUT ────────────────────────────────────────────────────────────
const NAV = [
  { key:"dashboard", label:"Dashboard", icon:"📊" },
  { key:"products", label:"Products", icon:"📦" },
  { key:"transactions", label:"Sales & Purchases", icon:"🛒" },
  { key:"categories", label:"Categories", icon:"🏷️" },
  { key:"lowstock", label:"Low Stock", icon:"⚠️" },
  { key:"profile", label:"Profile", icon:"👤" },
];

function AppLayout({ user, onLogout, setUser }) {
  const [page, setPage] = useState("dashboard");
  const pages = { dashboard:<Dashboard/>, products:<ProductsPage/>, transactions:<TransactionsPage/>, categories:<CategoriesPage/>, lowstock:<LowStockPage/>, profile:<ProfilePage user={user} setUser={setUser}/> };
  return (
    <div style={S.app}>
      <div style={S.sidebar}>
        <div style={S.sidebarLogo}><p style={S.logoText}>📦 StockMate</p><p style={S.logoSub}>Inventory Management</p></div>
        <nav>{NAV.map(n=><button key={n.key} style={S.navItem(page===n.key)} onClick={()=>setPage(n.key)}><span>{n.icon}</span>{n.label}</button>)}</nav>
        <div style={{ position:"absolute", bottom:"1.5rem", left:0, right:0, padding:"0 12px" }}>
          <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:10, padding:"10px 12px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:"#2563EB", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:12 }}>{user?.name?.[0]?.toUpperCase()}</div>
              <div><p style={{ margin:0, fontSize:13, fontWeight:600, color:"#fff" }}>{user?.name}</p><p style={{ margin:0, fontSize:11, color:"#6B7DB3" }}>Admin</p></div>
            </div>
            <button onClick={onLogout} style={{ background:"none", border:"none", color:"#6B7DB3", cursor:"pointer", fontSize:16 }} title="Logout">⬚</button>
          </div>
        </div>
      </div>
      <main style={S.main}>{pages[page]}</main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(getUser);
  const [hash, setHash] = useState(window.location.hash);
  useEffect(()=>{ const f=()=>setHash(window.location.hash); window.addEventListener("hashchange",f); return()=>window.removeEventListener("hashchange",f); },[]);
  const handleLogin = (u) => setUser(u);
  const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); setUser(null); };
  if(!user) { if(hash==="#register") return <RegisterPage onLogin={handleLogin}/>; return <LoginPage onLogin={handleLogin}/>; }
  return <AppLayout user={user} onLogout={handleLogout} setUser={setUser}/>;
}