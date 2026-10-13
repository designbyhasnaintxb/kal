/* ==========================================================================
   COACH KAL — CHOOSE YOUR COURT
   One global state (activeSport) drives every section of the homepage.
   Works without GSAP/Lenis (CDN optional) and without animation.
   ========================================================================== */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const root = document.documentElement;

  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mqFine = matchMedia('(hover: hover) and (pointer: fine)');
  const mqMobile = matchMedia('(max-width: 900px)');
  let reduce = mqReduce.matches;

  const IMG = 'assets/media/img/';
  const VID = 'assets/media/video/';
  const ORDER = ['pickleball', 'tennis', 'badminton', 'racquetball', 'more'];

  /* ------------------------------------------------------------------------
     CONTENT — only known facts; everything else is a visible placeholder
     ------------------------------------------------------------------------ */
  const SPORTS = {
    none: {
      label: 'Pick a court', short: 'No court yet', idx: '00',
      hero: 'Pick a court to see how coaching adapts to your sport.',
      dims: 'Neutral modular court',
      explorer: 'Select a racquet sport to see how the court, the motion and the coaching focus change.',
      cta: 'Talk to Coach Kal',
      coach: 'Select a sport above — or keep scrolling to explore them all.',
      motion: 'Neutral path',
      form: 'Choose your sport so Coach Kal knows where to start.'
    },
    pickleball: {
      label: 'Pickleball', short: 'Pickleball', idx: '01',
      hero: 'Compact court, quick exchanges. Coaching built around your pickleball game.',
      dims: '20 × 44 ft court · 7 ft kitchen · 34 in net',
      explorer: 'Learn and improve your pickleball game through focused, personalized coaching.',
      cta: 'Talk pickleball with Coach Kal',
      coach: 'Pickleball selected — the kitchen line frames the coach.',
      motion: 'Short hops · kitchen ↔ baseline',
      form: 'Tell Coach Kal what you’d like to improve in your pickleball game.'
    },
    tennis: {
      label: 'Tennis', short: 'Tennis', idx: '02',
      hero: 'Longer court, bigger swings. Coaching for players developing their tennis game.',
      dims: '36 × 78 ft court · 3 ft net',
      explorer: 'Coaching for players looking to develop their tennis skills and overall game.',
      cta: 'Talk tennis with Coach Kal',
      coach: 'Tennis selected — the baseline carries through.',
      motion: 'Long sweep · baseline to baseline',
      form: 'Tell Coach Kal what you’d like to improve in your tennis game.'
    },
    badminton: {
      label: 'Badminton', short: 'Badminton', idx: '03',
      hero: 'A high net and a light shuttle. Instruction for players improving their badminton.',
      dims: '20 × 44 ft court · 5 ft net',
      explorer: 'Focused instruction for players looking to improve their badminton game.',
      cta: 'Talk badminton with Coach Kal',
      coach: 'Badminton selected — the net line anchors the frame.',
      motion: 'High arc · rise and drop',
      form: 'Tell Coach Kal what you’d like to improve in your badminton game.'
    },
    racquetball: {
      label: 'Racquetball', short: 'Racquetball', idx: '04',
      hero: 'Four walls, fast rebounds. Training built around racquetball skill development.',
      dims: '20 × 40 ft court · 20 ft walls',
      explorer: 'Training designed around racquetball skill development.',
      cta: 'Talk racquetball with Coach Kal',
      coach: 'Racquetball selected — the wall plane sets the structure.',
      motion: 'Rebound · wall to wall',
      form: 'Tell Coach Kal what you’d like to improve in your racquetball game.'
    },
    more: {
      label: 'More sports', short: 'More sports', idx: '05',
      hero: 'Another racquet sport in mind? Tell Coach Kal what you want to train.',
      dims: 'Modular court · room to expand',
      explorer: 'Looking for coaching in another racquet sport? Connect with Coach Kal to discuss your training needs.',
      cta: 'Ask Coach Kal',
      coach: 'More sports — the court opens into a modular grid.',
      motion: 'Open grid · forward path',
      form: 'Tell Coach Kal which racquet sport you’d like to train in and what you’d like to improve.'
    }
  };

  /* Media library (from /image). sports: [] = multi-sport / neutral session. */
  const MEDIA = {
    singles:    { type: 'video', src: 'pickleball-skinny-singles', rotate: true, orient: 'land', sports: ['pickleball'], label: 'Pickleball · Skinny singles session', alt: 'Pickleball skinny singles session filmed from the side of the court' },
    wall:       { type: 'video', src: 'pickleball-wall-drill', orient: 'port', sports: ['pickleball'], label: 'Pickleball · Solo drill', alt: 'A player working through a pickleball drill' },
    cross:      { type: 'video', src: 'pickleball-crosscourt-drills', orient: 'land', sports: ['pickleball'], label: 'Pickleball · Forehand & backhand cross-court drills', alt: 'Pickleball forehand and backhand cross-court drills' },
    stance:     { type: 'img', src: 'pickleball-ready-stance', w: 1024, h: 1536, orient: 'port', sports: ['pickleball'], label: 'Pickleball · Ready position', alt: 'Coach Kal in a low ready position on a pickleball court' },
    action:     { type: 'img', src: 'pickleball-action', w: 1448, h: 1086, orient: 'land', sports: ['pickleball'], label: 'Pickleball · On court', alt: 'Coach Kal moving to play a pickleball shot on an outdoor court' },
    event:      { type: 'img', src: 'pickleball-event-group', w: 1254, h: 1254, orient: 'sq', sports: ['pickleball'], label: 'Pickleball · Event day', alt: 'Coach Kal with two people at a pickleball event' },
    gesture:    { type: 'img', src: 'pickleball-coaching-gesture', w: 1149, h: 1368, orient: 'port', sports: ['pickleball'], label: 'Pickleball · Instruction', alt: 'Coach Kal demonstrating with a pickleball paddle' },
    portrait:   { type: 'img', src: 'coach-kal-portrait', w: 1122, h: 1402, orient: 'port', sports: ['pickleball'], label: 'Pickleball · Instruction', alt: 'Coach Kal explaining a technique across the net' },
    groupInstr: { type: 'img', src: 'pickleball-group-instruction', w: 1122, h: 1402, orient: 'port', sports: [], label: 'Coaching session · Group instruction', alt: 'Coach Kal talking two players through a drill' },
    pointing:   { type: 'img', src: 'coaching-group-pointing', w: 1122, h: 1402, orient: 'port', sports: [], label: 'Coaching session · Group instruction', alt: 'Coach Kal pointing across the court while two players listen' },
    oneBlue:    { type: 'img', src: 'coaching-one-on-one-blue', w: 1122, h: 1402, orient: 'port', sports: [], label: 'Coaching session · One-on-one', alt: 'Coach Kal guiding a player’s positioning in a one-on-one session' },
    oneGreen:   { type: 'img', src: 'coaching-one-on-one-green', w: 1448, h: 1086, orient: 'land', sports: [], label: 'Coaching session · One-on-one', alt: 'Coach Kal adjusting a player’s grip and stance' },
    demo:       { type: 'img', src: 'coaching-forehand-demo', w: 1122, h: 1402, orient: 'port', sports: [], label: 'Coaching session · Stroke demonstration', alt: 'Coach Kal demonstrating a stroke next to a student' },
    clay:       { type: 'img', src: 'coaching-overhead-clay', w: 1122, h: 1402, orient: 'port', sports: [], label: 'Coaching session · Feeding drill', alt: 'Overhead view of Coach Kal handing a ball to a student' },
    groupBlue:  { type: 'img', src: 'coaching-group-blue', w: 1254, h: 1254, orient: 'sq', sports: [], label: 'Coaching session · Group', alt: 'Coach Kal leading a group session with young players' },
    groupGreen: { type: 'img', src: 'coaching-group-green', w: 1122, h: 1402, orient: 'port', sports: [], label: 'Coaching session · Group', alt: 'Coach Kal feeding balls to a young player while others wait' },
    overhead:   { type: 'img', src: 'coaching-overhead-group', w: 1122, h: 1402, orient: 'port', sports: [], label: 'Coaching session · Group', alt: 'Overhead view of Coach Kal instructing a group' },
    rbPortrait: { type: 'img', src: 'racquetball-court-portrait', w: 1254, h: 1254, orient: 'sq', sports: ['racquetball'], label: 'Racquetball · On court', alt: 'Coach Kal on a racquetball court holding a racquet' },
    rbEvent:    { type: 'img', src: 'racquetball-event-group', w: 1674, h: 940, orient: 'land', sports: ['racquetball'], label: 'Racquetball · Event', alt: 'Group photo on a racquetball court at an event' },
    rbMedal:    { type: 'img', src: 'racquetball-twg-medal-court', w: 2000, h: 1126, orient: 'land', sports: ['racquetball'], label: 'Racquetball · The World Games 2025, Chengdu', alt: 'Four people on a glass racquetball court under The World Games 2025 Chengdu branding, two of them holding bronze medals' },
    rbStaff:    { type: 'img', src: 'racquetball-twg-group-selfie', w: 1600, h: 1200, orient: 'land', sports: ['racquetball'], label: 'Racquetball · The World Games 2025 · Event team', alt: 'Group selfie with event staff in red polos at The World Games 2025 in Chengdu' },
    rbTeam:     { type: 'img', src: 'racquetball-twg-group', w: 960, h: 1280, orient: 'port', sports: ['racquetball'], label: 'Racquetball · The World Games 2025 · Event team', alt: 'Six people standing together in a sports hall at The World Games 2025 in Chengdu' },
    rbAward:    { type: 'img', src: 'racquetball-twg-award', w: 1200, h: 1600, orient: 'port', sports: ['racquetball'], label: 'Racquetball · Indian Racquetball Association award', alt: 'Three people in India racquetball team jackets holding an Indian Racquetball Association trophy at The World Games 2025 in Chengdu' },
    rbMex:      { type: 'video', src: 'racquetball-twg-india-mexico', orient: 'port', sports: ['racquetball'], label: 'Racquetball · The World Games 2025 · India vs Mexico walk-out', alt: 'Players walking out and lining up on court before the India vs Mexico racquetball match at The World Games 2025' },
    rbBreak:    { type: 'video', src: 'racquetball-twg-break-coaching', orient: 'land', sports: ['racquetball'], label: 'Racquetball · The World Games 2025 · Break-time coaching, India vs Japan', alt: 'Broadcast footage of a coach talking to a player during a break in the India vs Japan racquetball match' },
    bdTeam:     { type: 'img', src: 'badminton-team-orange', w: 1500, h: 2000, orient: 'port', sports: ['badminton'], label: 'Badminton · Team day', alt: 'Six players in matching orange “BOSS Baddies Orange” jerseys posing with rackets on an indoor badminton court' }
  };
  /* where each sport's media goes; tennis has no sport-specific media yet */
  const PLACE = {
    hero:     { none: 'pointing', pickleball: 'action', tennis: 'demo', badminton: 'bdTeam', racquetball: 'rbPortrait', more: 'clay' },
    explorer: { none: 'groupInstr', pickleball: 'cross', tennis: 'oneGreen', badminton: 'bdTeam', racquetball: 'rbStaff', more: 'groupGreen' },
    lead:     { none: 'singles', pickleball: 'singles', tennis: 'pointing', badminton: 'bdTeam', racquetball: 'rbMedal', more: 'overhead' }
  };
  const POOL = ['stance', 'wall', 'action', 'event', 'gesture', 'portrait', 'cross', 'singles',
    'groupInstr', 'oneBlue', 'oneGreen', 'demo', 'clay', 'groupBlue', 'groupGreen', 'pointing', 'overhead',
    'rbMedal', 'rbMex', 'rbAward', 'rbBreak', 'rbTeam', 'rbStaff', 'rbPortrait', 'rbEvent', 'bdTeam'];

  /* editable content (assets/js/content.js); the page still renders if it's missing */
  const CONTENT = window.COACH_CONTENT || {};

  /* ------------------------------------------------------------------------
     COURT GEOMETRY (top-down units: floor = 1000 × 560, ~11 units per foot)
     ------------------------------------------------------------------------ */
  const V = (x, y1, y2, k = 'l') => ({ v: 1, x, y1, y2, k });
  const H = (y, x1, x2, k = 'l') => ({ v: 0, y, x1, x2, k });
  const THICK = { l: 3.4, key: 7, net: 4.6, dash: 2.8, ghost: 2 };
  const VSLOTS = ['baseL', 'baseR', 'net', 'svcL', 'svcR', 'lsL', 'lsR', 'gV1', 'gV2'];
  const HSLOTS = ['sideT', 'sideB', 'sinT', 'sinB', 'cenL', 'cenR', 'markL', 'markR', 'gH1', 'gH2'];

  const COURTS = {
    none: {
      surf: [230, 150, 540, 260],
      lines: { baseL: V(230, 150, 410), baseR: V(770, 150, 410), net: V(500, 150, 410, 'net'), svcL: V(365, 150, 410, 'dash'), svcR: V(635, 150, 410, 'dash'), sideT: H(150, 230, 770), sideB: H(410, 230, 770) },
      net: { h: 14, y1: 146, y2: 414 }
    },
    pickleball: {
      surf: [258, 170, 484, 220],
      lines: { baseL: V(258, 170, 390), baseR: V(742, 170, 390), net: V(500, 164, 396, 'net'), svcL: V(423, 170, 390, 'key'), svcR: V(577, 170, 390, 'key'), sideT: H(170, 258, 742), sideB: H(390, 258, 742), cenL: H(280, 258, 423), cenR: H(280, 577, 742) },
      zones: [[423, 170, 77, 220], [500, 170, 77, 220]],
      net: { h: 31, y1: 158, y2: 402 }
    },
    tennis: {
      surf: [71, 82, 858, 396],
      lines: { baseL: V(71, 82, 478, 'key'), baseR: V(929, 82, 478, 'key'), net: V(500, 76, 484, 'net'), svcL: V(269, 131.5, 428.5), svcR: V(731, 131.5, 428.5), sideT: H(82, 71, 929), sideB: H(478, 71, 929), sinT: H(131.5, 71, 929), sinB: H(428.5, 71, 929), cenL: H(280, 269, 500), cenR: H(280, 500, 731), markL: H(280, 71, 88), markR: H(280, 912, 929) },
      net: { h: 36, y1: 66, y2: 494 }
    },
    badminton: {
      surf: [258, 170, 484, 220],
      lines: { baseL: V(258, 170, 390), baseR: V(742, 170, 390), net: V(500, 158, 402, 'key'), svcL: V(428.5, 170, 390), svcR: V(571.5, 170, 390), lsL: V(285.5, 170, 390), lsR: V(714.5, 170, 390), sideT: H(170, 258, 742), sideB: H(390, 258, 742), sinT: H(186.5, 258, 742), sinB: H(373.5, 258, 742), cenL: H(280, 258, 428.5), cenR: H(280, 571.5, 742) },
      net: { h: 58, y1: 160, y2: 400 }
    },
    racquetball: {
      surf: [280, 170, 440, 220],
      lines: { baseL: V(280, 170, 390, 'key'), baseR: V(720, 170, 390, 'key'), net: V(500, 170, 390), svcL: V(445, 170, 390, 'dash'), svcR: V(555, 170, 390), sideT: H(170, 280, 720, 'key'), sideB: H(390, 280, 720, 'key'), sinT: H(186.5, 500, 555), sinB: H(373.5, 500, 555) },
      zones: [[500, 170, 55, 220]],
      net: { h: 0 },
      walls: { x0: 280, x1: 720, y0: 170, y1: 390, front: 150, back: 64, side: 120 }
    },
    more: {
      surf: [200, 130, 600, 300],
      lines: { baseL: V(200, 130, 430), baseR: V(800, 130, 430), net: V(500, 130, 430, 'dash'), svcL: V(350, 130, 430, 'dash'), svcR: V(650, 130, 430, 'dash'), gV1: V(70, 50, 510, 'ghost'), gV2: V(930, 50, 510, 'ghost'), sideT: H(130, 200, 800), sideB: H(430, 200, 800), sinT: H(205, 200, 800, 'dash'), sinB: H(355, 200, 800, 'dash'), cenL: H(280, 200, 500, 'dash'), cenR: H(280, 500, 800, 'dash'), gH1: H(50, 70, 930, 'ghost'), gH2: H(510, 70, 930, 'ghost') },
      nodes: [[350, 205], [500, 205], [650, 205], [350, 280], [500, 280], [650, 280], [350, 355], [500, 355], [650, 355]],
      net: { h: 0 }
    }
  };

  /* Ball / shuttle choreography: [x, y, z] waypoints, h = arc height, d = seconds */
  const S = (a, b, h, d, e = 'lin', extra = {}) => ({ a, b, h, d, e, ...extra });
  const BALL = {
    none: [S([360, 280, 14], [640, 280, 14], 70, 1.4, 'io'), S([640, 280, 14], [360, 280, 14], 70, 1.4, 'io')],
    pickleball: [ // dinks at the kitchen, then a drive to the baseline and back
      S([432, 244, 12], [562, 306, 0], 24, .52), S([562, 306, 0], [574, 302, 12], 9, .2),
      S([574, 302, 12], [446, 318, 0], 22, .52), S([446, 318, 0], [432, 318, 12], 9, .2),
      S([432, 318, 12], [690, 250, 0], 44, .6), S([690, 250, 0], [732, 240, 14], 14, .26),
      S([732, 240, 14], [444, 252, 0], 38, .62), S([444, 252, 0], [432, 244, 12], 9, .2)
    ],
    tennis: [ // long sweeping diagonals, baseline to baseline
      S([88, 132, 22], [762, 402, 0], 96, 1.15), S([762, 402, 0], [914, 440, 24], 42, .45),
      S([914, 440, 24], [236, 148, 0], 100, 1.15), S([236, 148, 0], [88, 132, 22], 42, .45)
    ],
    badminton: [ // shuttle: high clear, net drop, lift
      S([300, 300, 30], [690, 252, 30], 250, 1.55, 'out', { shuttle: true }),
      S([690, 252, 30], [456, 292, 22], 34, .7, 'out', { shuttle: true }),
      S([456, 292, 22], [300, 300, 30], 210, 1.35, 'out', { shuttle: true })
    ],
    racquetball: [ // straight, fast, wall rebounds
      S([330, 300, 14], [720, 232, 60], 8, .42), S([720, 232, 60], [566, 170, 34], 4, .26),
      S([566, 170, 34], [420, 334, 0], 14, .34), S([420, 334, 0], [280, 300, 28], 10, .3),
      S([280, 300, 28], [330, 300, 14], 4, .16)
    ],
    more: [ // neutral forward path across the open grid
      S([350, 355, 0], [350, 280, 0], 16, .5, 'io'), S([350, 280, 0], [500, 280, 0], 16, .5, 'io'),
      S([500, 280, 0], [500, 205, 0], 16, .5, 'io'), S([500, 205, 0], [650, 205, 0], 16, .5, 'io'),
      S([650, 205, 0], [650, 280, 0], 16, .5, 'io'), S([650, 280, 0], [650, 355, 0], 16, .5, 'io'),
      S([650, 355, 0], [500, 355, 0], 16, .5, 'io'), S([500, 355, 0], [350, 355, 0], 16, .5, 'io')
    ]
  };
  const EASE = {
    lin: t => t,
    io: t => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    out: t => 1 - Math.pow(1 - t, 1.9)
  };

  const SIDEVIEW_DUR = { none: 3, pickleball: 2.8, tennis: 3.4, badminton: 3.8, racquetball: 2, more: 3.2 };

  /* ------------------------------------------------------------------------
     STATE
     ------------------------------------------------------------------------ */
  const state = { sport: null, booted: false };
  const store = {
    get() { try { return sessionStorage.getItem('ck-sport'); } catch (e) { return null; } },
    set(v) { try { sessionStorage.setItem('ck-sport', v); } catch (e) { /* ignore */ } }
  };
  const subscribers = [];
  const onSport = fn => subscribers.push(fn);

  function setSport(s, opts = {}) {
    if (!SPORTS[s]) s = 'none';
    if (s === state.sport) return;
    const first = state.sport === null;
    state.sport = s;
    Intro.cancel();
    root.dataset.sport = s;
    subscribers.forEach(fn => fn(s, first, opts));
    if (!first) {
      store.set(s);
      $('#sport-live').textContent = s === 'none' ? 'No sport selected.' : `${SPORTS[s].label} selected. The page has adapted to ${SPORTS[s].label.toLowerCase()}.`;
    }
  }
  const step = dir => {
    const i = ORDER.indexOf(state.sport);
    const n = i < 0 ? (dir > 0 ? 0 : ORDER.length - 1) : (i + dir + ORDER.length) % ORDER.length;
    setSport(ORDER[n]);
  };

  /* ------------------------------------------------------------------------
     SPORT TEXT + SYNCED RADIOGROUPS
     ------------------------------------------------------------------------ */
  const swapTargets = () => [$('.readout'), $('.viewport')].filter(Boolean);
  onSport((s, first) => {
    const apply = () => {
      $$('[data-sport-text]').forEach(el => {
        const v = SPORTS[s][el.dataset.sportText];
        if (v != null) el.textContent = v;
      });
      const gear = $('.readout__gear use');
      if (gear) gear.setAttribute('href', `#gear-${s}`);
      const chip = $('.nav__chip');
      if (chip) chip.setAttribute('aria-label', `Current sport: ${s === 'none' ? 'none selected' : SPORTS[s].label}. Go to sport explorer`);
    };
    if (first || reduce) return apply();
    swapTargets().forEach(t => t.classList.add('is-swapping'));
    setTimeout(() => { apply(); swapTargets().forEach(t => t.classList.remove('is-swapping')); }, 190);
  });

  const ARROW = '<svg class="sport-btn__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
  function buildGroups() {
    $$('[data-sport-group]').forEach(group => {
      const kind = group.dataset.sportGroup;
      group.innerHTML = '';
      ORDER.forEach((s, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role', 'radio');
        b.dataset.sport = s;
        b.style.setProperty('--i', i);
        if (kind === 'media' || kind === 'packages') {
          b.className = 'pill';
          b.textContent = SPORTS[s].short;
        } else {
          b.className = 'sport-btn';
          b.dataset.cursor = 'choose';
          b.innerHTML = `<span class="sport-btn__n">${SPORTS[s].idx}</span><span class="sport-btn__name">${s === 'more' ? (kind === 'hero' ? 'More' : 'More sports') : SPORTS[s].label}</span>${kind === 'explorer' ? ARROW : ''}`;
        }
        group.appendChild(b);
      });
      radiogroup(group);
    });
    // mobile menu pills (buttons that also close the menu)
    const mm = $('[data-sport-buttons]');
    if (mm) {
      ORDER.forEach(s => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'pill'; b.dataset.sport = s; b.textContent = SPORTS[s].label;
        b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', () => { setSport(s); Menu.close(); scrollToEl($('#explorer')); });
        mm.appendChild(b);
      });
    }
  }

  function radiogroup(group) {
    const btns = () => $$('[role="radio"]', group);
    let hoverT;
    group.addEventListener('click', e => {
      const b = e.target.closest('[role="radio"]');
      if (b) setSport(b.dataset.sport);
    });
    group.addEventListener('keydown', e => {
      const list = btns();
      const i = list.indexOf(document.activeElement);
      if (i < 0) return;
      let n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % list.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + list.length) % list.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = list.length - 1;
      if (n === null) return;
      e.preventDefault();
      list[n].focus();
      setSport(list[n].dataset.sport);
    });
    // hover intent selects on desktop (sport names change activeSport)
    if (group.dataset.sportGroup !== 'media' && group.dataset.sportGroup !== 'packages') {
      group.addEventListener('pointerover', e => {
        if (!mqFine.matches || e.pointerType !== 'mouse') return;
        const b = e.target.closest('[role="radio"]');
        if (!b) return;
        clearTimeout(hoverT);
        hoverT = setTimeout(() => setSport(b.dataset.sport), 150);
      });
      group.addEventListener('pointerleave', () => clearTimeout(hoverT));
    }
  }

  onSport(s => {
    $$('[data-sport-group]').forEach(group => {
      const list = $$('[role="radio"]', group);
      list.forEach(b => {
        const on = b.dataset.sport === s;
        b.setAttribute('aria-checked', String(on));
        b.tabIndex = on ? 0 : -1;
      });
      if (!list.some(b => b.dataset.sport === s) && list[0]) list[0].tabIndex = 0;
      // keep the checked tab visible in horizontally scrolling rows
      const on = list.find(b => b.dataset.sport === s);
      if (on && group.scrollWidth > group.clientWidth + 4) {
        group.scrollTo({ left: on.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
    $$('[data-sport-buttons] .pill').forEach(b => {
      b.setAttribute('aria-checked', String(b.dataset.sport === s));
      b.setAttribute('aria-pressed', String(b.dataset.sport === s));
    });
  });

  /* ------------------------------------------------------------------------
     MEDIA HELPERS
     ------------------------------------------------------------------------ */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function pictureHTML(m, sizes, eager) {
    const set = ext => `${IMG}${m.src}-800.${ext} 800w, ${IMG}${m.src}-1600.${ext} ${Math.min(m.w, 1600)}w`;
    return `<picture><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><img src="${IMG}${m.src}-800.webp" srcset="${set('webp')}" sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${esc(m.alt)}" ${eager ? '' : 'loading="lazy"'} decoding="async"></picture>`;
  }
  function videoHTML(m, { controls = false, autoplay = true, posterOnly = false } = {}) {
    let inner;
    if (posterOnly) inner = `<img src="${VID}${m.src}-poster.webp" alt="" loading="lazy" decoding="async">`;
    else inner = `<video ${controls ? 'controls' : ''} muted playsinline loop preload="none" ${autoplay ? 'data-autoplay' : ''} poster="${VID}${m.src}-poster.webp" aria-label="${esc(m.alt)}"><source src="${VID}${m.src}.mp4" type="video/mp4"></video>`;
    return m.rotate ? `<div class="rot">${inner}</div>` : inner;
  }
  const mediaHTML = (m, sizes, opts = {}) => (m.type === 'video' ? videoHTML(m, opts) : pictureHTML(m, sizes, opts.eager));

  function sportNote(key, s) {
    const m = MEDIA[key];
    if (s === 'none' || s === 'more' || m.sports.includes(s)) return esc(m.label);
    return `${esc(m.label)} <span class="ph">· ${SPORTS[s].label} media: placeholder</span>`;
  }

  /* swap media inside a slot with a wipe; old layer removed after */
  function swapMedia(slot, key, sizes, opts = {}) {
    if (!slot || slot.dataset.key === key) return;
    slot.dataset.key = key;
    const m = MEDIA[key];
    const layer = document.createElement('div');
    layer.className = 'mitem' + (slot.childElementCount && !reduce ? ' mswap' : '');
    layer.innerHTML = mediaHTML(m, sizes, opts);
    slot.appendChild(layer);
    const old = [...slot.children].filter(c => c !== layer && c.classList.contains('mitem'));
    const done = () => old.forEach(o => { $$('video', o).forEach(v => v.pause()); o.remove(); });
    if (layer.classList.contains('mswap')) layer.addEventListener('animationend', () => { layer.classList.remove('mswap'); done(); }, { once: true });
    else done();
    $$('video[data-autoplay]', layer).forEach(v => AutoVideo.observe(v));
    return layer;
  }

  /* play muted previews only while visible (and never under reduced motion) */
  const AutoVideo = (() => {
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      entries.forEach(({ target: v, isIntersecting }) => {
        if (isIntersecting && !reduce) {
          if (v.preload !== 'auto') v.preload = 'auto';
          const p = v.play(); if (p && p.catch) p.catch(() => {});
        } else v.pause();
      });
    }, { threshold: .25 }) : null;
    return { observe: v => io && io.observe(v) };
  })();

  /* ------------------------------------------------------------------------
     HERO MEDIA CARD + EXPLORER MEDIA + LEAD / FRAME
     ------------------------------------------------------------------------ */
  onSport((s, first) => {
    const heroKey = PLACE.hero[s];
    swapMedia($('[data-media-slot="hero"]'), heroKey, '214px', { eager: first });
    const heroCap = $('[data-media-cap="hero"]');
    if (heroCap) heroCap.innerHTML = 'Coach Kal · ' + sportNote(heroKey, s);

    const exKey = PLACE.explorer[s];
    swapMedia($('[data-media-slot="explorer"]'), exKey, '(max-width: 900px) 100vw, 60vw');
    const tag = $('[data-media-cap="explorer"]');
    if (tag) tag.innerHTML = sportNote(exKey, s);

    const leadKey = PLACE.lead[s];
    const lead = $('[data-media-slot="lead"]');
    if (lead && lead.dataset.key !== leadKey) {
      swapMedia(lead, leadKey, '100vw');
      const m = MEDIA[leadKey];
      lead.dataset.cursor = m.type === 'video' ? 'watch' : 'view';
      let ui = $('.media__lead-ui', lead);
      if (!ui) {
        ui = document.createElement('div');
        ui.className = 'media__lead-ui';
        lead.appendChild(ui);
      }
      lead.appendChild(ui);
      ui.innerHTML = `<p class="mono media__lead-label">${sportNote(leadKey, s)}</p>
        <button class="btn btn--paper btn--sm" type="button" data-open="${leadKey}" data-cursor="${m.type === 'video' ? 'watch' : 'view'}">
          <span class="btn__text">${m.type === 'video' ? 'Watch' : 'View'}</span>
          <span class="btn__chip" aria-hidden="true"><svg viewBox="0 0 16 16">${m.type === 'video' ? '<path d="M5 3.5v9l7-4.5z"/>' : '<path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"/>'}</svg></span>
        </button>`;
    }
    // the journey frame shows the same media as a still (it becomes the lead)
    const frame = $('[data-media-slot="frame"]');
    if (frame && frame.dataset.key !== leadKey) {
      frame.dataset.key = leadKey;
      const m = MEDIA[leadKey];
      frame.innerHTML = `<div class="mitem">${m.type === 'video' ? videoHTML(m, { posterOnly: true }) : pictureHTML(m, '100vw')}</div>`;
    }
  });

  /* ------------------------------------------------------------------------
     MEDIA GRID (section 05) — prioritise activeSport, never invent
     ------------------------------------------------------------------------ */
  const SLOTS = [
    { cls: 'slot--a', fits: m => m.type === 'img' && m.orient !== 'land', sizes: '(max-width: 900px) 78vw, 32vw' },
    { cls: 'slot--b', fits: m => m.orient === 'port', sizes: '(max-width: 900px) 78vw, 24vw', preferVideo: true },
    { cls: 'slot--c', fits: m => m.orient !== 'port', sizes: '(max-width: 900px) 78vw, 40vw' },
    { cls: 'slot--d', fits: m => m.type === 'img', sizes: '(max-width: 900px) 78vw, 40vw' }
  ];
  function rankFor(s) {
    const own = POOL.filter(k => MEDIA[k].sports.includes(s));
    const neutral = POOL.filter(k => MEDIA[k].sports.length === 0);
    const other = POOL.filter(k => MEDIA[k].sports.length && !MEDIA[k].sports.includes(s));
    return (s === 'none' || s === 'more') ? POOL.slice() : [...own, ...neutral, ...other];
  }
  onSport(s => {
    const grid = $('[data-media-grid]');
    if (!grid) return;
    const used = new Set([PLACE.lead[s]]);
    const ranked = rankFor(s);
    const picks = SLOTS.map(slot => {
      let key = slot.preferVideo ? ranked.find(k => !used.has(k) && MEDIA[k].type === 'video' && slot.fits(MEDIA[k]) && (s === 'none' || s === 'more' || MEDIA[k].sports.includes(s))) : null;
      if (!key) key = ranked.find(k => !used.has(k) && slot.fits(MEDIA[k]));
      used.add(key);
      return key;
    });
    const prevKeys = $$('.slot', grid).map(b => b.dataset.key).join();
    if (prevKeys === picks.join()) return;

    grid.innerHTML = '';
    picks.forEach((key, i) => {
      const m = MEDIA[key];
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `slot ${SLOTS[i].cls}`;
      b.dataset.key = key;
      b.dataset.open = key;
      b.dataset.cursor = m.type === 'video' ? 'watch' : 'view';
      b.setAttribute('aria-label', `${m.type === 'video' ? 'Watch' : 'View'}: ${m.label}`);
      b.innerHTML = `<div class="mitem ${reduce ? '' : 'mswap'}" style="animation-delay:${i * 70}ms">${mediaHTML(m, SLOTS[i].sizes)}</div>
        <span class="slot__label mono">${sportNote(key, s)}</span>
        ${m.type === 'video' ? '<span class="slot__kind mono">Video</span>' : ''}`;
      grid.appendChild(b);
      const mi = $('.mswap', b); if (mi) mi.addEventListener('animationend', () => mi.classList.remove('mswap'), { once: true });
      $$('video[data-autoplay]', b).forEach(v => AutoVideo.observe(v));
    });

    const status = $('[data-media-status]');
    if (status) {
      const has = POOL.some(k => MEDIA[k].sports.includes(s));
      status.textContent = s === 'none' ? 'Showing multi-sport coaching. Choose a sport to prioritise its media.'
        : s === 'more' ? 'Showing multi-sport coaching sessions.'
        : has ? `Showing ${SPORTS[s].label.toLowerCase()} media first, then multi-sport sessions.`
        : `No ${SPORTS[s].label.toLowerCase()} media yet — showing multi-sport coaching sessions instead. (Placeholder: add ${SPORTS[s].label.toLowerCase()} footage.)`;
    }
  });

  /* lightbox */
  const Lightbox = (() => {
    const dlg = $('.lightbox');
    if (!dlg) return { open() {} };
    const body = $('.lightbox__body', dlg);
    const cap = $('.lightbox__cap', dlg);
    const close = () => { $$('video', body).forEach(v => v.pause()); dlg.close(); };
    $('.lightbox__close', dlg).addEventListener('click', close);
    dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
    dlg.addEventListener('close', () => { body.innerHTML = ''; });
    return {
      open(key) {
        const m = MEDIA[key];
        if (!m) return;
        if (m.type === 'video') {
          const v = `<video controls playsinline preload="metadata" poster="${VID}${m.src}-poster.webp" aria-label="${esc(m.alt)}"><source src="${VID}${m.src}.mp4" type="video/mp4"></video>`;
          body.innerHTML = m.rotate ? `<div class="rot-lb"><div class="rot">${v}</div></div>` : v;
        } else {
          body.innerHTML = `<picture><source type="image/avif" srcset="${IMG}${m.src}-1600.avif"><img src="${IMG}${m.src}-1600.webp" width="${m.w}" height="${m.h}" alt="${esc(m.alt)}"></picture>`;
        }
        cap.textContent = m.label;
        if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
        const v = $('video', body);
        if (v) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
      }
    };
  })();
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-open]');
    if (t) { Lightbox.open(t.dataset.open); return; }
    const lead = e.target.closest('.media__lead');
    if (lead && lead.dataset.key && !e.target.closest('button')) Lightbox.open(lead.dataset.key);
  });

  /* ------------------------------------------------------------------------
     02 — INTRO VIDEO (click to play with sound; nothing downloads before that)
     ------------------------------------------------------------------------ */
  (() => {
    const fig = $('[data-intro]');
    if (!fig) return;
    const video = $('.intro__video', fig), btn = $('.intro__play', fig), source = $('source', video);
    const cfg = CONTENT.intro || {};
    if (cfg.src && source.getAttribute('src') !== cfg.src) { source.setAttribute('src', cfg.src); video.load(); }
    if (cfg.poster) video.poster = cfg.poster;
    if (cfg.duration) {
      $('[data-intro-dur]', fig).textContent = `Intro · ${cfg.duration}`;
      btn.setAttribute('aria-label', `Play the Meet Coach Kal introduction video, ${cfg.duration}`);
    }
    const note = $('[data-intro-note]', fig);
    if (note && cfg.standIn === false) note.remove();

    const stop = () => {
      fig.classList.remove('is-playing');
      video.controls = false;
    };
    btn.addEventListener('click', () => {
      fig.classList.add('is-playing');
      video.controls = true;
      const p = video.play();
      if (p && p.catch) p.catch(() => stop());
      video.focus({ preventScroll: true });
    });
    video.addEventListener('ended', () => { stop(); video.currentTime = 0; btn.focus({ preventScroll: true }); });
    source.addEventListener('error', stop);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => { if (!en.isIntersecting && !video.paused) video.pause(); }, { threshold: .2 }).observe(fig);
    }
  })();

  /* ------------------------------------------------------------------------
     06 — INSTAGRAM (curated tiles; links go live once the handle/post URLs exist)
     ------------------------------------------------------------------------ */
  (() => {
    const grid = $('[data-ig-grid]');
    if (!grid) return;
    const ig = CONTENT.instagram || {};
    const handle = String(ig.handle || '').replace(/^@/, '').trim();
    const profile = handle ? `https://www.instagram.com/${encodeURIComponent(handle)}/` : '';
    if (profile) {
      [$('[data-ig-follow]'), $('[data-ig-link]')].filter(Boolean).forEach(a => {
        a.href = profile; a.target = '_blank'; a.rel = 'noopener';
        a.removeAttribute('aria-disabled'); a.removeAttribute('title');
      });
      const label = $('[data-ig-handle]');
      if (label) label.textContent = `Follow @${handle}`;
    }
    const REEL = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9l7-4.5z"/></svg>';
    const posts = (ig.posts || []).filter(p => MEDIA[p.media]).slice(0, 6);
    posts.forEach(p => {
      const m = MEDIA[p.media];
      const href = p.url || profile;
      const li = document.createElement('li');
      li.className = 'ig';
      const thumb = m.type === 'video' ? videoHTML(m, { posterOnly: true }) : pictureHTML(m, '(max-width: 900px) 46vw, 16vw');
      const badge = p.kind === 'reel' ? `<span class="ig__kind mono">${REEL}Reel</span>` : '';
      const inner = `<span class="ig__media">${thumb}</span>${badge}<span class="ig__cap mono">${esc(m.label)}</span>`;
      li.innerHTML = href
        ? `<a class="ig__tile" href="${esc(href)}" target="_blank" rel="noopener" aria-label="${esc(m.label)} — open on Instagram" data-cursor="view">${inner}</a>`
        : `<button class="ig__tile" type="button" data-open="${p.media}" aria-label="${m.type === 'video' ? 'Watch' : 'View'}: ${esc(m.label)}" data-cursor="${m.type === 'video' ? 'watch' : 'view'}">${inner}</button>`;
      grid.appendChild(li);
    });
    const note = $('[data-ig-note]');
    if (note && profile && posts.every(p => p.url)) note.remove();
  })();

  /* ------------------------------------------------------------------------
     08 — PACKAGES, PRIVATE LESSONS & CLINICS (rendered from content.js)
     ------------------------------------------------------------------------ */
  const Packages = (() => {
    const grid = $('[data-pkg-grid]');
    if (!grid) return { render() {}, options: () => ({ packages: [], clinics: [] }), today: '' };
    const packs = (CONTENT.packages || []).filter(p => p.enabled !== false);
    const formats = CONTENT.formats || [];
    const fmtById = Object.fromEntries(formats.map(f => [f.id, f]));
    const money = p => {
      if (p == null || p === '') return null;
      try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: CONTENT.currency || 'USD', maximumFractionDigits: 0 }).format(p); }
      catch (e) { return String(p); }
    };
    const isSport = s => s !== 'none' && s !== 'more';
    const offered = (item, s) => !isSport(s) || !(item.sports || []).length || item.sports.includes(s);
    const sportsLabel = (list, s) => {
      if (isSport(s)) return SPORTS[s].label;
      return (list || []).length ? list.map(k => (SPORTS[k] || {}).label || k).join(' · ') : 'Any sport';
    };
    const localISO = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const today = localISO(new Date());
    const sessionId = x => x.id || `${x.format}-${x.date}-${x.start}`;
    const upcoming = s => (CONTENT.sessions || [])
      .filter(x => x.date >= today && (!isSport(s) || !x.sport || x.sport === s))
      .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
    const fmtDate = d => {
      const dt = new Date(d + 'T00:00:00');
      return isNaN(dt) ? d : dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    function render(s) {
      const shown = packs.filter(p => offered(p, s));
      grid.innerHTML = shown.map((p, i) => {
        const price = money(p.price);
        return `<li class="pkg" style="--i:${i}">
          <p class="mono pkg__sport">${esc(sportsLabel(p.sports, s))}</p>
          <p class="pkg__count"><span>${Number(p.sessions) || 1}</span><small class="mono">${Number(p.sessions) === 1 ? 'session' : 'sessions'}</small></p>
          <h3 class="pkg__name">${esc(p.name)}</h3>
          ${p.summary ? `<p class="pkg__summary">${esc(p.summary)}</p>` : ''}
          <p class="pkg__price"><span class="mono">Price</span>${price ? `<strong>${esc(price)}</strong>` : '<strong class="ph">To be confirmed</strong>'}</p>
          <button class="btn btn--ink btn--block" type="button" data-inquire="package" data-pick="${esc(p.id)}" data-cursor="start">
            <span class="btn__text">Ask about this package</span>
            <span class="btn__chip" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"/></svg></span>
          </button>
        </li>`;
      }).join('') || `<li class="pkg pkg--empty"><p>No ${esc(SPORTS[s].label.toLowerCase())} packages listed yet. Ask Coach Kal about options below.</p></li>`;

      const status = $('[data-pkg-status]');
      if (status) {
        const pending = shown.some(p => money(p.price) == null) ? ' Prices to be confirmed.' : '';
        status.textContent = (isSport(s) ? `Showing packages for ${SPORTS[s].label.toLowerCase()}.` : 'Every package works for any sport Coach Kal teaches.') + pending;
      }

      const sessions = upcoming(s);
      const list = $('[data-formats]');
      if (list) list.innerHTML = formats.filter(f => offered(f, s)).map(f => {
        const next = sessions.find(x => x.format === f.id);
        const when = f.booking === 'request' ? 'By request · you pick the time'
          : next ? `Next: ${fmtDate(next.date)} · ${esc(next.start)}` : '<span class="ph">Dates to be announced</span>';
        const cta = f.booking === 'request' ? 'Request a time' : next ? 'Book a spot' : 'Ask about the next clinic';
        return `<li class="fmt">
          <p class="mono fmt__level">${esc(f.level || '')}</p>
          <h4 class="fmt__name">${esc(f.name)}</h4>
          <p class="fmt__summary">${esc(f.summary || '')}</p>
          <p class="mono fmt__when">${when}</p>
          <button class="btn btn--sm btn--ghost" type="button" data-inquire="${f.booking === 'request' ? 'private' : 'clinic'}" data-pick="${f.booking === 'request' ? '' : esc(next ? sessionId(next) : f.id)}" data-cursor="start">
            <span class="btn__text">${cta}</span>
            <span class="btn__chip" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"/></svg></span>
          </button>
        </li>`;
      }).join('');

      const sched = $('[data-schedule]');
      if (sched) {
        if (!sessions.length) {
          sched.innerHTML = '<p class="schedule__empty mono">Placeholder · clinic dates, times and open spots will be listed here once confirmed.</p>';
        } else {
          sched.innerHTML = `<table class="schedule__table"><caption class="sr-only">Upcoming clinic dates</caption>
            <thead><tr><th scope="col">Date</th><th scope="col">Time</th><th scope="col">Clinic</th><th scope="col">Sport</th><th scope="col">Spots</th><th scope="col"><span class="sr-only">Book</span></th></tr></thead>
            <tbody>${sessions.map(x => {
              const f = fmtById[x.format] || { name: x.format };
              const left = x.capacity != null ? Math.max(0, x.capacity - (x.booked || 0)) : null;
              const full = left === 0;
              return `<tr>
                <td data-th="Date">${esc(fmtDate(x.date))}</td>
                <td data-th="Time">${esc(x.start)}${x.end ? '–' + esc(x.end) : ''}</td>
                <td data-th="Clinic">${esc(f.name)}</td>
                <td data-th="Sport">${esc((SPORTS[x.sport] || {}).label || 'Any')}</td>
                <td data-th="Spots">${left == null ? '—' : full ? 'Full' : `${left} of ${x.capacity} left`}</td>
                <td>${full ? '' : `<button class="btn btn--sm btn--ink" type="button" data-inquire="clinic" data-pick="${esc(sessionId(x))}"><span class="btn__text">Book</span></button>`}</td>
              </tr>`;
            }).join('')}</tbody></table>`;
        }
      }
    }

    /* options for the contact form's package / clinic selects */
    const options = () => ({
      packages: packs.map(p => [p.id, p.name]),
      clinics: [
        ...formats.filter(f => f.booking === 'schedule').map(f => [f.id, f.name]),
        ...upcoming('none').map(x => [sessionId(x), `${(fmtById[x.format] || { name: x.format }).name} · ${fmtDate(x.date)} ${x.start}`])
      ]
    });
    return { render, options, today };
  })();
  onSport(s => Packages.render(s));

  /* ------------------------------------------------------------------------
     THE MODULAR COURT (hero) — one court, five states
     ------------------------------------------------------------------------ */
  const Court = (() => {
    const stage = $('.stage');
    if (!stage) return { render() {}, setMode() {} };
    const cam = $('.stage__cam', stage);
    const floor = $('.floor', stage);
    const surf = $('.floor__surface', floor);
    const linesWrap = $('.floor__lines', floor);
    const zonesWrap = $('.floor__zones', floor);
    const nodesWrap = $('.floor__nodes', floor);
    const trace = $('.floor__trace path', floor);
    const net = $('.plane--net', floor);
    const walls = { front: $('.plane--front', floor), back: $('.plane--back', floor), sa: $('.plane--side-a', floor), sb: $('.plane--side-b', floor) };
    const ballEl = $('.ball', floor);
    const ballBody = $('.ball__body', floor);
    const shadow = $('.ball-shadow', floor);

    const box = (el, [x, y, w, h], o) => {
      el.style.setProperty('--x', x); el.style.setProperty('--y', y);
      el.style.setProperty('--w', Math.max(0, w)); el.style.setProperty('--h', Math.max(0, h));
      if (o != null) el.style.opacity = o;
    };

    const lineEls = {};
    [...VSLOTS.map(n => [n, 1]), ...HSLOTS.map(n => [n, 0])].forEach(([n, v], i) => {
      const d = document.createElement('div');
      d.className = `ln ${v ? 'is-v' : 'is-h'}`;
      d.style.setProperty('--i', i);
      d.dataset.v = v;
      linesWrap.appendChild(d);
      lineEls[n] = d;
    });
    const zoneEls = [0, 1].map(() => zonesWrap.appendChild(Object.assign(document.createElement('div'), { className: 'zone' })));
    const nodeEls = Array.from({ length: 9 }, (_, i) => {
      const d = document.createElement('div'); d.className = 'node'; d.style.setProperty('--i', i); return nodesWrap.appendChild(d);
    });
    // coplanar layers: nudge apart to avoid z-fighting inside preserve-3d
    surf.style.transform = 'translateZ(.1px)';
    zonesWrap.style.transform = 'translateZ(.2px)';
    linesWrap.style.transform = 'translateZ(.4px)';
    $('.floor__trace', floor).style.transform = 'translateZ(.5px)';
    nodesWrap.style.transform = 'translateZ(.6px)';

    function render(s) {
      const c = COURTS[s];
      box(surf, c.surf);
      Object.entries(lineEls).forEach(([n, el]) => {
        const spec = c.lines[n];
        const vert = el.dataset.v === '1';
        if (!spec) {
          box(el, vert ? [500, 280, THICK.l, 0] : [500, 280, 0, THICK.l]);
          el.style.setProperty('--o', 0);
          return;
        }
        const t = THICK[spec.k];
        el.className = `ln ${vert ? 'is-v' : 'is-h'} ln--${spec.k}`;
        el.style.setProperty('--o', 1);
        if (vert) box(el, [spec.x - t / 2, spec.y1, t, spec.y2 - spec.y1]);
        else box(el, [spec.x1, spec.y - t / 2, spec.x2 - spec.x1, t]);
      });
      zoneEls.forEach((z, i) => {
        const zz = c.zones && c.zones[i];
        if (zz) { box(z, zz); z.style.removeProperty('opacity'); }
        else { box(z, [500, 280, 0, 0]); z.style.opacity = 0; }
      });
      nodeEls.forEach((n, i) => {
        const p = c.nodes && c.nodes[i];
        if (p) { box(n, [p[0], p[1], 12, 12]); n.style.setProperty('--o', 1); }
        else n.style.setProperty('--o', 0);
      });
      if (c.net.h > 0) box(net, [500, c.net.y1, c.net.h, c.net.y2 - c.net.y1], 1);
      else box(net, [500, 280, 0, 0], 0);
      const w = c.walls;
      if (w) {
        box(walls.front, [w.x1, w.y0, w.front, w.y1 - w.y0], 1);
        box(walls.back, [w.x0, w.y0, w.back, w.y1 - w.y0], 1);
        box(walls.sa, [w.x0, w.y0, w.x1 - w.x0, w.side], 1);
        box(walls.sb, [w.x0, w.y1, w.x1 - w.x0, w.side], 1);
      } else {
        box(walls.front, [720, 170, 0, 220], 0); box(walls.back, [280, 170, 0, 220], 0);
        box(walls.sa, [280, 170, 440, 0], 0); box(walls.sb, [280, 390, 440, 0], 0);
      }
      // ground trace of the shot path
      const segs = BALL[s];
      trace.setAttribute('d', 'M' + segs.map(g => `${g.a[0]} ${g.a[1]}`).join(' L') + ` L${segs[0].a[0]} ${segs[0].a[1]}`);
    }

    /* camera + ball loop */
    const cur = { rx: 57, rz: 24, s: 1, px: 0, py: 0 };
    const tgt = { flat: 0, px: 0, py: 0 };
    let u = 0.7, mode = 'none', segI = 0, segT = 0, last = 0, running = false, visible = true;
    const measure = () => { u = floor.offsetWidth / 1000; };
    measure();
    addEventListener('resize', measure);

    function evalSeg(g, t) {
      const e = EASE[g.e](t);
      const x = lerp(g.a[0], g.b[0], e), y = lerp(g.a[1], g.b[1], e);
      const base = lerp(g.a[2], g.b[2], t);
      const z = g.shuttle ? base + g.h * Math.sin(Math.PI * Math.pow(t, .78)) : base + g.h * 4 * t * (1 - t);
      return [x, y, z];
    }
    function place(x, y, z, ang) {
      const rx = cur.rx + cur.py, rz = cur.rz + cur.px;
      ballEl.style.transform = `translate3d(${x * u}px, ${y * u}px, ${Math.max(z, 0) * u + 1}px) rotateZ(${-rz}deg) rotateX(${-rx}deg)`;
      const k = clamp(1 - z / 320, .35, 1);
      shadow.style.transform = `translate3d(${x * u}px, ${y * u}px, .7px) scale(${k})`;
      shadow.style.opacity = clamp(.9 - z / 260, .15, .9);
      if (ang != null) ballBody.style.setProperty('--shuttle-a', ang + 'deg');
    }
    function shuttleAngle(g, t) {
      const [x0, y0, z0] = evalSeg(g, t), [x1, y1, z1] = evalSeg(g, Math.min(1, t + .02));
      const rz = (cur.rz + cur.px) * Math.PI / 180, rx = (cur.rx + cur.py) * Math.PI / 180;
      const dx = x1 - x0, dy = y1 - y0, dz = z1 - z0;
      const sx = dx * Math.cos(rz) - dy * Math.sin(rz);
      const sy = (dx * Math.sin(rz) + dy * Math.cos(rz)) * Math.cos(rx) - dz * Math.sin(rx);
      return Math.atan2(sy, sx) * 180 / Math.PI - 90;
    }

    function frame(now) {
      if (!running) return;
      const dt = Math.min(.05, (now - (last || now)) / 1000);
      last = now;
      // camera: cursor parallax + scroll flattening (hero → section 02 handoff)
      const f = tgt.flat;
      cur.rx = lerp(cur.rx, 57 - 47 * f, .1);
      cur.rz = lerp(cur.rz, 24 * (1 - f), .1);
      cur.s = lerp(cur.s, 1 + .2 * f, .1);
      cur.px = lerp(cur.px, tgt.px * (1 - f), .06);
      cur.py = lerp(cur.py, tgt.py * (1 - f), .06);
      cam.style.transform = `scale(${cur.s}) rotateX(${cur.rx + cur.py}deg) rotateZ(${cur.rz + cur.px}deg)`;

      const segs = BALL[mode];
      const g = segs[segI % segs.length];
      segT += dt / g.d;
      if (segT >= 1) { segT -= 1; segI = (segI + 1) % segs.length; }
      const gg = segs[segI];
      const [x, y, z] = evalSeg(gg, segT);
      place(x, y, z, gg.shuttle ? shuttleAngle(gg, segT) : null);
      requestAnimationFrame(frame);
    }
    function start() {
      if (running || reduce || !visible) return;
      running = true; last = 0; requestAnimationFrame(frame);
    }
    function stop() { running = false; }
    function staticPose() {
      cam.style.transform = `scale(1) rotateX(57deg) rotateZ(24deg)`;
      const g = BALL[mode][0];
      place(...evalSeg(g, .5), g.shuttle ? shuttleAngle(g, .5) : null);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => { visible = en.isIntersecting; stage.classList.toggle('is-off', !visible); visible ? start() : stop(); }).observe(stage);
    }
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    // court responds slightly to cursor position
    const hero = $('.hero');
    hero.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = stage.getBoundingClientRect();
      tgt.px = clamp((e.clientX - r.left) / r.width - .5, -.6, .6) * 7;
      tgt.py = clamp((e.clientY - r.top) / r.height - .5, -.6, .6) * -5;
    });
    hero.addEventListener('pointerleave', () => { tgt.px = 0; tgt.py = 0; });

    // click on court = next court; swipe on touch
    let sx = null, sy = null;
    stage.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; });
    stage.addEventListener('pointerup', e => {
      if (sx == null) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      sx = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
      else if (Math.abs(dx) < 6 && Math.abs(dy) < 6) step(1);
    });

    return {
      render,
      setMode(s) {
        mode = s; segI = 0; segT = 0;
        ballEl.style.opacity = 0;
        requestAnimationFrame(() => { ballEl.style.transition = 'opacity .35s'; ballEl.style.opacity = 1; });
        if (reduce || !running) staticPose();
      },
      setFlat(f) { tgt.flat = f; if (reduce) return; stage.style.opacity = String(1 - f * .55); },
      start, stop, stage,
      refresh() { if (reduce) { stop(); staticPose(); } else start(); }
    };
  })();
  onSport(s => { Court.render(s); Court.setMode(s); });

  /* ------------------------------------------------------------------------
     INTRO (≈2.5s, never blocks: content + CTAs usable immediately)
     ------------------------------------------------------------------------ */
  const Intro = (() => {
    let timers = [], previewing = false;
    const clear = () => { timers.forEach(clearTimeout); timers = []; };
    function cancel() {
      if (!previewing) return;
      previewing = false; clear();
      root.dataset.sport = state.sport || 'none';
      Court.render(state.sport || 'none'); Court.setMode(state.sport || 'none');
      root.classList.remove('is-intro');
      const st = Court.stage; if (st) st.classList.remove('is-predraw', 'is-pulse');
    }
    function run() {
      const st = Court.stage;
      if (reduce || !st) { $$('[data-choose].btn').forEach(b => b.classList.add('is-ready')); return; }
      previewing = true;
      root.classList.add('is-intro');
      st.classList.add('is-predraw');
      const at = (ms, fn) => timers.push(setTimeout(fn, ms));
      // 1. neutral court grid draws in
      at(60, () => { st.classList.remove('is-predraw'); st.classList.add('is-drawing'); });
      // 2–3. headline lines
      if (window.gsap) {
        gsap.from('.hero__display .line__in', { yPercent: 105, duration: .9, stagger: .16, ease: 'expo.out', delay: .15 });
        gsap.from(['.hero__h1', '.hero__lede', '.hero__ctas', '.hero__facts'], { y: 16, opacity: 0, duration: .7, stagger: .07, ease: 'power3.out', delay: .45 });
      }
      // 4. sport names animate into position
      at(650, () => root.classList.remove('is-intro'));
      // 5. court lines pulse once
      at(1000, () => { st.classList.add('is-pulse'); });
      at(1750, () => st.classList.remove('is-pulse', 'is-drawing'));
      // 6. a neutral object briefly previews sport switching
      const preview = ['pickleball', 'tennis', 'badminton', 'racquetball'];
      preview.forEach((s, i) => at(1150 + i * 360, () => {
        if (!previewing) return;
        root.dataset.sport = s; Court.render(s);
      }));
      at(1150 + preview.length * 360, () => {
        if (!previewing) return;
        previewing = false;
        root.dataset.sport = state.sport || 'none';
        Court.render(state.sport || 'none');
      });
      // 7. CTA becomes active
      at(2700, () => $$('[data-choose].btn').forEach(b => b.classList.add('is-ready')));
      ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(ev => addEventListener(ev, cancel, { once: true, passive: true }));
    }
    return { run, cancel };
  })();

  /* ------------------------------------------------------------------------
     02 — gear rail: active sport dominant; cycles when nothing is chosen
     ------------------------------------------------------------------------ */
  const GearRail = (() => {
    const items = $$('.gear-rail li');
    let t = null, i = 0, inView = false;
    const show = s => items.forEach(li => li.classList.toggle('is-on', li.dataset.gear === s));
    const cycle = () => {
      clearInterval(t); t = null;
      if (state.sport !== 'none' || reduce || !inView) return;
      show(ORDER[i % 4]);
      t = setInterval(() => { i++; show(ORDER[i % 4]); }, 1400);
    };
    if ('IntersectionObserver' in window && items.length) {
      new IntersectionObserver(([en]) => { inView = en.isIntersecting; cycle(); }).observe($('.coach'));
    }
    return { update(s) { if (s === 'none') { show(null); cycle(); } else { clearInterval(t); t = null; show(s === 'more' ? null : s); } } };
  })();
  onSport(s => GearRail.update(s));

  /* ------------------------------------------------------------------------
     03 — explorer side-view motion (SMIL follows the sport path)
     ------------------------------------------------------------------------ */
  onSport(s => {
    const am = $('.sideview animateMotion');
    const mp = am && $('mpath', am);
    if (!mp) return;
    mp.setAttribute('href', `#svp-${s}`);
    am.setAttribute('dur', SIDEVIEW_DUR[s] + 's');
    try { am.beginElement(); } catch (e) { /* ignore */ }
    const svg = $('.sideview svg');
    if (reduce && svg.pauseAnimations) { svg.pauseAnimations(); svg.setCurrentTime(1.1); }
  });
  // swipe the explorer viewport on touch
  (() => {
    const vp = $('.viewport__media');
    if (!vp) return;
    let sx = null, sy = null;
    vp.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { sx = e.clientX; sy = e.clientY; } });
    vp.addEventListener('pointerup', e => {
      if (sx == null) return;
      const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    });
  })();

  /* ------------------------------------------------------------------------
     04 — COACHING JOURNEY: one continuous trajectory shaped by the sport
     ------------------------------------------------------------------------ */
  const Journey = (() => {
    const sec = $('.journey');
    if (!sec) return { build() {}, progress() {}, resetSlot() {} };
    const pin = $('.journey__pin', sec);
    const track = $('.track', sec);
    const hSvg = $('.track__svg:not(.track__svg--v)', sec);
    const vSvg = $('.track__svg--v', sec);
    const hPath = $('.track__path', hSvg), hGhost = $('.track__ghost', hSvg), hGlow = $('.track__glow', hSvg);
    const vPath = $('.track__path', vSvg), vGhost = $('.track__ghost', vSvg);
    const ball = $('.track__ball', sec);
    const trailWrap = $('.track__trail', sec);
    const items = $$('.stage-item', sec);
    const slot = $('.track__slot', sec);
    const frame = $('.journey__frame', sec);
    const top = $('.journey__top', sec);
    const marquee = $('.journey__marquee', sec);
    const spot = $('.journey__spot', sec);
    const hudCur = $('.hud__cur', sec), hudName = $('.hud__name', sec), hudBar = $('.hud__bar', sec), hudGear = $('.hud__gear use', sec);
    const NODES = [110, 370, 630, 890];
    const BASE = 215;
    const STAGE_NAMES = ['Start the rally', 'Choose your sport', 'Explore coaching', 'Connect with Coach Kal', 'Start training'];
    const TRAIL = 9;
    const trail = Array.from({ length: TRAIL }, (_, k) => {
      const d = document.createElement('span');
      d.className = 'trail-dot';
      d.style.opacity = 0;
      d.dataset.k = k;
      return trailWrap.appendChild(d);
    });
    let len = 1, nodeFrac = [.1, .35, .6, .85], slotBox = null, lastP = -1, lastActive = -1;

    /* ---- headline slot machine: "YOUR [SPORT]." spins and lands on activeSport ---- */
    const REEL_WORDS = { none: 'Sport', pickleball: 'Pickleball', tennis: 'Tennis', badminton: 'Badminton', racquetball: 'Racquetball', more: 'Game' };
    const REEL_ORDER = ['none', ...ORDER];
    const reel = $('.jh__reel', sec), slotEl = $('.jh__slot', sec);
    const CYCLES = 3;
    reel.innerHTML = Array.from({ length: CYCLES }, () => REEL_ORDER.map(k => `<span>${REEL_WORDS[k]}</span>`).join('')).join('');
    const reelItems = $$('span', reel);
    let reelIdx = 0;
    function spin(s, animate) {
      const idx = REEL_ORDER.indexOf(s);
      const target = animate ? (CYCLES - 1) * REEL_ORDER.length + idx : idx;
      if (animate && !reduce) {
        // jump (no transition) to the same word in the first cycle, then spin forward
        reel.classList.remove('is-spinning');
        reel.style.setProperty('--reel-y', `${-(reelIdx % REEL_ORDER.length) * .9}em`);
        void reel.offsetWidth;
        reel.classList.add('is-spinning');
      }
      reel.style.setProperty('--reel-y', `${-target * .9}em`);
      reelIdx = target;
      const w = reelItems[target].scrollWidth;
      if (w) slotEl.style.setProperty('--slot-w', w + 'px');
    }
    let seen = false;

    /* hop between two abstract points (s = along, o = height above baseline) */
    function hop(s0, o0, s1, o1, sport, emit) {
      const w = s1 - s0, mid = (s0 + s1) / 2, ob = (o0 + o1) / 2;
      switch (sport) {
        case 'pickleball': {
          const n = 3;
          for (let k = 1; k <= n; k++) {
            const a = s0 + w * (k - 1) / n, b = s0 + w * k / n;
            const oa = lerp(o0, o1, (k - 1) / n), obb = lerp(o0, o1, k / n);
            emit('Q', [(a + b) / 2, (oa + obb) / 2 + 110], [b, obb]);
          }
          break;
        }
        case 'tennis': emit('Q', [mid, ob + 320], [s1, o1]); break;
        case 'badminton': emit('C', [s0 + w * .08, ob + 280], [s0 + w * .92, ob + 280], [s1, o1]); break;
        case 'racquetball':
          emit('L', [s0 + w * .34, 195]); emit('L', [s0 + w * .67, 0]); emit('L', [s1, o1]); break;
        case 'more':
          emit('L', [mid - 12, o0]); emit('L', [mid - 12, ob + 60]); emit('L', [s1 - 24, ob + 60]); emit('L', [s1 - 24, o1]); emit('L', [s1, o1]); break;
        default: emit('Q', [mid, ob + 170], [s1, o1]);
      }
    }
    function pathFor(sport, pts, map) {
      let d = '';
      const emit = (cmd, ...ps) => { d += ` ${cmd} ` + ps.map(p => map(p).join(' ')).join(' '); };
      d = 'M ' + map(pts[0]).join(' ');
      for (let i = 1; i < pts.length; i++) hop(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], sport, emit);
      return d;
    }

    function build() {
      const s = state.sport || 'none';
      if (hudGear) hudGear.setAttribute('href', `#gear-${s}`);
      spin(s, seen && state.booted);
      const mobile = mqMobile.matches;
      if (!mobile) {
        const tr = track.getBoundingClientRect();
        const sr = slot.getBoundingClientRect();
        const toSvg = (x, y) => [(x - tr.left) / tr.width * 1200, (y - tr.top) / tr.height * 380];
        const [ex, ey] = toSvg(sr.left, sr.top + sr.height * .55);
        const pts = [[0, 0], ...NODES.map(x => [x, 0]), [ex, BASE - ey]];
        const d = pathFor(s, pts, ([a, o]) => [+a.toFixed(1), +(BASE - o).toFixed(1)]);
        hPath.setAttribute('d', d); hGhost.setAttribute('d', d); hGlow.setAttribute('d', d);
        len = hPath.getTotalLength();
        nodeFrac = NODES.map(nx => {
          let lo = 0, hi = len;
          for (let k = 0; k < 22; k++) { const m = (lo + hi) / 2; (hPath.getPointAtLength(m).x < nx ? (lo = m) : (hi = m)); }
          return lo / len;
        });
        items.forEach((it, i) => { it.style.setProperty('--sx', `calc(${NODES[i] / 12}% - 12px)`); it.style.setProperty('--sy', `${BASE / 3.8}%`); });
        slotBox = null;
      } else {
        const tr = track.getBoundingClientRect();
        const ys = items.map(it => { const n = $('.stage-item__node', it).getBoundingClientRect(); return (n.top + n.height / 2 - tr.top) / tr.height * 1000; });
        const pts = [[0, 0], ...ys.map(y => [y, 0]), [1000, 0]];
        const d = pathFor(s, pts, ([a, o]) => [+(70 + o * .12).toFixed(1), +a.toFixed(1)]);
        vPath.setAttribute('d', d); vGhost.setAttribute('d', d);
        vPath.style.strokeDasharray = 'none';
      }
      lastP = -1;
      progress(currentP, true);
    }

    function setHud(active, p1) {
      if (hudBar) hudBar.style.setProperty('--prog', p1.toFixed(3));
      if (active === lastActive) return;
      if (active > lastActive && active >= 0) {
        const node = $('.stage-item__node', items[active]);
        node.classList.remove('is-hit'); void node.offsetWidth; node.classList.add('is-hit');
      }
      lastActive = active;
      hudCur.textContent = String(active + 1).padStart(2, '0');
      hudName.textContent = STAGE_NAMES[active + 1];
      if (!reduce) { hudCur.classList.remove('is-tick'); void hudCur.offsetWidth; hudCur.classList.add('is-tick'); }
    }

    let currentP = 0;
    function progress(p, force) {
      currentP = p;
      if (!force && Math.abs(p - lastP) < .0005) return;
      lastP = p;
      const pinned = root.classList.contains('has-pin');
      if (mqMobile.matches) return;
      const p1 = pinned ? clamp(p / .66) : 1;
      // draw the path (+ glow) and move the comet
      [hPath, hGlow].forEach(el => { el.style.strokeDasharray = `${len} ${len}`; el.style.strokeDashoffset = String(len * (1 - p1)); });
      const tw = track.clientWidth, th = track.clientHeight;
      const toPx = pt => [pt.x / 1200 * tw, pt.y / 380 * th];
      const [bx, by] = toPx(hPath.getPointAtLength(len * p1));
      ball.style.transform = `translate(${bx}px, ${by}px)`;
      trail.forEach((d, k) => {
        const l = len * p1 - (k + 1) * 16;
        if (l <= 0 || p1 <= 0) { d.style.opacity = 0; return; }
        const [tx, ty] = toPx(hPath.getPointAtLength(l));
        const f = 1 - (k + 1) / (TRAIL + 1);
        d.style.transform = `translate(${tx}px, ${ty}px) scale(${.35 + f * .65})`;
        d.style.opacity = (f * .55).toFixed(3);
      });
      // spotlight follows the ball
      spot.style.setProperty('--bx', `${track.offsetLeft + bx}px`);
      spot.style.setProperty('--by', `${track.offsetTop + by}px`);
      // stage states
      let active = -1;
      nodeFrac.forEach((f, i) => { if (p1 >= f - .015) active = i; });
      items.forEach((it, i) => {
        it.classList.toggle('is-active', i === active);
        it.classList.toggle('is-past', i < active);
        it.classList.toggle('is-next', i === active + 1);
      });
      setHud(active, p1);
      // 04 → 05: trajectory meets the frame; the frame grows to full-bleed
      const box = frame.firstElementChild;
      if (!pinned || !box) { frame.style.opacity = 0; return; }
      const p2 = clamp((p - .72) / .24);
      if (!slotBox) {
        const pr = pin.getBoundingClientRect(), sr = slot.getBoundingClientRect();
        slotBox = { x: sr.left - pr.left, y: sr.top - pr.top, w: sr.width, h: sr.height, W: pr.width, H: pr.height };
      }
      const e = EASE.io(p2);
      frame.style.opacity = p1 >= .985 ? 1 : 0;
      box.style.left = `${lerp(slotBox.x, 0, e)}px`;
      box.style.top = `${lerp(slotBox.y, 0, e)}px`;
      box.style.width = `${lerp(slotBox.w, slotBox.W, e)}px`;
      box.style.height = `${lerp(slotBox.h, slotBox.H, e)}px`;
      box.style.borderRadius = `${lerp(4, 0, e)}px`;
      const fade = String(1 - clamp(p2 * 1.6));
      top.style.opacity = fade; track.style.opacity = fade; marquee.style.opacity = fade;
      sec.classList.toggle('is-handed', p >= .999);
    }

    if ('IntersectionObserver' in window) {
      // mobile / no-pin: stages activate as they scroll into view
      const io = new IntersectionObserver(entries => {
        if (root.classList.contains('has-pin') && !mqMobile.matches) return;
        entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('is-active'); });
        const n = items.filter(it => it.classList.contains('is-active')).length;
        setHud(n - 1, n / items.length);
      }, { rootMargin: '0px 0px -30% 0px' });
      items.forEach(it => io.observe(it));
      // pause loops off-screen; spin the headline the first time it's seen
      new IntersectionObserver(([en]) => {
        sec.classList.toggle('is-off', !en.isIntersecting);
        if (en.isIntersecting && !seen) { seen = true; spin(state.sport || 'none', true); }
      }).observe(sec);
    }

    return {
      build, progress, sec,
      resetSlot() { slotBox = null; },
      reset() { [top, track, marquee].forEach(el => { el.style.opacity = ''; }); const b = frame.firstElementChild; if (b) b.removeAttribute('style'); }
    };
  })();
  onSport((s, first) => { if (!first) Journey.build(); });

  /* ------------------------------------------------------------------------
     06 — principles + convergence
     ------------------------------------------------------------------------ */
  const Principles = (() => {
    const list = $('[data-principles]');
    const head = $('.ah');
    if (!list) return { update() {} };
    const panels = $$('.principle', list);
    const morphs = $$('.viz-morph__g', list);
    const counter = $('[data-count]', list);
    let openI = 0, lastUser = 0, auto = null, morphT = null, mi = 0, inView = false, counted = false;

    // body width = the open panel's width, so text never reflows while panels resize
    const measure = () => {
      const gap = parseFloat(getComputedStyle(list).columnGap) || 12;
      list.style.setProperty('--open-w', `${(list.clientWidth - gap * 2) * 3.4 / 5.4}px`);
    };
    measure();
    addEventListener('resize', measure);

    function open(i, user) {
      if (user) lastUser = Date.now();
      if (i === openI && panels[i].classList.contains('is-open')) {
        if (user && mqMobile.matches) { panels[i].classList.remove('is-open'); $('.principle__tab', panels[i]).setAttribute('aria-expanded', 'false'); openI = -1; }
        return;
      }
      openI = i;
      panels.forEach((p, k) => {
        p.classList.toggle('is-open', k === i);
        $('.principle__tab', p).setAttribute('aria-expanded', String(k === i));
      });
      if (panels[i].dataset.principle === 'multi') countUp();
      if (panels[i].dataset.principle === 'clear') {
        // restart the noise → clarity loop from the top
        const svg = $('.viz-clear', panels[i]);
        $$('.vc-noise, .vc-clean, .vc-steps circle, .vc-steps text, .vc-ball', svg).forEach(el => { el.style.animation = 'none'; void el.getBoundingClientRect(); el.style.animation = ''; });
        if (svg.setCurrentTime) svg.setCurrentTime(0);
      }
    }
    panels.forEach((p, i) => {
      $('.principle__tab', p).addEventListener('click', () => open(i, true));
      p.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && !mqMobile.matches) open(i, true); });
    });

    function countUp() {
      if (counted || !counter) return;
      counted = true;
      if (reduce) return;
      const t0 = performance.now();
      const tick = now => {
        const k = clamp((now - t0) / 1100);
        counter.textContent = String(Math.round(EASE.out(k) * 10));
        if (k < 1) requestAnimationFrame(tick);
      };
      counter.textContent = '0';
      requestAnimationFrame(tick);
    }

    // autoplay through the principles while in view (desktop), pausing after user input
    function startAuto() {
      clearInterval(auto);
      if (reduce || mqMobile.matches || !inView) return;
      auto = setInterval(() => {
        if (Date.now() - lastUser < 9000) return;
        open((openI + 1) % panels.length);
      }, 5200);
    }

    // centre racquet morphs between sports; the chosen sport lingers
    function showMorph(s) {
      morphs.forEach(g => g.classList.toggle('is-on', g.dataset.morph === s));
      $$('.vm-sat', list).forEach(u => u.classList.toggle('is-on', u.dataset.morph === s));
    }
    function runMorph() {
      clearTimeout(morphT);
      if (reduce || !inView) { showMorph(ORDER.slice(0, 4).includes(state.sport) ? state.sport : 'pickleball'); return; }
      const s = ORDER[mi % 4]; mi++;
      showMorph(s);
      morphT = setTimeout(runMorph, s === state.sport ? 2600 : 1100);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => {
        inView = en.isIntersecting;
        list.classList.toggle('is-off', !inView);
        startAuto(); runMorph();
      }, { threshold: .25 }).observe(list);
      if (head) new IntersectionObserver(([en]) => head.classList.toggle('is-off', !en.isIntersecting)).observe(head);
    } else { inView = true; runMorph(); }
    mqMobile.addEventListener('change', () => { measure(); startAuto(); });
    if (reduce) { const svg = $('.viz-clear', list); if (svg && svg.pauseAnimations) svg.pauseAnimations(); }

    return {
      update(s) {
        const chosen = s !== 'none';
        $$('.vb-b, .vb-ends circle, .vb-ends text', list).forEach(el => el.classList.toggle('is-on', el.dataset.branch === s));
        // no sport yet: pulses run down every branch; otherwise only down yours
        $$('.vb-p', list).forEach(el => el.classList.toggle('is-on', chosen ? el.dataset.branch === s : true));
        $$('[data-conv]').forEach(el => el.classList.toggle('is-on', el.dataset.conv === s));
        if (reduce) showMorph(ORDER.slice(0, 4).includes(s) ? s : 'pickleball');
      }
    };
  })();
  onSport(s => Principles.update(s));

  /* ------------------------------------------------------------------------
     07 — form (preselects activeSport; no booking system)
     ------------------------------------------------------------------------ */
  const Form = (() => {
    const form = $('#contact-form');
    if (!form) return { sync() {}, prefill() {} };
    const sel = $('#f-sport', form);
    const status = $('.form__status', form);
    sel.addEventListener('change', () => setSport(sel.value || 'none'));

    /* inquiry type: show only the fields that matter; hidden fields are disabled so they don't submit */
    const type = $('#f-type', form), pkgSel = $('#f-package', form), clinicSel = $('#f-clinic', form);
    const TYPE_LABEL = { general: 'message', private: 'private lesson request', package: 'package inquiry', clinic: 'clinic inquiry' };
    const fillSelect = (el, pairs) => {
      if (!el || !pairs.length) return;
      const keep = el.value;
      el.innerHTML = '<option value="">Not sure yet</option>' + pairs.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join('');
      el.value = keep;
    };
    const opts = Packages.options();
    fillSelect(pkgSel, opts.packages);
    fillSelect(clinicSel, opts.clinics);
    const date = $('#f-date', form);
    if (date && Packages.today) date.min = Packages.today;
    const toggle = () => {
      $$('[data-show-for]', form).forEach(f => {
        const on = f.dataset.showFor.split(' ').includes(type.value);
        f.hidden = !on;
        $$('input, select, textarea', f).forEach(c => { c.disabled = !on; });
      });
    };
    if (type) { type.addEventListener('change', toggle); toggle(); }
    function prefill(kind, pick) {
      if (!type) return;
      type.value = TYPE_LABEL[kind] ? kind : 'general';
      toggle();
      const target = kind === 'package' ? pkgSel : kind === 'clinic' ? clinicSel : null;
      if (target && pick) {
        target.value = pick;
        if (target.value !== pick) target.value = '';
      }
    }
    const setErr = (input, msg) => {
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      const field = input.closest('.field');
      let err = $('.field__err', field);
      if (msg) {
        if (!err) { err = document.createElement('span'); err.className = 'field__err'; err.id = input.id + '-err'; field.appendChild(err); }
        err.textContent = msg;
        const desc = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
        if (!desc.includes(err.id)) input.setAttribute('aria-describedby', [...desc, err.id].join(' '));
      } else if (err) {
        err.remove();
        input.setAttribute('aria-describedby', (input.getAttribute('aria-describedby') || '').split(' ').filter(x => x && x !== input.id + '-err').join(' '));
      }
    };
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = $('#f-name', form), contact = $('#f-contact', form);
      const v = contact.value.trim();
      const okContact = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || v.replace(/\D/g, '').length >= 7;
      setErr(name, name.value.trim() ? '' : 'Please add your name.');
      setErr(contact, okContact ? '' : 'Please add an email address or phone number.');
      setErr(sel, sel.value ? '' : 'Please choose a sport.');
      const bad = $('[aria-invalid="true"]', form);
      if (bad) { bad.focus(); status.textContent = ''; return; }
      const sport = SPORTS[sel.value].label.toLowerCase();
      const what = `${sport} ${TYPE_LABEL[type ? type.value : 'general'] || 'message'}`;
      const who = esc(name.value.trim());
      // local preview: Netlify Forms only exists on the deployed site
      if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === 'file:') {
        status.innerHTML = `<strong>Thanks, ${who}.</strong> Your ${esc(what)} is ready. <em>Local preview — messages are delivered once the site is live on Netlify.</em>`;
        return;
      }
      const btn = $('button[type="submit"]', form);
      btn.disabled = true;
      status.textContent = 'Sending…';
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(r => {
        if (!r.ok) throw new Error(r.status);
        status.innerHTML = `<strong>Thanks, ${who}.</strong> Your ${esc(what)} has been sent to Coach Kal.`;
        form.reset();
        toggle();
        sel.value = state.sport === 'none' ? '' : state.sport;
      }).catch(() => {
        status.innerHTML = '<strong>Sorry — that didn’t send.</strong> Please try again in a moment.';
      }).finally(() => { btn.disabled = false; });
    });
    return { sync(s) { sel.value = s === 'none' ? '' : s; }, prefill };
  })();
  onSport(s => Form.sync(s));

  /* ------------------------------------------------------------------------
     SCROLL ENGINE — sticky sections + progress-driven transitions
     (CSS sticky instead of JS pinning: robust with or without Lenis/GSAP)
     ------------------------------------------------------------------------ */
  const Scroll = (() => {
    const nav = $('#nav');
    const hero = $('.hero');
    const handoff = $('.hero__handoff span');
    const coach = $('.coach');
    const viewport = $('.viewport');
    const exit = $('.explorer__exit');
    const adapt = $('.adapt');
    const adaptMedia = $('.adapt__media');
    const adaptImg = $('.adapt__media img');
    const conv = $('.converge svg');
    const cLine = $('.contact__line');
    const darks = $$('[data-theme="dark"]');
    const links = $$('.nav__links a');
    const sections = links.map(a => $(a.getAttribute('href')));
    let ticking = false, masked = false;

    function modes() {
      const desktopMotion = !mqMobile.matches && !reduce;
      root.classList.toggle('has-pin', desktopMotion);
      root.classList.toggle('has-scrub', desktopMotion);
      if (desktopMotion) {
        Journey.sec.style.height = '330vh';
        $('.journey__pin').style.cssText = 'position:sticky;top:0;height:100vh;min-height:0';
        $('.media__lead').style.height = '100vh';
      } else {
        Journey.sec.style.height = '';
        $('.journey__pin').style.cssText = '';
        $('.media__lead').style.height = '';
        Journey.reset();
        Journey.sec.classList.remove('is-handed');
        $('.journey__frame').style.opacity = '';
        if (adaptMedia) { adaptMedia.style.clipPath = ''; adaptImg.style.transform = ''; }
      }
      masked = desktopMotion;
      root.classList.toggle('has-mask', masked);
      Journey.resetSlot();
    }

    function update() {
      ticking = false;
      const vh = innerHeight;
      // nav: background + light/dark follows the section beneath it
      const y = scrollY;
      nav.classList.toggle('is-scrolled', y > 12);
      const probe = 34;
      nav.classList.toggle('on-dark', darks.some(d => { const r = d.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe; }));
      let cur = -1;
      sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < vh * .4) cur = i; });
      links.forEach((a, i) => a.classList.toggle('is-current', i === cur));

      if (reduce) return;
      // 01 → 02: court flattens; key line stretches into the next section
      const hr = hero.getBoundingClientRect();
      const flat = clamp(-hr.top / (hr.height * .85));
      Court.setFlat(flat);
      if (handoff) handoff.style.setProperty('--handoff', flat.toFixed(3));
      const cr = coach.getBoundingClientRect();
      coach.style.setProperty('--anchor-draw', clamp((vh - cr.top) / (vh * .75)).toFixed(3));
      // 02 → 03: racquet silhouette expands into the explorer viewport
      if (masked && viewport) {
        const vr = viewport.getBoundingClientRect();
        const m = clamp((vh - vr.top) / (vh * .75));
        viewport.style.setProperty('--mask-s', (0.5 + EASE.io(m) * 4.2).toFixed(3));
        if (m >= 1 && root.classList.contains('has-mask')) root.classList.remove('has-mask');
        if (m < 1 && !root.classList.contains('has-mask')) root.classList.add('has-mask');
      }
      // 03 → 04: trajectory extends out of the explorer
      if (exit) {
        const er = exit.getBoundingClientRect();
        exit.style.clipPath = `inset(0 0 ${(1 - clamp((vh * .95 - er.top) / (er.height + vh * .2))) * 100}% 0)`;
      }
      // 04: pinned journey progress
      if (root.classList.contains('has-pin')) {
        const jr = Journey.sec.getBoundingClientRect();
        Journey.progress(clamp(-jr.top / (jr.height - vh)));
      }
      // 05 → 06: one frame full-width, then reduced to a strip
      if (root.classList.contains('has-scrub') && adapt) {
        const ar = adapt.getBoundingClientRect();
        const p = clamp(-ar.top / (vh * .78));
        adaptMedia.style.clipPath = `inset(0 0 ${(p * 78).toFixed(2)}vh 0)`;
        adaptImg.style.transform = `translateY(${(-p * 34).toFixed(2)}vh)`;
      }
      // 06 → 07: many sport lines converge into one
      if (conv) {
        const r = conv.getBoundingClientRect();
        const p = clamp((vh * .92 - r.top) / (r.height + vh * .25));
        conv.style.clipPath = `inset(0 0 ${((1 - p) * 100).toFixed(2)}% 0)`;
      }
      if (cLine) {
        const r = cLine.getBoundingClientRect();
        cLine.style.transform = `scaleY(${clamp((vh - r.top) / (vh * .4)).toFixed(3)})`;
      }
    }
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', () => { modes(); Journey.build(); request(); });
    return { update: request, modes };
  })();

  /* ------------------------------------------------------------------------
     NAV / MENU / IN-PAGE SCROLLING
     ------------------------------------------------------------------------ */
  let lenis = null;
  function scrollToEl(el, cb) {
    if (!el) return;
    const offset = el.id === 'court' ? -(parseInt(getComputedStyle(root).getPropertyValue('--nav-h')) || 68) - 8 : 0;
    if (lenis) lenis.scrollTo(el, { offset, duration: 1.2, onComplete: cb });
    else {
      const top = el.getBoundingClientRect().top + scrollY + offset;
      scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
      if (cb) setTimeout(cb, reduce ? 0 : 700);
    }
  }
  const Menu = (() => {
    const btn = $('.nav__burger'), menu = $('#mobile-menu');
    if (!btn || !menu) return { close() {} };
    const close = () => { btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Open menu'); menu.hidden = true; document.body.style.overflow = ''; };
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.hidden = !open;
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) $('a', menu).focus();
    });
    menu.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { close(); btn.focus(); } });
    return { close };
  })();

  document.addEventListener('click', e => {
    // placeholder links (e.g. social handle not confirmed yet) do nothing
    if (e.target.closest('a[aria-disabled="true"]')) { e.preventDefault(); return; }

    const setter = e.target.closest('[data-set-sport]');
    if (setter) setSport(setter.dataset.setSport);

    const inquire = e.target.closest('[data-inquire]');
    if (inquire) {
      Form.prefill(inquire.dataset.inquire, inquire.dataset.pick);
      scrollToEl($('#contact-form'), () => $('#f-name').focus({ preventScroll: true }));
      return;
    }

    const chooser = e.target.closest('[data-choose]');
    if (chooser) {
      e.preventDefault();
      scrollToEl($('#court'), () => {
        const b = $('.selector [aria-checked="true"]') || $('.selector [role="radio"]');
        if (b) b.focus({ preventScroll: true });
      });
      return;
    }
    const focusForm = e.target.closest('[data-focus-form]');
    if (focusForm) {
      e.preventDefault();
      scrollToEl($('#contact-form'), () => $('#f-name').focus({ preventScroll: true }));
      return;
    }
    const sc = e.target.closest('[data-scroll]');
    if (sc) { scrollToEl($(sc.dataset.scroll)); return; }
    const a = e.target.closest('a[href^="#"]');
    if (a && a.getAttribute('href').length > 1) {
      const target = $(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        scrollToEl(target, () => { if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); });
      }
    }
  });

  /* ------------------------------------------------------------------------
     CUSTOM CURSOR + MAGNETIC BUTTONS (fine pointer only)
     ------------------------------------------------------------------------ */
  function initPointerFX() {
    if (!mqFine.matches) return;
    const cur = $('.cursor');
    const label = $('.cursor__label', cur);
    const LABELS = { choose: 'Choose', watch: 'Watch', view: 'View', start: 'Start' };
    root.classList.add('has-cursor');
    let x = -100, y = -100, cx = -100, cy = -100, raf = null;
    const loop = () => {
      cx = reduce ? x : lerp(cx, x, .28); cy = reduce ? y : lerp(cy, y, .28);
      cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = (Math.abs(cx - x) > .1 || Math.abs(cy - y) > .1) ? requestAnimationFrame(loop) : null;
    };
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
      const t = e.target.closest ? e.target.closest('[data-cursor]') : null;
      const k = t && LABELS[t.dataset.cursor];
      cur.classList.toggle('is-label', !!k);
      if (k) label.textContent = k;
      cur.classList.toggle('on-dark', !!(e.target.closest && e.target.closest('[data-theme="dark"], .mobile-menu')));
      cur.classList.remove('is-hidden');
    }, { passive: true });
    document.addEventListener('pointerleave', () => cur.classList.add('is-hidden'));

    if (reduce) return;
    $$('.magnetic').forEach(el => {
      const text = $('.btn__text', el), arrow = $('.btn__chip svg', el);
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`;
        if (text) text.style.transform = `translate(${dx * 4}px, ${dy * 3}px)`;
        if (arrow) arrow.style.transform = `translate(${dx * 6}px, ${dy * 6}px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transition = 'transform .5s cubic-bezier(.2,.7,.1,1), color .35s, background-color .7s';
        el.style.transform = ''; if (text) text.style.transform = ''; if (arrow) arrow.style.transform = '';
        setTimeout(() => { el.style.transition = ''; }, 500);
      });
    });
  }

  /* ------------------------------------------------------------------------
     BOOT
     ------------------------------------------------------------------------ */
  function boot() {
    if (state.booted) return;
    state.booted = true;
    buildGroups();
    const y = $('[data-year]'); if (y) y.textContent = new Date().getFullYear();

    Scroll.modes();
    const saved = store.get();
    setSport(SPORTS[saved] ? saved : 'none');
    Journey.build();
    Court.refresh();

    if (window.Lenis && !reduce && mqFine.matches) {
      lenis = new Lenis({ lerp: .11, smoothWheel: true });
      root.classList.add('lenis');
      lenis.on('scroll', Scroll.update);
      if (window.gsap) { gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
      else { const r = t => { lenis.raf(t); requestAnimationFrame(r); }; requestAnimationFrame(r); }
    }
    initPointerFX();
    Intro.run();
    Scroll.update();

    // rebuild once fonts/images settle (layout-dependent path geometry)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { Journey.build(); Scroll.update(); });
    addEventListener('load', () => { Journey.build(); Scroll.update(); });

    mqReduce.addEventListener('change', e => { reduce = e.matches; Scroll.modes(); Court.refresh(); Journey.build(); Scroll.update(); });
    mqMobile.addEventListener('change', () => { Scroll.modes(); Journey.build(); Scroll.update(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
