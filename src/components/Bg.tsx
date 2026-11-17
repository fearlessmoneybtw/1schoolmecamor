import {motion} from 'framer-motion';
const B=[['bg-sky-200/70','-left-24 top-0'],['bg-emerald-200/60','right-0 top-1/3'],['bg-amber-100/90','left-1/3 bottom-0']];
export default function Bg(){return <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
 {B.map(([c,p],i)=><motion.div key={i} className={`absolute h-96 w-96 rounded-full blur-3xl ${c} ${p}`} animate={{x:[0,60,-30,0],y:[0,-50,40,0],scale:[1,1.2,.9,1]}} transition={{duration:18+i*4,repeat:Infinity,ease:'easeInOut'}}/>)}</div>}
