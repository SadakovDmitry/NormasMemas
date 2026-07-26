const concepts = [
  { id: 'acid', n: '01', name: 'Кислотный портал', subtitle: 'Интернет 2003', icon: '☣', accent: '#39ff14' },
  { id: 'y2k', n: '02', name: 'Y2K Commerce', subtitle: 'Хром и пластик', icon: '✦', accent: '#7c3cff' },
  { id: 'tv', n: '03', name: 'Телемагазин', subtitle: 'Прямой эфир', icon: '◉', accent: '#ff312e' },
  { id: 'os', n: '04', name: 'Normas OS', subtitle: 'Мемная система', icon: '⌘', accent: '#6cff9b' },
  { id: 'arcade', n: '05', name: 'Аркада', subtitle: 'Gift player one', icon: '◆', accent: '#00e5ff' },
  { id: 'scrap', n: '06', name: 'Скрапбук', subtitle: 'Мемный коллаж', icon: '✂', accent: '#ff5e76' },
  { id: 'brutal', n: '07', name: 'Web Brutalism', subtitle: 'Честный интернет', icon: '■', accent: '#ff3b00' },
  { id: 'chaos', n: '08', name: 'Controlled Chaos', subtitle: 'Хаос под контролем', icon: '※', accent: '#ff4fd8' },
  { id: 'pixel', n: '09', name: 'Pixel Noir', subtitle: 'Modern game store', icon: '▦', accent: '#ff3b30' },
];

const products = [
  { id: 1, name: 'Открытка «Ну ты это… заходи»', price: 149, color: '#ffea00', ink: '#ef233c', emoji: '👀', badge: 'ХИТ' },
  { id: 2, name: 'Открытка «Это фиаско, братан»', price: 169, color: '#ff785a', ink: '#211a1d', emoji: '🐕', badge: 'НОВИНКА' },
  { id: 3, name: 'Стикер-пак «Жизненно»', price: 249, color: '#7bf1a8', ink: '#14281d', emoji: '🫠', badge: 'МАЛО' },
  { id: 4, name: 'Подарочный набор «Нормас»', price: 799, color: '#b8b8ff', ink: '#3a0ca3', emoji: '🎁', badge: 'ХИТ' },
];

const state = { concept: 0, hero: 0, cart: 0, expanded: 0, city: 'Москва', toast: '', playing: null, popup: false };
const requestedDesign = Number(new URLSearchParams(location.search).get('design'));
if (requestedDesign >= 1 && requestedDesign <= concepts.length) state.concept = requestedDesign - 1;
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
    <div class="concept-brand"><span>NM</span><div><b>ДИЗАЙН-ЛАБ</b><small>9 концепций магазина</small></div></div>
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
  const labels = {win98:'RINGTONE.EXE',acid:'100% FREE*',y2k:'SOUND DROP',tv:'РЕКЛАМА',os:'NOW PLAYING',arcade:'BONUS STAGE',scrap:'ВЫРЕЖИ И СОХРАНИ',brutal:'РИНГТОН №'+(i+1),warez:`track_0${i+1}.mp3`,chaos:'НЕ НАЖИМАЙ',pixel:'SOUND LOOT'};
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
    chaos: `<button class="card-main chaos-tile chaos-tile-${i+1}" data-expand="${p.id}"><span class="chaos-label">0${i+1} / ${p.badge}</span>${art(p)}<span class="chaos-copy"><h3>${p.name}</h3><p>${i%2?'Для неловких, но важных моментов.':'Мем вместо тысячи слов.'}</p><strong>${money(p.price)}</strong><i>РАСКРЫТЬ +</i></span><span class="chaos-mark">${['WOW','LOL','OMG','OK'][i]}</span></button>`,
    pixel: `<button class="card-main pixel-item pixel-item-${i+1}" data-expand="${p.id}"><span class="pixel-rarity">${p.badge==='ХИТ'?'LEGENDARY':p.badge==='МАЛО'?'LIMITED':'RARE'}</span><div class="pixel-art-frame">${art(p)}<span class="pixel-scan"></span></div><span class="pixel-item-copy"><small>ITEM / NM-00${p.id}</small><h3>${p.name}</h3><p>${i===3?'Комплект предметов для максимального эффекта.':'Физический мем. Можно экипировать в подарок.'}</p><span class="pixel-stats"><i>LOL ${88-i*7}</i><i>CRINGE 0</i></span><strong>${money(p.price)}</strong><em>INSPECT ITEM　↗</em></span></button>`
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
  const heroLabels={win98:'Welcome.exe',acid:'ЛУЧШИЙ САЙТ РУНЕТА',y2k:'DROP 01 / 2026',tv:'● ПРЯМОЙ ЭФИР',os:'NORMAS.OS / HOME',arcade:'INSERT COIN',scrap:'МОЯ КОЛЛЕКЦИЯ',brutal:'NO CRINGE.',warez:'NORMAS MEMAS PORTAL v2.6',chaos:'CONTROLLED CHAOS™',pixel:'SEASON 01 · SHOP ONLINE'};
  const heroText={win98:['Добро пожаловать!','Открытки, стикеры и подарки установлены и готовы к отправке.'],acid:['ТЫ НАШЁЛ ЛУЧШИЙ ПОДАРОК!!!','Мемные открытки с доставкой по всей России. Без регистрации и СМС*'],y2k:['Objects with feelings.','Коллекция тактильных мемов для людей, которым есть что сказать.'],tv:['Сегодня в эфире: подарки','Эксклюзивные открытки. Успейте заказать до окончания программы!'],os:['Everything you need to LOL.','Одна система для открыток, подарков, доставки и хорошего настроения.'],arcade:['Выбери свой подарок','Проходи уровни, собирай мемы и побеждай неловкие поздравления.'],scrap:['Собрано для своих','Открытки, которые хочется хранить между страницами любимого альбома.'],brutal:['ПОДАРКИ БЕЗ КРИНЖА.','Бумага. Мем. Доставка. Никакой лишней сентиментальности.'],warez:['Fresh gifts archive','Проверенные релизы открыток и стикеров. Чисто. Быстро. Без вирусов.'],chaos:['Красиво. Странно. Понятно.','Вокруг — интернет. Внутри — удобный магазин подарков.'],pixel:['Choose your legendary gift.','Современная коллекция физических мемов. Собрана для тех, кто прошёл интернет.']};
  return `<section class="hero hero-${c.id}">
    <div class="hero-mode-label">${heroLabels[c.id]}</div>
    <div class="hero-copy">
      <span class="eyebrow">★ ОФИЦИАЛЬНАЯ МЕМНАЯ ЛАВКА ★</span>
      <div class="logo-lockup"><span>НОРМАС</span><span>МЕМАС</span></div>
      <h1>${heroText[c.id][0]}<br><em>${c.id==='brutal'?'ДАРИ — ЛОЛ.':'Дари — ЛОЛ!'}</em></h1>
      <p>${heroText[c.id][1]}</p>
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

function catalogHeading(c) {
  const copy={win98:['C:\\МОИ ПОДАРКИ','Файлы, которые приятно отправлять.'],acid:['СУПЕР МЕГА КАТАЛОГ!!!','ЖМИ НА ТОВАР И СМОТРИ ПОДРОБНОСТИ'],y2k:['The gift edit.','Tactile memes, curated for your people.'],tv:['ТОВАРЫ В ЭФИРЕ','Выберите канал и смотрите предложение.'],os:['Your gift apps','Tap an icon to open Quick Look.'],arcade:['Выбери уровень','Каждый подарок открывает новый уровень дружбы.'],scrap:['Находки для своих','Собрано, подписано и приклеено с любовью.'],brutal:['ПОДАРКИ ДЛЯ СВОИХ','Четыре объекта. Никаких случайных вещей.'],warez:['/catalog/gifts','4 verified releases found'],chaos:['Витрина нормальных вещей','Нажимай куда хочется — главное видно сразу.'],pixel:['ITEM COLLECTION','Выберите предмет и откройте подробную карточку.']};
  return `<div class="catalog-head"><span>${c.id==='warez'?'INDEX OF /GIFTS':'КАТАЛОГ_2026'}</span><h2>${copy[c.id][0]}</h2><p>${copy[c.id][1]}</p></div>`;
}

function fullPageSections(c) {
  const blocks = {
    win98: `<section class="story-block story-win98"><div class="win-taskbar"><button>▶ Пуск</button><span>Полная версия магазина</span><i>17:42</i></div><div class="win-desktop"><div class="win-folder"><b>📦</b><span>Доставка</span></div><div class="win-folder"><b>💳</b><span>Оплата</span></div><div class="win-folder"><b>♫</b><span>Рингтоны</span></div><div class="win-dialog"><div>Оформление заказа.exe <i>— □ ×</i></div><h3>Мастер хорошего подарка</h3><ol><li><b>1</b> Выберите открытку</li><li><b>2</b> Укажите город и ПВЗ</li><li><b>3</b> Оплатите удобным способом</li></ol><button>Далее &gt;</button></div><div class="win-help"><div>Справка</div><h3>Почему всё нормас?</h3><p>Плотная бумага, СДЭК и Почта России, трек-номер по SMS.</p></div></div></section>`,
    acid: `<section class="story-block story-acid"><div class="acid-links"><h2>+++ ПОЛЕЗНЫЕ РАЗДЕЛЫ +++</h2><a>► КАК КУПИТЬ ПОДАРОК???</a><a>► ДОСТАВКА ПО ВСЕЙ РОССИИ!!!</a><a>► ОПЛАТА КАРТОЙ / СБП / ЮMONEY</a><a>► НАПИСАТЬ В ГОСТЕВУЮ КНИГУ</a></div><div class="acid-order"><marquee>ВАШ ЗАКАЗ БУДЕТ ОТПРАВЛЕН СЕГОДНЯ ★ ВЫБЕРИ ГОРОД ★ НЕ ДАРИ КРИНЖ</marquee><h2>КАК ЭТО РАБОТАЕТ?</h2><div><span><b>01</b> ТЫКАЕШЬ «КУПИТЬ»</span><span><b>02</b> ВЫБИРАЕШЬ ДОСТАВКУ</span><span><b>03</b> РЕШАЕШЬ МЕМНУЮ КАПЧУ</span><span><b>04</b> ПОЛУЧАЕШЬ ЛОЛ</span></div></div><div class="guestbook"><h3>ГОСТЕВАЯ КНИГА</h3><p><b>Кот_В_тапках:</b> открытка огонь!!!11</p><p><b>Лена2001:</b> доставили быстро, мама оценила</p><button>ОСТАВИТЬ СООБЩЕНИЕ</button></div></section>`,
    y2k: `<section class="story-block story-y2k"><div class="y2k-manifest"><small>NORMAS / SERVICE / 2026</small><h2>We deliver<br><i>real emotions.</i></h2><p>Выбирайте предмет, сравнивайте четыре цены и решайте, где удобнее купить. На нашем сайте — приоритетная цена и доставка до двери или ПВЗ.</p></div><div class="y2k-orbits"><span>01<br><b>Pick</b></span><span>02<br><b>Wrap</b></span><span>03<br><b>Send</b></span><div>СДЭК<br>ПОЧТА<br>1–3 DAYS</div></div><div class="y2k-checkout"><small>EXPRESS CHECKOUT</small><h3>One smooth flow.</h3><div><span>Москва</span><span>ПВЗ рядом</span><span>СБП</span></div><button>CONTINUE TO CHECKOUT ↗</button></div></section>`,
    tv: `<section class="story-block story-tv"><div class="tv-break">РЕКЛАМНАЯ ПАУЗА ОКОНЧЕНА</div><h2>ПРОГРАММА ПОКУПКИ</h2><div class="tv-schedule"><article><b>18:00</b><h3>Выбор подарка</h3><p>Все открытки в одном эфире.</p></article><article><b>18:05</b><h3>Доставка</h3><p>СДЭК или Почта России.</p></article><article><b>18:07</b><h3>Мемная капча</h3><p>Проверяем чувство юмора.</p></article><article><b>18:10</b><h3>Финальные титры</h3><p>Оплата и трек-номер по SMS.</p></article></div><div class="tv-lower"><span>СРОЧНАЯ НОВОСТЬ</span><p>Цена на сайте ниже маркетплейсов. Это не акция — это позиция бренда.</p></div></section>`,
    os: `<section class="story-block story-os"><div class="os-menubar"><span>● ● ●</span><b>Control Center</b><i>100% ▰</i></div><div class="os-widgets"><article class="weather"><small>ДОСТАВКА</small><b>1–3</b><span>дня до Москвы</span></article><article><small>СПОСОБЫ</small><h3>СДЭК · Почта</h3><p>ПВЗ или до двери</p></article><article class="os-player"><small>NORMAS RADIO</small><h3>♫ Мяу-мяу</h3><div>◀　▶　▶▶</div></article><article class="os-order"><small>ORDER FLOW</small><ol><li>Добавить</li><li>Доставка</li><li>Капча</li><li>Оплата</li></ol></article></div><div class="os-notification"><span>✓</span><div><b>Никакого аккаунта</b><p>Корзина сохранится, а статус придёт по SMS.</p></div><time>now</time></div></section>`,
    arcade: `<section class="story-block story-arcade"><div class="arcade-marquee">HOW TO WIN</div><div class="quest-map"><article><b>LEVEL 01</b><span>🛒</span><h3>Собери инвентарь</h3></article><i>····</i><article><b>LEVEL 02</b><span>📍</span><h3>Найди свой ПВЗ</h3></article><i>····</i><article><b>BOSS</b><span>🧠</span><h3>Победи капчу</h3></article><i>····</i><article><b>WIN!</b><span>🎁</span><h3>Получи подарок</h3></article></div><div class="arcade-score"><span>PLAYER 1</span><b>БОНУС: бесплатный ЛОЛ</b><button>CONTINUE ▶</button></div></section>`,
    scrap: `<section class="story-block story-scrap"><div class="scrap-letter"><small>ЗАПИСКА № 08</small><h2>Как подарок доберётся до тебя</h2><p>Упакуем открытки в крафтовый конверт, передадим в СДЭК или Почту и пришлём трек-номер. Всё без регистрации и лишних анкет.</p><div class="scrap-steps"><span>выбрать</span><i>→</i><span>подписать</span><i>→</i><span>отправить</span></div></div><div class="scrap-receipt"><b>НОРМАС МЕМАС</b><p>Открытка × 1</p><p>Конверт × 1</p><p>Настроение × ∞</p><hr><strong>ИТОГО: НОРМАС</strong></div><div class="scrap-caption">«Подарки нужны не по поводу, а по человеку»</div></section>`,
    brutal: `<section class="story-block story-brutal"><div class="brutal-rule"><b>01</b><h2>БЕЗ<br>РЕГИСТРАЦИИ</h2><p>Имя, телефон, город. Всё.</p></div><div class="brutal-rule inverse"><b>02</b><h2>4 ЦЕНЫ.<br>ОДИН ВЫБОР.</h2><p>Сайт, Ozon, WB и Маркет — рядом.</p></div><div class="brutal-rule"><b>03</b><h2>ДОСТАВКА<br>БЕЗ СЮРПРИЗОВ</h2><p>Срок и стоимость известны до оплаты.</p></div><div class="brutal-cta"><span>ХВАТИТ ЛИСТАТЬ.</span><button>ПОЛОЖИТЬ В КОРЗИНУ →</button></div></section>`,
    warez: `<section class="story-block story-warez"><div class="terminal"><div>README_FIRST.txt <i>_ □ ×</i></div><pre>normas-memas/store<br>├── catalog ........ ONLINE<br>├── prices.1c ...... SYNCED<br>├── delivery ....... CDEK / POST<br>├── payments ....... CARD / SBP / YM<br>└── cringe .......... NOT FOUND</pre><span>C:\\&gt; shop --without-registration_</span></div><div class="warez-table"><h3>ORDER_PIPELINE.LOG</h3><p><b>[OK]</b> Добавление в корзину</p><p><b>[OK]</b> Проверка цены</p><p><b>[OK]</b> Выбор ПВЗ</p><p><b>[FUN]</b> Мемная капча</p><p><b>[SECURE]</b> Оплата</p></div><div class="download-box"><span>READY TO DOWNLOAD</span><h2>Подарок найден.</h2><button>[ START ORDER ]</button></div></section>`,
    chaos: `<section class="story-block story-chaos"><div class="chaos-poster"><small>ИНСТРУКЦИЯ / НЕ ОБЯЗАТЕЛЬНО</small><h2>Купить проще,<br>чем выглядит.</h2></div><div class="chaos-instructions"><article><b>01</b><p>Кидаешь мем в корзину</p></article><article><b>02</b><p>Выбираешь город и ПВЗ</p></article><article><b>03</b><p>Проходишь мемную капчу</p></article><article><b>04</b><p>Получаешь SMS и подарок</p></article></div><div class="chaos-facts"><span>БЕЗ АККАУНТА</span><span>4 ЦЕНЫ СРАЗУ</span><span>ДОСТАВКА 1–3 ДНЯ</span><span>РИНГТОНЫ ПО 20 ₽</span></div><div class="chaos-final"><h3>Ну что,<br>нормас?</h3><button>ДА, В КОРЗИНУ →</button></div></section>`,
    pixel: `<section class="story-block story-pixel"><div class="pixel-section-head"><small>QUEST / ORDER FLOW</small><h2>Four steps.<br>Zero cringe.</h2><p>Всё необходимое для покупки собрано в одном чистом игровом интерфейсе.</p></div><div class="pixel-questline"><article><span>01</span><i>▣</i><b>ADD ITEM</b><p>Выберите предмет и положите его в инвентарь.</p></article><article><span>02</span><i>⌖</i><b>SELECT POINT</b><p>СДЭК, Почта России или доставка до двери.</p></article><article><span>03</span><i>◆</i><b>MEME CHECK</b><p>Пройдите короткую мемную капчу.</p></article><article><span>04</span><i>✓</i><b>GET REWARD</b><p>Оплатите и получите трек-номер по SMS.</p></article></div><div class="pixel-dashboard"><div><small>DELIVERY STATUS</small><strong>1–3 DAYS</strong><span>Москва · online</span></div><div><small>PAYMENT MODULES</small><strong>03 ACTIVE</strong><span>Card · SBP · ЮMoney</span></div><div><small>ACCOUNT REQUIRED</small><strong>NO</strong><span>Quick checkout</span></div></div><div class="pixel-final"><span class="pixel-cursor">◆</span><div><small>READY PLAYER?</small><h3>Equip a better gift.</h3></div><button>OPEN INVENTORY　→</button></div></section>`
  };
  return blocks[c.id];
}

function chrome(c) {
  return `<div class="theme-chrome">
    <div class="chrome-title"><span>${c.icon}</span><b>${c.name}</b><small>${c.subtitle}</small><i>${c.n}/${String(concepts.length).padStart(2,'0')}</i></div>
    <div class="city-control"><span>Доставка в</span><select data-city><option>Москва</option><option>Санкт-Петербург</option><option>Казань</option><option>Екатеринбург</option></select></div>
    <button class="cart" data-cart><span>🛒</span><b>${state.cart}</b><em>${state.cart?money(state.cart*149):'Корзина пуста'}</em></button>
  </div>`;
}

function pixelSoundModule(i) {
  const sounds = [
    ['RING_01', 'Бумер incoming call', '00:18'],
    ['RING_02', 'Шрек 2 theme', '00:21'],
    ['RING_03', 'Мяу-мяу alert', '00:24'],
  ];
  const s = sounds[i % sounds.length];
  return `<button class="px-sound ${state.playing===i?'playing':''}" data-ring="${i}">
    <span class="px-wave">${Array.from({length:18},(_,n)=>`<i style="--h:${18+(n*17)%72}%"></i>`).join('')}</span>
    <span class="px-sound-copy"><small>${s[0]} / SOUND LOOT</small><b>${s[1]}</b><em>${s[2]} · 20 ₽</em></span>
    <strong>${state.playing===i?'■':'▶'}</strong>
  </button>`;
}

function pixelInventoryCard(p, i) {
  return `<button class="px-inventory-card px-card-${i+1} ${state.expanded===p.id?'selected':''}" data-expand="${p.id}">
    <span class="px-card-id">NM.${String(p.id).padStart(3,'0')}</span>
    <span class="px-card-rarity">${p.badge==='ХИТ'?'S-TIER':p.badge==='МАЛО'?'LAST DROP':'RARE'}</span>
    <div class="px-card-art">${art(p)}<span></span></div>
    <div class="px-card-info"><h3>${p.name}</h3><p>${i===3?'Полный gift loadout':'Physical meme artifact'}</p><strong>${money(p.price)}</strong><i>SELECT ＋</i></div>
  </button>`;
}

function pixelStandalonePage(c) {
  const selected = products.find(p=>p.id===state.expanded) || products[state.hero] || products[0];
  return `${switcher()}<main class="pixel-standalone">
    <div class="px-ambient" aria-hidden="true"><i></i><i></i><i></i></div>
    <header class="px-header">
      <div class="px-brand"><span>NM</span><div><b>NORMAS / MEMAS</b><small>DARK ITEM STORE · SEASON 01</small></div></div>
      <div class="px-live"><i></i> 1C SYNCED <span>·</span> STORE ONLINE</div>
      <label class="px-location">DESTINATION <select data-city><option>Москва</option><option>Санкт-Петербург</option><option>Казань</option><option>Екатеринбург</option></select></label>
      <button class="px-cart" data-cart><span>INVENTORY</span><b>${String(state.cart).padStart(2,'0')}</b><em>${state.cart?money(state.cart*149):'EMPTY'}</em></button>
    </header>

    <section class="px-hero">
      <div class="px-meme-cast" aria-hidden="true">
        <div class="px-meme px-meme-erzhan">
          <em>ЕРЖАН, ВСТАВАЙ</em>
          <svg viewBox="0 0 48 34" shape-rendering="crispEdges">
            <path d="M3 24h39v3h3v5H2v-6h1z" fill="#173e4b"/><path d="M5 23h35v3h3v4H4v-5h1z" fill="#54d9ff"/>
            <path d="M6 20h5v-4h7v-2h12v3h6v9H8v-2H4v-7h2z" fill="#332017"/>
            <path d="M8 19h6v-3h14v2h8v7H10v-2H6v-5h2z" fill="#70452d"/>
            <path d="M13 17h12v2h7v5H14v-2H9v-3h4z" fill="#8e5a3a"/>
            <path d="M29 9h3V6h10v3h3v13h-3v3H29v-2h-3V12h3z" fill="#352117"/>
            <path d="M31 9h10v2h2v10h-3v2h-9v-2h-3v-8h3z" fill="#815033"/>
            <rect x="27" y="12" width="4" height="6" fill="#a36b47"/><rect x="42" y="12" width="4" height="6" fill="#a36b47"/>
            <path d="M31 15h11v6H31z" fill="#c58b62"/><rect x="33" y="14" width="3" height="2" fill="#1c1511"/><rect x="39" y="14" width="3" height="2" fill="#1c1511"/>
            <rect x="34" y="18" width="2" height="1" fill="#5a3424"/><rect x="39" y="18" width="2" height="1" fill="#5a3424"/><rect x="36" y="20" width="4" height="1" fill="#3a2219"/>
            <path d="M5 17H2v-3H0V7h3v6h3z" fill="#3c2519"/><path d="M4 15H2V9h2v3h3v4z" fill="#8f5b3b"/>
            <rect x="17" y="10" width="3" height="2" fill="#f6f4ee"/><rect x="21" y="6" width="3" height="2" fill="#f6f4ee"/><rect x="24" y="3" width="2" height="2" fill="#54d9ff"/>
            <rect x="12" y="25" width="15" height="1" fill="#90e8ff"/><rect x="6" y="30" width="35" height="1" fill="#286577"/>
          </svg>
        </div>
        <div class="px-meme px-meme-zhdun">
          <em>ЖДУН</em>
          <svg viewBox="0 0 38 46" shape-rendering="crispEdges">
            <path d="M11 3h16v3h4v12h3v17h-3v8H7v-8H4V18h3V6h4z" fill="#56545d"/>
            <path d="M13 4h12v2h4v12h3v15h-4v7H10v-7H6V19h3V7h4z" fill="#aaa7b0"/>
            <path d="M14 6h10v2h3v8h-4v2H12v-2H9V9h5z" fill="#c3c0c7"/>
            <rect x="12" y="11" width="3" height="3" fill="#f0eef0"/><rect x="23" y="11" width="3" height="3" fill="#f0eef0"/>
            <rect x="13" y="12" width="2" height="2" fill="#18171b"/><rect x="23" y="12" width="2" height="2" fill="#18171b"/>
            <path d="M16 15h8v4h3v11h-3v3H14v-3h3z" fill="#bebbc2"/><path d="M19 16h4v13h-2v2h-4v-3h2z" fill="#d0cdd2"/>
            <rect x="17" y="32" width="7" height="2" fill="#8d8a94"/><rect x="11" y="20" width="3" height="10" fill="#9b98a2"/>
            <path d="M7 26H3v3H0v6h8v-2h7v-5h-4v2H7z" fill="#bbb8c0"/><path d="M31 26h4v3h3v6h-8v-2h-7v-5h4v2h4z" fill="#bbb8c0"/>
            <rect x="2" y="32" width="10" height="2" fill="#d1ced3"/><rect x="26" y="32" width="10" height="2" fill="#d1ced3"/>
            <path d="M7 38h11v6H4v-4h3z" fill="#85828d"/><path d="M20 38h11v2h3v4H20z" fill="#85828d"/>
            <rect x="8" y="39" width="7" height="1" fill="#aaa7b0"/><rect x="23" y="39" width="7" height="1" fill="#aaa7b0"/>
          </svg>
        </div>
        <div class="px-meme px-meme-wolf">
          <em>ЩАС СПОЮ</em>
          <svg viewBox="0 0 44 44" shape-rendering="crispEdges">
            <path d="M10 7h4V2h7l3 6h5l3-6h6v7h3v17h-4v3h3v10h-6v4H10v-4H4V28H0V17h4v-5h6z" fill="#292b30"/>
            <path d="M12 8h4V5h4l3 6h8l3-6h3v7h3v13h-5v4h3v8h-6v4H12v-4H7V27H3v-8h4v-5h5z" fill="#6f747a"/>
            <path d="M14 10h16v3h5v11h-4v4H13v-3H9V14h5z" fill="#7f848a"/>
            <path d="M11 13h9v3h-8zM25 13h9v3h-8z" fill="#4a4d52"/>
            <rect x="14" y="16" width="5" height="4" fill="#efc958"/><rect x="26" y="16" width="5" height="4" fill="#efc958"/>
            <rect x="16" y="17" width="2" height="3" fill="#16171a"/><rect x="27" y="17" width="2" height="3" fill="#16171a"/>
            <path d="M14 22h17v6h-3v3H17v-2h-3z" fill="#b5b7b8"/><rect x="20" y="21" width="7" height="4" fill="#25262a"/>
            <rect x="22" y="25" width="3" height="2" fill="#f2efe8"/><rect x="17" y="28" width="11" height="1" fill="#55585d"/>
            <path d="M11 29h22v10H11z" fill="#676b70"/><path d="M14 30h15v9H14z" fill="#7d8185"/>
            <path d="M7 25H2v3H0v6h8v-3h6v-5h-3v2H7z" fill="#8f9397"/><path d="M36 24h5v3h3v6h-8v-3h-6v-5h3v2h3z" fill="#8f9397"/>
            <rect x="12" y="39" width="8" height="4" fill="#45484c"/><rect x="25" y="39" width="8" height="4" fill="#45484c"/>
            <rect x="17" y="33" width="2" height="2" fill="#92969a"/><rect x="26" y="34" width="2" height="2" fill="#5a5d61"/>
          </svg>
        </div>
        <div class="px-meme px-meme-vodka">
          <em>МЫ ДОМОЙ ЛЕТИМ</em>
          <svg viewBox="0 0 56 44" shape-rendering="crispEdges">
            <path d="M4 7h3V4h17v3h3v17h-3v17H5V25H1V14h3z" fill="#17181c"/>
            <path d="M7 8h15v3h3v11h-4v4H8v-3H5V12h2z" fill="#d2a07f"/>
            <path d="M5 5h19v4h3v5h-6v-3H8v4H4V8h1z" fill="#7f3429"/><rect x="8" y="7" width="12" height="2" fill="#a54d3c"/>
            <rect x="9" y="15" width="3" height="3" fill="#f6f0e9"/><rect x="19" y="15" width="3" height="3" fill="#f6f0e9"/><rect x="10" y="16" width="2" height="2" fill="#17171a"/><rect x="19" y="16" width="2" height="2" fill="#17171a"/>
            <rect x="13" y="21" width="7" height="2" fill="#984c48"/><rect x="15" y="20" width="4" height="1" fill="#6c3432"/>
            <path d="M5 26h18v15H5z" fill="#24262c"/><path d="M8 27h6v12H8z" fill="#33363d"/><rect x="2" y="27" width="6" height="7" fill="#d2a07f"/>
            <path d="M30 7h3V4h15v3h3v17h-3v17H29V25h-3V11h4z" fill="#1c2630"/>
            <path d="M33 8h13v2h3v12h-4v3H33v-3h-3V11h3z" fill="#ddb18e"/>
            <path d="M31 5h17v3h3v5h-4V9H33v4h-4V8h2z" fill="#48372f"/><rect x="34" y="7" width="12" height="2" fill="#655047"/>
            <rect x="34" y="15" width="3" height="2" fill="#17171a"/><rect x="43" y="15" width="3" height="2" fill="#17171a"/><rect x="37" y="21" width="6" height="1" fill="#996a58"/>
            <path d="M29 25h20v16H29z" fill="#31597c"/><rect x="34" y="25" width="10" height="8" fill="#f1f0e9"/><path d="M37 25h4v7h-4z" fill="#d5d6d3"/>
            <path d="M49 17h4v-5h2v4h1v17h-9V20h2z" fill="#cbd8dd"/><rect x="50" y="14" width="4" height="5" fill="#54d9ff"/><rect x="49" y="23" width="6" height="8" fill="#edf2f3"/><rect x="51" y="25" width="2" height="5" fill="#9edcf0"/>
            <rect x="8" y="41" width="7" height="3" fill="#0e0f12"/><rect x="17" y="41" width="6" height="3" fill="#0e0f12"/><rect x="32" y="41" width="7" height="3" fill="#152739"/><rect x="43" y="41" width="6" height="3" fill="#152739"/>
            <rect x="25" y="3" width="2" height="4" fill="#ff3b30"/><rect x="26" y="2" width="1" height="1" fill="#f6f4ee"/>
          </svg>
        </div>
      </div>
      <aside class="px-rail">
        <span class="active">01<br><b>DROP</b></span><span>02<br><b>ITEMS</b></span><span>03<br><b>AUDIO</b></span><span>04<br><b>ORDER</b></span>
        <i>SCROLL TO EXPLORE</i>
      </aside>
      <div class="px-hero-copy">
        <small>LIMITED PHYSICAL MEMES / 2026</small>
        <div class="px-spectrum"><span>COMBAT RED</span><span>SIGNAL CYAN</span></div>
        <h1>THE GIFT<br>IS <em>NOT</em><br>CRINGE.</h1>
        <p>Тёмная коллекция открыток и стикеров для людей, которые выросли на старых играх, но покупают в современном интернете.</p>
        <div><button data-scroll>ENTER THE STORE</button><span>↓ 09 ITEMS ONLINE</span></div>
      </div>
      <div class="px-stage">
        <div class="px-cameo-peeker" aria-hidden="true">
          <span>ШЛЁПА</span>
          <svg viewBox="0 0 40 36" shape-rendering="crispEdges">
            <path d="M7 8V2h4V0h4v9h10V0h4v2h4v7h3v22h-5v4H9v-4H4V11h3z" fill="#382820"/>
            <path d="M9 9V4h3v7h16V4h3v6h3v19h-5v4H11v-4H6V12h3z" fill="#b8784c"/>
            <path d="M11 12h18v3h4v13h-5v3H12v-3H8V15h3z" fill="#c88d5b"/>
            <path d="M9 4h3v8H9zM28 4h3v8h-3z" fill="#6c402d"/><rect x="10" y="1" width="2" height="5" fill="#211b18"/><rect x="29" y="1" width="2" height="5" fill="#211b18"/>
            <path d="M12 15h6v7h-6zM23 15h6v7h-6z" fill="#ead8c4"/><rect x="14" y="17" width="3" height="5" fill="#171513"/><rect x="24" y="17" width="3" height="5" fill="#171513"/>
            <rect x="15" y="17" width="1" height="2" fill="#f6f4ee"/><rect x="25" y="17" width="1" height="2" fill="#f6f4ee"/>
            <path d="M15 24h11v6H15z" fill="#efddc8"/><rect x="18" y="23" width="5" height="3" fill="#3b241b"/><rect x="19" y="24" width="3" height="1" fill="#8b5a42"/>
            <rect x="17" y="28" width="3" height="1" fill="#8d604a"/><rect x="22" y="28" width="3" height="1" fill="#8d604a"/>
            <rect x="7" y="22" width="8" height="1" fill="#6e4835"/><rect x="26" y="22" width="8" height="1" fill="#6e4835"/><rect x="4" y="20" width="3" height="1" fill="#d8a372"/><rect x="34" y="20" width="3" height="1" fill="#d8a372"/>
            <path d="M10 31h8v4h-9v-2H7v-2zM23 31h8v2h-2v2h-9v-4z" fill="#9f633f"/>
            <rect x="11" y="13" width="3" height="1" fill="#e3b27d"/><rect x="27" y="13" width="3" height="1" fill="#e3b27d"/>
          </svg>
        </div>
        <div class="px-stage-top"><span>FEATURED DROP</span><b>NM-${String(selected.id).padStart(3,'0')}</b><i>● LIVE</i></div>
        <button class="px-stage-arrow left" data-hero="-1">←</button>
        <div class="px-stage-art">${art(selected)}<span class="px-stage-grid"></span></div>
        <button class="px-stage-arrow right" data-hero="1">→</button>
        <div class="px-stage-bottom"><div><small>${selected.badge} / PHYSICAL ITEM</small><h2>${selected.name}</h2></div><strong>${money(selected.price)}</strong></div>
      </div>
      <aside class="px-buy-panel">
        <div class="px-stock"><small>AVAILABILITY</small><b><i></i> IN STOCK</b><span>Ships today</span></div>
        <div class="px-price-list"><small>PRICE INTEL</small><p><span>NORMAS</span><b>${money(selected.price)}</b></p><p><span>OZON</span><b>${money(selected.price+80)}</b></p><p><span>WB</span><b>${money(selected.price+110)}</b></p><p><span>MARKET</span><b>${money(selected.price+140)}</b></p></div>
        <button class="px-primary-buy" data-buy="${selected.id}">ADD TO INVENTORY <span>＋</span></button>
        <p class="px-delivery">⌖ Москва<br><b>Delivery 1–3 days</b></p>
      </aside>
    </section>

    <section class="px-audio-deck" id="audio">
      <div class="px-section-code">AUDIO<br>LOOT</div>
      ${pixelSoundModule(0)}${pixelSoundModule(1)}${pixelSoundModule(2)}
    </section>

    <section class="px-inventory" id="catalog">
      <header><div><small>COLLECTION / 01</small><h2>ITEM<br>INVENTORY</h2></div><p>Каждый предмет — самостоятельный игровой артефакт. Выберите карточку, чтобы открыть подробности и сравнить площадки.</p><span>04 ITEMS</span></header>
      <div class="px-inventory-grid">${products.map(pixelInventoryCard).join('')}</div>
    </section>

    <section class="px-inspect" id="inspect">
      <header><span>INSPECT MODE</span><b>ITEM ${String(selected.id).padStart(3,'0')}</b><i>UPDATED NOW</i></header>
      <div class="px-inspect-media"><div class="px-video"><span>▶</span><small>OPENING_SEQUENCE.MP4</small></div><div class="px-thumbs">${art(selected,true)}${art(products[(selected.id)%products.length],true)}</div></div>
      <div class="px-inspect-copy"><small>${selected.badge} · CARD ARTIFACT</small><h2>${selected.name}</h2><p>Плотная открытка с мемом внутри. Подходит для поздравления, поддержки и ситуаций, когда нормальные слова уже закончились.</p><dl><div><dt>FORMAT</dt><dd>A6</dd></div><div><dt>PAPER</dt><dd>300 g/m²</dd></div><div><dt>PACKAGE</dt><dd>CRAFT</dd></div></dl></div>
      <div class="px-inspect-market"><small>SELECT MERCHANT</small><button class="main" data-buy="${selected.id}"><span>NORMAS STORE<em>1–2 days</em></span><b>${money(selected.price)}</b></button><button><span>OZON<em>tomorrow</em></span><b>${money(selected.price+80)}</b></button><button><span>WILDBERRIES<em>2 days</em></span><b>${money(selected.price+110)}</b></button><button><span>YANDEX MARKET<em>1–3 days</em></span><b>${money(selected.price+140)}</b></button></div>
    </section>

    <section class="px-route">
      <header><small>ORDER PROTOCOL</small><h2>FROM DROP<br>TO DOOR.</h2></header>
      <div class="px-route-line"><article><span>01</span><i>▣</i><b>CHOOSE</b><p>Добавьте предмет</p></article><article><span>02</span><i>⌖</i><b>ROUTE</b><p>Выберите ПВЗ</p></article><article><span>03</span><i>◆</i><b>VERIFY</b><p>Пройдите капчу</p></article><article><span>04</span><i>✓</i><b>RECEIVE</b><p>Получите трек</p></article></div>
    </section>

    <section class="px-checkout" id="checkout">
      <div class="px-checkout-copy"><small>QUICK CHECKOUT / NO ACCOUNT</small><h2>READY TO<br>COMPLETE<br>THE QUEST?</h2><p>Карты, СБП и ЮMoney. Данные заказа сохраняются, даже если мемная капча отправит вас изучать классику.</p></div>
      <div class="px-terminal">
        <div><span>ORDER_TERMINAL</span><i>SECURE ●</i></div>
        <label>PLAYER NAME<input value="Алексей" readonly></label>
        <label>PHONE<input value="+7 999 000-00-00" readonly></label>
        <label>DELIVERY<select><option>СДЭК · Пункт выдачи</option></select></label>
        <p><span>ITEMS</span><b>${money(selected.price)}</b></p><p><span>DELIVERY</span><b>290 ₽</b></p><strong><span>TOTAL</span><b>${money(selected.price+290)}</b></strong>
        <button>PROCEED TO PAYMENT　→</button>
      </div>
    </section>

    <footer class="px-footer"><div class="px-brand"><span>NM</span><div><b>NORMAS / MEMAS</b><small>NO CRINGE SINCE 2026</small></div></div><p>ОФЕРТА.txt　 ПОЛИТИКА.txt　 КОНТАКТЫ.exe</p><span>© 2026 · ALL MEMES RESERVED</span></footer>
  </main>
  ${state.toast?`<div class="toast"><span>✓</span><div><b>${state.toast}</b><small>Inventory updated</small></div></div>`:''}
  ${state.popup?`<div class="px-alert"><button data-popup>×</button><small>INCOMING SOUND DROP</small><b>♫ Рингтон разблокирован</b><span>20 ₽ · instant download</span></div>`:''}`;
}

function render() {
  const c = concepts[state.concept];
  document.body.className = `theme-${c.id}`;
  document.documentElement.style.setProperty('--concept-accent', c.accent);
  if (c.id === 'pixel') {
    app.innerHTML = pixelStandalonePage(c);
    bind();
    return;
  }
  app.innerHTML = `${switcher()}<main class="site-shell">
    ${chrome(c)}
    <div class="ticker"><span>✦ БЕСПЛАТНЫЙ ЛОЛ К КАЖДОМУ ЗАКАЗУ ✦ ОТКРЫТКИ, КОТОРЫЕ НЕ СТЫДНО ДАРИТЬ ✦ РИНГТОНЫ ПО 20 ₽ ✦</span></div>
    ${hero(c)}
    <div class="shop-layout layout-${c.id}">
      <aside class="ad-rail left">${ringtoneAd(2)}${ringtoneAd(3)}${ringtoneAd(1)}</aside>
      <section class="catalog" id="catalog">
        ${catalogHeading(c)}
        <div class="mobile-ad">${ringtoneAd(2,'wide')}</div>
        <div class="products products-${c.id}">${products.map(productCard).join('')}</div>
        ${fullPageSections(c)}
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

function placePixelMemes() {
  if (!document.body.classList.contains('theme-pixel')) return;
  const placements = [
    ['.px-meme-erzhan', '.px-audio-deck'],
    ['.px-meme-zhdun', '.px-inventory'],
    ['.px-meme-wolf', '.px-inspect'],
    ['.px-meme-vodka', '.px-checkout']
  ];
  placements.forEach(([meme, section]) => {
    const character = document.querySelector(meme);
    const target = document.querySelector(section);
    if (character && target) target.appendChild(character);
  });
}

function bind() {
  placePixelMemes();
  document.querySelectorAll('[data-concept]').forEach(b=>b.onclick=()=>{state.concept=+b.dataset.concept;state.expanded=0;history.replaceState(null,'',`?design=${state.concept+1}`);render();window.scrollTo({top:0,behavior:'smooth'});});
  document.querySelector('[data-next]').onclick=()=>{state.concept=(state.concept+1)%concepts.length;history.replaceState(null,'',`?design=${state.concept+1}`);render();window.scrollTo({top:0,behavior:'smooth'});};
  document.querySelectorAll('[data-expand]').forEach(b=>b.onclick=()=>{state.expanded=+b.dataset.expand;render();setTimeout(()=>{const target=document.querySelector('.product-card.expanded')||document.querySelector('.px-inspect');target?.scrollIntoView({behavior:'smooth',block:'center'})},20);});
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
