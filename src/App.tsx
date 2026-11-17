import {useContext,useEffect,useState,ReactNode} from 'react';
import {motion,useScroll,useSpring} from 'framer-motion';
import {Menu,X,GraduationCap,Phone,Mail,MapPin,Facebook,Monitor,Globe2,Atom,FlaskConical,Leaf,Pencil,Plus} from 'lucide-react';
import {Lang,t} from './i18n';
import {api,Item} from './services/api';
import {NAV,ABOUT} from './sections';
import Tilt from './components/Tilt';
import LangSwitch from './components/LangSwitch';
import Admin from './Admin';
import {EditCtx} from './editCtx';
import Tx from './components/EditableText';
import Hero from './components/Hero';
import Bg from './components/Bg';

const LABI=[Monitor,Globe2,Atom,FlaskConical,Leaf];

function Pen({onClick,l}:{onClick:()=>void;l:Lang}){
 return <motion.button initial={{scale:0}} animate={{scale:1}} whileHover={{scale:1.15,rotate:-12}} whileTap={{scale:.9}} onClick={e=>{e.stopPropagation();onClick()}} aria-label={t(l,'edit')}
  className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-white text-emerald-600 shadow-xl ring-2 ring-gold"><Pencil size={18}/></motion.button>}

function Card({it,l,col}:{it:Item;l:Lang;col:string}){
 const c=useContext(EditCtx);
 return <Tilt><div className="glass relative rounded-3xl overflow-hidden h-full">{c.edit&&<Pen l={l} onClick={()=>c.edit!(col,it)}/>}
  {it.image&&<img src={it.image} alt="" className="h-52 w-full object-cover"/>}
  <div className="p-5 space-y-1.5">
   <h3 className="font-extrabold text-lg text-slate-800">{it.title||it.name}</h3>
   {it.position&&<p className="text-sm font-semibold text-emerald-700">{it.position}</p>}
   {it.subject&&<p className="text-sm text-emerald-700">{t(l,'subject')}: {it.subject}</p>}
   {it.head&&<p className="text-sm text-emerald-700">{t(l,'head')}: {it.head}</p>}
   {it.lab&&<p className="text-sm font-semibold text-sky-700">{t(l,'lab_'+it.lab)}</p>}
   {it.date&&<p className="text-sm text-gold font-semibold">{it.date}</p>}
   {it.desc&&<p className="text-sm text-slate-600 whitespace-pre-line">{it.desc}</p>}
  </div></div></Tilt>}

function Grid({col,l}:{col:string;l:Lang}){
 const c=useContext(EditCtx);
 const [items,setItems]=useState<Item[]>([]);
 useEffect(()=>{api.list(col).then(setItems)},[col,c.ver]);
 return <>{items.length?<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" style={{perspective:1200}}>{items.map((i,n)=><motion.div key={i.id} initial={{opacity:0,y:60,rotateX:-30,scale:.9}} whileInView={{opacity:1,y:0,rotateX:0,scale:1}} viewport={{once:true,margin:'-40px'}} transition={{type:'spring',damping:15,delay:(n%3)*.12}}><Card it={i} l={l} col={col}/></motion.div>)}</div>
 :<p className="text-center text-slate-400 py-6 rounded-2xl border border-dashed border-sky-200">{t(l,'empty')}</p>}
 {c.edit&&<div className="mt-5 text-center"><motion.button whileHover={{scale:1.08}} whileTap={{scale:.95}} onClick={()=>c.edit!(col,null)} className="btn shine inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-lg"><Plus size={18}/>{t(l,'add')}</motion.button></div>}</>}

function Sec({id,l,children}:{id:string;l:Lang;children:ReactNode}){
 return <section id={id} className="scroll-mt-24 py-14"><div className="mx-auto max-w-6xl px-5">
  <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="mb-8 text-center">
   <motion.h2 style={{transformPerspective:800}} initial={{opacity:0,rotateX:-70,y:30}} whileInView={{opacity:1,rotateX:0,y:0}} viewport={{once:true}} transition={{type:"spring",damping:14}} className="text-3xl md:text-5xl font-extrabold text-sky-900"><Tx l={l} k={id}/></motion.h2>
   <motion.div initial={{width:0}} whileInView={{width:90}} viewport={{once:true}} transition={{delay:.3,duration:.7}} className="mx-auto my-3 h-1 rounded bg-gradient-to-r from-gold to-emerald-400"/>
   <p className="mx-auto max-w-2xl text-slate-600"><Tx l={l} k={'i_'+id}/></p>
  </motion.div>{children}</div></section>}

function Contact({l}:{l:Lang}){
 const [s,setS]=useState<Item>({});const c=useContext(EditCtx);useEffect(()=>{api.getSettings().then(setS)},[c.ver]);
 const rows:[any,string][]=[[MapPin,t(l,'addr')],[Phone,s.phone],[Mail,s.email]];
 return <div className="grid gap-6 md:grid-cols-2" style={{perspective:1200}}>
  <Tilt><div className="glass relative rounded-3xl p-7 space-y-5 h-full">{c.edit&&<Pen l={l} onClick={()=>c.edit!("settings",null)}/>}{rows.map(([I,v],i)=><div key={i} className="flex items-center gap-3"><I className="text-emerald-600 shrink-0"/><span>{v||'—'}</span></div>)}</div></Tilt>
  <Tilt><a href={s.facebook||'#'} target="_blank" rel="noreferrer" className="flex h-full min-h-40 flex-col items-center justify-center gap-3 rounded-3xl bg-gradient-to-br from-sky-500 to-sky-700 p-7 text-xl font-extrabold text-white shadow-xl"><Facebook size={52}/>{t(l,'fb')}</a></Tilt></div>}

function Site({l,setL}:{l:Lang;setL:(x:Lang)=>void}){
 const [open,setOpen]=useState(false);
 const {scrollYProgress}=useScroll();const sc=useSpring(scrollYProgress,{stiffness:120,damping:25});
 return <div className="overflow-x-hidden"><Bg/><motion.div style={{scaleX:sc}} className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-sky-400 via-emerald-400 to-gold"/>
  <motion.header initial={{y:-90}} animate={{y:0}} transition={{type:"spring",damping:18}} className="sticky top-0 z-40 glass"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
   <a href="#top" className="flex items-center gap-2 font-extrabold text-sky-900"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-sky-400 text-white"><GraduationCap/></span><span className="hidden sm:block">{t(l,'site')}</span></a>
   <nav className="hidden xl:flex gap-4 text-sm font-semibold text-slate-600">{NAV.map(n=><a key={n} href={'#'+n} className="hover:text-emerald-600">{t(l,n)}</a>)}</nav>
   <div className="flex items-center gap-2"><LangSwitch l={l} setL={setL}/><button className="xl:hidden p-2" onClick={()=>setOpen(!open)} aria-label="menu">{open?<X/>:<Menu/>}</button></div></div>
   {open&&<nav className="xl:hidden grid gap-1 px-5 pb-4">{NAV.map(n=><a key={n} href={'#'+n} onClick={()=>setOpen(false)} className="rounded-lg px-3 py-2 font-semibold hover:bg-sky-50">{t(l,n)}</a>)}</nav>}
  </motion.header>
  <Hero l={l}/>

  <Sec id="about" l={l}><div className="space-y-14">{ABOUT.map(c=><div key={c}>
   <h3 className="text-2xl font-bold text-emerald-700 text-center"><Tx l={l} k={c}/></h3><p className="mx-auto mb-5 max-w-2xl text-center text-slate-500"><Tx l={l} k={'i_'+c}/></p><Grid col={c} l={l}/></div>)}</div></Sec>
  {['library','clubs','events','projects','olympiads','achievements'].map(id=><Sec key={id} id={id} l={l}><Grid col={id} l={l}/></Sec>)}
  <Sec id="labs" l={l}>
   <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5" style={{perspective:1200}}>{LABI.map((I,i)=><Tilt key={i}><div className="glass flex h-full flex-col items-center gap-2 rounded-2xl p-5 text-center font-bold text-sky-900"><motion.span animate={{y:[0,-8,0],rotate:[0,8,-8,0]}} transition={{repeat:Infinity,duration:4+i*.6,ease:"easeInOut"}}><I className="text-emerald-500" size={36}/></motion.span>{t(l,'lab_'+i)}</div></Tilt>)}</div>
   <p className="mb-8 rounded-2xl border-l-4 border-gold bg-amber-50/80 p-5 text-lg font-semibold text-amber-900"><Tx l={l} k="labnote"/></p>
   <Grid col="labs" l={l}/></Sec>
  <Sec id="contact" l={l}><Contact l={l}/></Sec>
  <Sec id="program" l={l}><Grid col="program" l={l}/></Sec>
  <footer className="py-8 text-center text-sm text-slate-500">© {new Date().getFullYear()} {t(l,'site')}</footer></div>}

export default function App(){
 const [l,setLang]=useState<Lang>(()=>(localStorage.getItem('lang') as Lang)||'hy');
 const setL=(x:Lang)=>{setLang(x);localStorage.setItem('lang',x)};
 useEffect(()=>{document.documentElement.lang=l},[l]);
 return location.pathname.startsWith('/admin')?<Admin l={l} setL={setL} site={<Site l={l} setL={setL}/>}/>:<Site l={l} setL={setL}/>}
