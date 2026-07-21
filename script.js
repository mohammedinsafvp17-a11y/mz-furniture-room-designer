/* ============================================================
   MZ FURNITURE — 3D ROOM DESIGNER (prototype)
   Catalog objects below are shaped like WooCommerce Store API
   product records (id, name, price, categories) so this array
   can be replaced with a real fetch() to:
     /wp-json/wc/store/v1/products?category=furniture
   and the 3D builder functions can be swapped for real GLTF
   models (one per product, stored in product meta) using
   THREE.GLTFLoader.
   ============================================================ */

const CATALOG = [
  {id:'sofa-01', name:'Oakhaven 3-Seater Sofa', price:899, cat:'seating', w:2.0, d:0.9, build:buildSofa, color:'#3e5c52'},
  {id:'chair-01', name:'Wren Accent Chair', price:329, cat:'seating', w:0.75, d:0.75, build:buildAccentChair, color:'#c08a34'},
  {id:'chair-02', name:'Ashgrove Dining Chair', price:149, cat:'seating', w:0.45, d:0.5, build:buildDiningChair, color:'#7a5636'},
  {id:'table-01', name:'Camden Dining Table', price:649, cat:'tables', w:1.6, d:0.9, build:buildDiningTable, color:'#5c4028'},
  {id:'table-02', name:'Milo Coffee Table', price:279, cat:'tables', w:1.1, d:0.55, build:buildCoffeeTable, color:'#5c4028'},
  {id:'table-03', name:'Linden Console Table', price:399, cat:'tables', w:1.2, d:0.35, build:buildConsole, color:'#4a3221'},
  {id:'shelf-01', name:'Birchwood Bookshelf', price:459, cat:'storage', w:0.9, d:0.32, build:buildBookshelf, color:'#d8c9a3'},
  {id:'cab-01', name:'Sideboard Cabinet', price:549, cat:'storage', w:1.4, d:0.42, build:buildSideboard, color:'#4a3221'},
  {id:'bed-01', name:'Aspen Queen Bed', price:1199, cat:'bedroom', w:1.6, d:2.1, build:buildBed, color:'#4a3221'},
  {id:'night-01', name:'Nightstand', price:149, cat:'bedroom', w:0.45, d:0.4, build:buildNightstand, color:'#4a3221'},
  {id:'lamp-01', name:'Halden Floor Lamp', price:99, cat:'lighting', w:0.35, d:0.35, build:buildFloorLamp, color:'#2a2a2a'},
  {id:'rug-01', name:'Wool Area Rug', price:199, cat:'decor', w:2.0, d:1.4, build:buildRug, color:'#9b8563'},
];

const CATS = [
  {id:'all', label:'All'},
  {id:'seating', label:'Seating'},
  {id:'tables', label:'Tables'},
  {id:'storage', label:'Storage'},
  {id:'bedroom', label:'Bedroom'},
  {id:'lighting', label:'Lighting'},
  {id:'decor', label:'Decor'},
  {id:'other', label:'Other'},
];

const FLOOR_COLORS = ['#8a6a45','#5c4028','#c9b28a','#2f2a26'];
const WALL_COLORS  = ['#efe6d6','#8a9a76','#3a3f4a','#b98f52'];

/* ---------- furniture builders (parametric primitives) ---------- */
function mat(hex, rough=0.75, metal=0.05){return new THREE.MeshStandardMaterial({color:hex, roughness:rough, metalness:metal});}
function addBox(group, w,h,d, m, x,y,z, ry=0){
  const box = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), m);
  box.position.set(x,y,z); box.rotation.y = ry;
  box.castShadow = true; box.receiveShadow = true;
  group.add(box); return box;
}
function addCyl(group, r,h, m, x,y,z){
  const c = new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,16), m);
  c.position.set(x,y,z); c.castShadow=true; c.receiveShadow=true;
  group.add(c); return c;
}

function buildSofa(color){
  const g = new THREE.Group();
  const fab = mat(color, 0.85), wood = mat('#3a2c1c', 0.6);
  addBox(g, 1.95, 0.32, 0.85, fab, 0, 0.16, 0);
  addBox(g, 1.95, 0.42, 0.16, fab, 0, 0.37+0.16, -0.34);
  addBox(g, 0.16, 0.42, 0.85, fab, -0.9, 0.37, 0);
  addBox(g, 0.16, 0.42, 0.85, fab, 0.9, 0.37, 0);
  for(const x of [-0.85,0.85]) for(const z of [-0.35,0.35]) addCyl(g,0.04,0.14,wood,x,0.07,z);
  return g;
}
function buildAccentChair(color){
  const g = new THREE.Group();
  const fab = mat(color, 0.8), wood = mat('#3a2c1c', 0.6);
  addBox(g, 0.62, 0.3, 0.62, fab, 0, 0.3, 0);
  addBox(g, 0.62, 0.5, 0.12, fab, 0, 0.6, -0.25);
  for(const x of [-0.26,0.26]) for(const z of [-0.26,0.26]) addCyl(g,0.03,0.28,wood,x,0.14,z);
  return g;
}
function buildDiningChair(color){
  const g = new THREE.Group();
  const wood = mat(color, 0.7);
  addBox(g, 0.42, 0.06, 0.42, wood, 0, 0.45, 0);
  addBox(g, 0.42, 0.4, 0.06, wood, 0, 0.65, -0.2);
  for(const x of [-0.18,0.18]) for(const z of [-0.18,0.18]) addCyl(g,0.025,0.45,wood,x,0.225,z);
  return g;
}
function buildDiningTable(color){
  const g = new THREE.Group();
  const top = mat(color, 0.5), leg = mat('#20180f', 0.6);
  addBox(g, 1.6, 0.07, 0.9, top, 0, 0.73, 0);
  for(const x of [-0.7,0.7]) for(const z of [-0.38,0.38]) addBox(g,0.07,0.73,0.07,leg,x,0.365,z);
  return g;
}
function buildCoffeeTable(color){
  const g = new THREE.Group();
  const top = mat(color, 0.5), leg = mat('#20180f', 0.6);
  addBox(g, 1.1, 0.06, 0.55, top, 0, 0.4, 0);
  for(const x of [-0.48,0.48]) for(const z of [-0.22,0.22]) addBox(g,0.06,0.4,0.06,leg,x,0.2,z);
  return g;
}
function buildConsole(color){
  const g = new THREE.Group();
  const top = mat(color, 0.5), leg = mat('#20180f', 0.6);
  addBox(g, 1.2, 0.05, 0.35, top, 0, 0.78, 0);
  for(const x of [-0.53,0.53]) for(const z of [-0.13,0.13]) addBox(g,0.05,0.78,0.05,leg,x,0.39,z);
  return g;
}
function buildBookshelf(color){
  const g = new THREE.Group();
  const wood = mat(color, 0.6);
  const w=0.9, h=1.8, d=0.32, t=0.045;
  // back panel, two sides, top and bottom — front left fully open (real holes)
  addBox(g, w, h, t, wood, 0, h/2, -d/2+t/2);
  addBox(g, t, h, d, wood, -w/2+t/2, h/2, 0);
  addBox(g, t, h, d, wood, w/2-t/2, h/2, 0);
  addBox(g, w, t, d, wood, 0, h-t/2, 0);
  addBox(g, w, t, d, wood, 0, t/2, 0);
  // three shelf boards create four open compartments
  for(let i=1;i<=3;i++){
    const y = (h/4)*i;
    addBox(g, w-t*2, t*0.7, d-0.01, wood, 0, y, 0);
  }
  return g;
}
function buildSideboard(color){
  const g = new THREE.Group();
  const wood = mat(color, 0.55);
  const doorWood = mat(color, 0.3);
  const brass = mat('#c9a227', 0.3, 0.8);
  const w=1.4, h=0.75, d=0.42, t=0.035;
  const bodyH = h - 0.08;
  // carcass: back, sides, top — sits on a recessed toe-kick base
  addBox(g, w, bodyH, t, wood, 0, bodyH/2+0.08, -d/2+t/2);
  addBox(g, t, bodyH, d, wood, -w/2+t/2, bodyH/2+0.08, 0);
  addBox(g, t, bodyH, d, wood, w/2-t/2, bodyH/2+0.08, 0);
  addBox(g, w, t, d, wood, 0, h-t/2, 0);
  addBox(g, w-0.12, 0.08, d-0.08, wood, 0, 0.04, 0);
  // two doors with a visible center seam, proud of the carcass face
  const doorW = w/2 - 0.045;
  const doorH = bodyH - 0.06;
  addBox(g, doorW, doorH, 0.025, doorWood, -w/4+0.01, bodyH/2+0.08, d/2-0.003);
  addBox(g, doorW, doorH, 0.025, doorWood, w/4-0.01, bodyH/2+0.08, d/2-0.003);
  // brass bar handles near the inner edge of each door
  addBox(g, 0.018, 0.16, 0.02, brass, -0.06, bodyH/2+0.08, d/2+0.02);
  addBox(g, 0.018, 0.16, 0.02, brass, 0.06, bodyH/2+0.08, d/2+0.02);
  return g;
}
function buildBed(color){
  const g = new THREE.Group();
  const frame = mat(color, 0.6), mattress = mat('#e8e2d6', 0.9), pillow = mat('#d8cdb8', 0.9);
  addBox(g, 1.6, 0.3, 2.1, frame, 0, 0.15, 0);
  addBox(g, 1.55, 0.22, 2.0, mattress, 0, 0.41, 0);
  addBox(g, 1.6, 0.55, 0.08, frame, 0, 0.55, -1.01);
  addBox(g, 0.7, 0.16, 0.4, pillow, -0.4, 0.6, -0.78);
  addBox(g, 0.7, 0.16, 0.4, pillow, 0.4, 0.6, -0.78);
  return g;
}
function buildNightstand(color){
  const g = new THREE.Group();
  const wood = mat(color, 0.55);
  addBox(g, 0.45, 0.5, 0.4, wood, 0, 0.25, 0);
  return g;
}
function buildFloorLamp(color){
  const g = new THREE.Group();
  const metal = mat(color, 0.4, 0.6), shade = mat('#e8dcc0', 0.9);
  addCyl(g, 0.14, 0.02, metal, 0, 0.01, 0);
  addCyl(g, 0.02, 1.3, metal, 0, 0.66, 0);
  const s = new THREE.Mesh(new THREE.ConeGeometry(0.18,0.28,16,1,true), shade);
  s.position.set(0,1.35,0); s.castShadow=true; g.add(s);
  return g;
}
function buildRug(color){
  const g = new THREE.Group();
  const m = mat(color, 1.0, 0);
  const r = new THREE.Mesh(new THREE.PlaneGeometry(2.0,1.4), m);
  r.rotation.x = -Math.PI/2; r.position.y = 0.005; r.receiveShadow = true;
  g.add(r);
  return g;
}

/* ---------- three.js scene setup ---------- */
const stage = document.getElementById('stage');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0c0a08);
scene.fog = new THREE.Fog(0x0c0a08, 9, 20);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);

const hemi = new THREE.HemisphereLight(0xfff2df, 0x201812, 0.65);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xfff2df, 0.9);
dir.position.set(4,6,3);
dir.castShadow = true;
dir.shadow.mapSize.set(1024,1024);
dir.shadow.camera.left = -6; dir.shadow.camera.right = 6;
dir.shadow.camera.top = 6; dir.shadow.camera.bottom = -6;
scene.add(dir);

let roomWidth = 5, roomDepth = 5;
let floorColorIdx = 0, wallColorIdx = 0;
let floorMesh, wallA, wallB;

function rebuildRoom(){
  [floorMesh, wallA, wallB].forEach(m=>{ if(m) scene.remove(m); });
  const floorMat = mat(FLOOR_COLORS[floorColorIdx], 0.85, 0);
  floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomDepth), floorMat);
  floorMesh.rotation.x = -Math.PI/2;
  floorMesh.receiveShadow = true;
  floorMesh.userData.isFloor = true;
  scene.add(floorMesh);

  const wallMat = mat(WALL_COLORS[wallColorIdx], 0.9, 0);
  const wallH = 2.6;
  wallA = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, wallH), wallMat);
  wallA.position.set(0, wallH/2, -roomDepth/2);
  wallA.receiveShadow = true;
  scene.add(wallA);

  wallB = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, wallH), wallMat.clone());
  wallB.position.set(-roomWidth/2, wallH/2, 0);
  wallB.rotation.y = Math.PI/2;
  wallB.receiveShadow = true;
  scene.add(wallB);

  clampAllToRoom();
}

/* ---------- camera orbit control (custom, no external deps) ---------- */
const camState = {theta: Math.PI*0.22, phi: 1.02, radius: 8, targetY: 0.4};
function updateCamera(){
  camera.position.x = camState.radius*Math.sin(camState.phi)*Math.sin(camState.theta);
  camera.position.z = camState.radius*Math.sin(camState.phi)*Math.cos(camState.theta);
  camera.position.y = camState.radius*Math.cos(camState.phi) + 0.2;
  camera.lookAt(0, camState.targetY, 0);
}
updateCamera();

function resize(){
  const w = stage.clientWidth, h = stage.clientHeight;
  camera.aspect = w/h; camera.updateProjectionMatrix();
  renderer.setSize(w,h);
}
window.addEventListener('resize', resize);

/* ---------- placed furniture state ---------- */
let placedItems = []; // {uid, catalogId, x, z, ry}
let objects = {}; // uid -> THREE.Group
let selectedUid = null;
let uidCounter = 1;
let spawnIdx = 0;

function catalogOf(id){ return CATALOG.find(c=>c.id===id); }

function addItem(catalogId, x, z, ry, uid){
  const c = catalogOf(catalogId);
  if(!c) return;
  const group = c.build(c.color);
  group.traverse(o=>{ o.userData.uid = uid; });
  group.position.set(x, 0, z);
  group.rotation.y = ry || 0;
  scene.add(group);
  objects[uid] = group;
}

function spawnPoint(){
  const pts = [[-0.25,-0.2],[0.25,-0.2],[-0.25,0.2],[0.25,0.2],[0,0]];
  const p = pts[spawnIdx % pts.length]; spawnIdx++;
  return { x: p[0]*roomWidth, z: p[1]*roomDepth };
}

function addFromCatalog(catalogId){
  const c = catalogOf(catalogId);
  const uid = 'i'+(uidCounter++);
  const {x,z} = spawnPoint();
  placedItems.push({uid, catalogId, x, z, ry:0});
  addItem(catalogId, x, z, 0, uid);
  select(uid);
  saveState();
  updateFooter();
}

function removeItem(uid){
  const g = objects[uid];
  if(g){ scene.remove(g); delete objects[uid]; }
  placedItems = placedItems.filter(p=>p.uid!==uid);
  if(selectedUid===uid) select(null);
  saveState();
  updateFooter();
}

function clampAllToRoom(){
  placedItems.forEach(p=>{
    const c = catalogOf(p.catalogId);
    const hw = roomWidth/2 - c.w/2, hd = roomDepth/2 - c.d/2;
    p.x = Math.max(-hw, Math.min(hw, p.x));
    p.z = Math.max(-hd, Math.min(hd, p.z));
    if(objects[p.uid]) objects[p.uid].position.set(p.x, 0, p.z);
  });
}

/* selection ring */
const ringGeo = new THREE.RingGeometry(0.3, 0.34, 32);
const ringMat = new THREE.MeshBasicMaterial({color:0xd8ae4d, side:THREE.DoubleSide, transparent:true, opacity:0.9});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = -Math.PI/2;
ring.visible = false;
scene.add(ring);

function select(uid){
  selectedUid = uid;
  const toolbar = document.getElementById('toolbar');
  if(!uid){ toolbar.style.display='none'; ring.visible=false; return; }
  const p = placedItems.find(p=>p.uid===uid);
  const c = catalogOf(p.catalogId);
  const maxDim = Math.max(c.w, c.d);
  ring.scale.set(maxDim*1.3, maxDim*1.3, 1);
  ring.position.set(p.x, 0.01, p.z);
  ring.visible = true;
  toolbar.style.display = 'flex';
  document.getElementById('selName').textContent = c.name;
  document.getElementById('selPrice').textContent = '$'+c.price;
}

function rotateSelected(deg){
  if(!selectedUid) return;
  const p = placedItems.find(p=>p.uid===selectedUid);
  p.ry += deg * Math.PI/180;
  objects[selectedUid].rotation.y = p.ry;
  saveState();
}

function moveSelected(dx, dz){
  if(!selectedUid) return;
  const p = placedItems.find(p=>p.uid===selectedUid);
  const c = catalogOf(p.catalogId);
  const hw = roomWidth/2 - c.w/2, hd = roomDepth/2 - c.d/2;
  p.x = Math.max(-hw, Math.min(hw, p.x + dx));
  p.z = Math.max(-hd, Math.min(hd, p.z + dz));
  objects[p.uid].position.set(p.x, 0, p.z);
  ring.position.set(p.x, 0.01, p.z);
  saveState();
}

/* ---------- keyboard shortcuts ---------- */
const NUDGE = 0.1;
window.addEventListener('keydown', (e)=>{
  const tag = (document.activeElement && document.activeElement.tagName) || '';
  if(tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return; // don't hijack sliders etc.
  if(!selectedUid) return;
  switch(e.key){
    case 'Delete':
    case 'Backspace':
      e.preventDefault();
      removeItem(selectedUid);
      break;
    case 'ArrowLeft':  e.preventDefault(); moveSelected(-NUDGE, 0); break;
    case 'ArrowRight': e.preventDefault(); moveSelected(NUDGE, 0); break;
    case 'ArrowUp':    e.preventDefault(); moveSelected(0, -NUDGE); break;
    case 'ArrowDown':  e.preventDefault(); moveSelected(0, NUDGE); break;
    case 'q': case 'Q': rotateSelected(-15); break;
    case 'e': case 'E': rotateSelected(15); break;
  }
});

/* ---------- pointer interaction: drag furniture OR orbit camera ---------- */
const raycaster = new THREE.Raycaster();
const floorPlane = new THREE.Plane(new THREE.Vector3(0,1,0), 0);
let drag = null; // {type:'move', uid, offX, offZ} or {type:'orbit', lastX, lastY}

function pointerToNDC(e){
  const rect = renderer.domElement.getBoundingClientRect();
  return new THREE.Vector2(
    ((e.clientX-rect.left)/rect.width)*2-1,
    -((e.clientY-rect.top)/rect.height)*2+1
  );
}
function floorHit(e){
  raycaster.setFromCamera(pointerToNDC(e), camera);
  const pt = new THREE.Vector3();
  raycaster.ray.intersectPlane(floorPlane, pt);
  return pt;
}

renderer.domElement.addEventListener('pointerdown', (e)=>{
  raycaster.setFromCamera(pointerToNDC(e), camera);
  const meshes = [];
  Object.values(objects).forEach(g=> g.traverse(o=>{ if(o.isMesh) meshes.push(o); }));
  const hits = raycaster.intersectObjects(meshes, false);
  if(hits.length){
    const uid = hits[0].object.userData.uid;
    select(uid);
    const p = placedItems.find(p=>p.uid===uid);
    const hitPt = floorHit(e);
    drag = {type:'move', uid, offX: hitPt.x - p.x, offZ: hitPt.z - p.z};
  } else {
    select(null);
    drag = {type:'orbit', lastX: e.clientX, lastY: e.clientY};
  }
});
window.addEventListener('pointermove', (e)=>{
  if(!drag) return;
  if(drag.type==='move'){
    const pt = floorHit(e);
    const p = placedItems.find(p=>p.uid===drag.uid);
    const c = catalogOf(p.catalogId);
    const hw = roomWidth/2 - c.w/2, hd = roomDepth/2 - c.d/2;
    p.x = Math.max(-hw, Math.min(hw, pt.x - drag.offX));
    p.z = Math.max(-hd, Math.min(hd, pt.z - drag.offZ));
    objects[p.uid].position.set(p.x,0,p.z);
    ring.position.set(p.x, 0.01, p.z);
  } else if(drag.type==='orbit'){
    const dx = e.clientX - drag.lastX, dy = e.clientY - drag.lastY;
    camState.theta -= dx*0.006;
    camState.phi = Math.max(0.25, Math.min(1.35, camState.phi - dy*0.006));
    drag.lastX = e.clientX; drag.lastY = e.clientY;
    updateCamera();
  }
});
window.addEventListener('pointerup', ()=>{
  if(drag && drag.type==='move'){ saveState(); }
  drag = null;
});
renderer.domElement.addEventListener('wheel', (e)=>{
  e.preventDefault();
  camState.radius = Math.max(3.5, Math.min(14, camState.radius + e.deltaY*0.004));
  updateCamera();
}, {passive:false});

/* ---------- UI: catalog + tabs ---------- */
const catalogEl = document.getElementById('catalog');
const tabsEl = document.getElementById('tabs');
let activeCat = 'all';

function renderTabs(){
  tabsEl.innerHTML='';
  CATS.forEach(c=>{
    const b = document.createElement('button');
    b.className = 'tab'+(c.id===activeCat?' active':'');
    b.textContent = c.label;
    b.onclick = ()=>{ activeCat = c.id; renderTabs(); renderCatalog(); };
    tabsEl.appendChild(b);
  });
}
function renderCatalog(){
  catalogEl.innerHTML='';
  CATALOG.filter(c=> activeCat==='all' || c.cat===activeCat).forEach(c=>{
    const card = document.createElement('div');
    card.className='card';
        const swatchBg = c.color ? c.color : `var(--${c.cat})`;
        const thumb = c.image ? `<img src="${c.image}" style="width:56px;height:56px;object-fit:cover;border-radius:6px;margin-right:10px;">` : `<div class="swatch" style="background:${swatchBg}"></div>`;
        card.innerHTML = `
          ${thumb}
          <div class="card-body">
            <div class="name">${c.name}</div>
            <div class="meta">${c.w.toFixed(2)}m × ${c.d.toFixed(2)}m</div>
            <div class="price">$${c.price}</div>
          </div>
          <div class="add-icon">+</div>`;
    card.onclick = ()=> addFromCatalog(c.id);
    catalogEl.appendChild(card);
  });
}
// load any previously saved custom catalog entries (images stored as data URLs)
function saveCatalog(){
  try{
    const custom = CATALOG.filter(it=> String(it.id).startsWith('u-')).map(it=>{
      const m = (it.modelUrl && typeof it.modelUrl === 'string' && it.modelUrl.startsWith('http')) ? it.modelUrl : null;
      return { id: it.id, name: it.name, price: it.price, cat: it.cat, w: it.w, d: it.d, color: it.color, image: it.image, modelUrl: m, modelName: it.modelName || null };
    });
    localStorage.setItem('mz-room-custom-catalog', JSON.stringify(custom));
  }catch(err){ console.warn('saveCatalog failed', err); }
}
function loadCatalog(){
  try{
    const raw = localStorage.getItem('mz-room-custom-catalog');
    if(!raw) return;
    const arr = JSON.parse(raw);
    arr.forEach(item=>{
      // rebuild runtime entry with a builder function
      const newItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        cat: item.cat,
        w: item.w,
        d: item.d,
        color: item.color,
        image: item.image,
        build: (cColor)=>{
          const g = new THREE.Group();
          if(item.modelUrl && typeof THREE.GLTFLoader !== 'undefined'){
            // placeholder
            addBox(g, Math.min(0.6,item.w), 0.02, Math.min(0.6,item.d), mat('#888', 1), 0, 0.01, 0);
            try{
              const loader = new THREE.GLTFLoader();
              loader.load(item.modelUrl, (gltf)=>{
                const model = gltf.scene || (gltf.scenes && gltf.scenes[0]);
                if(!model) return;
                model.traverse(n=>{ if(n.isMesh){ n.castShadow=true; n.receiveShadow=true; } });
                // scale to approximate size
                const box = new THREE.Box3().setFromObject(model);
                const size = new THREE.Vector3(); box.getSize(size);
                const sx = (item.w) / Math.max(size.x, 0.001);
                const sz = (item.d) / Math.max(size.z, 0.001);
                const s = Math.min(sx, sz, 1.5);
                model.scale.setScalar(s);
                const center = new THREE.Vector3(); box.getCenter(center);
                model.position.sub(center.multiplyScalar(s));
                g.clear(); g.add(model);
              }, undefined, (err)=>{ console.warn('GLTF load failed', err); });
            }catch(err){ console.warn('GLTF loader not available', err); }
            return g;
          }
          addBox(g, item.w, 0.45, item.d, mat(cColor || item.color || '#999', 0.6), 0, 0.225, 0);
          return g;
        }
      };
      CATALOG.push(newItem);
      if(!CATS.find(x=>x.id===item.cat)) CATS.push({id:item.cat, label:item.cat.charAt(0).toUpperCase()+item.cat.slice(1)});
    });
  }catch(err){ console.warn('loadCatalog failed', err); }
}

loadCatalog();
renderTabs(); renderCatalog();

// ---------- product upload / add-to-catalog handler ----------
document.getElementById('addProductBtn').addEventListener('click', ()=>{
  const name = document.getElementById('prodName').value.trim();
  const price = parseFloat(document.getElementById('prodPrice').value);
  const cat = document.getElementById('prodCat').value || 'other';
  const color = document.getElementById('prodColor').value || '#999999';
  const w = parseFloat(document.getElementById('prodWidth').value) || 1.0;
  const d = parseFloat(document.getElementById('prodDepth').value) || 0.5;
  if(!name){ showToast('Enter a product name'); return; }
  const id = 'u-'+Date.now();
  const imageFile = document.getElementById('prodImage').files && document.getElementById('prodImage').files[0];
  const modelFile = document.getElementById('prodModel').files && document.getElementById('prodModel').files[0];

  const addWithImageAndModel = (imageData, modelUrl, modelName)=>{
    const newItem = {
      id,
      name,
      price: isNaN(price) ? 0 : price,
      cat,
      w,
      d,
      color,
      image: imageData || null,
      modelUrl: modelUrl || null, // may be object URL (not persisted)
      modelName: modelName || null,
      build: (cColor)=>{
        const g = new THREE.Group();
        if(newItem.modelUrl && typeof THREE.GLTFLoader !== 'undefined'){
          // placeholder while loading
          addBox(g, Math.min(0.6,w), 0.02, Math.min(0.6,d), mat('#888', 1), 0, 0.01, 0);
          try{
            const loader = new THREE.GLTFLoader();
            loader.load(newItem.modelUrl, (gltf)=>{
              const model = gltf.scene || gltf.scenes && gltf.scenes[0];
              if(!model) return;
              model.traverse(n=>{ if(n.isMesh){ n.castShadow=true; n.receiveShadow=true; } });
              // scale model to roughly fit width/depth — crude fit: compute bbox
              const box = new THREE.Box3().setFromObject(model);
              const size = new THREE.Vector3(); box.getSize(size);
              const sx = (newItem.w) / Math.max(size.x, 0.001);
              const sz = (newItem.d) / Math.max(size.z, 0.001);
              const s = Math.min(sx, sz, 1.5);
              model.scale.setScalar(s);
              // center
              const center = new THREE.Vector3(); box.getCenter(center);
              model.position.sub(center.multiplyScalar(s));
              g.clear(); g.add(model);
            }, undefined, (err)=>{ console.warn('GLTF load failed', err); });
          }catch(err){ console.warn('GLTF loader not available', err); }
          return g;
        }
        // fallback: simple parametric block representing the product sized to the given w/d
        addBox(g, w, 0.45, d, mat(cColor || color, 0.6), 0, 0.225, 0);
        return g;
      }
    };
    CATALOG.push(newItem);
    saveCatalog();
    if(!CATS.find(x=>x.id===cat)) { CATS.push({id:cat, label:cat.charAt(0).toUpperCase()+cat.slice(1)}); renderTabs(); }
    renderCatalog();
    showToast('Product added to catalog');
    // clear inputs
    document.getElementById('prodName').value='';
    document.getElementById('prodPrice').value='';
    document.getElementById('prodImage').value = '';
    document.getElementById('prodModel').value = '';
    document.getElementById('prodPreview').style.display='none';
    const pm = document.getElementById('prodModelName'); if(pm){ pm.style.display='none'; pm.textContent=''; }
  };

  // read image first (if any), then create object URL for model (if any)
  if(imageFile){
    const reader = new FileReader();
    reader.onload = ()=>{
      const imgData = reader.result;
      if(modelFile){
        const modelUrl = URL.createObjectURL(modelFile);
        addWithImageAndModel(imgData, modelUrl, modelFile.name);
      } else {
        addWithImageAndModel(imgData, null, null);
      }
    };
    reader.readAsDataURL(imageFile);
  } else {
    if(modelFile){
      const modelUrl = URL.createObjectURL(modelFile);
      addWithImageAndModel(null, modelUrl, modelFile.name);
    } else {
      addWithImageAndModel(null, null, null);
    }
  }
});

document.getElementById('clearProductBtn').addEventListener('click', ()=>{
  document.getElementById('prodName').value='';
  document.getElementById('prodPrice').value='';
  document.getElementById('prodWidth').value='1.0';
  document.getElementById('prodDepth').value='0.5';
  document.getElementById('prodColor').value='#cccccc';
  document.getElementById('prodCat').value='seating';
  document.getElementById('prodImage').value='';
  const pv = document.getElementById('prodPreview'); if(pv){ pv.src=''; pv.style.display='none'; }
  const pm = document.getElementById('prodModelName'); if(pm){ pm.style.display='none'; pm.textContent=''; }
});

// preview selected image in the upload form
const prodImageEl = document.getElementById('prodImage');
if(prodImageEl){
  prodImageEl.addEventListener('change', (e)=>{
    const f = e.target.files && e.target.files[0];
    const pv = document.getElementById('prodPreview');
    if(!f){ if(pv){ pv.src=''; pv.style.display='none'; } return; }
    const r = new FileReader(); r.onload = ()=>{
      pv.src = r.result; pv.style.display='block';
    };
    r.readAsDataURL(f);
  });
}
// show selected model filename
const prodModelEl = document.getElementById('prodModel');
if(prodModelEl){
  prodModelEl.addEventListener('change', (e)=>{
    const f = e.target.files && e.target.files[0];
    const pm = document.getElementById('prodModelName');
    if(!f){ if(pm){ pm.style.display='none'; pm.textContent=''; } return; }
    pm.textContent = f.name; pm.style.display='inline-block';
  });
}

/* ---------- UI: settings panel ---------- */
function renderSwatches(containerId, colors, selectedIdx, onPick){
  const el = document.getElementById(containerId);
  el.innerHTML='';
  colors.forEach((hex,i)=>{
    const d = document.createElement('div');
    d.className = 'swatch-dot'+(i===selectedIdx?' selected':'');
    d.style.background = hex;
    d.onclick = ()=> onPick(i);
    el.appendChild(d);
  });
}
function renderSettings(){
  renderSwatches('floorSwatches', FLOOR_COLORS, floorColorIdx, (i)=>{ floorColorIdx=i; rebuildRoom(); renderSettings(); saveState(); });
  renderSwatches('wallSwatches', WALL_COLORS, wallColorIdx, (i)=>{ wallColorIdx=i; rebuildRoom(); renderSettings(); saveState(); });
  document.getElementById('wVal').textContent = roomWidth.toFixed(1);
  document.getElementById('dVal').textContent = roomDepth.toFixed(1);
  document.getElementById('widthSlider').value = roomWidth;
  document.getElementById('depthSlider').value = roomDepth;
}
document.getElementById('widthSlider').addEventListener('input', (e)=>{
  roomWidth = parseFloat(e.target.value); rebuildRoom(); renderSettings(); saveState();
});
document.getElementById('depthSlider').addEventListener('input', (e)=>{
  roomDepth = parseFloat(e.target.value); rebuildRoom(); renderSettings(); saveState();
});
document.getElementById('rotLeft').onclick = ()=> rotateSelected(-15);
document.getElementById('rotRight').onclick = ()=> rotateSelected(15);
document.getElementById('delSel').onclick = ()=> { if(selectedUid) removeItem(selectedUid); };
document.getElementById('resetBtn').onclick = ()=>{
  Object.keys(objects).forEach(uid=>{ scene.remove(objects[uid]); });
  objects = {}; placedItems = []; select(null);
  saveState(); updateFooter();
};
document.getElementById('cartBtn').onclick = ()=>{
  showToast(placedItems.length
    ? `In the live store, this sends ${placedItems.length} item(s) to your WooCommerce cart via the Store API.`
    : 'Add some furniture to the room first.');
};

function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(showToast._h);
  showToast._h = setTimeout(()=> t.classList.remove('show'), 3200);
}

function updateFooter(){
  const total = placedItems.reduce((sum,p)=> sum + catalogOf(p.catalogId).price, 0);
  document.getElementById('totalPrice').textContent = '$'+total.toLocaleString();
  document.getElementById('itemCount').textContent = placedItems.length + (placedItems.length===1 ? ' piece placed' : ' pieces placed');
}

/* ---------- persistence (browser localStorage) ----------
   Works on any real website. If you later move this into a
   logged-in WooCommerce account flow, swap these two functions
   for calls that save/load the layout against the customer's
   account (e.g. user meta via a small REST endpoint). */
let saveTimer = null;
function saveState(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(()=>{
    try{
      localStorage.setItem('mz-room-state', JSON.stringify({
        roomWidth, roomDepth, floorColorIdx, wallColorIdx, placedItems
      }));
    }catch(err){ console.warn('Storage save failed', err); }
  }, 400);
}
function loadState(){
  try{
    const raw = localStorage.getItem('mz-room-state');
    if(raw){
      const s = JSON.parse(raw);
      roomWidth = s.roomWidth || 5;
      roomDepth = s.roomDepth || 5;
      floorColorIdx = s.floorColorIdx || 0;
      wallColorIdx = s.wallColorIdx || 0;
      rebuildRoom();
      (s.placedItems||[]).forEach(p=>{
        placedItems.push(p);
        addItem(p.catalogId, p.x, p.z, p.ry, p.uid);
        uidCounter = Math.max(uidCounter, parseInt(p.uid.slice(1))+1);
      });
      renderSettings();
      updateFooter();
      return;
    }
  }catch(err){ /* no saved state yet, or storage blocked */ }
  rebuildRoom();
  renderSettings();
  updateFooter();
}

/* ---------- render loop ---------- */
function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
resize();
loadState();
animate();

const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleSidebar");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");

    toggleBtn.innerHTML =
        sidebar.classList.contains("collapsed") ? ">" : "☰";
});

const settingsPanel = document.getElementById("settings");
const closeSettingsBtn = document.getElementById("closeSettings");
const openSettingsBtn = document.getElementById("openSettings");

openSettingsBtn.addEventListener("click", () => {
    settingsPanel.classList.remove("hidden");
});

closeSettingsBtn.addEventListener("click", () => {
    settingsPanel.classList.add("hidden");
});