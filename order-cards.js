(() => {
 const root=document.getElementById('orderRotator');if(!root)return;
 const panels=[...root.querySelectorAll('.order-panel')],dots=[...root.querySelectorAll('[data-order-index]')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let index=0,hover=false,visible=false,startX=null;
 const show=n=>{index=(n+panels.length)%panels.length;panels.forEach((p,i)=>{p.setAttribute('aria-hidden',String(i!==index));p.inert=i!==index;});dots.forEach((d,i)=>d.setAttribute('aria-current',String(i===index)));};
 root.querySelector('[data-order-prev]').addEventListener('click',()=>show(index-1));
 root.querySelector('[data-order-next]').addEventListener('click',()=>show(index+1));
 dots.forEach(d=>d.addEventListener('click',()=>show(Number(d.dataset.orderIndex))));
 root.addEventListener('mouseenter',()=>hover=true);root.addEventListener('mouseleave',()=>hover=false);
 root.addEventListener('keydown',e=>{if(e.target.closest('.order-switcher')&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1));}});
 root.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&!e.target.closest('a,button'))startX=e.clientX;});
 root.addEventListener('pointerup',e=>{if(startX!==null){const dx=e.clientX-startX;if(Math.abs(dx)>45)show(index+(dx<0?1:-1));startX=null;}});
 root.addEventListener('pointercancel',()=>startX=null);
 new IntersectionObserver(es=>visible=es[0].isIntersecting,{threshold:.25}).observe(root);
 setInterval(()=>{if(visible&&!hover&&!document.hidden&&!reduced.matches&&!root.contains(document.activeElement))show(index+1);},6000);
 show(0);
})();
