const state = {
  view: 'explore',
  filter: 'All',
  sort: 'Featured',
  search: '',
  likes: new Set(JSON.parse(localStorage.getItem('morrow.likes') || '[]')),
  saves: new Set(JSON.parse(localStorage.getItem('morrow.saves') || '[]')),
  follows: new Set(JSON.parse(localStorage.getItem('morrow.follows') || '["hana-vale","noor-adebayo","sora-lin"]')),
  uploads: JSON.parse(localStorage.getItem('morrow.uploads') || '[]')
};

const artists = [
  { id:'hana-vale', name:'Hana Vale', handle:'@hanavale', field:'Illustration', status:'Available', avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80' },
  { id:'ivo-march', name:'Ivo March', handle:'@ivomarch', field:'3D / Motion', status:'Available', avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80' },
  { id:'noor-adebayo', name:'Noor Adebayo', handle:'@noorstudio', field:'Photography', status:'Available', avatar:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80' },
  { id:'sora-lin', name:'Sora Lin', handle:'@soralin', field:'Concept Art', status:'Booked', avatar:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80' },
  { id:'cass-renn', name:'Cass Renn', handle:'@cassrenn', field:'Graphic Design', status:'Available', avatar:'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80' },
  { id:'emilia-ortiz', name:'Emilia Ortiz', handle:'@eortiz', field:'Painting', status:'Available', avatar:'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=160&q=80' }
];

const artworks = [
  { id:'blue-hour', title:'Blue Hour Studies', artist:'Hana Vale', artistId:'hana-vale', field:'Illustration', image:'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1200&q=88', likes:1284, year:'2026', tools:'Gouache, graphite', tags:['editorial','figure','gouache'], description:'A sequence of quiet colour studies built around the half hour when interior light and evening light briefly match.' },
  { id:'soft-machinery', title:'Soft Machinery', artist:'Ivo March', artistId:'ivo-march', field:'3D', image:'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1200&q=88', likes:932, year:'2026', tools:'Blender, Houdini', tags:['3d','form','material'], description:'Material experiments asking how industrial forms change when their surfaces behave more like fabric than metal.' },
  { id:'after-rain', title:'After Rain, 6:42', artist:'Noor Adebayo', artistId:'noor-adebayo', field:'Photography', image:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=88', likes:2460, year:'2026', tools:'Leica Q3', tags:['street','light','city'], description:'Part of an ongoing study of wet pavement, reflected signs, and the small shifts in colour that happen after summer rain.' },
  { id:'weather-system', title:'Weather System', artist:'Sora Lin', artistId:'sora-lin', field:'Concept Art', image:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=88', likes:1887, year:'2026', tools:'Photoshop', tags:['environment','sky','concept'], description:'Environment development for a story set above a permanent cloud shelf, where weather is treated as geography.' },
  { id:'field-notes', title:'Field Notes No. 14', artist:'Cass Renn', artistId:'cass-renn', field:'Graphic Design', image:'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=88', likes:721, year:'2026', tools:'InDesign, risograph', tags:['print','type','riso'], description:'A print study combining found type, registration errors, and colour separations from a larger editorial identity system.' },
  { id:'still-warm', title:'Still Warm', artist:'Emilia Ortiz', artistId:'emilia-ortiz', field:'Painting', image:'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=88', likes:3410, year:'2025', tools:'Oil on linen', tags:['painting','portrait','oil'], description:'Oil on linen, painted from repeated sittings over six weeks. The final pass kept the underdrawing visible at the shoulder.' },
  { id:'signal-garden', title:'Signal Garden', artist:'Ivo March', artistId:'ivo-march', field:'Motion', image:'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?auto=format&fit=crop&w=1200&q=88', likes:1112, year:'2026', tools:'Cinema 4D, Redshift', tags:['motion','abstract','colour'], description:'Frames from a short motion piece built from modular signals, shifting depth, and deliberately imperfect loops.' },
  { id:'paper-sun', title:'Paper Sun', artist:'Hana Vale', artistId:'hana-vale', field:'Illustration', image:'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=88', likes:2019, year:'2026', tools:'Acrylic, coloured pencil', tags:['colour','editorial','acrylic'], description:'An editorial image about optimism that is useful precisely because it is temporary.' },
  { id:'room-tone', title:'Room Tone', artist:'Noor Adebayo', artistId:'noor-adebayo', field:'Photography', image:'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=88', likes:803, year:'2025', tools:'Sony A7R V', tags:['interior','space','documentary'], description:'A study of empty workspaces photographed before people arrive, with attention to traces of the previous day.' },
  { id:'orbital-type', title:'Orbital Type', artist:'Cass Renn', artistId:'cass-renn', field:'Graphic Design', image:'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=88', likes:646, year:'2026', tools:'Illustrator, Glyphs', tags:['identity','typography','poster'], description:'A display type experiment developed for a fictional astronomy journal and expanded into a small poster system.' },
  { id:'red-figure', title:'Red Figure / Green Room', artist:'Emilia Ortiz', artistId:'emilia-ortiz', field:'Painting', image:'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=88', likes:1530, year:'2026', tools:'Oil, wax', tags:['figure','painting','colour'], description:'A figure study focused on temperature rather than likeness, with wax added between oil layers to flatten the surface.' },
  { id:'monument-valley', title:'Monument Study 03', artist:'Sora Lin', artistId:'sora-lin', field:'Concept Art', image:'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=88', likes:2771, year:'2026', tools:'Photoshop, Blender', tags:['landscape','environment','concept'], description:'Shape language exploration for a monumental desert structure designed to read clearly from extreme distance.' }
];

const jobs = [
  { company:'Northline Games', role:'Senior Environment Artist', location:'Toronto · Hybrid', type:'Full time', field:'3D / Concept', salary:'CAD $105k–$132k' },
  { company:'Mica Studio', role:'Editorial Illustrator', location:'Remote · Americas', type:'Contract', field:'Illustration', salary:'Per project' },
  { company:'Soft Assembly', role:'Brand Designer', location:'Montréal · Hybrid', type:'Full time', field:'Graphic Design', salary:'CAD $82k–$98k' },
  { company:'Paper House Press', role:'Book Cover Artist', location:'Remote', type:'Freelance', field:'Painting / Illustration', salary:'CAD $2.5k–$5k' },
  { company:'Lumen Pictures', role:'Look Development Artist', location:'Vancouver · On site', type:'Full time', field:'3D', salary:'CAD $96k–$120k' }
];

const fields = ['All','Illustration','Digital Art','Photography','3D','Graphic Design','Painting','Concept Art','Motion'];

const main = document.querySelector('#main');
const drawer = document.querySelector('#upload-drawer');
const scrim = document.querySelector('#scrim');
const toast = document.querySelector('#toast');
const dialog = document.querySelector('#art-dialog');
let toastTimer;
let pendingImage = '';

function allArt() {
  return [...state.uploads, ...artworks];
}

function artistById(id) {
  return artists.find(a => a.id === id) || {name:'David Vale', handle:'@david', field:'Visual Artist', avatar:''};
}

function escapeHTML(value='') {
  return value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
}

function saveState() {
  localStorage.setItem('morrow.likes', JSON.stringify([...state.likes]));
  localStorage.setItem('morrow.saves', JSON.stringify([...state.saves]));
  localStorage.setItem('morrow.follows', JSON.stringify([...state.follows]));
  localStorage.setItem('morrow.uploads', JSON.stringify(state.uploads.slice(0, 8)));
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

function setView(view) {
  state.view = view;
  document.querySelectorAll('.nav-link').forEach(btn => btn.classList.toggle('is-active', btn.dataset.view === view));
  render();
  window.scrollTo({top:0, behavior:'smooth'});
}

function render() {
  if (state.view === 'explore') renderExplore();
  if (state.view === 'following') renderFollowing();
  if (state.view === 'collections') renderCollections();
  if (state.view === 'jobs') renderJobs();
  if (state.view === 'profile') renderProfile();
}

function renderExplore() {
  const query = state.search.trim().toLowerCase();
  let items = allArt().filter(item => state.filter === 'All' || item.field === state.filter || (state.filter === 'Digital Art' && ['3D','Motion','Concept Art'].includes(item.field)));
  if (query) {
    items = items.filter(item => [item.title,item.artist,item.field,...(item.tags||[])].join(' ').toLowerCase().includes(query));
  }
  if (state.sort === 'Most appreciated') items.sort((a,b) => b.likes - a.likes);
  if (state.sort === 'Newest') items.sort((a,b) => (b.year || '').localeCompare(a.year || ''));

  main.innerHTML = `
    <div class="page">
      <section class="explore-intro" aria-labelledby="explore-title">
        <h1 id="explore-title">A place for the <em>work</em> itself.</h1>
        <div class="intro-note">
          <strong>Discover portfolios, process, and people.</strong>
          Publish finished work and the thinking behind it. Build a portfolio without losing the community around it.
        </div>
      </section>

      <div class="section-head">
        <h2>Artists to know</h2>
        <p>Selected across disciplines</p>
      </div>

      <section class="creator-strip" aria-label="Featured artists">
        ${artists.map(creatorCard).join('')}
      </section>

      <div class="feed-toolbar">
        <div class="filter-scroll" aria-label="Filter artwork">
          ${fields.map(field => `<button class="filter-chip ${state.filter===field?'is-active':''}" data-filter="${field}">${field}</button>`).join('')}
        </div>
        <span class="toolbar-spacer"></span>
        <select class="sort-select" id="sort-select" aria-label="Sort projects">
          <option ${state.sort==='Featured'?'selected':''}>Featured</option>
          <option ${state.sort==='Newest'?'selected':''}>Newest</option>
          <option ${state.sort==='Most appreciated'?'selected':''}>Most appreciated</option>
        </select>
      </div>

      <section class="masonry" id="art-grid" aria-label="Artwork">
        ${items.map(artCard).join('')}
      </section>
      ${items.length ? '' : `<div class="empty-state"><strong>No work matched that search.</strong>Try another artist, field, or tag.</div>`}
    </div>
  `;
  bindArtworkEvents();
  bindCreatorEvents();
  document.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => { state.filter = btn.dataset.filter; renderExplore(); }));
  document.querySelector('#sort-select')?.addEventListener('change', e => { state.sort = e.target.value; renderExplore(); });
}

function creatorCard(a) {
  return `<button class="creator-card" data-creator="${a.id}">
    <span class="avatar"><img src="${a.avatar}" alt="" loading="lazy"></span>
    <span class="creator-name">${a.name}</span>
    <span class="creator-field">${a.field}</span>
    <span class="creator-status"><i></i>${a.status}</span>
  </button>`;
}

function artCard(item) {
  const liked = state.likes.has(item.id);
  const saved = state.saves.has(item.id);
  return `<article class="art-card">
    <button class="art-thumb" data-open-art="${item.id}" aria-label="Open ${escapeHTML(item.title)} by ${escapeHTML(item.artist)}">
      <img src="${item.image}" alt="${escapeHTML(item.title)} by ${escapeHTML(item.artist)}" loading="lazy">
      <span class="art-overlay" aria-hidden="true">
        <span class="mini-action">${saved ? '★' : '☆'}</span>
        <span class="mini-action">${liked ? '♥' : '♡'}</span>
      </span>
    </button>
    <div class="art-meta">
      <div>
        <h3 class="art-title">${escapeHTML(item.title)}</h3>
        <div class="art-byline">${escapeHTML(item.artist)} · ${escapeHTML(item.field)}</div>
      </div>
      <button class="text-action art-stat ${liked?'is-liked':''}" data-like="${item.id}" aria-label="Appreciate ${escapeHTML(item.title)}">${liked?'♥':'♡'} ${formatNumber(item.likes + (liked?1:0))}</button>
    </div>
  </article>`;
}

function formatNumber(n) {
  if (n >= 1000) return (n/1000).toFixed(n >= 10000 ? 0 : 1).replace('.0','') + 'k';
  return String(n);
}

function bindArtworkEvents() {
  document.querySelectorAll('[data-open-art]').forEach(el => el.addEventListener('click', () => openArtwork(el.dataset.openArt)));
  document.querySelectorAll('[data-like]').forEach(el => el.addEventListener('click', () => toggleLike(el.dataset.like)));
}

function bindCreatorEvents() {
  document.querySelectorAll('[data-creator]').forEach(el => el.addEventListener('click', () => {
    const creator = artistById(el.dataset.creator);
    showToast(`Opened ${creator.name}'s portfolio`);
  }));
}

function toggleLike(id) {
  state.likes.has(id) ? state.likes.delete(id) : state.likes.add(id);
  saveState();
  showToast(state.likes.has(id) ? 'Added appreciation' : 'Appreciation removed');
  render();
}

function toggleSave(id) {
  state.saves.has(id) ? state.saves.delete(id) : state.saves.add(id);
  saveState();
  showToast(state.saves.has(id) ? 'Saved to collection' : 'Removed from collection');
  if (dialog.open) openArtwork(id, true);
  else render();
}

function toggleFollow(id) {
  state.follows.has(id) ? state.follows.delete(id) : state.follows.add(id);
  saveState();
  showToast(state.follows.has(id) ? 'Following artist' : 'Unfollowed artist');
  render();
}

function openArtwork(id, keepOpen=false) {
  const item = allArt().find(x => x.id === id);
  if (!item) return;
  const artist = artistById(item.artistId);
  const liked = state.likes.has(id);
  const saved = state.saves.has(id);
  document.querySelector('#art-dialog-content').innerHTML = `
    <div class="project-layout">
      <div class="project-media">
        <img src="${item.image}" alt="${escapeHTML(item.title)} by ${escapeHTML(item.artist)}">
      </div>
      <section class="project-info">
        <div class="project-author">
          <span class="avatar">${artist.avatar ? `<img src="${artist.avatar}" alt="">` : 'DV'}</span>
          <div><strong>${escapeHTML(item.artist)}</strong><small>${escapeHTML(artist.handle || '@david')} · ${escapeHTML(item.field)}</small></div>
        </div>
        <h2>${escapeHTML(item.title)}</h2>
        <p>${escapeHTML(item.description || 'A new project shared with the Morrow community.')}</p>
        <div class="tag-list">${(item.tags||[]).map(tag => `<span class="tag">#${escapeHTML(tag)}</span>`).join('')}</div>
        <div class="project-actions">
          <button class="button ${liked?'button-primary':'button-quiet'}" data-dialog-like="${id}">${liked?'♥ Appreciated':'♡ Appreciate'}</button>
          <button class="button ${saved?'button-primary':'button-quiet'}" data-dialog-save="${id}">${saved?'★ Saved':'☆ Save'}</button>
        </div>
        <div class="project-details">
          <div class="detail-row"><span>Creative field</span><span>${escapeHTML(item.field)}</span></div>
          <div class="detail-row"><span>Created</span><span>${escapeHTML(item.year || '2026')}</span></div>
          <div class="detail-row"><span>Tools / materials</span><span>${escapeHTML(item.tools || 'Mixed media')}</span></div>
          <div class="detail-row"><span>Rights</span><span>© ${escapeHTML(item.artist)}</span></div>
        </div>
      </section>
    </div>`;
  document.querySelector('[data-dialog-like]')?.addEventListener('click', () => { state.likes.has(id) ? state.likes.delete(id) : state.likes.add(id); saveState(); openArtwork(id, true); });
  document.querySelector('[data-dialog-save]')?.addEventListener('click', () => toggleSave(id));
  if (!keepOpen && !dialog.open) dialog.showModal();
}

function renderFollowing() {
  const followed = allArt().filter(item => state.follows.has(item.artistId));
  main.innerHTML = `
    <div class="page">
      <header class="subpage-head">
        <h1>Following</h1>
        <p>A chronological stream from the artists you chose. No recommended posts mixed in.</p>
      </header>
      <section class="following-feed">
        ${followed.map(item => {
          const a = artistById(item.artistId);
          return `<article class="timeline-item">
            <span class="avatar"><img src="${a.avatar}" alt=""></span>
            <div>
              <div class="timeline-head"><strong>${a.name}</strong><span>${a.handle} · today</span></div>
              <button class="art-thumb" data-open-art="${item.id}"><img class="timeline-image" src="${item.image}" alt="${escapeHTML(item.title)}"></button>
              <p class="timeline-copy"><strong>${escapeHTML(item.title)}</strong> · ${escapeHTML(item.description)}</p>
              <div class="timeline-actions">
                <button class="text-action" data-like="${item.id}">${state.likes.has(item.id)?'♥':'♡'} Appreciate</button>
                <button class="text-action" data-save="${item.id}">${state.saves.has(item.id)?'★':'☆'} Save</button>
                <button class="text-action">Reply</button>
              </div>
            </div>
          </article>`;
        }).join('')}
      </section>
    </div>`;
  bindArtworkEvents();
  document.querySelectorAll('[data-save]').forEach(el => el.addEventListener('click', () => toggleSave(el.dataset.save)));
}

function renderCollections() {
  const saved = allArt().filter(item => state.saves.has(item.id));
  const starters = saved.length ? saved : allArt().slice(0,6);
  main.innerHTML = `
    <div class="page">
      <header class="subpage-head">
        <h1>Collections</h1>
        <p>Keep references, favourites, and research private or group them into shareable boards.</p>
      </header>
      <section class="collection-grid">
        ${collectionCard('Saved work', saved.length ? saved : starters.slice(0,2), saved.length + ' saved')}
        ${collectionCard('Colour & atmosphere', starters.slice(1,3), '18 works')}
        ${collectionCard('Editorial references', starters.slice(3,5), '11 works')}
      </section>
      <div class="section-head"><h2>Recently saved</h2><p>${saved.length ? saved.length + ' works' : 'Start saving work from Explore'}</p></div>
      ${saved.length ? `<section class="masonry">${saved.map(artCard).join('')}</section>` : `<div class="empty-state"><strong>Your saved work will land here.</strong>Use the star on a project to keep it close.</div>`}
    </div>`;
  bindArtworkEvents();
}

function collectionCard(title, items, meta) {
  const first = items[0] || artworks[0];
  const second = items[1] || artworks[1];
  return `<article class="collection-card">
    <img src="${first.image}" alt="">
    <img src="${second.image}" alt="">
    <div class="collection-label"><strong>${title}</strong><span>${meta}</span></div>
  </article>`;
}

function renderJobs() {
  main.innerHTML = `
    <div class="page">
      <header class="subpage-head">
        <h1>Creative jobs</h1>
        <p>Roles for working artists and designers, with discipline, location, and compensation visible before you click.</p>
      </header>
      <div class="jobs-layout">
        <aside class="job-filters">
          <h3>Work type</h3>
          <label class="check-row"><input type="checkbox" checked> Full time</label>
          <label class="check-row"><input type="checkbox" checked> Contract</label>
          <label class="check-row"><input type="checkbox" checked> Freelance</label>
          <h3 style="margin-top:26px">Location</h3>
          <label class="check-row"><input type="checkbox" checked> Remote</label>
          <label class="check-row"><input type="checkbox"> Canada</label>
          <label class="check-row"><input type="checkbox"> United States</label>
        </aside>
        <section class="job-list">
          ${jobs.map(job => `<article class="job-card">
            <div>
              <div class="job-company">${job.company}</div>
              <h3>${job.role}</h3>
              <p>${job.field}</p>
              <div class="job-meta"><span>${job.location}</span><span>${job.type}</span><span>Posted this week</span></div>
            </div>
            <div class="job-salary">${job.salary}</div>
          </article>`).join('')}
        </section>
      </div>
    </div>`;
}

function renderProfile() {
  const portfolio = state.uploads.length ? state.uploads : artworks.slice(0,5);
  main.innerHTML = `
    <div class="page">
      <section class="profile-hero">
        <div>
          <div class="profile-id">
            <span class="avatar avatar-me">DV</span>
            <div><h1>David Vale</h1><div class="profile-handle">@david · London, Canada</div></div>
          </div>
          <p class="profile-copy">Independent visual artist working across image making, print, and small digital experiments. Available for selected editorial and identity projects.</p>
        </div>
        <div class="profile-actions">
          <button class="button button-quiet">Edit profile</button>
          <button class="button button-primary" id="profile-upload">Add project</button>
        </div>
      </section>
      <div class="profile-stats">
        <span><strong>${portfolio.length}</strong> projects</span>
        <span><strong>1.8k</strong> followers</span>
        <span><strong>42.6k</strong> project views</span>
        <span><strong>Available</strong> for work</span>
      </div>
      <nav class="profile-tabs" aria-label="Profile sections">
        <button class="profile-tab is-active">Portfolio</button>
        <button class="profile-tab">Timeline</button>
        <button class="profile-tab">About</button>
      </nav>
      <section class="masonry">${portfolio.map(artCard).join('')}</section>
    </div>`;
  bindArtworkEvents();
  document.querySelector('#profile-upload')?.addEventListener('click', openUpload);
}

function openUpload() {
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden','false');
  scrim.hidden = false;
  setTimeout(() => document.querySelector('#art-title')?.focus(), 100);
}

function closeUpload() {
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden','true');
  scrim.hidden = true;
}

document.querySelectorAll('.nav-link').forEach(btn => btn.addEventListener('click', () => setView(btn.dataset.view)));
document.querySelector('.wordmark').addEventListener('click', e => { e.preventDefault(); setView('explore'); });
document.querySelector('#profile-button').addEventListener('click', () => setView('profile'));
document.querySelector('#upload-button').addEventListener('click', openUpload);
document.querySelector('#close-upload').addEventListener('click', closeUpload);
scrim.addEventListener('click', closeUpload);
document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

const searchInput = document.querySelector('#global-search');
searchInput.addEventListener('input', e => {
  state.search = e.target.value;
  if (state.view !== 'explore') setView('explore');
  else renderExplore();
});
document.addEventListener('keydown', e => {
  if (e.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
    e.preventDefault();
    searchInput.focus();
  }
  if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeUpload();
});

const fileInput = document.querySelector('#art-file');
const dropZone = document.querySelector('#drop-zone');
const preview = document.querySelector('#upload-preview');

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) return showToast('Choose an image file');
  if (file.size > 8 * 1024 * 1024) return showToast('Please choose an image under 8 MB');
  const reader = new FileReader();
  reader.onload = () => {
    pendingImage = reader.result;
    preview.src = pendingImage;
    preview.hidden = false;
    dropZone.classList.add('has-preview');
  };
  reader.readAsDataURL(file);
}
fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));
['dragenter','dragover'].forEach(name => dropZone.addEventListener(name, e => { e.preventDefault(); dropZone.classList.add('is-dragging'); }));
['dragleave','drop'].forEach(name => dropZone.addEventListener(name, e => { e.preventDefault(); dropZone.classList.remove('is-dragging'); }));
dropZone.addEventListener('drop', e => handleFile(e.dataTransfer.files[0]));

document.querySelector('#save-draft').addEventListener('click', () => showToast('Draft saved locally'));

document.querySelector('#upload-form').addEventListener('submit', e => {
  e.preventDefault();
  if (!pendingImage) return showToast('Add an image first');
  const title = document.querySelector('#art-title').value.trim();
  const field = document.querySelector('#art-field').value;
  const description = document.querySelector('#art-description').value.trim();
  const tags = document.querySelector('#art-tags').value.split(',').map(x => x.trim()).filter(Boolean).slice(0,8);
  const item = {
    id: 'local-' + Date.now(),
    title,
    artist:'David Vale',
    artistId:'me',
    field,
    image: pendingImage,
    likes:0,
    year:'2026',
    tools: document.querySelector('#process-toggle').checked ? 'Process details added' : 'Not listed',
    tags,
    description: description || 'New work.',
    portfolio: document.querySelector('#portfolio-toggle').checked
  };
  state.uploads.unshift(item);
  try { saveState(); } catch (err) { localStorage.removeItem('morrow.uploads'); }
  e.target.reset();
  pendingImage = '';
  preview.hidden = true;
  preview.removeAttribute('src');
  dropZone.classList.remove('has-preview');
  closeUpload();
  setView('profile');
  showToast('Project published');
});

render();
