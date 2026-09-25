const STORAGE = {
  likes: 'margin.likes',
  saves: 'margin.saves',
  follows: 'margin.follows',
  uploads: 'margin.uploads',
  drafts: 'margin.drafts',
  collections: 'margin.collections',
  comments: 'margin.comments',
  notifications: 'margin.notifications',
  threads: 'margin.threads',
  jobSaves: 'margin.jobSaves',
  applications: 'margin.applications',
  profile: 'margin.profile'
};

const LEGACY_STORAGE = Object.fromEntries(
  Object.entries(STORAGE).map(([name,key]) => [name, key.replace('margin.', 'morrow.')])
);

Object.entries(STORAGE).forEach(([name,key]) => {
  if (localStorage.getItem(key) === null) {
    const legacy = localStorage.getItem(LEGACY_STORAGE[name]);
    if (legacy !== null) localStorage.setItem(key, legacy);
  }
});

const readLocal = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
};

const writeLocal = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

const profileDefaults = {
  name: 'David Vale',
  handle: '@david',
  location: 'London, Canada',
  bio: 'Independent visual artist working across image making, print, and small digital experiments. Available for selected editorial and identity projects.',
  availability: 'Available',
  website: 'davidvale.art'
};

const state = {
  route: 'explore',
  routeId: null,
  filter: 'All',
  sort: 'Featured',
  search: '',
  profileTab: 'portfolio',
  likes: new Set(readLocal(STORAGE.likes, [])),
  saves: new Set(readLocal(STORAGE.saves, [])),
  follows: new Set(readLocal(STORAGE.follows, ['hana-vale', 'noor-adebayo', 'sora-lin'])),
  uploads: readLocal(STORAGE.uploads, []),
  drafts: readLocal(STORAGE.drafts, []),
  collections: readLocal(STORAGE.collections, [
    { id: 'colour-atmosphere', name: 'Colour & atmosphere', description: 'Light, colour relationships, and images worth returning to.', itemIds: ['after-rain','paper-sun','red-figure'], private: false },
    { id: 'editorial-reference', name: 'Editorial references', description: 'Composition, pacing, type, and visual storytelling.', itemIds: ['blue-hour','field-notes','orbital-type'], private: true }
  ]),
  comments: readLocal(STORAGE.comments, {
    'blue-hour': [
      { id: 'c1', author: 'Noor Adebayo', avatar: 'noor-adebayo', body: 'The colour transition in the second study is beautiful.', time: '2h' },
      { id: 'c2', author: 'Cass Renn', avatar: 'cass-renn', body: 'Love how much of the underdrawing you kept visible.', time: '48m' }
    ],
    'still-warm': [
      { id: 'c3', author: 'Hana Vale', avatar: 'hana-vale', body: 'The surface is doing so much here without getting busy.', time: '1d' }
    ]
  }),
  notifications: readLocal(STORAGE.notifications, [
    { id: 'n1', type: 'like', actorId: 'hana-vale', text: 'Hana Vale appreciated Paper Sun', time: '12m', unread: true },
    { id: 'n2', type: 'follow', actorId: 'noor-adebayo', text: 'Noor Adebayo followed you', time: '2h', unread: true },
    { id: 'n3', type: 'comment', actorId: 'cass-renn', text: 'Cass Renn commented on Red Figure / Green Room', time: '1d', unread: false }
  ]),
  threads: readLocal(STORAGE.threads, [
    {
      id: 'thread-hana',
      artistId: 'hana-vale',
      unread: 1,
      messages: [
        { id: 'm1', from: 'hana-vale', body: 'Hey David, thanks for saving the new studies.', time: '10:18' },
        { id: 'm2', from: 'me', body: 'Of course. The blue one is especially good.', time: '10:24' },
        { id: 'm3', from: 'hana-vale', body: 'Thank you. I am putting together a process post for it too.', time: '11:02' }
      ]
    },
    {
      id: 'thread-noor',
      artistId: 'noor-adebayo',
      unread: 0,
      messages: [
        { id: 'm4', from: 'noor-adebayo', body: 'Sending the print reference we talked about.', time: 'Tue' },
        { id: 'm5', from: 'me', body: 'Got it. Thank you.', time: 'Tue' }
      ]
    }
  ]),
  jobSaves: new Set(readLocal(STORAGE.jobSaves, [])),
  applications: readLocal(STORAGE.applications, []),
  profile: { ...profileDefaults, ...readLocal(STORAGE.profile, {}) },
  jobFilters: { fulltime: true, contract: true, freelance: true, remote: true, canada: true }
};

const artists = [
  {
    id:'hana-vale', name:'Hana Vale', handle:'@hanavale', field:'Illustration', location:'Toronto, Canada',
    status:'Available', avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=86',
    bio:'Illustrator making figurative work for editorial, publishing, and cultural clients. Interested in quiet gesture, difficult colour, and hand made surfaces.',
    website:'hanavale.studio', followers:18400, views:284000, joined:'2021'
  },
  {
    id:'ivo-march', name:'Ivo March', handle:'@ivomarch', field:'3D / Motion', location:'Berlin, Germany',
    status:'Available', avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=86',
    bio:'Independent 3D artist and motion designer building tactile digital objects, title systems, and experimental films.',
    website:'ivomarch.com', followers:12900, views:198000, joined:'2022'
  },
  {
    id:'noor-adebayo', name:'Noor Adebayo', handle:'@noorstudio', field:'Photography', location:'Montréal, Canada',
    status:'Available', avatar:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=86',
    bio:'Photographer documenting cities through weather, artificial light, interiors, and the small evidence people leave behind.',
    website:'nooradebayo.photo', followers:24100, views:511000, joined:'2020'
  },
  {
    id:'sora-lin', name:'Sora Lin', handle:'@soralin', field:'Concept Art', location:'Vancouver, Canada',
    status:'Booked', avatar:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=86',
    bio:'Concept artist focused on environments, world building, and cinematic visual development for games and animation.',
    website:'soralin.art', followers:32700, views:822000, joined:'2019'
  },
  {
    id:'cass-renn', name:'Cass Renn', handle:'@cassrenn', field:'Graphic Design', location:'Chicago, USA',
    status:'Available', avatar:'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=240&q=86',
    bio:'Graphic designer working in publishing, identity systems, type, and print. Makes a lot of things with registration errors on purpose.',
    website:'cassrenn.design', followers:9800, views:154000, joined:'2023'
  },
  {
    id:'emilia-ortiz', name:'Emilia Ortiz', handle:'@eortiz', field:'Painting', location:'Mexico City, Mexico',
    status:'Available', avatar:'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=240&q=86',
    bio:'Painter working primarily in oil, wax, and linen. Recent work studies temperature, memory, and repeated sittings.',
    website:'emiliaortiz.mx', followers:21300, views:397000, joined:'2020'
  }
];

const artworks = [
  {
    id:'blue-hour', title:'Blue Hour Studies', artist:'Hana Vale', artistId:'hana-vale', field:'Illustration',
    images:[
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1500&q=88',
      'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=1500&q=88'
    ],
    likes:1284, year:'2026', tools:'Gouache, graphite', tags:['editorial','figure','gouache'],
    description:'A sequence of quiet colour studies built around the half hour when interior light and evening light briefly match.',
    rights:'© Hana Vale. All rights reserved.', comments:true, portfolio:true, featured:98
  },
  {
    id:'soft-machinery', title:'Soft Machinery', artist:'Ivo March', artistId:'ivo-march', field:'3D',
    images:['https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1500&q=88'],
    likes:932, year:'2026', tools:'Blender, Houdini', tags:['3d','form','material'],
    description:'Material experiments asking how industrial forms change when their surfaces behave more like fabric than metal.',
    rights:'© Ivo March. All rights reserved.', comments:true, portfolio:true, featured:91
  },
  {
    id:'after-rain', title:'After Rain, 6:42', artist:'Noor Adebayo', artistId:'noor-adebayo', field:'Photography',
    images:[
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1500&q=88',
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1500&q=88'
    ],
    likes:2460, year:'2026', tools:'Leica Q3', tags:['street','light','city'],
    description:'Part of an ongoing study of wet pavement, reflected signs, and the small shifts in colour that happen after summer rain.',
    rights:'© Noor Adebayo. All rights reserved.', comments:true, portfolio:true, featured:100
  },
  {
    id:'weather-system', title:'Weather System', artist:'Sora Lin', artistId:'sora-lin', field:'Concept Art',
    images:['https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1500&q=88'],
    likes:1887, year:'2026', tools:'Photoshop', tags:['environment','sky','concept'],
    description:'Environment development for a story set above a permanent cloud shelf, where weather is treated as geography.',
    rights:'© Sora Lin. All rights reserved.', comments:true, portfolio:true, featured:96
  },
  {
    id:'field-notes', title:'Field Notes No. 14', artist:'Cass Renn', artistId:'cass-renn', field:'Graphic Design',
    images:['https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1500&q=88'],
    likes:721, year:'2026', tools:'InDesign, risograph', tags:['print','type','riso'],
    description:'A print study combining found type, registration errors, and colour separations from a larger editorial identity system.',
    rights:'© Cass Renn. All rights reserved.', comments:true, portfolio:true, featured:86
  },
  {
    id:'still-warm', title:'Still Warm', artist:'Emilia Ortiz', artistId:'emilia-ortiz', field:'Painting',
    images:['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1500&q=88'],
    likes:3410, year:'2025', tools:'Oil on linen', tags:['painting','portrait','oil'],
    description:'Oil on linen, painted from repeated sittings over six weeks. The final pass kept the underdrawing visible at the shoulder.',
    rights:'© Emilia Ortiz. All rights reserved.', comments:true, portfolio:true, featured:99
  },
  {
    id:'signal-garden', title:'Signal Garden', artist:'Ivo March', artistId:'ivo-march', field:'Motion',
    images:['https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?auto=format&fit=crop&w=1500&q=88'],
    likes:1112, year:'2026', tools:'Cinema 4D, Redshift', tags:['motion','abstract','colour'],
    description:'Frames from a short motion piece built from modular signals, shifting depth, and deliberately imperfect loops.',
    rights:'© Ivo March. All rights reserved.', comments:true, portfolio:true, featured:88
  },
  {
    id:'paper-sun', title:'Paper Sun', artist:'Hana Vale', artistId:'hana-vale', field:'Illustration',
    images:['https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1500&q=88'],
    likes:2019, year:'2026', tools:'Acrylic, coloured pencil', tags:['colour','editorial','acrylic'],
    description:'An editorial image about optimism that is useful precisely because it is temporary.',
    rights:'© Hana Vale. All rights reserved.', comments:true, portfolio:true, featured:94
  },
  {
    id:'room-tone', title:'Room Tone', artist:'Noor Adebayo', artistId:'noor-adebayo', field:'Photography',
    images:['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1500&q=88'],
    likes:803, year:'2025', tools:'Sony A7R V', tags:['interior','space','documentary'],
    description:'A study of empty workspaces photographed before people arrive, with attention to traces of the previous day.',
    rights:'© Noor Adebayo. All rights reserved.', comments:true, portfolio:true, featured:84
  },
  {
    id:'orbital-type', title:'Orbital Type', artist:'Cass Renn', artistId:'cass-renn', field:'Graphic Design',
    images:['https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1500&q=88'],
    likes:646, year:'2026', tools:'Illustrator, Glyphs', tags:['identity','typography','poster'],
    description:'A display type experiment developed for a fictional astronomy journal and expanded into a small poster system.',
    rights:'© Cass Renn. All rights reserved.', comments:true, portfolio:true, featured:82
  },
  {
    id:'red-figure', title:'Red Figure / Green Room', artist:'Emilia Ortiz', artistId:'emilia-ortiz', field:'Painting',
    images:['https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1500&q=88'],
    likes:1530, year:'2026', tools:'Oil, wax', tags:['figure','painting','colour'],
    description:'A figure study focused on temperature rather than likeness, with wax added between oil layers to flatten the surface.',
    rights:'© Emilia Ortiz. All rights reserved.', comments:true, portfolio:true, featured:92
  },
  {
    id:'monument-valley', title:'Monument Study 03', artist:'Sora Lin', artistId:'sora-lin', field:'Concept Art',
    images:['https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1500&q=88'],
    likes:2771, year:'2026', tools:'Photoshop, Blender', tags:['landscape','environment','concept'],
    description:'Shape language exploration for a monumental desert structure designed to read clearly from extreme distance.',
    rights:'© Sora Lin. All rights reserved.', comments:true, portfolio:true, featured:97
  },
  {
    id:'david-quiet-shift', title:'Quiet Shift', artist:'David Vale', artistId:'me', field:'Photography',
    images:['https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1500&q=88'],
    likes:417, year:'2026', tools:'Digital photography', tags:['interior','light','study'],
    description:'An ongoing set of interior studies about late afternoon light and objects left slightly out of place.',
    rights:'© David Vale. All rights reserved.', comments:true, portfolio:true, featured:80
  },
  {
    id:'david-interval', title:'Interval Forms', artist:'David Vale', artistId:'me', field:'Graphic Design',
    images:['https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1500&q=88'],
    likes:682, year:'2026', tools:'Illustrator, InDesign', tags:['graphic','shape','poster'],
    description:'Poster studies made from a limited set of forms, repeated until the gaps became more important than the objects.',
    rights:'© David Vale. All rights reserved.', comments:true, portfolio:true, featured:85
  },
  {
    id:'david-garden-index', title:'Garden Index', artist:'David Vale', artistId:'me', field:'Illustration',
    images:['https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1500&q=88'],
    likes:355, year:'2025', tools:'Ink, digital colour', tags:['botanical','ink','editorial'],
    description:'A small visual index of imagined plant forms, drawn in ink and assembled digitally.',
    rights:'© David Vale. All rights reserved.', comments:true, portfolio:true, featured:77
  }
];

const jobs = [
  {
    id:'northline-environment', company:'Northline Games', role:'Senior Environment Artist', location:'Toronto, Canada', mode:'Hybrid',
    type:'Full time', field:'3D / Concept', salary:'CAD $105k to $132k', posted:'2 days ago',
    description:'Build visual direction and production ready environments for an unannounced narrative game. You will work across blockout, paintover, material direction, and final world building.',
    requirements:['5+ years in environment art or adjacent production work','Strong portfolio showing composition, lighting, and spatial storytelling','Comfort moving between 2D paintover and 3D workflows'],
    portfolioRequired:true
  },
  {
    id:'mica-editorial', company:'Mica Studio', role:'Editorial Illustrator', location:'Remote', mode:'Remote',
    type:'Contract', field:'Illustration', salary:'Per project', posted:'3 days ago',
    description:'Create editorial illustration for long form journalism and cultural reporting. Assignments range from fast turnaround spot art to larger feature packages.',
    requirements:['Editorial portfolio with strong conceptual thinking','Reliable communication across short production cycles','Ability to deliver layered source files when required'],
    portfolioRequired:true
  },
  {
    id:'soft-brand', company:'Soft Assembly', role:'Brand Designer', location:'Montréal, Canada', mode:'Hybrid',
    type:'Full time', field:'Graphic Design', salary:'CAD $82k to $98k', posted:'4 days ago',
    description:'Develop identity systems, campaign language, and digital brand components for cultural and technology clients.',
    requirements:['Strong identity and typography work','Comfort presenting rationale to clients','Experience producing systems across print and digital'],
    portfolioRequired:true
  },
  {
    id:'paper-cover', company:'Paper House Press', role:'Book Cover Artist', location:'Remote', mode:'Remote',
    type:'Freelance', field:'Painting / Illustration', salary:'CAD $2.5k to $5k', posted:'5 days ago',
    description:'Create original cover art for literary fiction and essay collections. Projects may involve painting, illustration, collage, or mixed media.',
    requirements:['Published or publication ready portfolio','Ability to work from manuscript themes without literalizing them','Final artwork suitable for print reproduction'],
    portfolioRequired:true
  },
  {
    id:'lumen-lookdev', company:'Lumen Pictures', role:'Look Development Artist', location:'Vancouver, Canada', mode:'On site',
    type:'Full time', field:'3D', salary:'CAD $96k to $120k', posted:'1 week ago',
    description:'Develop materials, lighting references, and final surface language for stylized animated features.',
    requirements:['Production experience with modern shading workflows','Strong material observation and colour judgment','Ability to collaborate closely with lighting and modelling'],
    portfolioRequired:true
  }
];

const fields = ['All','Illustration','Digital Art','Photography','3D','Graphic Design','Painting','Concept Art','Motion'];

const main = document.querySelector('#main');
const drawer = document.querySelector('#upload-drawer');
const sidePanel = document.querySelector('#side-panel');
const sidePanelContent = document.querySelector('#side-panel-content');
const scrim = document.querySelector('#scrim');
const toast = document.querySelector('#toast');
const artDialog = document.querySelector('#art-dialog');
const artDialogContent = document.querySelector('#art-dialog-content');
const modal = document.querySelector('#modal');
const modalContent = document.querySelector('#modal-content');
const searchInput = document.querySelector('#global-search');
const notificationBadge = document.querySelector('#notification-badge');
const messageBadge = document.querySelector('#message-badge');

let toastTimer;
let uploadMedia = [];
let uploadCover = 0;
let editingProjectId = null;
let currentProjectId = null;
let currentProjectMedia = 0;
let activeThreadId = null;

function allArt() {
  const uploads = state.uploads.map(item => ({ ...item, artist:state.profile.name, artistId:'me' }));
  const seeded = artworks.map(item => item.artistId === 'me' ? { ...item, artist:state.profile.name } : item);
  return [...uploads, ...seeded];
}

function artById(id) {
  return allArt().find(item => item.id === id);
}

function artistById(id) {
  if (id === 'me') {
    return {
      id:'me',
      name:state.profile.name,
      handle:state.profile.handle,
      field:'Visual Artist',
      location:state.profile.location,
      status:state.profile.availability,
      avatar:'',
      bio:state.profile.bio,
      website:state.profile.website,
      followers:1800,
      views:42600,
      joined:'2026'
    };
  }
  return artists.find(a => a.id === id);
}

function projectImages(item) {
  if (!item) return [];
  if (Array.isArray(item.images) && item.images.length) return item.images;
  return item.image ? [item.image] : [];
}

function coverImage(item) {
  const images = projectImages(item);
  const index = Math.min(item.coverIndex || 0, Math.max(images.length - 1, 0));
  return images[index] || '';
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
  }[char]));
}

function escapeAttr(value = '') {
  return escapeHTML(value).replace(/\n/g, ' ');
}

function formatNumber(number) {
  const n = Number(number) || 0;
  if (n >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 0 : 1).replace('.0','') + 'm';
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0','') + 'k';
  return String(n);
}

function icon(name, size = 16) {
  return `<i data-lucide="${name}" style="width:${size}px;height:${size}px" aria-hidden="true"></i>`;
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1900);
}

function persist() {
  writeLocal(STORAGE.likes, [...state.likes]);
  writeLocal(STORAGE.saves, [...state.saves]);
  writeLocal(STORAGE.follows, [...state.follows]);
  writeLocal(STORAGE.uploads, state.uploads.slice(0, 20));
  writeLocal(STORAGE.drafts, state.drafts.slice(0, 20));
  writeLocal(STORAGE.collections, state.collections);
  writeLocal(STORAGE.comments, state.comments);
  writeLocal(STORAGE.notifications, state.notifications.slice(0, 60));
  writeLocal(STORAGE.threads, state.threads);
  writeLocal(STORAGE.jobSaves, [...state.jobSaves]);
  writeLocal(STORAGE.applications, state.applications);
  writeLocal(STORAGE.profile, state.profile);
  updateBadges();
}

function updateBadges() {
  const unreadNotifications = state.notifications.filter(item => item.unread).length;
  const unreadMessages = state.threads.reduce((sum, thread) => sum + (thread.unread || 0), 0);
  notificationBadge.hidden = unreadNotifications === 0;
  messageBadge.hidden = unreadMessages === 0;
}

function parseRoute() {
  const raw = location.hash.replace(/^#/, '') || 'explore';
  const [route, id] = raw.split('/');
  state.route = ['explore','following','collections','jobs','profile','artist'].includes(route) ? route : 'explore';
  state.routeId = id || null;
}

function syncNavigation() {
  document.querySelectorAll('[data-nav]').forEach(el => {
    const activeRoute = state.route === 'artist' ? 'explore' : state.route;
    el.classList.toggle('is-active', el.dataset.nav === activeRoute);
  });
  document.querySelectorAll('[data-mobile-nav]').forEach(el => {
    const activeRoute = state.route === 'artist' ? 'explore' : state.route;
    el.classList.toggle('is-active', el.dataset.mobileNav === activeRoute);
  });
}

function renderRoute() {
  parseRoute();
  syncNavigation();
  if (state.route === 'explore') renderExplore();
  if (state.route === 'following') renderFollowing();
  if (state.route === 'collections') renderCollections(state.routeId);
  if (state.route === 'jobs') renderJobs();
  if (state.route === 'profile') renderProfile();
  if (state.route === 'artist') renderArtist(state.routeId);
  refreshIcons();
  main.focus({ preventScroll:true });
}

function creatorCard(artist) {
  return `<button class="creator-card" data-creator="${artist.id}">
    <span class="avatar"><img src="${artist.avatar}" alt="" loading="lazy"></span>
    <span class="creator-name">${escapeHTML(artist.name)}</span>
    <span class="creator-field">${escapeHTML(artist.field)}</span>
    <span class="creator-status ${artist.status === 'Available' ? '' : 'is-busy'}"><i></i>${escapeHTML(artist.status)}</span>
  </button>`;
}

function artCard(item, index = 0, context = '') {
  const liked = state.likes.has(item.id);
  const saved = state.saves.has(item.id);
  const image = coverImage(item);
  const contextClass = context === 'gallery'
    ? ` art-card--gallery gallery-shape-${index % 8}`
    : context === 'portfolio'
      ? ` art-card--portfolio portfolio-shape-${index % 6}`
      : '';
  return `<article class="art-card${contextClass}">
    <button class="art-thumb" data-open-art="${item.id}" aria-label="Open ${escapeAttr(item.title)} by ${escapeAttr(item.artist)}">
      <img src="${image}" alt="${escapeAttr(item.title)} by ${escapeAttr(item.artist)}" loading="lazy">
      <span class="art-overlay" aria-hidden="true">
        <span class="mini-action">${icon(saved ? 'bookmark-check' : 'bookmark',15)}</span>
        <span class="mini-action">${icon('heart',15)}</span>
      </span>
    </button>
    <div class="art-meta">
      <div>
        <h3 class="art-title">${escapeHTML(item.title)}</h3>
        <div class="art-byline"><button class="artist-inline" data-creator="${item.artistId}">${escapeHTML(item.artist)}</button><span>${escapeHTML(item.field)}</span></div>
      </div>
      <button class="art-stat ${liked ? 'is-liked' : ''}" data-like="${item.id}" aria-label="Appreciate ${escapeAttr(item.title)}">
        ${liked ? '♥' : '♡'} ${formatNumber((item.likes || 0) + (liked ? 1 : 0))}
      </button>
    </div>
  </article>`;
}

function bindArtworkEvents(scope = document) {
  scope.querySelectorAll('[data-open-art]').forEach(el => el.addEventListener('click', () => openArtwork(el.dataset.openArt)));
  scope.querySelectorAll('[data-like]').forEach(el => el.addEventListener('click', event => {
    event.stopPropagation();
    toggleLike(el.dataset.like);
  }));
  scope.querySelectorAll('[data-save]').forEach(el => el.addEventListener('click', event => {
    event.stopPropagation();
    toggleSave(el.dataset.save);
  }));
}

function bindCreatorEvents(scope = document) {
  scope.querySelectorAll('[data-creator]').forEach(el => el.addEventListener('click', () => {
    location.hash = 'artist/' + el.dataset.creator;
  }));
}

function renderExplore() {
  const query = state.search.trim().toLowerCase();
  let items = allArt().filter(item => {
    if (state.filter === 'All') return true;
    if (state.filter === 'Digital Art') return ['3D','Motion','Concept Art','Digital Art'].includes(item.field);
    return item.field === state.filter;
  });

  if (query) {
    items = items.filter(item => [item.title,item.artist,item.field,...(item.tags || [])].join(' ').toLowerCase().includes(query));
  }

  if (state.sort === 'Most appreciated') items.sort((a,b) => (b.likes || 0) - (a.likes || 0));
  if (state.sort === 'Newest') items.sort((a,b) => String(b.year || '').localeCompare(String(a.year || '')));
  if (state.sort === 'Featured') items.sort((a,b) => (b.featured || 50) - (a.featured || 50));

  const matchedArtists = query
    ? artists.filter(a => [a.name,a.handle,a.field,a.location].join(' ').toLowerCase().includes(query))
    : [];

  const selected = query ? [] : items.slice(0, 3);
  const browseItems = query ? items : items.slice(3);

  main.innerHTML = `
    <div class="page explore-page">
      ${query ? `
        <section class="search-summary search-summary--editorial">
          <div>
            <p class="archive-index">Search / Margin</p>
            <h1>“${escapeHTML(state.search)}”</h1>
            <p>${items.length} work${items.length === 1 ? '' : 's'} found</p>
          </div>
          <button class="button button-quiet button-small" id="clear-search">${icon('x',14)} Clear</button>
        </section>
        ${matchedArtists.length ? `
          <div class="search-artist-row">
            ${matchedArtists.map(a => `<button class="search-artist-pill" data-creator="${a.id}">
              <span class="avatar"><img src="${a.avatar}" alt=""></span>
              <span><strong>${escapeHTML(a.name)}</strong><small>${escapeHTML(a.field)} · ${escapeHTML(a.location)}</small></span>
            </button>`).join('')}
          </div>` : ''}
      ` : `
        <header class="archive-opening">
          <div>
            <p class="archive-index">01 / Explore</p>
            <h1>Explore</h1>
          </div>
          <p class="archive-note">New work, ongoing practices, and things worth returning to. Selected loosely across disciplines rather than ranked into a single feed.</p>
        </header>

        <section class="selected-stage" aria-label="Selected work">
          ${selected.map((item,index) => `
            <article class="selected-work selected-work--${index + 1}">
              <button class="selected-image" data-open-art="${item.id}">
                <img src="${coverImage(item)}" alt="${escapeAttr(item.title)} by ${escapeAttr(item.artist)}">
              </button>
              <div class="selected-caption">
                <span class="selected-number">0${index + 1}</span>
                <div>
                  <strong>${escapeHTML(item.title)}</strong>
                  <button data-creator="${item.artistId}">${escapeHTML(item.artist)}</button>
                </div>
              </div>
            </article>`).join('')}
        </section>

        <section class="artist-ribbon" aria-label="Artists to know">
          <div class="artist-ribbon-copy">
            <span>Artists to know</span>
            <small>Across illustration, image making, design, 3D, and painting</small>
          </div>
          <div class="artist-ribbon-list">
            ${artists.map(a => `<button class="artist-ribbon-item" data-creator="${a.id}">
              <span class="avatar"><img src="${a.avatar}" alt=""></span>
              <span><strong>${escapeHTML(a.name)}</strong><small>${escapeHTML(a.field)}</small></span>
            </button>`).join('')}
          </div>
        </section>
      `}

      <section class="browse-intro">
        <div>
          <p class="archive-index">${query ? 'Results' : '02 / Browse'}</p>
          <h2>${query ? 'Work' : 'The archive'}</h2>
        </div>
        <p>${query ? 'Refine by discipline or change the sort.' : 'A changing mix of recent projects and older work resurfacing through the community.'}</p>
      </section>

      <div class="feed-toolbar feed-toolbar--soft">
        <div class="filter-scroll" aria-label="Filter artwork">
          ${fields.map(field => `<button class="filter-chip ${state.filter === field ? 'is-active' : ''}" data-filter="${field}">${field}</button>`).join('')}
        </div>
        <span class="toolbar-spacer"></span>
        <select class="sort-select" id="sort-select" aria-label="Sort projects">
          <option ${state.sort === 'Featured' ? 'selected' : ''}>Featured</option>
          <option ${state.sort === 'Newest' ? 'selected' : ''}>Newest</option>
          <option ${state.sort === 'Most appreciated' ? 'selected' : ''}>Most appreciated</option>
        </select>
      </div>

      ${browseItems.length ? `<section class="gallery-grid" aria-label="Artwork">${browseItems.map((item,index) => artCard(item,index,'gallery')).join('')}</section>` : `
        <div class="empty-state">
          ${icon('search-x',30)}
          <strong>No work matched that search.</strong>
          Try another artist, field, or tag.
        </div>
      `}
    </div>
  `;

  document.querySelector('#clear-search')?.addEventListener('click', () => {
    state.search = '';
    searchInput.value = '';
    renderExplore();
  });
  document.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
    state.filter = btn.dataset.filter;
    renderExplore();
  }));
  document.querySelector('#sort-select')?.addEventListener('change', event => {
    state.sort = event.target.value;
    renderExplore();
  });
  bindArtworkEvents(main);
  bindCreatorEvents(main);
  refreshIcons();
}

function renderFollowing() {
  const followed = allArt().filter(item => state.follows.has(item.artistId));

  main.innerHTML = `
    <div class="page page-narrow">
      <header class="subpage-head">
        <h1>Following</h1>
        <p>A chronological stream from the artists you chose. No recommended work is mixed into it.</p>
      </header>

      ${followed.length ? `
        <section class="following-feed">
          ${followed.map(item => {
            const artist = artistById(item.artistId);
            return `<article class="timeline-item">
              <span class="avatar"><img src="${artist.avatar}" alt=""></span>
              <div>
                <div class="timeline-head">
                  <button data-creator="${artist.id}">${escapeHTML(artist.name)}</button>
                  <span>${escapeHTML(artist.handle)} · recently</span>
                </div>
                <button class="art-thumb" data-open-art="${item.id}">
                  <img class="timeline-image" src="${coverImage(item)}" alt="${escapeAttr(item.title)}">
                </button>
                <p class="timeline-copy"><strong>${escapeHTML(item.title)}</strong> · ${escapeHTML(item.description)}</p>
                <div class="timeline-actions">
                  <button class="text-action ${state.likes.has(item.id) ? 'is-active' : ''}" data-like="${item.id}">${icon('heart',15)} Appreciate</button>
                  <button class="text-action ${state.saves.has(item.id) ? 'is-active' : ''}" data-save="${item.id}">${icon('bookmark',15)} Save</button>
                  <button class="text-action" data-comment-open="${item.id}">${icon('message-circle',15)} Comment</button>
                </div>
              </div>
            </article>`;
          }).join('')}
        </section>
      ` : `
        <div class="empty-state">
          ${icon('users',30)}
          <strong>Your following feed is quiet.</strong>
          Follow artists from Explore to build a chronological feed.
          <br><a href="#explore" class="button button-primary">Find artists</a>
        </div>
      `}
    </div>
  `;

  bindArtworkEvents(main);
  bindCreatorEvents(main);
  main.querySelectorAll('[data-comment-open]').forEach(btn => btn.addEventListener('click', () => openArtwork(btn.dataset.commentOpen, true)));
  refreshIcons();
}

function collectionCard(collection) {
  const items = collection.itemIds.map(artById).filter(Boolean);
  return `<article class="collection-card" data-open-collection="${collection.id}" tabindex="0" role="button" aria-label="Open ${escapeAttr(collection.name)}">
    ${items.length ? `
      <div class="collection-stack">
        <img src="${coverImage(items[0])}" alt="">
        <img src="${coverImage(items[1] || items[0])}" alt="">
      </div>
    ` : `<div class="collection-placeholder">${icon('images',38)}</div>`}
    <div class="collection-label">
      <strong>${escapeHTML(collection.name)} ${collection.private ? icon('lock',12) : ''}</strong>
      <span>${items.length} work${items.length === 1 ? '' : 's'} · ${collection.private ? 'Private' : 'Public'}</span>
    </div>
  </article>`;
}

function renderCollections(collectionId) {
  if (collectionId) {
    const collection = state.collections.find(item => item.id === collectionId);
    if (!collection) {
      location.hash = 'collections';
      return;
    }
    const items = collection.itemIds.map(artById).filter(Boolean);
    main.innerHTML = `
      <div class="page">
        <header class="collection-detail-head">
          <div>
            <a href="#collections" class="text-action">${icon('arrow-left',15)} All collections</a>
            <h1>${escapeHTML(collection.name)}</h1>
            <p>${escapeHTML(collection.description || 'A collection of saved work.')}</p>
          </div>
          <div class="head-actions">
            <button class="button button-quiet" id="edit-collection">${icon('pencil',15)} Edit</button>
            <button class="button button-danger" id="delete-collection">${icon('trash-2',15)} Delete</button>
          </div>
        </header>
        ${items.length ? `<section class="masonry" style="margin-top:24px">${items.map(artCard).join('')}</section>` : `
          <div class="empty-state">${icon('bookmark',30)}<strong>This collection is empty.</strong>Save a project, then add it to this collection from the project view.</div>
        `}
      </div>
    `;
    bindArtworkEvents(main);
    document.querySelector('#edit-collection').addEventListener('click', () => openCollectionEditor(collection));
    document.querySelector('#delete-collection').addEventListener('click', () => confirmDeleteCollection(collection));
    refreshIcons();
    return;
  }

  const saved = allArt().filter(item => state.saves.has(item.id));

  main.innerHTML = `
    <div class="page">
      <header class="subpage-head">
        <div>
          <h1>Collections</h1>
        </div>
        <div>
          <p>Keep references, favourites, and research private or group them into shareable boards.</p>
          <div class="head-actions" style="margin-top:16px;justify-content:flex-end">
            <button class="button button-primary" id="new-collection">${icon('plus',15)} New collection</button>
          </div>
        </div>
      </header>

      <section class="collection-grid">
        <article class="collection-card" id="saved-work-card" tabindex="0" role="button">
          ${saved.length ? `
            <div class="collection-stack">
              <img src="${coverImage(saved[0])}" alt="">
              <img src="${coverImage(saved[1] || saved[0])}" alt="">
            </div>
          ` : `<div class="collection-placeholder">${icon('bookmark',38)}</div>`}
          <div class="collection-label">
            <strong>Saved work</strong>
            <span>${saved.length} saved · Private</span>
          </div>
        </article>
        ${state.collections.map(collectionCard).join('')}
      </section>

      <div class="section-head">
        <h2>Recently saved</h2>
        <p>${saved.length ? saved.length + ' works' : 'Start saving work from Explore'}</p>
      </div>
      ${saved.length ? `<section class="masonry">${saved.map(artCard).join('')}</section>` : `
        <div class="empty-state">${icon('bookmark',30)}<strong>Your saved work will land here.</strong>Use Save on a project to keep it close.</div>
      `}
    </div>
  `;

  document.querySelector('#new-collection').addEventListener('click', () => openCollectionEditor());
  document.querySelector('#saved-work-card').addEventListener('click', () => openSavedWorkModal());
  document.querySelectorAll('[data-open-collection]').forEach(card => {
    const open = () => location.hash = 'collections/' + card.dataset.openCollection;
    card.addEventListener('click', open);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });
  bindArtworkEvents(main);
  refreshIcons();
}

function openSavedWorkModal() {
  const saved = allArt().filter(item => state.saves.has(item.id));
  openModal({
    eyebrow:'Saved work',
    title:'Your quick saves',
    html: saved.length ? `
      <div class="modal-list">
        ${saved.map(item => `<div class="modal-list-row">
          <span>${escapeHTML(item.title)} <small style="color:var(--muted)">by ${escapeHTML(item.artist)}</small></span>
          <button class="button button-small button-quiet" data-modal-open-art="${item.id}">Open</button>
        </div>`).join('')}
      </div>
    ` : '<div class="panel-empty">Nothing saved yet.</div>',
    onMount: () => {
      modalContent.querySelectorAll('[data-modal-open-art]').forEach(btn => btn.addEventListener('click', () => {
        closeModal();
        openArtwork(btn.dataset.modalOpenArt);
      }));
    }
  });
}

function openCollectionEditor(collection = null) {
  openModal({
    eyebrow: collection ? 'Edit collection' : 'New collection',
    title: collection ? 'Collection details' : 'Create a collection',
    html: `
      <form id="collection-form" class="modal-body">
        <label><span>Name</span><input id="collection-name" required maxlength="60" value="${escapeAttr(collection?.name || '')}" placeholder="Lighting references"></label>
        <label><span>Description</span><textarea id="collection-description" rows="3" maxlength="220" placeholder="What belongs here?">${escapeHTML(collection?.description || '')}</textarea></label>
        <div class="toggle-row">
          <div><strong>Private collection</strong><small>Only visible to you.</small></div>
          <label class="switch"><input id="collection-private" type="checkbox" ${collection?.private ? 'checked' : ''}><span></span></label>
        </div>
        <div class="modal-actions">
          <button type="button" class="button button-quiet" data-close-modal>Cancel</button>
          <button type="submit" class="button button-primary">${collection ? 'Save changes' : 'Create collection'}</button>
        </div>
      </form>
    `,
    onMount: () => {
      document.querySelector('#collection-form').addEventListener('submit', event => {
        event.preventDefault();
        const name = document.querySelector('#collection-name').value.trim();
        const description = document.querySelector('#collection-description').value.trim();
        const isPrivate = document.querySelector('#collection-private').checked;
        if (collection) {
          collection.name = name;
          collection.description = description;
          collection.private = isPrivate;
        } else {
          state.collections.unshift({
            id:'collection-' + Date.now(),
            name,
            description,
            private:isPrivate,
            itemIds:[]
          });
        }
        persist();
        closeModal();
        renderRoute();
        showToast(collection ? 'Collection updated' : 'Collection created');
      });
      bindCloseModalButtons();
    }
  });
}

function confirmDeleteCollection(collection) {
  openModal({
    eyebrow:'Collection',
    title:'Delete this collection?',
    html:`
      <div class="modal-body">
        <p>The artworks themselves will not be deleted. Only “${escapeHTML(collection.name)}” and its organization will be removed.</p>
        <div class="modal-actions">
          <button class="button button-quiet" data-close-modal>Cancel</button>
          <button class="button button-danger" id="confirm-delete-collection">Delete collection</button>
        </div>
      </div>
    `,
    onMount:() => {
      bindCloseModalButtons();
      document.querySelector('#confirm-delete-collection').addEventListener('click', () => {
        state.collections = state.collections.filter(item => item.id !== collection.id);
        persist();
        closeModal();
        location.hash = 'collections';
        showToast('Collection deleted');
      });
    }
  });
}

function renderJobs() {
  const filtered = jobs.filter(job => {
    const typeKey = job.type === 'Full time' ? 'fulltime' : job.type.toLowerCase();
    const typeMatch = state.jobFilters[typeKey] !== false;
    const locationMatch = (job.mode === 'Remote' && state.jobFilters.remote) || (job.location.includes('Canada') && state.jobFilters.canada);
    return typeMatch && locationMatch;
  });

  main.innerHTML = `
    <div class="page">
      <header class="subpage-head">
        <h1>Creative jobs</h1>
        <p>Roles for working artists and designers, with discipline, location, and compensation visible before you click.</p>
      </header>

      <div class="jobs-layout">
        <aside class="job-filters">
          <div class="job-filter-group">
            <h3>Work type</h3>
            <label class="check-row"><input type="checkbox" data-job-filter="fulltime" ${state.jobFilters.fulltime ? 'checked' : ''}> Full time</label>
            <label class="check-row"><input type="checkbox" data-job-filter="contract" ${state.jobFilters.contract ? 'checked' : ''}> Contract</label>
            <label class="check-row"><input type="checkbox" data-job-filter="freelance" ${state.jobFilters.freelance ? 'checked' : ''}> Freelance</label>
          </div>
          <div class="job-filter-group">
            <h3>Location</h3>
            <label class="check-row"><input type="checkbox" data-job-filter="remote" ${state.jobFilters.remote ? 'checked' : ''}> Remote</label>
            <label class="check-row"><input type="checkbox" data-job-filter="canada" ${state.jobFilters.canada ? 'checked' : ''}> Canada</label>
          </div>
        </aside>

        <section class="job-list">
          ${filtered.map(job => `<article class="job-card">
            <button class="job-main" data-job="${job.id}">
              <div class="job-company">${escapeHTML(job.company)}</div>
              <h3>${escapeHTML(job.role)}</h3>
              <p>${escapeHTML(job.field)}</p>
              <div class="job-meta"><span>${escapeHTML(job.location)} · ${escapeHTML(job.mode)}</span><span>${escapeHTML(job.type)}</span><span>${escapeHTML(job.posted)}</span></div>
            </button>
            <div class="job-side">
              <div class="job-salary">${escapeHTML(job.salary)}</div>
              <button class="save-job ${state.jobSaves.has(job.id) ? 'is-active' : ''}" data-save-job="${job.id}" aria-label="Save job">${icon('bookmark',16)}</button>
            </div>
          </article>`).join('')}
        </section>
      </div>
    </div>
  `;

  document.querySelectorAll('[data-job]').forEach(btn => btn.addEventListener('click', () => openJob(btn.dataset.job)));
  document.querySelectorAll('[data-save-job]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.saveJob;
    state.jobSaves.has(id) ? state.jobSaves.delete(id) : state.jobSaves.add(id);
    persist();
    renderJobs();
    showToast(state.jobSaves.has(id) ? 'Job saved' : 'Job removed');
  }));
  document.querySelectorAll('[data-job-filter]').forEach(input => input.addEventListener('change', () => {
    state.jobFilters[input.dataset.jobFilter] = input.checked;
    renderJobs();
  }));
  refreshIcons();
}

function openJob(id) {
  const job = jobs.find(item => item.id === id);
  if (!job) return;
  const applied = state.applications.some(item => item.jobId === id);
  openModal({
    eyebrow:job.company,
    title:job.role,
    html:`
      <div class="modal-body job-detail">
        <div class="job-detail-meta">
          <span class="meta-pill">${escapeHTML(job.location)} · ${escapeHTML(job.mode)}</span>
          <span class="meta-pill">${escapeHTML(job.type)}</span>
          <span class="meta-pill">${escapeHTML(job.salary)}</span>
        </div>
        <p>${escapeHTML(job.description)}</p>
        <h3>What they are looking for</h3>
        <ul>${job.requirements.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
        <h3>Portfolio</h3>
        <p>A Margin portfolio can be attached directly to the application. The employer receives a public link, not access to private collections or drafts.</p>
        <div class="modal-actions">
          <button class="button button-quiet ${state.jobSaves.has(job.id) ? 'is-active' : ''}" id="modal-save-job">${icon('bookmark',15)} ${state.jobSaves.has(job.id) ? 'Saved' : 'Save job'}</button>
          <button class="button button-primary" id="apply-job" ${applied ? 'disabled' : ''}>${applied ? 'Application sent' : 'Apply'}</button>
        </div>
      </div>
    `,
    onMount:() => {
      document.querySelector('#modal-save-job').addEventListener('click', () => {
        state.jobSaves.has(id) ? state.jobSaves.delete(id) : state.jobSaves.add(id);
        persist();
        openJob(id);
      });
      document.querySelector('#apply-job').addEventListener('click', () => openApplication(job));
    }
  });
}

function openApplication(job) {
  const portfolioUrl = 'margin.art/' + state.profile.handle.replace('@','');
  openModal({
    eyebrow:'Application',
    title:job.role,
    html:`
      <form id="application-form" class="modal-body">
        <label><span>Name</span><input value="${escapeAttr(state.profile.name)}" required></label>
        <label><span>Email</span><input type="email" value="david@example.com" required></label>
        <label><span>Portfolio</span><input type="url" value="https://${escapeAttr(portfolioUrl)}" required></label>
        <label><span>Short note</span><textarea id="application-note" rows="5" maxlength="900" placeholder="Introduce yourself and why this role is relevant to your work."></textarea></label>
        <div class="modal-actions">
          <button type="button" class="button button-quiet" data-close-modal>Cancel</button>
          <button type="submit" class="button button-primary">Send application</button>
        </div>
      </form>
    `,
    onMount:() => {
      bindCloseModalButtons();
      document.querySelector('#application-form').addEventListener('submit', event => {
        event.preventDefault();
        state.applications.push({ id:'application-' + Date.now(), jobId:job.id, sentAt:new Date().toISOString(), note:document.querySelector('#application-note').value.trim() });
        persist();
        modalContent.innerHTML = `
          <div class="application-confirm">
            ${icon('circle-check-big',42)}
            <h3>Application sent</h3>
            <p>Your profile and portfolio link were included with the application to ${escapeHTML(job.company)}.</p>
            <button class="button button-primary" data-close-modal>Done</button>
          </div>`;
        bindCloseModalButtons();
        refreshIcons();
      });
    }
  });
}

function profilePortfolio() {
  const seeded = artworks.filter(item => item.artistId === 'me');
  const user = state.uploads.filter(item => item.portfolio !== false);
  return [...user, ...seeded];
}

function renderProfile() {
  const portfolio = profilePortfolio();
  const totalLikes = portfolio.reduce((sum,item) => sum + (item.likes || 0),0) + state.likes.size;
  const tab = state.profileTab;
  const featured = portfolio[0];

  main.innerHTML = `
    <div class="page profile-page">
      <section class="profile-authored">
        <div class="profile-authored-copy">
          <div class="profile-kicker">
            <span class="avatar avatar-me">DV</span>
            <span>${escapeHTML(state.profile.handle)}</span>
            <span>${icon('map-pin',13)} ${escapeHTML(state.profile.location)}</span>
          </div>
          <h1>${escapeHTML(state.profile.name)}</h1>
          <p class="profile-statement">${escapeHTML(state.profile.bio)}</p>
          <div class="profile-actions profile-actions--authored">
            <button class="button button-quiet" id="edit-profile">${icon('pencil',15)} Edit profile</button>
            <button class="button button-primary" id="profile-upload">${icon('plus',15)} Add project</button>
          </div>
          <div class="profile-facts">
            <span><strong>${portfolio.length}</strong> projects</span>
            <span><strong>1.8k</strong> followers</span>
            <span><strong>${formatNumber(totalLikes)}</strong> appreciations</span>
            <span class="availability-mark"><i></i>${escapeHTML(state.profile.availability)} for work</span>
          </div>
        </div>

        ${featured ? `
          <button class="profile-feature" data-open-art="${featured.id}">
            <img src="${coverImage(featured)}" alt="${escapeAttr(featured.title)}">
            <span class="profile-feature-caption">
              <small>Featured work</small>
              <strong>${escapeHTML(featured.title)}</strong>
              <span>${escapeHTML(featured.field)} · ${escapeHTML(featured.year)}</span>
            </span>
          </button>
        ` : ''}
      </section>

      <nav class="profile-tabs profile-tabs--authored" aria-label="Profile sections">
        ${['portfolio','timeline','about','studio'].map(name => `<button class="profile-tab ${tab === name ? 'is-active' : ''}" data-profile-tab="${name}">${name[0].toUpperCase() + name.slice(1)}</button>`).join('')}
      </nav>

      <div id="profile-tab-content">
        ${profileTabHTML(tab, portfolio)}
      </div>
    </div>
  `;

  document.querySelector('#profile-upload').addEventListener('click', () => openUpload());
  document.querySelector('#edit-profile').addEventListener('click', openProfileEditor);
  document.querySelectorAll('[data-profile-tab]').forEach(btn => btn.addEventListener('click', () => {
    state.profileTab = btn.dataset.profileTab;
    renderProfile();
  }));
  bindArtworkEvents(main);
  bindStudioEvents();
  refreshIcons();
}

function profileTabHTML(tab, portfolio) {
  if (tab === 'portfolio') {
    return portfolio.length
      ? `<section class="portfolio-grid">${portfolio.map((item,index) => artCard(item,index,'portfolio')).join('')}</section>`
      : `<div class="empty-state">${icon('images',30)}<strong>Your portfolio is empty.</strong>Publish a project and choose “Add to portfolio”.</div>`;
  }

  if (tab === 'timeline') {
    const timeline = [...state.uploads, ...artworks.filter(item => item.artistId === 'me')];
    return timeline.length
      ? `<section class="following-feed">${timeline.map(item => `
          <article class="timeline-item">
            <span class="avatar avatar-me">DV</span>
            <div>
              <div class="timeline-head"><strong>${escapeHTML(state.profile.name)}</strong><span>published a project</span></div>
              <button class="art-thumb" data-open-art="${item.id}"><img class="timeline-image" src="${coverImage(item)}" alt="${escapeAttr(item.title)}"></button>
              <p class="timeline-copy"><strong>${escapeHTML(item.title)}</strong> · ${escapeHTML(item.description)}</p>
            </div>
          </article>`).join('')}</section>`
      : '';
  }

  if (tab === 'about') {
    return `
      <section class="profile-about">
        <div>
          <h2>About</h2>
          <p>${escapeHTML(state.profile.bio)}</p>
          <h2>Practice</h2>
          <p>Visual work spanning image making, illustration, print, and digital experiments. This profile keeps finished portfolio work separate from process and timeline posts.</p>
        </div>
        <div class="info-list">
          <div class="info-row"><span>Location</span><span>${escapeHTML(state.profile.location)}</span></div>
          <div class="info-row"><span>Availability</span><span>${escapeHTML(state.profile.availability)}</span></div>
          <div class="info-row"><span>Website</span><span>${escapeHTML(state.profile.website)}</span></div>
          <div class="info-row"><span>Member since</span><span>2026</span></div>
        </div>
      </section>`;
  }

  const managed = state.uploads;
  const drafts = state.drafts;
  return `
    <section class="studio-grid">
      <div>
        <div class="section-head"><h2>Published projects</h2><p>${managed.length} you can manage</p></div>
        <div class="studio-section">
          ${managed.length ? managed.map(item => studioRow(item,'project')).join('') : '<div class="panel-empty">Your locally published projects will appear here.</div>'}
        </div>
        <div class="section-head"><h2>Drafts</h2><p>${drafts.length} saved</p></div>
        <div class="studio-section">
          ${drafts.length ? drafts.map(item => studioRow(item,'draft')).join('') : '<div class="panel-empty">No drafts saved.</div>'}
        </div>
      </div>
      <aside>
        <div class="section-head"><h2>Portfolio pulse</h2><p>Last 30 days</p></div>
        <div class="metric-grid">
          <div class="metric"><strong>8.4k</strong><span>Project views</span></div>
          <div class="metric"><strong>612</strong><span>Profile visits</span></div>
          <div class="metric"><strong>184</strong><span>Appreciations</span></div>
          <div class="metric"><strong>39</strong><span>New followers</span></div>
        </div>
        <div class="section-head"><h2>Job activity</h2><p>Private</p></div>
        <div class="info-list">
          <div class="info-row"><span>Saved jobs</span><span>${state.jobSaves.size}</span></div>
          <div class="info-row"><span>Applications</span><span>${state.applications.length}</span></div>
          <div class="info-row"><span>Availability</span><span>${escapeHTML(state.profile.availability)}</span></div>
        </div>
      </aside>
    </section>`;
}

function studioRow(item, type) {
  const image = coverImage(item);
  return `<div class="studio-row">
    <div>${image ? `<img src="${image}" alt="">` : '<div style="width:74px;height:54px;background:var(--surface)"></div>'}</div>
    <div><h3>${escapeHTML(item.title || 'Untitled draft')}</h3><p>${escapeHTML(item.field || 'Uncategorized')} · ${type === 'draft' ? 'Draft' : item.portfolio === false ? 'Timeline only' : 'Portfolio'}</p></div>
    <div class="row-actions">
      <button class="button button-small button-quiet" data-edit-${type}="${item.id}">${icon('pencil',14)} Edit</button>
      <button class="button button-small button-danger" data-delete-${type}="${item.id}">${icon('trash-2',14)}</button>
    </div>
  </div>`;
}

function bindStudioEvents() {
  document.querySelectorAll('[data-edit-project]').forEach(btn => btn.addEventListener('click', () => openUpload(artById(btn.dataset.editProject))));
  document.querySelectorAll('[data-edit-draft]').forEach(btn => btn.addEventListener('click', () => {
    const draft = state.drafts.find(item => item.id === btn.dataset.editDraft);
    openUpload(draft, true);
  }));
  document.querySelectorAll('[data-delete-project]').forEach(btn => btn.addEventListener('click', () => {
    state.uploads = state.uploads.filter(item => item.id !== btn.dataset.deleteProject);
    persist();
    renderProfile();
    showToast('Project deleted');
  }));
  document.querySelectorAll('[data-delete-draft]').forEach(btn => btn.addEventListener('click', () => {
    state.drafts = state.drafts.filter(item => item.id !== btn.dataset.deleteDraft);
    persist();
    renderProfile();
    showToast('Draft deleted');
  }));
}

function openProfileEditor() {
  openModal({
    eyebrow:'Profile',
    title:'Edit profile',
    html:`
      <form id="profile-form" class="modal-body">
        <div class="form-grid">
          <label><span>Name</span><input id="profile-name" required value="${escapeAttr(state.profile.name)}"></label>
          <label><span>Handle</span><input id="profile-handle" required value="${escapeAttr(state.profile.handle)}"></label>
        </div>
        <label><span>Location</span><input id="profile-location" value="${escapeAttr(state.profile.location)}"></label>
        <label><span>Bio</span><textarea id="profile-bio" rows="4" maxlength="420">${escapeHTML(state.profile.bio)}</textarea></label>
        <div class="form-grid">
          <label><span>Website</span><input id="profile-website" value="${escapeAttr(state.profile.website)}"></label>
          <label><span>Availability</span>
            <select id="profile-availability">
              <option ${state.profile.availability === 'Available' ? 'selected' : ''}>Available</option>
              <option ${state.profile.availability === 'Limited' ? 'selected' : ''}>Limited</option>
              <option ${state.profile.availability === 'Booked' ? 'selected' : ''}>Booked</option>
            </select>
          </label>
        </div>
        <div class="modal-actions">
          <button type="button" class="button button-quiet" data-close-modal>Cancel</button>
          <button type="submit" class="button button-primary">Save profile</button>
        </div>
      </form>
    `,
    onMount:() => {
      bindCloseModalButtons();
      document.querySelector('#profile-form').addEventListener('submit', event => {
        event.preventDefault();
        state.profile = {
          name:document.querySelector('#profile-name').value.trim(),
          handle:document.querySelector('#profile-handle').value.trim().replace(/^([^@])/, '@$1'),
          location:document.querySelector('#profile-location').value.trim(),
          bio:document.querySelector('#profile-bio').value.trim(),
          website:document.querySelector('#profile-website').value.trim(),
          availability:document.querySelector('#profile-availability').value
        };
        persist();
        closeModal();
        renderProfile();
        showToast('Profile updated');
      });
    }
  });
}

function renderArtist(id) {
  const artist = artistById(id);
  if (!artist || id === 'me') {
    location.hash = 'profile';
    return;
  }
  const portfolio = allArt().filter(item => item.artistId === id && item.portfolio !== false);
  const following = state.follows.has(id);
  const featured = portfolio[0];

  main.innerHTML = `
    <div class="page profile-page">
      <section class="profile-authored">
        <div class="profile-authored-copy">
          <div class="profile-kicker">
            <span class="avatar"><img src="${artist.avatar}" alt=""></span>
            <span>${escapeHTML(artist.handle)}</span>
            <span>${icon('map-pin',13)} ${escapeHTML(artist.location)}</span>
          </div>
          <h1>${escapeHTML(artist.name)}</h1>
          <p class="profile-statement">${escapeHTML(artist.bio)}</p>
          <div class="profile-actions profile-actions--authored">
            <button class="button button-quiet" id="message-artist">${icon('mail',15)} Message</button>
            <button class="button ${following ? 'button-quiet' : 'button-primary'}" id="follow-artist">${following ? 'Following' : 'Follow'}</button>
          </div>
          <div class="profile-facts">
            <span><strong>${portfolio.length}</strong> projects</span>
            <span><strong>${formatNumber(artist.followers)}</strong> followers</span>
            <span><strong>${formatNumber(artist.views)}</strong> project views</span>
            <span class="availability-mark ${artist.status === 'Available' ? '' : 'is-busy'}"><i></i>${escapeHTML(artist.status)} for work</span>
          </div>
        </div>

        ${featured ? `
          <button class="profile-feature" data-open-art="${featured.id}">
            <img src="${coverImage(featured)}" alt="${escapeAttr(featured.title)}">
            <span class="profile-feature-caption">
              <small>Featured work</small>
              <strong>${escapeHTML(featured.title)}</strong>
              <span>${escapeHTML(featured.field)} · ${escapeHTML(featured.year)}</span>
            </span>
          </button>
        ` : ''}
      </section>

      <nav class="profile-tabs profile-tabs--authored">
        <button class="profile-tab is-active" id="artist-portfolio-tab">Portfolio</button>
        <button class="profile-tab" id="artist-about-tab">About</button>
      </nav>

      <div id="artist-content">
        <section class="portfolio-grid">${portfolio.map((item,index) => artCard(item,index,'portfolio')).join('')}</section>
      </div>
    </div>
  `;

  document.querySelector('#follow-artist').addEventListener('click', () => toggleFollow(id));
  document.querySelector('#message-artist').addEventListener('click', () => openMessages(id));
  document.querySelector('#artist-portfolio-tab').addEventListener('click', () => renderArtist(id));
  document.querySelector('#artist-about-tab').addEventListener('click', event => {
    document.querySelectorAll('.profile-tab').forEach(btn => btn.classList.remove('is-active'));
    event.currentTarget.classList.add('is-active');
    document.querySelector('#artist-content').innerHTML = `
      <section class="profile-about">
        <div><h2>About</h2><p>${escapeHTML(artist.bio)}</p></div>
        <div class="info-list">
          <div class="info-row"><span>Practice</span><span>${escapeHTML(artist.field)}</span></div>
          <div class="info-row"><span>Location</span><span>${escapeHTML(artist.location)}</span></div>
          <div class="info-row"><span>Availability</span><span>${escapeHTML(artist.status)}</span></div>
          <div class="info-row"><span>Website</span><span>${escapeHTML(artist.website)}</span></div>
          <div class="info-row"><span>Member since</span><span>${escapeHTML(artist.joined)}</span></div>
        </div>
      </section>`;
  });
  bindArtworkEvents(main);
  refreshIcons();
}

function toggleLike(id) {
  if (state.likes.has(id)) state.likes.delete(id);
  else state.likes.add(id);
  persist();
  if (currentProjectId === id && artDialog.open) renderProjectDialog();
  else renderRoute();
  showToast(state.likes.has(id) ? 'Added appreciation' : 'Appreciation removed');
}

function toggleSave(id) {
  if (state.saves.has(id)) state.saves.delete(id);
  else state.saves.add(id);
  persist();
  if (currentProjectId === id && artDialog.open) renderProjectDialog();
  else renderRoute();
  showToast(state.saves.has(id) ? 'Saved' : 'Removed from saved work');
}

function toggleFollow(id) {
  if (state.follows.has(id)) state.follows.delete(id);
  else state.follows.add(id);
  persist();
  renderRoute();
  showToast(state.follows.has(id) ? 'Following artist' : 'Unfollowed artist');
}

function openArtwork(id, focusComments = false) {
  const item = artById(id);
  if (!item) return;
  currentProjectId = id;
  currentProjectMedia = 0;
  renderProjectDialog();
  if (!artDialog.open) artDialog.showModal();
  document.body.classList.add('no-scroll');
  if (focusComments) {
    setTimeout(() => document.querySelector('#project-comment-input')?.focus(), 60);
  }
}

function renderProjectDialog() {
  const item = artById(currentProjectId);
  if (!item) return;
  const artist = artistById(item.artistId);
  const liked = state.likes.has(item.id);
  const saved = state.saves.has(item.id);
  const following = item.artistId !== 'me' && state.follows.has(item.artistId);
  const images = projectImages(item);
  const comments = state.comments[item.id] || [];
  const currentImage = images[currentProjectMedia] || images[0];

  artDialogContent.innerHTML = `
    <div class="project-layout">
      <div class="project-media-column">
        <div class="project-media">
          <img src="${currentImage}" alt="${escapeAttr(item.title)} by ${escapeAttr(item.artist)}">
          ${images.length > 1 ? `
            <div class="media-nav">
              <button data-media-prev aria-label="Previous image">${icon('chevron-left',20)}</button>
              <button data-media-next aria-label="Next image">${icon('chevron-right',20)}</button>
            </div>
          ` : ''}
        </div>
        ${images.length > 1 ? `<div class="media-dots">${images.map((_,index) => `<button class="media-dot ${index === currentProjectMedia ? 'is-active' : ''}" data-media-index="${index}" aria-label="Show image ${index + 1}"></button>`).join('')}</div>` : ''}
      </div>

      <section class="project-info">
        <div class="project-author">
          <span class="avatar">${artist?.avatar ? `<img src="${artist.avatar}" alt="">` : 'DV'}</span>
          <div class="project-author-copy">
            <button data-project-author="${item.artistId}">${escapeHTML(item.artist)}</button>
            <small>${escapeHTML(artist?.handle || state.profile.handle)} · ${escapeHTML(item.field)}</small>
          </div>
          ${item.artistId !== 'me' ? `<button class="button button-small ${following ? 'button-quiet' : 'button-primary'}" id="project-follow">${following ? 'Following' : 'Follow'}</button>` : ''}
        </div>

        <div class="project-title-block">
          <p class="project-index">${escapeHTML(item.field)} / ${escapeHTML(item.year || '2026')}</p>
          <h2>${escapeHTML(item.title)}</h2>
          <p class="project-description">${escapeHTML(item.description || 'A new project shared with the Margin community.')}</p>
        </div>

        <div class="project-facts-line">
          ${item.process !== false ? `<span><small>Made with</small>${escapeHTML(item.tools || 'Mixed media')}</span>` : ''}
          <span><small>Project</small>${images.length} image${images.length === 1 ? '' : 's'}</span>
        </div>

        <div class="tag-list">${(item.tags || []).map(tag => `<button class="tag" data-project-tag="${escapeAttr(tag)}">#${escapeHTML(tag)}</button>`).join('')}</div>

        <div class="project-actions">
          <button class="button ${liked ? 'button-primary' : 'button-quiet'}" id="project-like">${icon('heart',16)} ${liked ? 'Appreciated' : 'Appreciate'}</button>
          <button class="button ${saved ? 'button-primary' : 'button-quiet'}" id="project-save">${icon('bookmark',16)} ${saved ? 'Saved' : 'Save'}</button>
        </div>

        <div class="project-secondary-actions">
          <button class="text-action" id="add-to-collection">${icon('folder-plus',15)} Collection</button>
          <button class="text-action" id="share-project">${icon('share-2',15)} Share</button>
          ${item.artistId === 'me' && String(item.id).startsWith('local-') ? `<button class="text-action" id="edit-project-dialog">${icon('pencil',15)} Edit</button>` : ''}
        </div>

        <p class="project-rights">${escapeHTML(item.rights || '© ' + item.artist + '. All rights reserved.')}</p>

        ${item.comments !== false ? `
          <section class="comments">
            <h3>Comments · ${comments.length}</h3>
            <div id="comment-list">
              ${comments.length ? comments.map(commentHTML).join('') : '<p style="color:var(--faint)">No comments yet.</p>'}
            </div>
            <form class="comment-form" id="comment-form">
              <input id="project-comment-input" maxlength="500" placeholder="Leave a thoughtful comment" aria-label="Comment">
              <button class="button button-small button-primary" type="submit">Post</button>
            </form>
          </section>
        ` : ''}
      </section>
    </div>
  `;

  document.querySelector('#project-like').addEventListener('click', () => toggleLike(item.id));
  document.querySelector('#project-save').addEventListener('click', () => toggleSave(item.id));
  document.querySelector('#project-follow')?.addEventListener('click', () => {
    if (state.follows.has(item.artistId)) state.follows.delete(item.artistId);
    else state.follows.add(item.artistId);
    persist();
    renderProjectDialog();
  });
  document.querySelector('[data-project-author]').addEventListener('click', () => {
    closeArtwork();
    location.hash = item.artistId === 'me' ? 'profile' : 'artist/' + item.artistId;
  });
  document.querySelectorAll('[data-project-tag]').forEach(btn => btn.addEventListener('click', () => {
    state.search = btn.dataset.projectTag;
    searchInput.value = state.search;
    closeArtwork();
    location.hash = 'explore';
    renderRoute();
  }));
  document.querySelector('#add-to-collection').addEventListener('click', () => openAddToCollection(item.id));
  document.querySelector('#share-project').addEventListener('click', () => shareProject(item));
  document.querySelector('#edit-project-dialog')?.addEventListener('click', () => {
    closeArtwork();
    openUpload(item);
  });
  document.querySelector('[data-media-prev]')?.addEventListener('click', () => {
    currentProjectMedia = (currentProjectMedia - 1 + images.length) % images.length;
    renderProjectDialog();
  });
  document.querySelector('[data-media-next]')?.addEventListener('click', () => {
    currentProjectMedia = (currentProjectMedia + 1) % images.length;
    renderProjectDialog();
  });
  document.querySelectorAll('[data-media-index]').forEach(btn => btn.addEventListener('click', () => {
    currentProjectMedia = Number(btn.dataset.mediaIndex);
    renderProjectDialog();
  }));
  document.querySelector('#comment-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const input = document.querySelector('#project-comment-input');
    const body = input.value.trim();
    if (!body) return;
    if (!state.comments[item.id]) state.comments[item.id] = [];
    state.comments[item.id].push({ id:'comment-' + Date.now(), author:state.profile.name, avatar:'me', body, time:'now' });
    persist();
    renderProjectDialog();
    setTimeout(() => document.querySelector('#project-comment-input')?.focus(), 20);
  });
  refreshIcons();
}

function commentHTML(comment) {
  const artist = artistById(comment.avatar);
  return `<div class="comment">
    <span class="avatar">${artist?.avatar ? `<img src="${artist.avatar}" alt="">` : 'DV'}</span>
    <div><p><strong>${escapeHTML(comment.author)}</strong> ${escapeHTML(comment.body)}</p><small>${escapeHTML(comment.time)}</small></div>
  </div>`;
}

function closeArtwork() {
  if (artDialog.open) artDialog.close();
  currentProjectId = null;
  document.body.classList.remove('no-scroll');
}

function shareProject(item) {
  const url = location.origin + location.pathname + '#project/' + item.id;
  if (navigator.share) {
    navigator.share({ title:item.title, text:item.title + ' by ' + item.artist, url }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => showToast('Project link copied'));
  } else {
    showToast('Project link ready to copy');
  }
}

function openAddToCollection(projectId) {
  openModal({
    eyebrow:'Collections',
    title:'Add project',
    html:`
      <div class="modal-body">
        <p>Choose where this project belongs. A project can be in more than one collection.</p>
        <div class="modal-list">
          ${state.collections.map(collection => `
            <div class="modal-list-row">
              <label><input type="checkbox" data-collection-check="${collection.id}" ${collection.itemIds.includes(projectId) ? 'checked' : ''}> <span>${escapeHTML(collection.name)}</span></label>
              <small style="color:var(--muted)">${collection.itemIds.length} works</small>
            </div>
          `).join('')}
        </div>
        <div class="modal-actions">
          <button class="button button-quiet" id="quick-new-collection">${icon('plus',15)} New collection</button>
          <button class="button button-primary" id="save-collection-membership">Done</button>
        </div>
      </div>
    `,
    onMount:() => {
      document.querySelector('#save-collection-membership').addEventListener('click', () => {
        state.collections.forEach(collection => {
          const checked = document.querySelector(`[data-collection-check="${collection.id}"]`)?.checked;
          const hasItem = collection.itemIds.includes(projectId);
          if (checked && !hasItem) collection.itemIds.unshift(projectId);
          if (!checked && hasItem) collection.itemIds = collection.itemIds.filter(id => id !== projectId);
        });
        persist();
        closeModal();
        showToast('Collections updated');
      });
      document.querySelector('#quick-new-collection').addEventListener('click', () => {
        closeModal();
        openCollectionEditor();
      });
    }
  });
}

function openNotifications() {
  closeUpload();
  sidePanel.classList.add('is-open');
  sidePanel.setAttribute('aria-hidden','false');
  scrim.hidden = false;
  document.querySelector('#side-panel-eyebrow').textContent = 'Activity';
  document.querySelector('#side-panel-title').textContent = 'Notifications';

  sidePanelContent.innerHTML = `
    <div class="panel-actions">
      <button class="text-action" id="mark-notifications-read">Mark all read</button>
    </div>
    <div class="notification-list">
      ${state.notifications.length ? state.notifications.map(notification => {
        const artist = artistById(notification.actorId);
        return `<div class="notification ${notification.unread ? 'is-unread' : ''}">
          <span class="avatar">${artist?.avatar ? `<img src="${artist.avatar}" alt="">` : 'DV'}</span>
          <div><p>${escapeHTML(notification.text)}</p><small>${escapeHTML(notification.time)}</small></div>
        </div>`;
      }).join('') : '<div class="panel-empty">No notifications yet.</div>'}
    </div>
  `;

  document.querySelector('#mark-notifications-read')?.addEventListener('click', () => {
    state.notifications.forEach(item => item.unread = false);
    persist();
    openNotifications();
  });
  refreshIcons();
}

function openMessages(artistId = null) {
  closeUpload();
  sidePanel.classList.add('is-open');
  sidePanel.setAttribute('aria-hidden','false');
  scrim.hidden = false;
  document.querySelector('#side-panel-eyebrow').textContent = 'Inbox';
  document.querySelector('#side-panel-title').textContent = 'Messages';

  if (artistId) {
    let thread = state.threads.find(item => item.artistId === artistId);
    if (!thread) {
      thread = { id:'thread-' + artistId, artistId, unread:0, messages:[] };
      state.threads.unshift(thread);
      persist();
    }
    activeThreadId = thread.id;
  }

  if (activeThreadId) renderThread(activeThreadId);
  else renderThreadList();
}

function renderThreadList() {
  activeThreadId = null;
  sidePanelContent.innerHTML = `
    <div class="thread-list">
      ${state.threads.length ? state.threads.map(thread => {
        const artist = artistById(thread.artistId);
        const last = thread.messages[thread.messages.length - 1];
        return `<button class="thread-row" data-thread="${thread.id}">
          <span class="avatar"><img src="${artist.avatar}" alt=""></span>
          <span><strong>${escapeHTML(artist.name)} ${thread.unread ? '<span style="color:var(--accent)">•</span>' : ''}</strong><p>${escapeHTML(last?.body || 'Start a conversation')}</p></span>
          <time>${escapeHTML(last?.time || '')}</time>
        </button>`;
      }).join('') : '<div class="panel-empty">No messages yet.</div>'}
    </div>
  `;
  sidePanelContent.querySelectorAll('[data-thread]').forEach(btn => btn.addEventListener('click', () => renderThread(btn.dataset.thread)));
}

function renderThread(id) {
  const thread = state.threads.find(item => item.id === id);
  if (!thread) return renderThreadList();
  activeThreadId = id;
  thread.unread = 0;
  persist();
  const artist = artistById(thread.artistId);

  sidePanelContent.innerHTML = `
    <div class="thread-view">
      <div class="thread-top">
        <button id="back-threads" aria-label="Back">${icon('arrow-left',18)}</button>
        <span class="avatar"><img src="${artist.avatar}" alt=""></span>
        <span><strong>${escapeHTML(artist.name)}</strong><small>${escapeHTML(artist.status)} for work</small></span>
      </div>
      <div class="messages" id="messages-scroll">
        ${thread.messages.length ? thread.messages.map(message => `
          <div class="message ${message.from === 'me' ? 'is-me' : ''}">
            ${escapeHTML(message.body)}
            <small>${escapeHTML(message.time)}</small>
          </div>`).join('') : '<div class="panel-empty">Start the conversation.</div>'}
      </div>
      <form class="message-compose" id="message-form">
        <input id="message-input" maxlength="600" placeholder="Message ${escapeAttr(artist.name)}" autocomplete="off">
        <button class="button button-primary" type="submit">${icon('send',15)} Send</button>
      </form>
    </div>
  `;

  document.querySelector('#back-threads').addEventListener('click', renderThreadList);
  document.querySelector('#message-form').addEventListener('submit', event => {
    event.preventDefault();
    const input = document.querySelector('#message-input');
    const body = input.value.trim();
    if (!body) return;
    thread.messages.push({ id:'message-' + Date.now(), from:'me', body, time:'now' });
    persist();
    renderThread(id);
    setTimeout(() => document.querySelector('#message-input')?.focus(), 20);
  });
  const scroll = document.querySelector('#messages-scroll');
  if (scroll) scroll.scrollTop = scroll.scrollHeight;
  refreshIcons();
}

function closeSidePanel() {
  sidePanel.classList.remove('is-open');
  sidePanel.setAttribute('aria-hidden','true');
  activeThreadId = null;
  if (!drawer.classList.contains('is-open')) scrim.hidden = true;
}

function openModal({ eyebrow='Margin', title='Dialog', html='', onMount=null }) {
  document.querySelector('#modal-eyebrow').textContent = eyebrow;
  document.querySelector('#modal-title').textContent = title;
  modalContent.innerHTML = html;
  if (!modal.open) modal.showModal();
  if (onMount) onMount();
  refreshIcons();
}

function closeModal() {
  if (modal.open) modal.close();
}

function bindCloseModalButtons() {
  modalContent.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeModal));
}

function resetUploadForm() {
  document.querySelector('#upload-form').reset();
  document.querySelector('#art-year').value = '2026';
  document.querySelector('#portfolio-toggle').checked = true;
  document.querySelector('#comments-toggle').checked = true;
  document.querySelector('#process-toggle').checked = true;
  uploadMedia = [];
  uploadCover = 0;
  editingProjectId = null;
  renderUploadMedia();
}

function openUpload(item = null, fromDraft = false) {
  closeSidePanel();
  resetUploadForm();

  if (item) {
    editingProjectId = item.id;
    uploadMedia = projectImages(item).slice();
    uploadCover = item.coverIndex || 0;
    document.querySelector('#upload-eyebrow').textContent = fromDraft ? 'Draft' : 'Edit project';
    document.querySelector('#upload-title').textContent = fromDraft ? 'Finish your draft' : 'Edit your work';
    document.querySelector('#publish-button').textContent = fromDraft ? 'Publish project' : 'Save changes';
    document.querySelector('#art-title').value = item.title || '';
    document.querySelector('#art-field').value = item.field || 'Illustration';
    document.querySelector('#art-description').value = item.description || '';
    document.querySelector('#art-tools').value = item.tools || '';
    document.querySelector('#art-year').value = item.year || '2026';
    document.querySelector('#art-tags').value = (item.tags || []).join(', ');
    document.querySelector('#art-rights').value = item.rights || '';
    document.querySelector('#portfolio-toggle').checked = item.portfolio !== false;
    document.querySelector('#comments-toggle').checked = item.comments !== false;
    document.querySelector('#process-toggle').checked = item.process !== false;
  } else {
    document.querySelector('#upload-eyebrow').textContent = 'New project';
    document.querySelector('#upload-title').textContent = 'Publish your work';
    document.querySelector('#publish-button').textContent = 'Publish project';
  }

  renderUploadMedia();
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden','false');
  scrim.hidden = false;
  document.body.classList.add('no-scroll');
  setTimeout(() => document.querySelector('#art-title')?.focus(), 90);
  refreshIcons();
}

function closeUpload() {
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden','true');
  if (!sidePanel.classList.contains('is-open')) scrim.hidden = true;
  document.body.classList.remove('no-scroll');
}

function renderUploadMedia() {
  const mediaWrap = document.querySelector('#upload-media');
  const primary = document.querySelector('#upload-primary');
  const thumbs = document.querySelector('#upload-thumbs');
  if (!uploadMedia.length) {
    mediaWrap.hidden = true;
    primary.innerHTML = '';
    thumbs.innerHTML = '';
    return;
  }
  uploadCover = Math.min(uploadCover, uploadMedia.length - 1);
  mediaWrap.hidden = false;
  primary.innerHTML = `<img src="${uploadMedia[uploadCover]}" alt="Project cover preview">`;
  thumbs.innerHTML = uploadMedia.map((src,index) => `
    <button type="button" class="upload-thumb ${index === uploadCover ? 'is-cover' : ''}" data-upload-cover="${index}" aria-label="Make image ${index + 1} the cover">
      <img src="${src}" alt="">
      <span class="remove-media" data-remove-media="${index}" aria-label="Remove image">${icon('x',11)}</span>
    </button>`).join('');
  thumbs.querySelectorAll('[data-upload-cover]').forEach(btn => btn.addEventListener('click', event => {
    if (event.target.closest('[data-remove-media]')) return;
    uploadCover = Number(btn.dataset.uploadCover);
    renderUploadMedia();
  }));
  thumbs.querySelectorAll('[data-remove-media]').forEach(btn => btn.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    const index = Number(btn.dataset.removeMedia);
    uploadMedia.splice(index,1);
    if (uploadCover >= uploadMedia.length) uploadCover = Math.max(0, uploadMedia.length - 1);
    renderUploadMedia();
  }));
  refreshIcons();
}

async function fileToDataURL(file) {
  if (!file.type.startsWith('image/')) throw new Error('not-image');
  if (file.size > 12 * 1024 * 1024) throw new Error('too-large');

  if (file.type === 'image/gif') {
    return await new Promise((resolve,reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const original = await new Promise((resolve,reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return await new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      const max = 1800;
      const scale = Math.min(1, max / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      context.drawImage(image,0,0,canvas.width,canvas.height);
      const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      resolve(canvas.toDataURL(mime, mime === 'image/jpeg' ? .84 : undefined));
    };
    image.onerror = () => resolve(original);
    image.src = original;
  });
}

async function addUploadFiles(fileList) {
  const existingCount = uploadMedia.length;
  const incomingCount = fileList.length;
  const files = [...fileList].slice(0, Math.max(0, 8 - existingCount));
  if (!files.length) {
    if (incomingCount) showToast('Projects can contain up to 8 images');
    return;
  }
  try {
    const encoded = [];
    for (const file of files) encoded.push(await fileToDataURL(file));
    uploadMedia.push(...encoded);
    renderUploadMedia();
    if (existingCount + incomingCount > 8) showToast('Projects can contain up to 8 images');
  } catch (error) {
    showToast(error.message === 'too-large' ? 'Each image must be under 12 MB' : 'Choose image files only');
  }
}

function formProjectSnapshot() {
  return {
    title:document.querySelector('#art-title').value.trim() || 'Untitled',
    field:document.querySelector('#art-field').value,
    description:document.querySelector('#art-description').value.trim(),
    tools:document.querySelector('#art-tools').value.trim(),
    year:document.querySelector('#art-year').value.trim() || '2026',
    tags:document.querySelector('#art-tags').value.split(',').map(tag => tag.trim()).filter(Boolean).slice(0,12),
    rights:document.querySelector('#art-rights').value.trim() || '© ' + state.profile.name + '. All rights reserved.',
    portfolio:document.querySelector('#portfolio-toggle').checked,
    comments:document.querySelector('#comments-toggle').checked,
    process:document.querySelector('#process-toggle').checked,
    images:uploadMedia.slice(),
    coverIndex:uploadCover
  };
}

function saveDraft() {
  const snapshot = formProjectSnapshot();
  const existingDraftIndex = state.drafts.findIndex(item => item.id === editingProjectId);
  const draft = {
    ...snapshot,
    id: existingDraftIndex >= 0 ? editingProjectId : 'draft-' + Date.now(),
    artist:state.profile.name,
    artistId:'me',
    likes:0,
    updatedAt:new Date().toISOString()
  };
  if (existingDraftIndex >= 0) state.drafts.splice(existingDraftIndex,1,draft);
  else state.drafts.unshift(draft);
  persist();
  editingProjectId = draft.id;
  showToast('Draft saved');
}

function publishProject(event) {
  event.preventDefault();
  if (!uploadMedia.length) {
    showToast('Add at least one image first');
    return;
  }
  const snapshot = formProjectSnapshot();
  const isExistingProject = String(editingProjectId || '').startsWith('local-');
  const isDraft = String(editingProjectId || '').startsWith('draft-');
  const id = isExistingProject ? editingProjectId : 'local-' + Date.now();
  const project = {
    ...snapshot,
    id,
    artist:state.profile.name,
    artistId:'me',
    likes:isExistingProject ? (state.uploads.find(item => item.id === id)?.likes || 0) : 0,
    featured:82,
    publishedAt:new Date().toISOString()
  };

  if (isExistingProject) {
    const index = state.uploads.findIndex(item => item.id === id);
    if (index >= 0) state.uploads.splice(index,1,project);
  } else {
    state.uploads.unshift(project);
  }
  if (isDraft) state.drafts = state.drafts.filter(item => item.id !== editingProjectId);

  const persisted = persist();
  closeUpload();
  state.profileTab = 'portfolio';
  location.hash = 'profile';
  renderRoute();
  showToast(isExistingProject ? 'Project updated' : 'Project published');
}

function openCollectionFromProject() {
  if (currentProjectId) openAddToCollection(currentProjectId);
}

function openSidePanelScrimClose() {
  if (sidePanel.classList.contains('is-open')) closeSidePanel();
  if (drawer.classList.contains('is-open')) closeUpload();
}

function initializeGlobalEvents() {
  window.addEventListener('hashchange', () => {
    if (location.hash.startsWith('#project/')) {
      const id = location.hash.split('/')[1];
      history.replaceState(null,'',location.pathname + '#explore');
      renderRoute();
      openArtwork(id);
      return;
    }
    renderRoute();
    window.scrollTo({ top:0, behavior:'smooth' });
  });

  searchInput.addEventListener('input', event => {
    state.search = event.target.value;
    if (state.route !== 'explore') {
      location.hash = 'explore';
    } else {
      renderExplore();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
      event.preventDefault();
      searchInput.focus();
    }
    if (event.key === 'Escape' && drawer.classList.contains('is-open')) closeUpload();
    if (event.key === 'Escape' && sidePanel.classList.contains('is-open')) closeSidePanel();
  });

  document.querySelector('#upload-button').addEventListener('click', () => openUpload());
  document.querySelector('#mobile-upload').addEventListener('click', () => openUpload());
  document.querySelector('#notifications-button').addEventListener('click', openNotifications);
  document.querySelector('#messages-button').addEventListener('click', () => openMessages());
  document.querySelector('#close-side-panel').addEventListener('click', closeSidePanel);
  document.querySelector('#close-upload').addEventListener('click', closeUpload);
  document.querySelector('#dialog-close').addEventListener('click', closeArtwork);
  document.querySelector('#modal-close').addEventListener('click', closeModal);
  scrim.addEventListener('click', openSidePanelScrimClose);

  artDialog.addEventListener('close', () => {
    currentProjectId = null;
    document.body.classList.remove('no-scroll');
  });
  artDialog.addEventListener('click', event => {
    if (event.target === artDialog) closeArtwork();
  });
  modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });

  const fileInput = document.querySelector('#art-file');
  const dropZone = document.querySelector('#drop-zone');
  fileInput.addEventListener('change', () => addUploadFiles(fileInput.files));
  ['dragenter','dragover'].forEach(name => dropZone.addEventListener(name, event => {
    event.preventDefault();
    dropZone.classList.add('is-dragging');
  }));
  ['dragleave','drop'].forEach(name => dropZone.addEventListener(name, event => {
    event.preventDefault();
    dropZone.classList.remove('is-dragging');
  }));
  dropZone.addEventListener('drop', event => addUploadFiles(event.dataTransfer.files));

  document.querySelector('#save-draft').addEventListener('click', saveDraft);
  document.querySelector('#upload-form').addEventListener('submit', publishProject);
}

initializeGlobalEvents();
updateBadges();
const initialProjectMatch = location.hash.match(/^#project\/(.+)$/);
if (initialProjectMatch) {
  history.replaceState(null,'',location.pathname + '#explore');
  renderRoute();
  openArtwork(initialProjectMatch[1]);
} else {
  renderRoute();
}
refreshIcons();