(() => {
  const INACTIVITY_MS=180000;
  const WARNING_MS=30000;
  let lastActivity=Date.now(), warningUntil=0;
  const idleDialog=document.getElementById('idle-dialog');
  function returnToWelcome(){try{sessionStorage.removeItem('addys-kiosk-order-v2');}catch{}location.href='index.html';}
  document.getElementById('home-btn').addEventListener('click',()=>{if(itemCount()>0)document.getElementById('exit-dialog').showModal();else returnToWelcome();});
  document.querySelector('.brand').addEventListener('click',event=>{event.preventDefault();document.getElementById('home-btn').click();});
  document.getElementById('return-home').addEventListener('click',returnToWelcome);
  function continueOrdering(){lastActivity=Date.now();warningUntil=0;if(idleDialog.open)idleDialog.close();}
  document.getElementById('keep-ordering').addEventListener('click',continueOrdering);
  idleDialog.addEventListener('cancel',event=>{event.preventDefault();continueOrdering();});
  for(const name of ['pointerdown','keydown','input','wheel','touchstart'])document.addEventListener(name,()=>{if(!warningUntil)lastActivity=Date.now();},{passive:true});
  setInterval(()=>{
    const now=Date.now();
    if(warningUntil){const remaining=Math.max(0,Math.ceil((warningUntil-now)/1000));document.getElementById('idle-count').textContent=remaining;if(remaining===0)returnToWelcome();}
    else if(now-lastActivity>=INACTIVITY_MS){warningUntil=now+WARNING_MS;document.getElementById('idle-count').textContent='30';idleDialog.showModal();}
  },1000);
})();
