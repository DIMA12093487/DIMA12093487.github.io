(() => {
 const items=[...document.querySelectorAll('h1,h2,h3,.case-title,.case-score')];
 const initial=new WeakMap(items.map(e=>[e,e.style.fontSize]));
 function fit(){
  for(const e of items){
   e.style.fontSize=initial.get(e)||'';
   if(!e.clientWidth)continue;
   for(let i=0;i<7&&e.scrollWidth>e.clientWidth+1;i++){
    const size=parseFloat(getComputedStyle(e).fontSize);
    e.style.fontSize=(size*e.clientWidth/e.scrollWidth*.98)+'px';
   }
  }
 }
 const schedule=()=>{fit();setTimeout(fit,60)};
 window.addEventListener('load',()=>{schedule();setTimeout(schedule,200)});
 window.addEventListener('resize',()=>setTimeout(schedule,80),{passive:true});
 document.fonts?.addEventListener('loadingdone',schedule);
 document.fonts?.ready.then(schedule);
})();
