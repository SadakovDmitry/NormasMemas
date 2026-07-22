const concepts = [
  { id: 'win98', n: '01', name: 'Windows 98', subtitle: 'Магазин подарков', icon: '▣', accent: '#000080' },
  { id: 'acid', n: '02', name: 'Кислотный портал', subtitle: 'Интернет 2003', icon: '☣', accent: '#39ff14' },
  { id: 'y2k', n: '03', name: 'Y2K Commerce', subtitle: 'Хром и пластик', icon: '✦', accent: '#7c3cff' },
  { id: 'tv', n: '04', name: 'Телемагазин', subtitle: 'Прямой эфир', icon: '◉', accent: '#ff312e' },
  { id: 'os', n: '05', name: 'Normas OS', subtitle: 'Мемная система', icon: '⌘', accent: '#6cff9b' },
  { id: 'arcade', n: '06', name: 'Аркада', subtitle: 'Gift player one', icon: '◆', accent: '#00e5ff' },
  { id: 'scrap', n: '07', name: 'Скрапбук', subtitle: 'Мемный коллаж', icon: '✂', accent: '#ff5e76' },
  { id: 'brutal', n: '08', name: 'Web Brutalism', subtitle: 'Честный интернет', icon: '■', accent: '#ff3b00' },
  { id: 'warez', n: '09', name: 'Пиратский софт', subtitle: 'Giftware portal', icon: '▤', accent: '#39a0ff' },
  { id: 'chaos', n: '10', name: 'Controlled Chaos', subtitle: 'Хаос под контролем', icon: '※', accent: '#ff4fd8' },
];

const products = [
  { id: 1, name: 'Открытка «Ну ты это… заходи»', price: 149, color: '#ffea00', ink: '#ef233c', emoji: '👀', badge: 'ХИТ' },
  { id: 2, name: 'Открытка «Это фиаско, братан»', price: 169, color: '#ff785a', ink: '#211a1d', emoji: '🐕', badge: 'НОВИНКА' },
  { id: 3, name: 'Стикер-пак «Жизненно»', price: 249, color: '#7bf1a8', ink: '#14281d', emoji: '🫠', badge: 'МАЛО' },
  { id: 4, name: 'Подарочный набор «Нормас»', price: 799, color: '#b8b8ff', ink: '#3a0ca3', emoji: '🎁', badge: 'ХИТ' },
];

const state = { concept: 0, hero: 0, cart: 0, expanded: 1, city: 'Москва', toast: '', playing: null, popup: false };
const app = document.querySelector('#app');

function money(n) { return `${n.toLocaleString('ru-RU')} ₽`; }

function art(p, small = false) {
  return `<div class="product-art ${small ? 'small' : ''}" style="--paper:${p.color};--ink:${p.ink}">
    <span class="art-noise"></span><span class="art-emoji">${p.emoji}</span>
    <strong>${p.name.split('«')[1]?.replace('»','') || 'НОРМАС'}</strong>
    <i>normas<br>memas</i>
  </div>`;
}

function switcher() {
  return `<header class="concept-bar">
    <div class="concept-brand"><span>NM</span><div><b>ДИЗАЙН-ЛАБ</b><small>10 концепций магазина</small></div></div>
    <div class="concept-tabs" role="tablist">
      ${concepts.map((c,i)=>`<button class="concept-tab ${i===state.concept?'active':''}" data-concept="${i}" title="${c.name}: ${c.subtitle}">
        <span>${c.n}</span><b>${c.icon}</b><em>${c.name}</em>
      </button>`).join('')}
    </div>
    <button class="concept-next" data-next>Следующий <span>→</span></button>
  </header>`;
}

function ringtoneAd(i, shape='side') {
  const ads = [
    ['ТВОЙ ТЕЛЕФОН МОЛЧИТ?', 'Поставь «Бумер» за 20 ₽', '☎'],
    ['СУПЕР ХИТ!', 'Мелодия «Шрек 2»', '★'],
    ['СКАЧАЙ СЕЙЧАС', 'Рингтон «Мяу-мяу»', '♫'],
    ['ТЫ 1000-Й ГОСТЬ!', 'Забери громкий звонок', '🏆'],
  ]; const a=ads[i%ads.length];
  return `<button class="ring-ad ${shape} ring-${i%4}" data-ring="${i}" aria-label="Прослушать рингтон">
    <span class="ad-spark">${a[2]}</span><strong>${a[0]}</strong><em>${a[1]}</em>
    <span class="equalizer"><i></i><i></i><i></i><i></i></span><small>${state.playing===i?'■ СТОП':'▶ СЛУШАТЬ'}</small>
  </button>`;
}

function priceGrid(p) {
  return `<div class="prices">
    <div class="our-price"><small>У НАС</small><strong>${money(p.price)}</strong><span>доставка 1–2 дня</span></div>
    <div><small>OZON</small><b>${money(p.price+80)}</b><span>завтра</span></div>
    <div><small>WB</small><b>${money(p.price+110)}</b><span>2 дня</span></div>
    <div><small>Я.МАРКЕТ</small><b>${money(p.price+140)}</b><span>1–3 дня</span></div>
  </div>
  <button class="buy-button" data-buy="${p.id}"><span>＋</span> КУПИТЬ У НАС — ${money(p.price)}</button>
  <div class="market-buttons"><button>OZON</button><button>WB</button><button>Я.МАРКЕТ</button></div>`;
}

function productCard(p, i) {
  const expanded = state.expanded === p.id;
  return `<article class="product-card ${expanded?'expanded':''}" style="--i:${i}">
    <button class="card-main" data-expand="${p.id}">
      <span class="badge badge-${p.badge==='МАЛО'?'low':'hot'}">${p.badge}</span>
      ${art(p)}
      <span class="card-copy"><small>ОТКРЫТЬ КАРТОЧКУ ↗</small><h3>${p.name}</h3><p>Та самая открытка для того самого человека. Плотная бумага, мем внутри.</p><b>от ${money(p.price)}</b></span>
    </button>
    <div class="card-details">
      <div class="detail-media"><div class="video-fake"><span>▶</span><small>ВИДЕО ОТКРЫТИЯ · 0:08</small></div><p>В наличии · отправим сегодня</p></div>
      <div class="detail-copy"><small>АРТИКУЛ NM-00${p.id}</small><h3>${p.name}</h3><p>Можно подписать вручную, положить к подарку или отправить тому, кто понимает мемы без объяснений.</p><ul><li>формат А6</li><li>плотность 300 г/м²</li><li>крафт-конверт в комплекте</li></ul></div>
      <div class="detail-buy">${priceGrid(p)}</div>
      <button class="detail-close" data-expand="0">×</button>
    </div>
  </article>`;
}

function hero(c) {
  const p = products[state.hero % products.length];
  return `<section class="hero">
    <div class="hero-copy">
      <span class="eyebrow">★ ОФИЦИАЛЬНАЯ МЕМНАЯ ЛАВКА ★</span>
      <div class="logo-lockup"><span>НОРМАС</span><span>МЕМАС</span></div>
      <h1>Не дари кринж!<br><em>Дари — ЛОЛ!</em></h1>
      <p>Открытки, стикеры и подарки, которые говорят за тебя.</p>
      <button class="hero-cta" data-scroll>СМОТРЕТЬ ПОДАРКИ <span>↓</span></button>
      <div class="visitor">Вы посетитель № <b>001337</b></div>
    </div>
    <div class="hero-product">
      <div class="hero-window-bar"><span>ГЛАВНАЯ ОТКРЫТКА</span><i>— □ ×</i></div>
      <button class="hero-arrow prev" data-hero="-1">‹</button>
      ${art(p)}
      <div class="hero-offer"><small>ВЫБОР РЕДАКЦИИ</small><b>${p.name}</b><strong>${money(p.price)}</strong></div>
      <button class="hero-arrow next" data-hero="1">›</button>
      <div class="hero-dots">${products.map((_,i)=>`<button class="${i===state.hero?'active':''}" data-hero-index="${i}"></button>`).join('')}</div>
    </div>
    <div class="hero-ads">${ringtoneAd(0,'mini')}${ringtoneAd(1,'mini')}</div>
  </section>`;
}

function chrome(c) {
  return `<div class="theme-chrome">
    <div class="chrome-title"><span>${c.icon}</span><b>${c.name}</b><small>${c.subtitle}</small><i>${c.n}/10</i></div>
    <div class="city-control"><span>Доставка в</span><select data-city><option>Москва</option><option>Санкт-Петербург</option><option>Казань</option><option>Екатеринбург</option></select></div>
    <button class="cart" data-cart><span>🛒</span><b>${state.cart}</b><em>${state.cart?money(state.cart*149):'Корзина пуста'}</em></button>
  </div>`;
}

function render() {
  const c = concepts[state.concept];
  document.body.className = `theme-${c.id}`;
  document.documentElement.style.setProperty('--concept-accent', c.accent);
  app.innerHTML = `${switcher()}<main class="site-shell">
    ${chrome(c)}
    <div class="ticker"><span>✦ БЕСПЛАТНЫЙ ЛОЛ К КАЖДОМУ ЗАКАЗУ ✦ ОТКРЫТКИ, КОТОРЫЕ НЕ СТЫДНО ДАРИТЬ ✦ РИНГТОНЫ ПО 20 ₽ ✦</span></div>
    ${hero(c)}
    <div class="shop-layout">
      <aside class="ad-rail left">${ringtoneAd(2)}${ringtoneAd(3)}${ringtoneAd(1)}</aside>
      <section class="catalog" id="catalog">
        <div class="catalog-head"><span>КАТАЛОГ_2026</span><h2>Подарки для своих</h2><p>Нажми на карточку — она раскроется прямо здесь.</p></div>
        <div class="mobile-ad">${ringtoneAd(2,'wide')}</div>
        <div class="products">${products.map(productCard).join('')}</div>
        <div class="bottom-banner">${ringtoneAd(3,'wide')}<div><small>ДОШЁЛ ДО КОНЦА?</small><h2>Это знак купить открытку.</h2><button data-scroll>НАВЕРХ ↑</button></div></div>
      </section>
      <aside class="ad-rail right">${ringtoneAd(0)}${ringtoneAd(2)}${ringtoneAd(3)}</aside>
    </div>
    <footer><b>НОРМАС МЕМАС © 2026</b><span>СДЕЛАНО С ЛЮБОВЬЮ И ПЛОХИМ ИНТЕРНЕТОМ</span><a>ОФЕРТА.txt</a><a>КОНТАКТЫ.exe</a></footer>
  </main>
  ${state.toast?`<div class="toast"><span>✓</span><div><b>${state.toast}</b><small>Корзина обновлена</small></div></div>`:''}
  ${state.popup?`<div class="popup-ad"><div class="popup-bar"><b>ВАЖНОЕ СООБЩЕНИЕ</b><button data-popup>×</button></div>${ringtoneAd(1,'popup')}<p>Этот рингтон выбирают лучшие из лучших.</p></div>`:''}`;
  bind();
}

function bind() {
  document.querySelectorAll('[data-concept]').forEach(b=>b.onclick=()=>{state.concept=+b.dataset.concept;state.expanded=1;render();window.scrollTo({top:0,behavior:'smooth'});});
  document.querySelector('[data-next]').onclick=()=>{state.concept=(state.concept+1)%10;render();window.scrollTo({top:0,behavior:'smooth'});};
  document.querySelectorAll('[data-expand]').forEach(b=>b.onclick=()=>{state.expanded=+b.dataset.expand;render();setTimeout(()=>document.querySelector('.product-card.expanded')?.scrollIntoView({behavior:'smooth',block:'center'}),20);});
  document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{state.cart++;state.toast='Товар добавлен! Нормас.';render();setTimeout(()=>{state.toast='';render()},2200);});
  document.querySelectorAll('[data-ring]').forEach(b=>b.onclick=()=>{const n=+b.dataset.ring;state.playing=state.playing===n?null:n;render();});
  document.querySelectorAll('[data-hero]').forEach(b=>b.onclick=()=>{state.hero=(state.hero+ +b.dataset.hero+products.length)%products.length;render();});
  document.querySelectorAll('[data-hero-index]').forEach(b=>b.onclick=()=>{state.hero=+b.dataset.heroIndex;render();});
  document.querySelectorAll('[data-scroll]').forEach(b=>b.onclick=()=>document.querySelector('#catalog').scrollIntoView({behavior:'smooth'}));
  document.querySelector('[data-city]').value=state.city;
  document.querySelector('[data-city]').onchange=e=>state.city=e.target.value;
  document.querySelector('[data-cart]').onclick=()=>{state.toast=state.cart?'Прототип корзины':'Сначала добавь мем!';render();setTimeout(()=>{state.toast='';render()},1800)};
  document.querySelector('[data-popup]')?.addEventListener('click',()=>{state.popup=false;render()});
}

render();
setTimeout(()=>{ if(!state.popup){state.popup=true;render()} },9000);
setInterval(()=>{ state.hero=(state.hero+1)%products.length; render(); },30000);
