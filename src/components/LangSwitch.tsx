import {Lang,LANGS} from '../i18n';
export default function LangSwitch({l,setL}:{l:Lang;setL:(x:Lang)=>void}){
 return <div className="flex rounded-full bg-sky-100 p-1">{LANGS.map(x=><button key={x} onClick={()=>setL(x)}
  className={'px-3 py-1 rounded-full text-sm font-bold transition '+(x===l?'bg-white text-emerald-700 shadow':'text-sky-700')}>{x.toUpperCase()}</button>)}</div>}
