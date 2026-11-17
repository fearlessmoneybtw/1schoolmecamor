import {ElementType,useContext,useEffect,useState} from 'react';
import {Check,Pencil,RotateCcw,X} from 'lucide-react';
import {Lang,t} from '../i18n';
import {api} from '../services/api';
import {EditCtx} from '../editCtx';

// Text that visitors just read, but that the admin can edit in place (live mode).
// An edited text is stored per language; "reset" returns the original wording from i18n.ts.
export default function Tx({l,k,as:As='span',className=''}:{l:Lang;k:string;as?:ElementType;className?:string}){
 const c=useContext(EditCtx);
 const key=l+':'+k;
 const [o,setO]=useState<string|undefined>();
 const [ed,setEd]=useState(false);
 const [v,setV]=useState('');
 useEffect(()=>{api.getTexts().then(m=>setO(m[key]))},[key,c.ver]);
 const val=o??t(l,k);
 if(!c.edit)return <As className={className}>{val}</As>;
 const done=async(x:string)=>{await api.setText(key,x);setO(x||undefined);setEd(false)};
 const B='inline-grid h-8 w-8 place-items-center rounded-full bg-white shadow ring-1 ring-gold';
 return <As className={className}>{ed?
  <span className="block">
   <textarea autoFocus rows={3} className="inp font-sans text-base font-normal text-slate-800" value={v} onChange={e=>setV(e.target.value)}/>
   <span className="mt-2 flex justify-center gap-2">
    <button className={B+' text-emerald-600'} onClick={()=>done(v.trim())}><Check size={16}/></button>
    <button className={B+' text-slate-500'} onClick={()=>setEd(false)}><X size={16}/></button>
    <button className={B+' text-amber-600'} title={t(l,'reset')} onClick={()=>done('')}><RotateCcw size={15}/></button></span></span>
  :<>{val}<button className={B+' ml-2 align-middle'} onClick={()=>{setV(val);setEd(true)}} aria-label={t(l,'edit')}><Pencil size={14} className="text-emerald-600"/></button></>}</As>}
