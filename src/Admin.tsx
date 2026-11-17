import {ReactNode,useEffect,useState} from 'react';
import {AnimatePresence,motion} from 'framer-motion';
import {Plus,Pencil,Trash2,LogOut,Upload,Settings,ArrowLeft,Lock,Eye,X} from 'lucide-react';
import {Lang,t} from './i18n';
import {api,readImage,Item} from './services/api';
import {COLS} from './sections';
import {EditCtx} from './editCtx';
import LangSwitch from './components/LangSwitch';

// One form for every collection (+ site settings). Used in the panel AND in the live drawer.
export function EditForm({col,init,l,onClose}:{col:string;init:Item|null;l:Lang;onClose:(saved:boolean)=>void}){
 const [d,setD]=useState<Item>(init||{});
 const [nu,setNu]=useState(''),[np,setNp]=useState('');
 useEffect(()=>{if(col==='settings')api.getSettings().then(setD)},[col]);
 const set=(k:string,v:string)=>setD(x=>({...x,[k]:v}));
 const save=async()=>{
  if(col==='settings'){await api.saveSettings(d);if(nu&&np)await api.setAuth(nu,np);return onClose(true)}
  if(await api.save(col,{...d,id:d.id||crypto.randomUUID()}))onClose(true);else alert(t(l,'full'))};
 const del=async()=>{if(confirm(t(l,'confirm'))){await api.remove(col,d.id);onClose(true)}};
 const btns=<div className="flex flex-wrap gap-3 pt-2"><button className="btn shine bg-emerald-500 text-white" onClick={save}>{t(l,'save')}</button>
  <button className="btn bg-slate-100" onClick={()=>onClose(false)}>{t(l,'cancel')}</button>
  {col!=='settings'&&d.id&&<button className="btn ml-auto bg-red-50 text-red-500" onClick={del}><Trash2 size={17}/></button>}</div>;
 if(col==='settings')return <div className="max-w-md space-y-4">
  {['phone','email','facebook'].map(k=><label key={k} className="block text-sm font-semibold">{t(l,k==='facebook'?'fburl':k)}<input className="inp mt-1" value={d[k]||''} onChange={e=>set(k,e.target.value)}/></label>)}
  <label className="block text-sm font-semibold">{t(l,'newu')}<input className="inp mt-1" value={nu} onChange={e=>setNu(e.target.value)}/></label>
  <label className="block text-sm font-semibold">{t(l,'newp')}<input className="inp mt-1" type="password" value={np} onChange={e=>setNp(e.target.value)}/></label>{btns}</div>;
 return <div className="max-w-xl space-y-4">
  {COLS[col].map(f=><label key={f.k} className="block text-sm font-semibold">{t(l,f.l||f.k)}
   {f.t==='area'?<textarea rows={5} className="inp mt-1" value={d[f.k]||''} onChange={e=>set(f.k,e.target.value)}/>
   :f.t==='lab'?<select className="inp mt-1" value={d.lab||'0'} onChange={e=>set('lab',e.target.value)}>{[0,1,2,3,4].map(i=><option key={i} value={i}>{t(l,'lab_'+i)}</option>)}</select>
   :f.t==='image'?<div className="mt-1 space-y-2">{d.image&&<img src={d.image} className="h-40 rounded-xl object-cover"/>}
     <label className="btn glass inline-flex cursor-pointer items-center gap-2 text-sky-700"><Upload size={18}/>{t(l,'upload')}<input type="file" accept="image/*" hidden onChange={async e=>{const x=e.target.files?.[0];if(x)set('image',await readImage(x))}}/></label></div>
   :<input type={f.t==='date'?'date':'text'} className="inp mt-1" value={d[f.k]||''} onChange={e=>set(f.k,e.target.value)}/>}</label>)}{btns}</div>}

export default function Admin({l,setL,site}:{l:Lang;setL:(x:Lang)=>void;site:ReactNode}){
 const [ok,setOk]=useState(api.isAuth());
 const [u,setU]=useState(''),[p,setP]=useState(''),[bad,setBad]=useState(false);
 const [tab,setTab]=useState('history');
 const [items,setItems]=useState<Item[]>([]);
 const [d,setD]=useState<{it:Item|null}|null>(null);
 const [live,setLive]=useState(false);
 const [dr,setDr]=useState<{c:string;it:Item|null}|null>(null);
 const [ver,setVer]=useState(0);
 useEffect(()=>{if(ok&&tab!=='settings'){setD(null);api.list(tab).then(setItems)}},[tab,ok,ver]);
 async function go(){if(await api.login(u,p))setOk(true);else setBad(true)}

 if(!ok)return <div className="grid min-h-screen place-items-center px-5"><motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} className="glass w-full max-w-sm space-y-4 rounded-3xl p-8">
  <div className="flex justify-between"><Lock className="text-emerald-500"/><LangSwitch l={l} setL={setL}/></div>
  <h1 className="text-2xl font-extrabold text-sky-900">{t(l,'admin')}</h1>
  <input className="inp" placeholder={t(l,'user')} value={u} onChange={e=>setU(e.target.value)}/>
  <input className="inp" type="password" placeholder={t(l,'pass')} value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()}/>
  {bad&&<p className="text-sm text-red-500">{t(l,'wrong')}</p>}
  <button className="btn w-full bg-emerald-500 text-white" onClick={go}>{t(l,'login')}</button></motion.div></div>;

 // LIVE MODE: the real site inside the admin, with a pen on every card. Saving updates it instantly.
 if(live)return <EditCtx.Provider value={{edit:(c,it)=>setDr({c,it}),ver}}>
  {site}
  <div className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-full bg-white px-3 py-2 shadow-2xl ring-2 ring-gold">
   <button className="btn flex items-center gap-2 bg-emerald-500 text-white" onClick={()=>{setLive(false);setDr(null)}}><ArrowLeft size={18}/>{t(l,'toPanel')}</button>
   <span className="hidden pr-3 text-sm font-semibold text-sky-800 sm:block">{t(l,'editmode')}</span></div>
  <AnimatePresence>{dr&&<>
   <motion.div key="bg" className="fixed inset-0 z-[65] bg-sky-900/20" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setDr(null)}/>
   <motion.aside key="dr" className="fixed right-0 top-0 z-[70] h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',damping:26,stiffness:240}}>
    <div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-extrabold text-sky-900">{t(l,dr.c)}</h2><button onClick={()=>setDr(null)} className="rounded-full p-2 hover:bg-slate-100"><X/></button></div>
    <EditForm key={dr.c+(dr.it?.id||'new')} col={dr.c} init={dr.it} l={l} onClose={s=>{setDr(null);if(s)setVer(v=>v+1)}}/></motion.aside></>}</AnimatePresence></EditCtx.Provider>;

 const tabs=[...Object.keys(COLS),'settings'];
 return <div className="min-h-screen">
  <header className="glass sticky top-0 z-30 flex items-center justify-between gap-3 px-5 py-3">
   <a href="/" className="flex items-center gap-2 font-bold text-sky-800"><ArrowLeft size={18}/>{t(l,'back')}</a>
   <button className="btn shine flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-lg" onClick={()=>setLive(true)}><Eye size={18}/>{t(l,'live')}</button>
   <div className="flex items-center gap-2"><LangSwitch l={l} setL={setL}/><button className="btn bg-slate-100" onClick={()=>{api.logout();setOk(false)}}><LogOut size={18}/></button></div></header>
  <div className="mx-auto grid max-w-6xl gap-6 p-5 md:grid-cols-[220px_1fr]">
   <aside className="flex gap-2 overflow-x-auto md:flex-col">{tabs.map(x=><button key={x} onClick={()=>setTab(x)} className={'btn whitespace-nowrap text-left '+(tab===x?'bg-emerald-500 text-white shadow':'glass text-slate-700')}>{t(l,x)}</button>)}</aside>
   <main className="glass min-h-96 rounded-3xl p-6">
    <h2 className="mb-5 flex items-center gap-2 text-2xl font-extrabold text-sky-900">{tab==='settings'&&<Settings/>}{t(l,tab)}</h2>
    {tab==='settings'?<EditForm key={'s'+ver} col="settings" init={null} l={l} onClose={()=>setVer(v=>v+1)}/>
    :d?<EditForm key={d.it?.id||'new'} col={tab} init={d.it} l={l} onClose={s=>{setD(null);if(s)setVer(v=>v+1)}}/>
    :<><button className="btn mb-5 inline-flex items-center gap-2 bg-emerald-500 text-white shadow" onClick={()=>setD({it:null})}><Plus size={18}/>{t(l,'add')}</button>
     {items.length===0&&<p className="py-8 text-center text-slate-400">{t(l,'none')}</p>}
     <ul className="space-y-3">{items.map(i=><li key={i.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
      {i.image?<img src={i.image} className="h-14 w-14 rounded-xl object-cover"/>:<div className="h-14 w-14 rounded-xl bg-sky-100"/>}
      <span className="flex-1 font-semibold">{i.title||i.name||(i.lab&&t(l,'lab_'+i.lab))}</span>
      <button className="btn bg-sky-50 text-sky-700" onClick={()=>setD({it:i})} aria-label={t(l,'edit')}><Pencil size={17}/></button></li>)}</ul></>}
   </main></div></div>}
