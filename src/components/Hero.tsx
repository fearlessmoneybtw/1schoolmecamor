import {motion,useMotionValue,useSpring,useTransform} from 'framer-motion';
import {BookOpen,Atom,Globe2,Palette,Trophy,FlaskConical,Star,Music,ChevronDown} from 'lucide-react';
import {Lang,t} from '../i18n';
import Tx from './EditableText';
const FACES=[BookOpen,Atom,Globe2,Palette,Trophy,FlaskConical];
const POS=['rotateY(0deg)','rotateY(90deg)','rotateY(180deg)','rotateY(-90deg)','rotateX(90deg)','rotateX(-90deg)'];
const CHIPS=[{I:Star,c:'left-2 top-8',z:110},{I:Music,c:'right-0 top-24',z:150},{I:Trophy,c:'left-6 bottom-10',z:130},{I:Globe2,c:'right-8 bottom-4',z:100}];
export default function Hero({l}:{l:Lang}){
 const mx=useMotionValue(0),my=useMotionValue(0);
 const sx=useSpring(mx,{stiffness:70,damping:16}),sy=useSpring(my,{stiffness:70,damping:16});
 const ry=useTransform(sx,[-.5,.5],[-24,24]),rx=useTransform(sy,[-.5,.5],[18,-18]);
 const words=t(l,'site').split(' ');
 return <section id="top" className="relative px-5 pb-16 pt-12 lg:pt-20" onMouseMove={e=>{mx.set(e.clientX/innerWidth-.5);my.set(e.clientY/innerHeight-.5)}}>
  <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
   <div style={{perspective:900}}>
    <h1 className="text-4xl font-extrabold leading-[1.15] md:text-6xl">{words.map((w,i)=><motion.span key={l+i} className="mr-3 inline-block bg-gradient-to-r from-sky-700 to-emerald-500 bg-clip-text text-transparent" style={{transformOrigin:'50% 100%'}}
     initial={{opacity:0,rotateX:-95,y:40}} animate={{opacity:1,rotateX:0,y:0}} transition={{delay:.15+i*.14,type:'spring',damping:14}}>{w}</motion.span>)}</h1>
    <motion.div className="my-6 h-1.5 rounded bg-gradient-to-r from-gold to-emerald-400" initial={{width:0}} animate={{width:120}} transition={{delay:.8,duration:.8}}/>
    <motion.p className="max-w-lg text-lg text-slate-600" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1}}><Tx l={l} k="i_about"/></motion.p>
    <motion.div className="mt-8 flex flex-wrap gap-3" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.2}}>
     <motion.a whileHover={{scale:1.07}} whileTap={{scale:.95}} href="#about" className="btn shine bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-3 text-white shadow-xl">{t(l,'about')}</motion.a>
     <motion.a whileHover={{scale:1.07}} whileTap={{scale:.95}} href="#contact" className="btn glass px-6 py-3 text-sky-800">{t(l,'contact')}</motion.a></motion.div>
   </div>
   <div className="relative mx-auto h-[360px] w-[360px] max-w-full" style={{perspective:1100}}>
    <motion.div className="absolute inset-0" style={{rotateX:rx,rotateY:ry,transformStyle:'preserve-3d'}}>
     {[300,240].map((s,i)=><motion.div key={s} className="absolute left-1/2 top-1/2 rounded-full border-2 border-dashed border-gold/70" style={{width:s,height:s,marginLeft:-s/2,marginTop:-s/2,rotateX:72}} animate={{rotateZ:i?-360:360}} transition={{repeat:Infinity,duration:16+i*6,ease:'linear'}}/>)}
     <motion.div className="absolute left-1/2 top-1/2 -ml-[90px] -mt-[90px] h-[180px] w-[180px]" style={{transformStyle:'preserve-3d'}} animate={{rotateY:360,rotateX:[-18,18,-18]}}
      transition={{rotateY:{repeat:Infinity,duration:20,ease:'linear'},rotateX:{repeat:Infinity,duration:10,ease:'easeInOut'}}}>
      {FACES.map((I,i)=><div key={i} className="absolute inset-0 grid place-items-center rounded-3xl border border-white shadow-2xl" style={{transform:`${POS[i]} translateZ(90px)`,background:'linear-gradient(135deg,rgba(255,255,255,.95),rgba(186,230,253,.7))'}}><I size={64} className={i%2?'text-emerald-500':'text-sky-600'}/></div>)}
     </motion.div>
     {CHIPS.map(({I,c,z},i)=><motion.div key={i} className={`absolute ${c} grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-xl`} style={{z}} animate={{y:[0,-16,0]}} transition={{repeat:Infinity,duration:3+i,ease:'easeInOut'}}><I className="text-gold"/></motion.div>)}
    </motion.div></div></div>
  <motion.a href="#about" className="mx-auto mt-10 block w-fit text-sky-500" animate={{y:[0,10,0]}} transition={{repeat:Infinity,duration:1.8}}><ChevronDown size={34}/></motion.a></section>}
