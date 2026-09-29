export const toMinutes=(value:string)=>{const [h,m]=String(value).slice(0,5).split(':').map(Number);return h*60+m};
export const toTime=(minutes:number)=>`${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;
export const localParts=(timeZone:string,date=new Date())=>{
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date);
 const get=(type:string)=>parts.find(p=>p.type===type)?.value||'';
 return {date:`${get('year')}-${get('month')}-${get('day')}`,time:`${get('hour')}:${get('minute')}`};
};
export const weekdayForDate=(date:string,timeZone:string)=>{
 const noon=new Date(`${date}T12:00:00Z`);
 const label=new Intl.DateTimeFormat('en-US',{timeZone,weekday:'short'}).format(noon);
 return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(label);
};
export const isPastLocalSlot=(date:string,time:string,timeZone:string)=>{
 const now=localParts(timeZone);
 return date<now.date||(date===now.date&&time.slice(0,5)<=now.time);
};
export const localDateTimeToUtc=(date:string,time:string,timeZone:string)=>{
 const probe=new Date(`${date}T${time.slice(0,5)}:00Z`);
 const p=localParts(timeZone,probe);
 const wanted=Date.parse(`${date}T${time.slice(0,5)}:00Z`);
 const represented=Date.parse(`${p.date}T${p.time}:00Z`);
 return new Date(probe.getTime()+(wanted-represented));
};
