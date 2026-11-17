import {ReactNode,useState} from 'react';
import {motion,useMotionTemplate,useMotionValue,useSpring,useTransform} from 'framer-motion';
export default function Tilt({children,className='',max=11}:{children:ReactNode;className?:string;max?:number}){
 const x=useMotionValue(.5),y=useMotionValue(.5),[h,setH]=useState(false);
 const sp={stiffness:180,damping:16};
 const rx=useSpring(useTransform(y,[0,1],[max,-max]),sp),ry=useSpring(useTransform(x,[0,1],[-max,max]),sp);
 const gx=useTransform(x,v=>v*100+'%'),gy=useTransform(y,v=>v*100+'%');
 const glare=useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,.75), rgba(255,255,255,0) 55%)`;
 return <motion.div className={'relative '+className} style={{rotateX:rx,rotateY:ry,transformPerspective:900}} whileHover={{scale:1.035,y:-8}} transition={{type:'spring',stiffness:260,damping:20}}
  onMouseEnter={()=>setH(true)}
  onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();x.set((e.clientX-r.left)/r.width);y.set((e.clientY-r.top)/r.height)}}
  onMouseLeave={()=>{x.set(.5);y.set(.5);setH(false)}}>
  {children}<motion.div className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300" style={{background:glare,opacity:h?.9:0}}/></motion.div>}
