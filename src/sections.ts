export type F={k:string;l?:string;t?:'text'|'area'|'image'|'date'|'lab'};
const TI:F={k:'title'},DE:F={k:'desc',t:'area'},IM:F={k:'image',t:'image'};
const PEOPLE:F[]=[{k:'name'},{k:'position'},IM];
const BASIC:F[]=[TI,DE,IM];
// Collection id -> admin form fields (each collection = one table in Supabase)
export const COLS:Record<string,F[]>={
history:BASIC,director:PEOPLE,deputies:PEOPLE,teachers:PEOPLE,library:BASIC,clubs:BASIC,
events:[TI,{k:'date',t:'date'},DE,IM],projects:[{k:'title',l:'ptitle'},{k:'subject'},{k:'head'},IM],
olympiads:BASIC,achievements:BASIC,labs:[{k:'lab',t:'lab'},TI,DE,IM],program:BASIC};
export const ABOUT=['history','director','deputies','teachers'];
export const NAV=['about','library','clubs','events','projects','olympiads','achievements','labs','contact','program'];
