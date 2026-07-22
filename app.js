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

const state = { concept: 0, hero: 0, cart: 0, expanded: 0, city: 'Москва', toast: '', playing: null, popup: false };
const requestedDesign = Number(new URLSearchParams(location.search).get('design'));
if (requestedDesign >= 1 && requestedDesign <= 10) state.concept = requestedDesign - 1;
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
  const mode = concepts[state.concept].id;
  const labels = {win98:'RINGTONE.EXE',acid:'100% FREE*',y2k:'SOUND DROP',tv:'РЕКЛАМА',os:'NOW PLAYING',arcade:'BONUS STAGE',scrap:'ВЫРЕЖИ И СОХРАНИ',brutal:'РИНГТОН №'+(i+1),warez:`track_0${i+1}.mp3`,chaos:'НЕ НАЖИМАЙ'};
  return `<button class="ring-ad ${shape} ring-${i%4} ad-${mode}" data-ring="${i}" aria-label="Прослушать рингтон">
    <span class="ad-format">${labels[mode]}</span><span class="ad-spark">${a[2]}</span><strong>${a[0]}</strong><em>${a[1]}</em>
    <span class="equalizer"><i></i><i></i><i></i><i></i></span><small>${state.playing===i?'■ СТОП':'▶ СЛУШАТЬ'}</small><span class="ad-meta">00:${18+i*3} · MP3</span>
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
  const mode = concepts[state.concept].id;
  const templates = {
    win98: `<div class="win-title"><span>📄 NM_00${p.id}.CARD</span><i>— □ ×</i></div><button class="card-main win-file" data-expand="${p.id}">${art(p)}<span class="win-properties"><b>${p.name}</b><span>Тип: поздравительная открытка</span><span>Размер: 105 × 148 мм</span><span>Состояние: <i>в наличии</i></span><strong>${money(p.price)}</strong><em>Открыть свойства…</em></span></button>`,
    acid: `<div class="acid-strip"><b>!!! ${p.badge} !!!</b><span>ТОВАР №000${p.id}</span><marquee>ЛУЧШАЯ ЦЕНА В РУНЕТЕ ★ ДОСТАВКА В ТВОЙ ГОРОД</marquee></div><button class="card-main acid-row" data-expand="${p.id}">${art(p)}<span class="acid-data"><small>[ОТКРЫТЬ]</small><h3>${p.name}</h3><p>КРУТАЯ ОТКРЫТКА ДЛЯ РЕАЛЬНЫХ ДРУЗЕЙ!!!</p><strong>${money(p.price)}</strong><u>ПОДРОБНЕЕ &gt;&gt;&gt;</u></span></button>`,
    y2k: `<button class="card-main y2k-editorial" data-expand="${p.id}"><span class="y2k-number">0${i+1}</span>${art(p)}<span class="y2k-copy"><small>LIMITED MEME OBJECT</small><h3>${p.name}</h3><p>Analog feelings for digital people.</p><span class="y2k-pill">${p.badge}</span><strong>${money(p.price)}</strong><i>DISCOVER ↗</i></span></button>`,
    tv: `<div class="tv-channel"><b>КАНАЛ ${i+1}</b><span>СЕЙЧАС В ЭФИРЕ</span><i>● REC</i></div><button class="card-main tv-show" data-expand="${p.id}"><div class="tv-screen">${art(p)}<span>16:9</span></div><span class="tv-pitch"><small>ТОВАР ДНЯ</small><h3>${p.name}</h3><p>ЗВОНИТЕ ПРЯМО СЕЙЧАС! Количество ограничено.</p><strong>${money(p.price)}</strong><em>СМОТРЕТЬ ПРЕДЛОЖЕНИЕ →</em></span></button>`,
    os: `<button class="card-main os-app" data-expand="${p.id}"><span class="os-icon">${art(p,true)}<i>${p.badge}</i></span><b>${p.name.replace('Открытка ','')}</b><small>${money(p.price)} · INSTALLED</small></button><div class="os-dock-info"><span>Quick Look</span><span>♡</span><span>•••</span></div>`,
    arcade: `<div class="arcade-top"><span>HIGH SCORE</span><b>00${p.price}00</b></div><button class="card-main arcade-machine" data-expand="${p.id}"><div class="arcade-screen">${art(p)}<span>LEVEL ${i+1}</span></div><div class="arcade-controls"><i></i><span>● ●</span></div><h3>${p.name}</h3><strong>${money(p.price)}</strong><em>PRESS START</em></button>`,
    scrap: `<button class="card-main scrap-polaroid" data-expand="${p.id}"><span class="scrap-tape"></span>${art(p)}<span class="scrap-note"><small># находка 0${i+1}</small><h3>${p.name}</h3><p>«Увидел и сразу вспомнил про тебя»</p><strong>${money(p.price)}</strong><i>посмотреть ↗</i></span><span class="scrap-sticker">${p.badge}!</span></button>`,
    brutal: `<button class="card-main brutal-story" data-expand="${p.id}"><span class="brutal-no">0${i+1}</span><div class="brutal-image">${art(p)}</div><span class="brutal-copy"><small>ОБЪЕКТ / NM-00${p.id}</small><h3>${p.name}</h3><p>Бумага. Мем. Никакой лишней сентиментальности.</p><strong>${money(p.price)}</strong><i>КУПИТЬ ЭТО →</i></span></button>`,
    warez: `<div class="warez-head"><span>NM_RELEASE_00${p.id}</span><i>verified ✓</i></div><button class="card-main warez-file" data-expand="${p.id}"><span class="file-icon">${p.emoji}<small>.CARD</small></span><span class="file-name"><b>${p.name}</b><small>/gifts/postcards/2026/</small></span><span class="file-size">${120+i*37} KB</span><span class="file-seeds">▲ ${83-i*9}</span><strong>${money(p.price)}</strong><em>[ DETAILS ]</em></button>`,
    chaos: `<button class="card-main chaos-tile chaos-tile-${i+1}" data-expand="${p.id}"><span class="chaos-label">0${i+1} / ${p.badge}</span>${art(p)}<span class="chaos-copy"><h3>${p.name}</h3><p>${i%2?'Для неловких, но важных моментов.':'Мем вместо тысячи слов.'}</p><strong>${money(p.price)}</strong><i>РАСКРЫТЬ +</i></span><span class="chaos-mark">${['WOW','LOL','OMG','OK'][i]}</span></button>`
  };
  return `<article class="product-card card-${mode} ${expanded?'expanded':''}" style="--i:${i}">
    ${templates[mode]}
    <div class="card-details details-${mode}">
      <div class="detail-media"><div class="video-fake"><span>▶</span><small>ВИДЕО ОТКРЫТИЯ · 0:08</small></div><p>В наличии · отправим сегодня</p></div>
      <div class="detail-copy"><small>АРТИКУЛ NM-00${p.id}</small><h3>${p.name}</h3><p>Можно подписать вручную, положить к подарку или отправить тому, кто понимает мемы без объяснений.</p><ul><li>формат А6</li><li>плотность 300 г/м²</li><li>крафт-конверт в комплекте</li></ul></div>
      <div class="detail-buy">${priceGrid(p)}</div>
      <button class="detail-close" data-expand="0">×</button>
    </div>
  </article>`;
}

function hero(c) {
  const p = products[state.hero % products.length];
  const heroLabels={win98:'Welcome.exe',acid:'ЛУЧШИЙ САЙТ РУНЕТА',y2k:'DROP 01 / 2026',tv:'● ПРЯМОЙ ЭФИР',os:'NORMAS.OS / HOME',arcade:'INSERT COIN',scrap:'МОЯ КОЛЛЕКЦИЯ',brutal:'NO CRINGE.',warez:'NORMAS MEMAS PORTAL v2.6',chaos:'CONTROLLED CHAOS™'};
  return `<section class="hero hero-${c.id}">
    <div class="hero-mode-label">${heroLabels[c.id]}</div>
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
    <div class="hero-ads hero-ads-${c.id}">${ringtoneAd(0,'mini')}${ringtoneAd(1,'mini')}</div>
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
    <div class="shop-layout layout-${c.id}">
      <aside class="ad-rail left">${ringtoneAd(2)}${ringtoneAd(3)}${ringtoneAd(1)}</aside>
      <section class="catalog" id="catalog">
        <div class="catalog-head"><span>КАТАЛОГ_2026</span><h2>Подарки для своих</h2><p>Нажми на карточку — она раскроется прямо здесь.</p></div>
        <div class="mobile-ad">${ringtoneAd(2,'wide')}</div>
        <div class="products products-${c.id}">${products.map(productCard).join('')}</div>
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
  document.querySelectorAll('[data-concept]').forEach(b=>b.onclick=()=>{state.concept=+b.dataset.concept;state.expanded=0;history.replaceState(null,'',`?design=${state.concept+1}`);render();window.scrollTo({top:0,behavior:'smooth'});});
  document.querySelector('[data-next]').onclick=()=>{state.concept=(state.concept+1)%10;history.replaceState(null,'',`?design=${state.concept+1}`);render();window.scrollTo({top:0,behavior:'smooth'});};
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
