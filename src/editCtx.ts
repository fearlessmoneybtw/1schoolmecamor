import {createContext} from 'react';import {Item} from './services/api';
// When 'edit' is set, the public site shows pen buttons (live edit mode inside /admin).
export const EditCtx=createContext<{edit?:(c:string,it:Item|null)=>void;ver:number}>({ver:0});
