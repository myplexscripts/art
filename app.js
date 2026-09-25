const STORAGE = {
  state: 'tombbound.state',
  posts: 'tombbound.posts',
  comments: 'tombbound.comments'
};

const readLocal = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
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

const members = [
  {
    id:'mara', name:'Mara Chen', handle:'@artifactmara', avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=84',
    level:18, points:4380, title:'Relic Hunter'
  },
  {
    id:'jonah', name:'Jonah Reed', handle:'@dualpisces', avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=180&q=84',
    level:12, points:2860, title:'Pathfinder'
  },
  {
    id:'noor', name:'Noor Bell', handle:'@noorcroft', avatar:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=84',
    level:24, points:6220, title:'Master Explorer'
  },
  {
    id:'sora', name:'Sora Vale', handle:'@savecrystal', avatar:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=180&q=84',
    level:9, points:1975, title:'Trailblazer'
  }
];

const games = [
  {
    id:'tr1', title:'Tomb Raider', year:'1996', era:'Classic', location:'Peru, Greece, Egypt, Atlantis',
    image:'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=86',
    description:'The original expedition. Isolation, platforming, impossible architecture, and the hunt for the Scion.',
    community:18420, rating:4.7, tags:['Classic','Scion','Secrets']
  },
  {
    id:'tr2', title:'Tomb Raider II', year:'1997', era:'Classic', location:'China, Venice, Tibet',
    image:'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=86',
    description:'A globe-spanning hunt for the Dagger of Xian, from Venice canals to the Great Wall and floating islands.',
    community:16110, rating:4.8, tags:['Classic','Dagger of Xian','Venice']
  },
  {
    id:'tr4', title:'The Last Revelation', year:'1999', era:'Classic', location:'Egypt',
    image:'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=86',
    description:'A denser, interconnected expedition through Egypt built around ruins, mythology, and long-form puzzle solving.',
    community:12880, rating:4.6, tags:['Classic','Egypt','Horus']
  },
  {
    id:'legend', title:'Tomb Raider: Legend', year:'2006', era:'Legend', location:'Bolivia, Peru, Japan, Ghana',
    image:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=86',
    description:'A fast-moving global adventure that reintroduced Lara with a stronger emphasis on cinematic traversal.',
    community:14520, rating:4.5, tags:['Legend Era','Excalibur','Croft Manor']
  },
  {
    id:'underworld', title:'Tomb Raider: Underworld', year:'2008', era:'Legend', location:'Mediterranean, Thailand, Mexico, Arctic',
    image:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=86',
    description:'Large environments, mythic ruins, and a darker journey built around Helheim, Thor, and Natla.',
    community:13940, rating:4.4, tags:['Legend Era','Mjolnir','Thailand']
  },
  {
    id:'tr2013', title:'Tomb Raider', year:'2013', era:'Survivor', location:'Yamatai',
    image:'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=86',
    description:'A survival-focused origin story set across the storm-bound island of Yamatai.',
    community:22610, rating:4.6, tags:['Survivor','Yamatai','Origins']
  },
  {
    id:'rise', title:'Rise of the Tomb Raider', year:'2015', era:'Survivor', location:'Siberia, Syria',
    image:'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1200&q=86',
    description:'Frozen wilderness, challenge tombs, and the search for the Divine Source in Kitezh.',
    community:23980, rating:4.8, tags:['Survivor','Kitezh','Siberia']
  },
  {
    id:'shadow', title:'Shadow of the Tomb Raider', year:'2018', era:'Survivor', location:'Mexico, Peru',
    image:'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=86',
    description:'Jungle traversal, elaborate tombs, and a journey through Paititi at the end of the Survivor trilogy.',
    community:20140, rating:4.5, tags:['Survivor','Paititi','Peru']
  }
];

const lore = [
  { id:'scion', title:'The Scion of Atlantis', type:'Artifact', gameId:'tr1', icon:'gem', summary:'Three pieces, three rulers, and one of the series defining artifacts.' },
  { id:'dagger', title:'The Dagger of Xian', type:'Artifact', gameId:'tr2', icon:'swords', summary:'A legendary dagger said to grant the power of the dragon to whoever plunges it into their heart.' },
  { id:'horus', title:'The Amulet of Horus', type:'Artifact', gameId:'tr4', icon:'sun', summary:'An ancient key to the mythology that drives Lara through The Last Revelation.' },
  { id:'croft-manor', title:'Croft Manor', type:'Location', gameId:'legend', icon:'castle', summary:'Home, training ground, puzzle box, and one of the most loved recurring locations in the series.' },
  { id:'mjolnir', title:'Mjolnir', type:'Artifact', gameId:'underworld', icon:'hammer', summary:'Thor’s hammer becomes both archaeological objective and overwhelming tool in Underworld.' },
  { id:'yamatai', title:'Yamatai', type:'Location', gameId:'tr2013', icon:'map', summary:'The storm-locked island where the Survivor era begins.' },
  { id:'kitezh', title:'Kitezh', type:'Location', gameId:'rise', icon:'mountain-snow', summary:'The lost city at the centre of Rise of the Tomb Raider and the search for immortality.' },
  { id:'paititi', title:'Paititi', type:'Location', gameId:'shadow', icon:'landmark', summary:'A hidden city whose history anchors much of Shadow of the Tomb Raider.' }
];

const challenges = [
  {
    id:'classic-secrets', title:'Classic Secrets Week', icon:'key-round', points:250,
    description:'Find and log five secrets from any Classic era game this week.', progress:3, goal:5, joined:true
  },
  {
    id:'no-medpack', title:'No Medpack Run', icon:'heart-pulse', points:400,
    description:'Finish any full level without using a medpack.', progress:0, goal:1, joined:false
  },
  {
    id:'manor-quiz', title:'Croft Manor Scholar', icon:'brain', points:120,
    description:'Complete the community Croft Manor trivia set.', progress:7, goal:10, joined:true
  }
];

const defaultPosts = [
  {
    id:'p1', memberId:'mara', type:'Discovery', gameId:'tr4', title:'The Last Revelation still has the best sense of place',
    body:'Replaying Karnak made me realize how much I miss interconnected spaces that slowly reveal how they fit together. The backtracking feels purposeful instead of padded.',
    image:'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=86',
    tags:['replay','egypt','level design'], likes:186, comments:34, time:'18m'
  },
  {
    id:'p2', memberId:'jonah', type:'Discussion', gameId:'legend', title:'Which version of Croft Manor do you return to the most?',
    body:'Legend is still mine. It feels compact enough to know by heart, but there is always something satisfying about running the assault course and poking around the library.',
    image:'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=86',
    tags:['croft manor','discussion'], likes:121, comments:61, time:'42m'
  },
  {
    id:'p3', memberId:'noor', type:'Discovery', gameId:'rise', title:'A tiny environmental detail I missed for years',
    body:'The way the snow compresses around certain traversal paths in Rise subtly points you toward climbable routes. It is much easier to notice when you replay without survival instincts.',
    image:'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1200&q=86',
    tags:['rise','details','siberia'], likes:274, comments:29, time:'1h'
  },
  {
    id:'p4', memberId:'sora', type:'Collection', gameId:'tr2', title:'My five favourite impossible Tomb Raider spaces',
    body:'Floating Islands is obviously here, but I also included Palace Midas because it feels like architecture designed by a dream rather than a civilization.',
    image:'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=86',
    tags:['classic','levels','collection'], likes:199, comments:45, time:'2h'
  }
];

const collections = [
  { id:'c1', title:'Tombs I never get tired of', count:12, icon:'landmark', images:[games[7].image,games[6].image,games[2].image] },
  { id:'c2', title:'Best puzzle rooms', count:18, icon:'puzzle', images:[games[0].image,games[4].image,games[1].image] },
  { id:'c3', title:'Favourite locations', count:24, icon:'map-pinned', images:[games[5].image,games[7].image,games[3].image] },
  { id:'c4', title:'Classic replay list', count:5, icon:'rotate-ccw', images:[games[0].image,games[1].image,games[2].image] }
];

const initial = readLocal(STORAGE.state, {});
const state = {
  route:'home',
  routeId:null,
  points:initial.points ?? 1240,
  level:initial.level ?? 8,
  liked:new Set(initial.liked || ['p3']),
  saved:new Set(initial.saved || ['p1','scion']),
  following:new Set(initial.following || ['mara','noor']),
  completed:new Set(initial.completed || ['tr1','legend','tr2013']),
  playing:new Set(initial.playing || ['tr4']),
  joinedChallenges:new Set(initial.joinedChallenges || ['classic-secrets','manor-quiz']),
  notificationsRead:initial.notificationsRead || false,
  search:'',
  communityFilter:'All'
};

let posts = [...readLocal(STORAGE.posts, []), ...defaultPosts];
const comments = readLocal(STORAGE.comments, {
  p1:[
    { id:'cm1', name:'Noor Bell', body:'Karnak is exactly the level I use when I explain this to people.', time:'8m' },
    { id:'cm2', name:'Sora Vale', body:'The spatial memory it asks from you is so different from the newer games.', time:'4m' }
  ],
  p2:[
    { id:'cm3', name:'Mara Chen', body:'Anniversary manor for me. The music alone gets me.', time:'22m' }
  ]
});

const main = document.querySelector('#main');
const createModal = document.querySelector('#create-modal');
const detailModal = document.querySelector('#detail-modal');
const notificationsSheet = document.querySelector('#notifications-sheet');
const notificationsContent = document.querySelector('#notifications-content');
const scrim = document.querySelector('#scrim');
const toast = document.querySelector('#toast');
const searchInput = document.querySelector('#global-search');
const headerPoints = document.querySelector('#header-points');

let currentPostType = 'Discovery';
let toastTimer;

function persist() {
  writeLocal(STORAGE.state, {
    points:state.points,
    level:state.level,
    liked:[...state.liked],
    saved:[...state.saved],
    following:[...state.following],
    completed:[...state.completed],
    playing:[...state.playing],
    joinedChallenges:[...state.joinedChallenges],
    notificationsRead:state.notificationsRead
  });
  writeLocal(STORAGE.posts, posts.filter(post => post.memberId === 'self'));
  writeLocal(STORAGE.comments, comments);
  updateHeader();
}

function updateHeader() {
  headerPoints.textContent = state.points.toLocaleString();
  document.querySelector('#notification-dot').hidden = state.notificationsRead;
}

function addPoints(amount, reason) {
  state.points += amount;
  state.level = Math.max(state.level, Math.floor(state.points / 500) + 1);
  persist();
  showToast(`+${amount} XP · ${reason}`);
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2100);
}

function icon(name, size=18) {
  return `<i data-lucide="${name}" style="width:${size}px;height:${size}px" aria-hidden="true"></i>`;
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function escapeHTML(value='') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
  }[char]));
}

function memberById(id) {
  if (id === 'self') return { id:'self', name:'David Vale', handle:'@davidraids', avatar:'', level:state.level, points:state.points, title:'Pathfinder' };
  return members.find(member => member.id === id);
}

function gameById(id) {
  return games.find(game => game.id === id);
}

function parseRoute() {
  const raw = location.hash.replace(/^#/,'') || 'home';
  const [route,id] = raw.split('/');
  const valid = ['home','games','lore','community','collections','profile'];
  state.route = valid.includes(route) ? route : 'home';
  state.routeId = id || null;
}

function syncNavigation() {
  document.querySelectorAll('[data-nav]').forEach(link => link.classList.toggle('is-active', link.dataset.nav === state.route));
  document.querySelectorAll('[data-mobile-nav]').forEach(link => link.classList.toggle('is-active', link.dataset.mobileNav === state.route));
}

function renderRoute() {
  parseRoute();
  syncNavigation();
  if (state.route === 'home') renderHome();
  if (state.route === 'games') renderGames();
  if (state.route === 'lore') renderLore();
  if (state.route === 'community') renderCommunity();
  if (state.route === 'collections') renderCollections();
  if (state.route === 'profile') renderProfile();
  refreshIcons();
}

function renderHome() {
  const feed = filteredPosts().slice(0,3);
  const current = gameById('tr4');

  main.innerHTML = `
    <div class="page home-page">
      <section class="hero-panel panel">
        <img class="hero-image" src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1800&q=88" alt="">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <span class="hero-kicker">${icon('compass',17)} Community expedition</span>
          <h1>Raid. Remember. Rediscover.</h1>
          <p>A social home for Tomb Raider fans to replay the series, compare discoveries, collect lore, and keep the old secrets alive.</p>
          <div class="hero-actions">
            <a class="primary-button" href="#community">${icon('users',17)} <span>Enter community</span></a>
            <a class="glass-button" href="#games">${icon('gamepad-2',17)} <span>Explore the series</span></a>
          </div>
        </div>
        <div class="hero-status glass-card">
          <span class="section-label">Your expedition</span>
          <div class="hero-status-title">
            <span class="game-mini-cover"><img src="${current.image}" alt=""></span>
            <div><strong>${current.title}</strong><span>Classic era replay</span></div>
          </div>
          <div class="progress-row"><span>Secrets logged</span><strong>12 / 70</strong></div>
          <div class="progress-track"><span style="width:17%"></span></div>
          <button class="glass-button compact" data-open-game="${current.id}">${icon('arrow-right',16)} <span>Continue</span></button>
        </div>
      </section>

      <section class="dashboard-grid">
        <div class="dashboard-main">
          <div class="section-heading">
            <div><span class="section-label">Community</span><h2>From the expedition log</h2></div>
            <a href="#community">See all ${icon('arrow-right',16)}</a>
          </div>
          <div class="post-stack">
            ${feed.map(postCard).join('')}
          </div>
        </div>

        <aside class="dashboard-side">
          <section class="side-panel-card panel">
            <div class="section-heading compact-heading">
              <div><span class="section-label">Challenge</span><h2>Earn XP</h2></div>
            </div>
            ${challengeCard(challenges[0], true)}
          </section>

          <section class="side-panel-card panel">
            <div class="section-heading compact-heading">
              <div><span class="section-label">Trending</span><h2>Discussions</h2></div>
            </div>
            <div class="discussion-list">
              ${posts.filter(p => p.type === 'Discussion').concat(posts).slice(0,3).map((post,index) => `
                <button class="discussion-row" data-open-post="${post.id}">
                  <span class="rank">${String(index+1).padStart(2,'0')}</span>
                  <span><strong>${escapeHTML(post.title)}</strong><small>${post.comments} replies</small></span>
                  ${icon('chevron-right',17)}
                </button>`).join('')}
            </div>
          </section>
        </aside>
      </section>

      <section class="series-section">
        <div class="section-heading">
          <div><span class="section-label">Series</span><h2>Choose an era</h2></div>
          <a href="#games">All games ${icon('arrow-right',16)}</a>
        </div>
        <div class="game-scroll">
          ${games.slice(0,6).map(gameCard).join('')}
        </div>
      </section>

      <section class="members-panel panel">
        <div class="members-copy">
          <span class="section-label">People to follow</span>
          <h2>Find your kind of raider.</h2>
          <p>Follow people whose replays, theories, collections, and impossible level opinions you want in your feed.</p>
        </div>
        <div class="member-grid">
          ${members.map(memberCard).join('')}
        </div>
      </section>
    </div>
  `;

  bindCommonEvents();
}

function renderGames() {
  main.innerHTML = `
    <div class="page">
      <header class="page-header">
        <div>
          <span class="section-label">Series archive</span>
          <h1 class="page-title">Games</h1>
          <p class="page-subtitle">Track what you are playing, mark completions, revisit locations, and jump into community discussion for each era.</p>
        </div>
        <div class="segmented-control" id="era-filter">
          <button class="is-active" data-era="All">All</button>
          <button data-era="Classic">Classic</button>
          <button data-era="Legend">Legend</button>
          <button data-era="Survivor">Survivor</button>
        </div>
      </header>
      <div class="game-library" id="game-library">
        ${games.map(gameLibraryCard).join('')}
      </div>
    </div>
  `;

  document.querySelectorAll('[data-era]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-era]').forEach(btn => btn.classList.remove('is-active'));
    button.classList.add('is-active');
    const era = button.dataset.era;
    document.querySelectorAll('[data-game-era]').forEach(card => {
      card.hidden = era !== 'All' && card.dataset.gameEra !== era;
    });
  }));

  bindCommonEvents();
}

function renderLore() {
  main.innerHTML = `
    <div class="page">
      <header class="page-header split-header">
        <div>
          <span class="section-label">Field notes</span>
          <h1 class="page-title">Lore & relics</h1>
          <p class="page-subtitle">Artifacts, places, myths, and recurring pieces of Tomb Raider history collected into one community reference.</p>
        </div>
        <div class="lore-stat panel">
          ${icon('book-open',22)}
          <div><strong>${lore.length}</strong><span>community entries</span></div>
        </div>
      </header>

      <section class="lore-feature panel">
        <div class="lore-feature-copy">
          <span class="section-label">Featured entry</span>
          <h2>The Scion of Atlantis</h2>
          <p>Few objects define Tomb Raider as clearly as the Scion. Trace its pieces, guardians, locations, and the community theories that still orbit it.</p>
          <button class="primary-button" data-open-lore="scion">${icon('book-open',17)} <span>Open entry</span></button>
        </div>
        <div class="artifact-orbit" aria-hidden="true">
          <div class="artifact-core">${icon('gem',48)}</div>
          <span class="orbit orbit-one"></span>
          <span class="orbit orbit-two"></span>
        </div>
      </section>

      <div class="section-heading">
        <div><span class="section-label">Browse</span><h2>Community archive</h2></div>
      </div>

      <div class="lore-grid">
        ${lore.map(loreCard).join('')}
      </div>
    </div>
  `;

  bindCommonEvents();
}

function renderCommunity() {
  const filters = ['All','Discovery','Discussion','Collection'];
  const feed = filteredPosts();

  main.innerHTML = `
    <div class="page community-page">
      <header class="page-header community-header">
        <div>
          <span class="section-label">Social</span>
          <h1 class="page-title">Community</h1>
          <p class="page-subtitle">Discoveries, replay notes, theories, collections, and conversations from people still combing every corner of the series.</p>
        </div>
        <button class="primary-button" id="community-create">${icon('plus',17)} <span>New post</span></button>
      </header>

      <div class="community-layout">
        <section class="community-feed">
          <div class="feed-toolbar panel">
            <div class="segmented-control">
              ${filters.map(filter => `<button class="${state.communityFilter===filter?'is-active':''}" data-community-filter="${filter}">${filter}</button>`).join('')}
            </div>
            <span>${feed.length} posts</span>
          </div>
          <div class="post-stack">
            ${feed.map(postCard).join('')}
          </div>
        </section>

        <aside class="community-rail">
          <section class="rail-card panel">
            <span class="section-label">Your standing</span>
            <div class="rank-card">
              <div class="rank-icon">${icon('shield',26)}</div>
              <div><strong>Level ${state.level}</strong><span>Pathfinder · ${state.points.toLocaleString()} XP</span></div>
            </div>
            <div class="progress-row"><span>Next level</span><strong>${state.points % 500} / 500 XP</strong></div>
            <div class="progress-track"><span style="width:${Math.min(100,(state.points%500)/5)}%"></span></div>
          </section>

          <section class="rail-card panel">
            <div class="section-heading compact-heading">
              <div><span class="section-label">Challenges</span><h2>Active</h2></div>
            </div>
            <div class="challenge-list">
              ${challenges.slice(0,3).map(ch => challengeCard(ch,false)).join('')}
            </div>
          </section>

          <section class="rail-card panel">
            <span class="section-label">Members</span>
            <div class="mini-members">
              ${members.map(member => `<button data-member="${member.id}"><span class="avatar"><img src="${member.avatar}" alt=""></span><span><strong>${member.name}</strong><small>Level ${member.level} · ${member.title}</small></span></button>`).join('')}
            </div>
          </section>
        </aside>
      </div>
    </div>
  `;

  document.querySelector('#community-create').addEventListener('click', openComposer);
  document.querySelectorAll('[data-community-filter]').forEach(button => button.addEventListener('click', () => {
    state.communityFilter = button.dataset.communityFilter;
    renderCommunity();
  }));

  bindCommonEvents();
}

function renderCollections() {
  main.innerHTML = `
    <div class="page">
      <header class="page-header">
        <div>
          <span class="section-label">Your archive</span>
          <h1 class="page-title">Collections</h1>
          <p class="page-subtitle">Keep favourite levels, lore entries, places, posts, and replay ideas together without turning the site into a spreadsheet.</p>
        </div>
        <button class="primary-button" id="new-collection">${icon('plus',17)} <span>New collection</span></button>
      </header>

      <div class="collection-grid">
        ${collections.map(collectionCard).join('')}
      </div>

      <div class="section-heading collection-saved-head">
        <div><span class="section-label">Quick saves</span><h2>Saved for later</h2></div>
      </div>
      <div class="saved-grid">
        ${savedItemsHTML()}
      </div>
    </div>
  `;

  document.querySelector('#new-collection').addEventListener('click', () => showToast('Collection creation is ready for the backend layer'));
  bindCommonEvents();
}

function renderProfile() {
  const self = memberById('self');
  const ownPosts = posts.filter(post => post.memberId === 'self');
  const completed = games.filter(game => state.completed.has(game.id));

  main.innerHTML = `
    <div class="page profile-page">
      <section class="profile-hero panel">
        <div class="profile-identity">
          <span class="avatar avatar-profile avatar-self">DV</span>
          <div>
            <span class="section-label">Member profile</span>
            <h1>David Vale</h1>
            <p>@davidraids · Pathfinder</p>
          </div>
        </div>
        <p class="profile-bio">Classic-era puzzle enjoyer, Croft Manor tourist, and habitual secret-room checker. Currently replaying The Last Revelation.</p>
        <div class="profile-actions-row">
          <button class="secondary-button">${icon('pencil',16)} <span>Edit profile</span></button>
          <button class="primary-button" id="profile-post">${icon('plus',16)} <span>Post</span></button>
        </div>
        <div class="profile-metrics">
          <div><strong>${state.points.toLocaleString()}</strong><span>Expedition XP</span></div>
          <div><strong>${state.level}</strong><span>Level</span></div>
          <div><strong>${completed.length}</strong><span>Games completed</span></div>
          <div><strong>${state.saved.size}</strong><span>Saved</span></div>
        </div>
      </section>

      <div class="profile-layout">
        <section>
          <div class="section-heading">
            <div><span class="section-label">Shelf</span><h2>Completed games</h2></div>
          </div>
          <div class="profile-game-grid">
            ${completed.length ? completed.map(game => `<button class="profile-game card" data-open-game="${game.id}"><img src="${game.image}" alt=""><span><strong>${game.title}</strong><small>${game.year}</small></span>${icon('circle-check',20)}</button>`).join('') : '<div class="empty-state">No completed games yet.</div>'}
          </div>

          <div class="section-heading">
            <div><span class="section-label">Activity</span><h2>Your posts</h2></div>
          </div>
          <div class="post-stack">
            ${ownPosts.length ? ownPosts.map(postCard).join('') : `<div class="empty-state panel"><strong>No posts yet</strong><span>Your discoveries and discussions will appear here.</span><button class="primary-button" id="empty-post">${icon('plus',16)} <span>Share something</span></button></div>`}
          </div>
        </section>

        <aside class="profile-rail">
          <section class="rail-card panel">
            <span class="section-label">Badges</span>
            <div class="badge-grid">
              ${badge('First Steps','footprints','Completed your first game')}
              ${badge('Secret Keeper','key-round','Logged 10 secrets')}
              ${badge('Manor Guest','castle','Completed a Croft Manor challenge')}
              ${badge('Pathfinder','compass','Reached level 8')}
            </div>
          </section>

          <section class="rail-card panel">
            <span class="section-label">Following</span>
            <div class="mini-members">
              ${members.filter(m => state.following.has(m.id)).map(member => `<button data-member="${member.id}"><span class="avatar"><img src="${member.avatar}" alt=""></span><span><strong>${member.name}</strong><small>${member.handle}</small></span></button>`).join('')}
            </div>
          </section>
        </aside>
      </div>
    </div>
  `;

  document.querySelector('#profile-post')?.addEventListener('click', openComposer);
  document.querySelector('#empty-post')?.addEventListener('click', openComposer);
  bindCommonEvents();
}

function filteredPosts() {
  let result = [...posts];
  if (state.communityFilter !== 'All') result = result.filter(post => post.type === state.communityFilter);
  if (state.search.trim()) {
    const q = state.search.trim().toLowerCase();
    result = result.filter(post => [post.title,post.body,...(post.tags||[])].join(' ').toLowerCase().includes(q));
  }
  return result;
}

function postCard(post) {
  const member = memberById(post.memberId);
  const game = gameById(post.gameId);
  const liked = state.liked.has(post.id);
  const saved = state.saved.has(post.id);

  return `<article class="social-post panel">
    <div class="post-header">
      <button class="member-chip" data-member="${member.id}">
        <span class="avatar">${member.avatar ? `<img src="${member.avatar}" alt="">` : 'DV'}</span>
        <span><strong>${member.name}</strong><small>${member.handle} · ${post.time || 'now'}</small></span>
      </button>
      <span class="post-type">${icon(post.type==='Discussion'?'message-circle':post.type==='Collection'?'archive':'compass',15)} ${post.type}</span>
    </div>
    <button class="post-body" data-open-post="${post.id}">
      <span class="post-copy">
        <strong>${escapeHTML(post.title)}</strong>
        <span>${escapeHTML(post.body)}</span>
      </span>
      ${post.image ? `<img src="${post.image}" alt="">` : ''}
    </button>
    <div class="post-context">
      <span>${icon('gamepad-2',15)} ${escapeHTML(game?.title || 'General')}</span>
      ${(post.tags||[]).slice(0,3).map(tag => `<span>#${escapeHTML(tag)}</span>`).join('')}
    </div>
    <div class="post-actions">
      <button class="${liked?'is-active':''}" data-like-post="${post.id}">${icon('heart',17)} <span>${post.likes + (liked?1:0)}</span></button>
      <button data-open-post="${post.id}">${icon('message-circle',17)} <span>${post.comments}</span></button>
      <button class="${saved?'is-active':''}" data-save-post="${post.id}">${icon(saved?'bookmark-check':'bookmark',17)} <span>${saved?'Saved':'Save'}</span></button>
    </div>
  </article>`;
}

function gameCard(game) {
  return `<button class="game-card" data-open-game="${game.id}">
    <img src="${game.image}" alt="">
    <span class="game-card-overlay"></span>
    <span class="game-card-copy"><small>${game.era} · ${game.year}</small><strong>${game.title}</strong><span>${icon('users',15)} ${game.community.toLocaleString()}</span></span>
  </button>`;
}

function gameLibraryCard(game) {
  const completed = state.completed.has(game.id);
  const playing = state.playing.has(game.id);
  return `<article class="library-card panel" data-game-era="${game.era}">
    <button class="library-cover" data-open-game="${game.id}"><img src="${game.image}" alt=""></button>
    <div class="library-copy">
      <div class="library-title-row"><div><span class="section-label">${game.era} · ${game.year}</span><h2>${game.title}</h2></div><span class="rating">${icon('star',16)} ${game.rating}</span></div>
      <p>${game.description}</p>
      <div class="tag-row">${game.tags.map(tag=>`<span>${tag}</span>`).join('')}</div>
      <div class="library-footer">
        <span>${icon('map-pin',16)} ${game.location}</span>
        <span>${icon('users',16)} ${game.community.toLocaleString()} members</span>
      </div>
      <div class="library-actions">
        <button class="secondary-button ${playing?'is-selected':''}" data-toggle-playing="${game.id}">${icon('play',16)} <span>${playing?'Playing':'Play next'}</span></button>
        <button class="secondary-button ${completed?'is-selected':''}" data-toggle-completed="${game.id}">${icon('circle-check',16)} <span>${completed?'Completed':'Mark complete'}</span></button>
        <button class="icon-button" data-open-game="${game.id}" aria-label="More about ${game.title}">${icon('chevron-right',18)}</button>
      </div>
    </div>
  </article>`;
}

function loreCard(entry) {
  const game = gameById(entry.gameId);
  const saved = state.saved.has(entry.id);
  return `<article class="lore-card panel">
    <div class="lore-icon">${icon(entry.icon,25)}</div>
    <span class="section-label">${entry.type}</span>
    <h3>${entry.title}</h3>
    <p>${entry.summary}</p>
    <div class="lore-footer">
      <span>${game?.title || ''}</span>
      <div>
        <button class="icon-button ${saved?'is-selected':''}" data-save-lore="${entry.id}" aria-label="Save entry">${icon(saved?'bookmark-check':'bookmark',17)}</button>
        <button class="icon-button" data-open-lore="${entry.id}" aria-label="Open entry">${icon('arrow-up-right',17)}</button>
      </div>
    </div>
  </article>`;
}

function challengeCard(challenge, large=false) {
  const joined = state.joinedChallenges.has(challenge.id);
  return `<div class="challenge-card ${large?'challenge-large':''}">
    <div class="challenge-top">
      <span class="challenge-icon">${icon(challenge.icon,20)}</span>
      <span class="xp-chip">+${challenge.points} XP</span>
    </div>
    <strong>${challenge.title}</strong>
    <p>${challenge.description}</p>
    ${joined ? `<div class="progress-row"><span>Progress</span><strong>${challenge.progress} / ${challenge.goal}</strong></div><div class="progress-track"><span style="width:${Math.min(100,(challenge.progress/challenge.goal)*100)}%"></span></div>` : ''}
    <button class="${joined?'secondary-button':'primary-button'} compact" data-toggle-challenge="${challenge.id}">${icon(joined?'circle-check':'plus',16)} <span>${joined?'Joined':'Join challenge'}</span></button>
  </div>`;
}

function memberCard(member) {
  const following = state.following.has(member.id);
  return `<article class="member-card">
    <button class="member-card-main" data-member="${member.id}">
      <span class="avatar avatar-large"><img src="${member.avatar}" alt=""></span>
      <span><strong>${member.name}</strong><small>${member.handle}</small><small>Level ${member.level} · ${member.title}</small></span>
    </button>
    <button class="follow-button ${following?'is-following':''}" data-follow="${member.id}">${following?'Following':'Follow'}</button>
  </article>`;
}

function collectionCard(collection) {
  return `<article class="collection-card panel">
    <button class="collection-preview">
      <img src="${collection.images[0]}" alt="">
      <div class="collection-side-images"><img src="${collection.images[1]}" alt=""><img src="${collection.images[2]}" alt=""></div>
    </button>
    <div class="collection-info">
      <span class="collection-icon">${icon(collection.icon,18)}</span>
      <div><strong>${collection.title}</strong><small>${collection.count} items</small></div>
      ${icon('chevron-right',18)}
    </div>
  </article>`;
}

function badge(title, iconName, description) {
  return `<div class="badge-card"><span>${icon(iconName,21)}</span><strong>${title}</strong><small>${description}</small></div>`;
}

function savedItemsHTML() {
  const savedLore = lore.filter(item => state.saved.has(item.id)).slice(0,3);
  const savedPosts = posts.filter(item => state.saved.has(item.id)).slice(0,3);
  const items = [
    ...savedLore.map(item => ({title:item.title, meta:item.type, icon:item.icon, id:item.id, kind:'lore'})),
    ...savedPosts.map(item => ({title:item.title, meta:item.type, icon:'message-square-text', id:item.id, kind:'post'}))
  ];
  if (!items.length) return `<div class="empty-state panel"><strong>Nothing saved yet</strong><span>Use the bookmark button on posts and lore entries.</span></div>`;
  return items.map(item => `<button class="saved-item card" data-open-${item.kind}="${item.id}"><span class="saved-icon">${icon(item.icon,21)}</span><span><strong>${item.title}</strong><small>${item.meta}</small></span>${icon('chevron-right',18)}</button>`).join('');
}

function bindCommonEvents() {
  document.querySelectorAll('[data-open-game]').forEach(button => button.addEventListener('click', () => openGame(button.dataset.openGame)));
  document.querySelectorAll('[data-open-post]').forEach(button => button.addEventListener('click', () => openPost(button.dataset.openPost)));
  document.querySelectorAll('[data-open-lore]').forEach(button => button.addEventListener('click', () => openLore(button.dataset.openLore)));

  document.querySelectorAll('[data-like-post]').forEach(button => button.addEventListener('click', event => {
    event.stopPropagation();
    const id = button.dataset.likePost;
    if (state.liked.has(id)) {
      state.liked.delete(id);
      persist();
      renderRoute();
    } else {
      state.liked.add(id);
      addPoints(5,'Community appreciation');
      renderRoute();
    }
  }));

  document.querySelectorAll('[data-save-post]').forEach(button => button.addEventListener('click', event => {
    event.stopPropagation();
    const id = button.dataset.savePost;
    state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id);
    persist();
    renderRoute();
    showToast(state.saved.has(id) ? 'Saved to your archive' : 'Removed from saved');
  }));

  document.querySelectorAll('[data-save-lore]').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.saveLore;
    state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id);
    persist();
    renderRoute();
    showToast(state.saved.has(id) ? 'Lore entry saved' : 'Removed from saved');
  }));

  document.querySelectorAll('[data-follow]').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.follow;
    if (state.following.has(id)) {
      state.following.delete(id);
      persist();
      renderRoute();
    } else {
      state.following.add(id);
      addPoints(10,'Connected with a raider');
      renderRoute();
    }
  }));

  document.querySelectorAll('[data-toggle-playing]').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.togglePlaying;
    state.playing.has(id) ? state.playing.delete(id) : state.playing.add(id);
    persist();
    renderRoute();
  }));

  document.querySelectorAll('[data-toggle-completed]').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.toggleCompleted;
    if (state.completed.has(id)) {
      state.completed.delete(id);
      persist();
      renderRoute();
    } else {
      state.completed.add(id);
      addPoints(75,'Game completed');
      renderRoute();
    }
  }));

  document.querySelectorAll('[data-toggle-challenge]').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.toggleChallenge;
    if (state.joinedChallenges.has(id)) {
      state.joinedChallenges.delete(id);
      persist();
      renderRoute();
    } else {
      state.joinedChallenges.add(id);
      addPoints(20,'Challenge joined');
      renderRoute();
    }
  }));

  document.querySelectorAll('[data-member]').forEach(button => button.addEventListener('click', () => {
    const member = memberById(button.dataset.member);
    if (member) showToast(`${member.name} · Level ${member.level} ${member.title}`);
  }));
}

function openGame(id) {
  const game = gameById(id);
  if (!game) return;
  const completed = state.completed.has(id);
  const playing = state.playing.has(id);
  const gameLore = lore.filter(entry => entry.gameId === id);
  const gamePosts = posts.filter(post => post.gameId === id).slice(0,3);

  openDetail('Game archive', game.title, `
    <div class="game-detail">
      <img class="detail-hero-image" src="${game.image}" alt="">
      <div class="detail-meta-row"><span>${game.era}</span><span>${game.year}</span><span>${icon('star',15)} ${game.rating}</span><span>${icon('users',15)} ${game.community.toLocaleString()}</span></div>
      <p class="detail-lead">${game.description}</p>
      <div class="detail-info-grid">
        <div><span>Locations</span><strong>${game.location}</strong></div>
        <div><span>Community tags</span><strong>${game.tags.join(' · ')}</strong></div>
      </div>
      <div class="detail-action-row">
        <button class="secondary-button ${playing?'is-selected':''}" data-detail-playing="${game.id}">${icon('play',16)} <span>${playing?'Playing':'Play next'}</span></button>
        <button class="secondary-button ${completed?'is-selected':''}" data-detail-completed="${game.id}">${icon('circle-check',16)} <span>${completed?'Completed':'Mark complete'}</span></button>
      </div>
      ${gameLore.length ? `<div class="detail-section"><div class="section-heading compact-heading"><div><span class="section-label">Lore</span><h2>Related entries</h2></div></div><div class="related-list">${gameLore.map(item=>`<button data-detail-lore="${item.id}">${icon(item.icon,18)}<span><strong>${item.title}</strong><small>${item.type}</small></span>${icon('chevron-right',17)}</button>`).join('')}</div></div>` : ''}
      ${gamePosts.length ? `<div class="detail-section"><div class="section-heading compact-heading"><div><span class="section-label">Community</span><h2>Recent posts</h2></div></div><div class="related-list">${gamePosts.map(item=>`<button data-detail-post="${item.id}">${icon(item.type==='Discussion'?'message-circle':'compass',18)}<span><strong>${item.title}</strong><small>${item.comments} replies</small></span>${icon('chevron-right',17)}</button>`).join('')}</div></div>` : ''}
    </div>
  `);

  document.querySelector('[data-detail-playing]')?.addEventListener('click', () => {
    state.playing.has(id) ? state.playing.delete(id) : state.playing.add(id);
    persist(); closeDetail(); openGame(id);
  });
  document.querySelector('[data-detail-completed]')?.addEventListener('click', () => {
    if (state.completed.has(id)) state.completed.delete(id);
    else { state.completed.add(id); addPoints(75,'Game completed'); }
    persist(); closeDetail(); openGame(id);
  });
  document.querySelectorAll('[data-detail-lore]').forEach(btn => btn.addEventListener('click', () => { closeDetail(); openLore(btn.dataset.detailLore); }));
  document.querySelectorAll('[data-detail-post]').forEach(btn => btn.addEventListener('click', () => { closeDetail(); openPost(btn.dataset.detailPost); }));
}

function openLore(id) {
  const entry = lore.find(item => item.id === id);
  if (!entry) return;
  const game = gameById(entry.gameId);
  const saved = state.saved.has(id);

  openDetail(entry.type, entry.title, `
    <div class="lore-detail">
      <div class="detail-symbol">${icon(entry.icon,46)}</div>
      <p class="detail-lead">${entry.summary}</p>
      <div class="detail-info-grid">
        <div><span>Appears in</span><strong>${game?.title || 'Series archive'}</strong></div>
        <div><span>Classification</span><strong>${entry.type}</strong></div>
      </div>
      <div class="lore-note panel">
        <span class="section-label">Community note</span>
        <p>This entry is designed to grow with member notes, screenshots, references, theories, and linked discoveries once the backend layer is connected.</p>
      </div>
      <div class="detail-action-row">
        <button class="secondary-button ${saved?'is-selected':''}" id="detail-save-lore">${icon(saved?'bookmark-check':'bookmark',16)} <span>${saved?'Saved':'Save entry'}</span></button>
        <button class="secondary-button" id="detail-open-game">${icon('gamepad-2',16)} <span>Open game</span></button>
      </div>
    </div>
  `);

  document.querySelector('#detail-save-lore').addEventListener('click', () => {
    state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id);
    persist(); closeDetail(); openLore(id);
  });
  document.querySelector('#detail-open-game').addEventListener('click', () => { closeDetail(); openGame(entry.gameId); });
}

function openPost(id) {
  const post = posts.find(item => item.id === id);
  if (!post) return;
  const member = memberById(post.memberId);
  const game = gameById(post.gameId);
  const postComments = comments[id] || [];

  openDetail(post.type, post.title, `
    <article class="post-detail">
      <div class="post-detail-author">
        <span class="avatar">${member.avatar ? `<img src="${member.avatar}" alt="">` : 'DV'}</span>
        <span><strong>${member.name}</strong><small>${member.handle} · ${post.time || 'now'}</small></span>
      </div>
      ${post.image ? `<img class="detail-hero-image" src="${post.image}" alt="">` : ''}
      <p class="detail-lead">${escapeHTML(post.body)}</p>
      <div class="post-context"><span>${icon('gamepad-2',15)} ${game?.title || 'General'}</span>${(post.tags||[]).map(tag=>`<span>#${escapeHTML(tag)}</span>`).join('')}</div>
      <div class="detail-action-row">
        <button class="secondary-button ${state.liked.has(id)?'is-selected':''}" id="detail-like-post">${icon('heart',16)} <span>${post.likes + (state.liked.has(id)?1:0)}</span></button>
        <button class="secondary-button ${state.saved.has(id)?'is-selected':''}" id="detail-save-post">${icon(state.saved.has(id)?'bookmark-check':'bookmark',16)} <span>${state.saved.has(id)?'Saved':'Save'}</span></button>
      </div>
      <div class="comments-section">
        <div class="section-heading compact-heading"><div><span class="section-label">Discussion</span><h2>${postComments.length} replies</h2></div></div>
        <div class="comment-list">
          ${postComments.length ? postComments.map(comment => `<div class="comment"><span class="avatar avatar-self">DV</span><div><strong>${escapeHTML(comment.name)}</strong><p>${escapeHTML(comment.body)}</p><small>${comment.time}</small></div></div>`).join('') : '<div class="empty-comments">No replies yet. Start the conversation.</div>'}
        </div>
        <form class="comment-form" id="comment-form">
          <input id="comment-input" maxlength="500" placeholder="Write a reply" aria-label="Reply">
          <button class="primary-button" type="submit">${icon('send',16)} <span>Reply</span></button>
        </form>
      </div>
    </article>
  `);

  document.querySelector('#detail-like-post').addEventListener('click', () => {
    if (state.liked.has(id)) state.liked.delete(id);
    else { state.liked.add(id); addPoints(5,'Community appreciation'); }
    persist(); closeDetail(); openPost(id);
  });

  document.querySelector('#detail-save-post').addEventListener('click', () => {
    state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id);
    persist(); closeDetail(); openPost(id);
  });

  document.querySelector('#comment-form').addEventListener('submit', event => {
    event.preventDefault();
    const input = document.querySelector('#comment-input');
    const body = input.value.trim();
    if (!body) return;
    if (!comments[id]) comments[id] = [];
    comments[id].push({ id:'cm-'+Date.now(), name:'David Vale', body, time:'now' });
    post.comments += 1;
    writeLocal(STORAGE.comments, comments);
    addPoints(15,'Added to the discussion');
    closeDetail();
    openPost(id);
  });
}

function openDetail(label, title, html) {
  document.querySelector('#detail-label').textContent = label;
  document.querySelector('#detail-title').textContent = title;
  document.querySelector('#detail-content').innerHTML = html;
  if (!detailModal.open) detailModal.showModal();
  refreshIcons();
}

function closeDetail() {
  if (detailModal.open) detailModal.close();
}

function openComposer() {
  currentPostType = 'Discovery';
  document.querySelectorAll('[data-post-type]').forEach((btn,index) => btn.classList.toggle('is-active', index===0));
  document.querySelector('#create-form').reset();
  populateGameSelect();
  createModal.showModal();
  refreshIcons();
}

function populateGameSelect() {
  document.querySelector('#post-game').innerHTML = '<option value="">General Tomb Raider</option>' + games.map(game => `<option value="${game.id}">${game.title}</option>`).join('');
}

function publishPost(event) {
  event.preventDefault();
  const title = document.querySelector('#post-title').value.trim();
  const body = document.querySelector('#post-body').value.trim();
  const gameId = document.querySelector('#post-game').value || '';
  const tags = document.querySelector('#post-tags').value.split(',').map(t => t.trim()).filter(Boolean).slice(0,5);
  if (!title || !body) return;

  posts.unshift({
    id:'local-'+Date.now(),
    memberId:'self',
    type:currentPostType,
    gameId,
    title,
    body,
    image:'',
    tags,
    likes:0,
    comments:0,
    time:'now'
  });
  writeLocal(STORAGE.posts, posts.filter(post => post.memberId === 'self'));
  createModal.close();
  addPoints(30,'Published to the community');
  location.hash = 'community';
  renderRoute();
}

function renderNotifications() {
  const items = [
    { icon:'heart', text:'Noor Bell appreciated your replay note.', time:'12m' },
    { icon:'message-circle', text:'Mara Chen replied to a discussion you saved.', time:'38m' },
    { icon:'sparkles', text:'You earned 75 XP for completing Tomb Raider.', time:'2h' },
    { icon:'users', text:'Sora Vale followed your expedition log.', time:'1d' }
  ];

  notificationsContent.innerHTML = `
    <button class="mark-read" id="mark-read">${icon('check-check',16)} Mark all read</button>
    <div class="notification-list">
      ${items.map(item => `<div class="notification-item"><span class="notification-icon">${icon(item.icon,18)}</span><div><strong>${item.text}</strong><small>${item.time}</small></div></div>`).join('')}
    </div>`;

  document.querySelector('#mark-read').addEventListener('click', () => {
    state.notificationsRead = true;
    persist();
    showToast('Notifications marked read');
    closeNotifications();
  });
  refreshIcons();
}

function openNotifications() {
  renderNotifications();
  notificationsSheet.classList.add('is-open');
  notificationsSheet.setAttribute('aria-hidden','false');
  scrim.hidden = false;
  document.body.classList.add('no-scroll');
}

function closeNotifications() {
  notificationsSheet.classList.remove('is-open');
  notificationsSheet.setAttribute('aria-hidden','true');
  scrim.hidden = true;
  document.body.classList.remove('no-scroll');
}

function renderSearch() {
  const q = state.search.trim().toLowerCase();
  if (!q) {
    renderRoute();
    return;
  }

  const foundGames = games.filter(game => [game.title,game.era,game.location,...game.tags].join(' ').toLowerCase().includes(q));
  const foundLore = lore.filter(item => [item.title,item.type,item.summary].join(' ').toLowerCase().includes(q));
  const foundPosts = posts.filter(post => [post.title,post.body,...(post.tags||[])].join(' ').toLowerCase().includes(q));

  main.innerHTML = `
    <div class="page search-page">
      <header class="page-header">
        <div><span class="section-label">Search</span><h1 class="page-title">“${escapeHTML(state.search)}”</h1><p class="page-subtitle">${foundGames.length + foundLore.length + foundPosts.length} results across the Tombbound archive.</p></div>
      </header>

      ${foundGames.length ? `<section><div class="section-heading"><div><span class="section-label">Games</span><h2>${foundGames.length} matches</h2></div></div><div class="game-scroll">${foundGames.map(gameCard).join('')}</div></section>` : ''}
      ${foundLore.length ? `<section><div class="section-heading"><div><span class="section-label">Lore</span><h2>${foundLore.length} matches</h2></div></div><div class="lore-grid">${foundLore.map(loreCard).join('')}</div></section>` : ''}
      ${foundPosts.length ? `<section><div class="section-heading"><div><span class="section-label">Community</span><h2>${foundPosts.length} matches</h2></div></div><div class="post-stack search-posts">${foundPosts.map(postCard).join('')}</div></section>` : ''}
      ${!foundGames.length && !foundLore.length && !foundPosts.length ? `<div class="empty-state panel"><strong>No results</strong><span>Try another game, artifact, location, or community topic.</span></div>` : ''}
    </div>
  `;

  bindCommonEvents();
  refreshIcons();
}

function initialize() {
  updateHeader();
  populateGameSelect();

  window.addEventListener('hashchange', () => {
    state.search = '';
    searchInput.value = '';
    renderRoute();
    window.scrollTo({top:0,behavior:'smooth'});
  });

  searchInput.addEventListener('input', event => {
    state.search = event.target.value;
    renderSearch();
  });

  document.querySelector('#create-button').addEventListener('click', openComposer);
  document.querySelector('#mobile-create').addEventListener('click', openComposer);
  document.querySelector('#notifications-button').addEventListener('click', openNotifications);
  document.querySelector('#close-notifications').addEventListener('click', closeNotifications);
  document.querySelector('#detail-close').addEventListener('click', closeDetail);
  document.querySelector('#create-form').addEventListener('submit', publishPost);
  document.querySelectorAll('[data-post-type]').forEach(button => button.addEventListener('click', () => {
    currentPostType = button.dataset.postType;
    document.querySelectorAll('[data-post-type]').forEach(btn => btn.classList.toggle('is-active', btn===button));
  }));

  scrim.addEventListener('click', closeNotifications);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeNotifications();
      closeDetail();
    }
    if (event.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
      event.preventDefault();
      searchInput.focus();
    }
  });

  renderRoute();
  refreshIcons();
}

initialize();
