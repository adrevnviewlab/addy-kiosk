const $ = id => document.getElementById(id);
const menu = window.ADDYS_MENU;
const money = cents => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
const escapeHtml = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const groups = [
  {id:'favorites',name:'Favorites',symbol:'✳',title:'The favorites',description:'A few good places to start.',filter:i=>i.popular},
  {id:'pizza',name:'Pizza',symbol:'◔',title:'Pizza, your way.',description:'Classic pies, specialty slices and everything in between.',filter:i=>i.category.includes('Pie')||i.category.includes('Pizza')},
  {id:'knots',name:'Knots & sides',symbol:'∞',title:'A little something extra.',description:'Garlic knots, appetizers, wings and more.',filter:i=>['Appetizers','Sides','Wings','Calzones & Rolls','Rice Balls'].includes(i.category)},
  {id:'pasta',name:'Pasta',symbol:'≋',title:'Pass the pasta.',description:'Italian favorites for your next lunch or dinner.',filter:i=>i.category.includes('Pasta')},
  {id:'heroes',name:'Heroes & wraps',symbol:'▱',title:'The good stuff, to go.',description:'Heroes, paninis and wraps.',filter:i=>['Heroes','Paninis','Wraps'].includes(i.category)},
  {id:'salads',name:'Salads',symbol:'❋',title:'Keep it fresh.',description:'House salads and specialty favorites.',filter:i=>i.category.includes('Salad')},
  {id:'plates',name:'Italian plates',symbol:'◡',title:'Italian favorites.',description:'Entrees, specialty dishes and soups.',filter:i=>['Entrees','Specialty Dishes','Soups'].includes(i.category)},
  {id:'desserts',name:'Desserts',symbol:'◇',title:'There’s always room.',description:'A little something sweet.',filter:i=>i.category==='Desserts'},
  {id:'drinks',name:'Drinks',symbol:'⌑',title:'Something to sip.',description:'The finishing touch for your order.',filter:i=>i.category==='Beverages'},
  {id:'all',name:'Whole menu',symbol:'≡',title:'The whole menu.',description:'Find your next favorite.',filter:()=>true}
];
const pizzaStyles=[['all','All pizza',()=>true],['classic','Classic pies',i=>i.category==='Pizza'],['specialty','Round specialties',i=>i.category==='Round Specialty Pies'],['slice','By the slice',i=>i.category==='Pizza By The Slice'],['pan','Pan pies',i=>i.category.includes('Pan Pies')],['thin','Extra thin',i=>i.category==='Extra Thin Specialty Pies'],['gluten','Gluten-free',i=>i.category==='Gluten Free Specialty Pies']];
let category='favorites',sub='all',mode='pickup',selected=null,itemQty=1,toastTimer;
let cart=[];
try{const stored=JSON.parse(sessionStorage.getItem('addys-kiosk-order-v2')||'[]');cart=Array.isArray(stored)?stored.filter(i=>menu.some(m=>m.id===i.id)&&Number.isInteger(i.qty)&&i.qty>0&&i.qty<=99).map(i=>({id:i.id,qty:i.qty,note:String(i.note||'').slice(0,200)})):[];}catch{}
const info = id => menu.find(i=>i.id===id);
const subtotal = () => cart.reduce((sum,row)=>sum+info(row.id).price*row.qty,0);
const itemCount = () => cart.reduce((sum,row)=>sum+row.qty,0);
function notify(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2400);}
function persist(){try{sessionStorage.setItem('addys-kiosk-order-v2',JSON.stringify(cart));}catch{}}
function changeCategory(id){category=id;sub='all';$('search-input').value='';renderMenu();$('catalog').scrollTo({top:0,behavior:'smooth'});}
function descriptionFor(item){if(item.name==='Margherita Round Pizza')return 'Tomato, mozzarella, basil. A classic for a reason.';return item.description.trim();}
function renderMenu(){
  const query=$('search-input').value.trim().toLowerCase();
  $('categories').innerHTML=groups.map(group=>`<button class="category-button ${category===group.id?'active':''}" data-category="${group.id}" aria-pressed="${category===group.id}"><span class="category-symbol" aria-hidden="true">${group.symbol}</span>${group.name}${group.id==='favorites'?`<small>${menu.filter(i=>i.popular).length}</small>`:''}</button>`).join('');
  const current=groups.find(g=>g.id===category);
  let filtered=menu.filter(query?i=>`${i.name} ${i.description}`.toLowerCase().includes(query):current.filter);
  if(!query&&category==='pizza')filtered=filtered.filter(pizzaStyles.find(s=>s[0]===sub)[2]);
  $('welcome').hidden=!!query||category!=='favorites';
  $('category-title').textContent=query?'Search results':current.title;
  $('category-description').textContent=query?`Dishes matching “${$('search-input').value.trim()}”`:current.description;
  $('result-count').textContent=`${filtered.length} ${filtered.length===1?'dish':'dishes'}`;
  $('subcategories').hidden=!!query||category!=='pizza';
  $('subcategories').innerHTML=pizzaStyles.map(style=>`<button class="subcategory ${sub===style[0]?'active':''}" data-sub="${style[0]}" aria-pressed="${sub===style[0]}">${style[1]}</button>`).join('');
  $('no-results').hidden=filtered.length>0;
  $('menu-grid').innerHTML=filtered.map((item,index)=>`<article class="menu-card ${item.image?'has-picture':''}" tabindex="0" role="button" aria-label="View ${escapeHtml(item.name)} details" data-item="${item.id}">${item.image?`<figure class="card-picture"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="${index<6?'eager':'lazy'}" decoding="async"></figure>`:''}<div class="card-copy">${item.popular?'<span class="popular-mark" aria-label="Popular"></span>':''}<div class="card-category">${escapeHtml(item.category)}</div><h3>${escapeHtml(item.name)}</h3>${descriptionFor(item)?`<p class="card-description">${escapeHtml(descriptionFor(item))}</p>`:''}<div class="card-bottom"><span class="card-price"><small>from</small>${money(item.price)}</span><button class="add-button" data-add="${item.id}" aria-label="Add ${escapeHtml(item.name)}">+</button></div></div></article>`).join('');
}
function renderCart(){
  const count=itemCount();$('cart-count').textContent=count;$('cart-total').textContent=money(subtotal());$('cart-empty').hidden=count>0;$('review-btn').disabled=!count;$('clear-btn').hidden=!count;
  $('mobile-cart').hidden=false;$('mobile-count').textContent=count;$('mobile-total').innerHTML=`${money(subtotal())} <span aria-hidden="true">→</span>`;
  $('order-mode-label').textContent=mode==='pickup'?'Pickup':'Delivery';$('order-mode-detail').textContent=mode==='pickup'?'75 East Main Street':'Address and delivery fee confirmed by phone';
  $('cart-items').innerHTML=cart.map((row,index)=>{const item=info(row.id);return `<div class="cart-item"><div class="cart-item-head"><span class="cart-item-name">${escapeHtml(item.name)}</span><span class="cart-item-price">${money(item.price*row.qty)}</span></div>${row.note?`<p class="cart-item-note">${escapeHtml(row.note)}</p>`:''}<div class="cart-item-controls"><div class="small-quantity"><button data-quantity="${index}" data-delta="-1" aria-label="Decrease ${escapeHtml(item.name)} quantity">−</button><span>${row.qty}</span><button data-quantity="${index}" data-delta="1" aria-label="Increase ${escapeHtml(item.name)} quantity">+</button></div><button class="remove-item" data-remove="${index}">Remove</button></div></div>`;}).join('');
  persist();
}
function addItem(id,qty=1,note=''){
  const existing=cart.find(i=>i.id===id&&i.note===note);
  if(existing)existing.qty=Math.min(99,existing.qty+qty);else cart.push({id,qty,note});
  renderCart();notify(`${info(id).name} added`);
}
function openItem(id){selected=info(id);itemQty=1;$('item-category').textContent=selected.category;$('item-name').textContent=selected.name;$('item-description').textContent=descriptionFor(selected)||'Ask the restaurant about this dish when you call.';$('item-price').textContent=money(selected.price);$('item-note').value='';const photo=$('item-picture');photo.hidden=!selected.image;if(selected.image){photo.src=selected.image;photo.alt=selected.name;}else{photo.removeAttribute('src');photo.alt='';}updateItemQuantity();$('item-dialog').showModal();}
function updateItemQuantity(){$('item-qty').textContent=itemQty;$('item-minus').disabled=itemQty===1;$('item-plus').disabled=itemQty===99;$('item-add').innerHTML=`Add to order <span>${money(selected.price*itemQty)}</span>`;}
function openReview(){if(!cart.length)return;$('review-items').innerHTML=cart.map(row=>`<div class="review-item"><span>${row.qty} × ${escapeHtml(info(row.id).name)}${row.note?`<small>${escapeHtml(row.note)}</small>`:''}</span><strong>${money(info(row.id).price*row.qty)}</strong></div>`).join('');$('review-total').textContent=money(subtotal());$('review-mode').textContent=mode==='pickup'?'Pickup at 75 East Main Street, Huntington.':'Delivery address, availability, minimum and fee confirmed by phone.';$('review-dialog').showModal();}
function showInfo(kind){
  const text=kind==='about'?`<img class="info-photo" src="assets/storefront-1600.webp" alt="Addy’s storefront"><p class="overline">YOUR NEIGHBORHOOD PIZZERIA</p><h2>See you at Addy’s.</h2><p>75 East Main Street<br>Huntington, NY 11743</p><p class="hours">Monday–Saturday: 11 am–10 pm<br>Sunday: Noon–10 pm</p><a class="primary" href="tel:+16319231389">Call (631) 923-1389 <span>↗</span></a>`:kind==='allergy'?`<p class="overline">BEFORE YOU ORDER</p><h2>Let’s talk allergies.</h2><p>Please speak with the restaurant about food allergies and dietary needs before ordering.</p><p>Gluten-free menu names do not guarantee an allergen-free kitchen.</p><a class="primary" href="tel:+16319231389">Call (631) 923-1389 <span>↗</span></a>`:`<p class="overline">A WARM WELCOME</p><h2>We’re here to help.</h2><p>Browse a category or search for a dish. Tap + to add a favorite, or tap a dish for details and special requests.</p><p>Review your list, then call Addy’s to confirm your order and current prices.</p><a class="primary" href="tel:+16319231389">Call (631) 923-1389 <span>↗</span></a>`;
  $('info-content').innerHTML=text;$('info-dialog').showModal();
}
document.addEventListener('click',event=>{
  const target=event.target.closest('button');
  if(target?.dataset.category)changeCategory(target.dataset.category);
  if(target?.dataset.sub){sub=target.dataset.sub;renderMenu();}
  if(target?.dataset.add){event.stopPropagation();addItem(target.dataset.add);return;}
  if(target?.dataset.close)$(target.dataset.close).close();
  if(target?.dataset.quantity!==undefined){const row=cart[Number(target.dataset.quantity)];row.qty=Math.min(99,row.qty+Number(target.dataset.delta));cart=cart.filter(r=>r.qty>0);renderCart();}
  if(target?.dataset.remove!==undefined){cart.splice(Number(target.dataset.remove),1);renderCart();}
  const card=event.target.closest('.menu-card');if(card&&!target?.dataset.add)openItem(card.dataset.item);
  if(target?.dataset.mode){mode=target.dataset.mode;document.querySelectorAll('[data-mode]').forEach(b=>{const active=b.dataset.mode===mode;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active);});renderCart();}
});
document.addEventListener('keydown',event=>{if(event.target.classList.contains('menu-card')&&(event.key==='Enter'||event.key===' ')){event.preventDefault();openItem(event.target.dataset.item);}});
$('search-input').addEventListener('input',renderMenu);
$('browse-pizza').addEventListener('click',()=>changeCategory('pizza'));
$('reset-search').addEventListener('click',()=>changeCategory('all'));
$('item-minus').addEventListener('click',()=>{itemQty=Math.max(1,itemQty-1);updateItemQuantity();});
$('item-plus').addEventListener('click',()=>{itemQty=Math.min(99,itemQty+1);updateItemQuantity();});
$('item-form').addEventListener('submit',event=>{event.preventDefault();addItem(selected.id,itemQty,$('item-note').value.trim());$('item-dialog').close();});
$('review-btn').addEventListener('click',openReview);
$('mobile-cart').addEventListener('click',()=>{$('cart').classList.add('mobile-open');$('cart-close').focus();});
$('cart-close').addEventListener('click',()=>{$('cart').classList.remove('mobile-open');$('mobile-cart').focus();});
$('clear-btn').addEventListener('click',()=>{cart=[];renderCart();notify('Ready for a new order.');});
$('about-btn').addEventListener('click',()=>showInfo('about'));
$('allergy-btn').addEventListener('click',()=>showInfo('allergy'));
$('help-btn').addEventListener('click',()=>showInfo('help'));
$('save-order').addEventListener('click',()=>{
  const text=['ADDY’S PIZZERIA','75 East Main Street, Huntington, NY 11743','(631) 923-1389','',mode==='pickup'?'PICKUP ORDER LIST':'DELIVERY ORDER LIST','',...cart.map(row=>`${row.qty} × ${info(row.id).name} — ${money(info(row.id).price*row.qty)}${row.note?'\n  Request: '+row.note:''}`),'',`Estimated subtotal: ${money(subtotal())}`,'Menu starting prices. Confirm sizes, prices, availability, tax and any delivery fees by phone.','This list has not been sent to the restaurant.','Source: https://addys-pizza.vercel.app/menu'].join('\n');
  const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Addys-Pizzeria-Order-List.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Order list saved.');
});
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(dialog.id==='idle-dialog')return;if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}}));
renderMenu();renderCart();
