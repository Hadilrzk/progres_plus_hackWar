const DATA = {
      student: {
          name: "Amira k.", initials: "AM",
          level: "Licence 2 (L2)", major: "Mathematics",
          section: "Section:1", group: "G:1",
          year: "2025 / 2026", semester: 3, date: "28 feb 2026"
        },
        scholarship: { status: "Paid", amount: 4000, date: "12 feb 2026" },
        activeSem: "S3",
        semesters: {
          S3: { credits: 60, modules: [
                { name: "Algebre 3", coeff: 3, cc: 7, exam: 3, isNew: false },
                { name: "Analysis 3", coeff: 4, cc: 12, exam: 14, isNew: true },
                { name: "Topology", coeff: 3, cc: 9, exam: 3, isNew: true },
                { name: "Numerical analysis",coeff: 3, cc: 17, exam: 17, isNew: true },
                { name: "OPM", coeff: 1, cc: 17, exam: 14.5, isNew: true },
                { name: "Mathematical logic",coeff: 2, cc: 12.5, exam: 14.88, isNew: true }
          ]},
           S4: { credits: 60, modules: [] },
           S2: { credits: 60, modules: [] },
           S1: { credits: 60, modules: [] }
       },
       timetable: {
         Sunday: [
            { type:"c", name:"Numerical analysis", teacher:"Mme.Hhhh", room:"S.252" },
            { type:"td", name:"Alg 3", teacher:"Mme.Hhhh", room:"S.252" },
            { type:"td", name:"Numerical analysis", teacher:"Mme.Hhhh", room:"S.252" }
          ],
         Monday: [
           { type:"td", name:"Analysis 3", teacher:"Mme.Hhhh", room:"S.252" },
           { type:"c", name:"Topology", teacher:"Mme.Hhhh", room:"S.252" },
           { type:"c", name:"Math logic", teacher:"Mme.Hhhh", room:"S.252" }
          ],
         Tuesday: [
           { type:"c", name:"Analysis", teacher:"Mme.Hhhh", room:"S.252" },
           { type:"td", name:"Math logic", teacher:"Mme.Hhhh", room:"S.252" },
           { type:"td", name:"Numerical analysis", teacher:"Mme.Hhhh", room:"S.252" }
         ],
          Wednesday: [
           { type:"td", name:"Topology", teacher:"Mme.Hhhh", room:"S.252" },
          { type:"tp", name:"OPM", teacher:"Mme.Hhhh", room:"S.252", time:"10:00–12:00" },
         null
         ],
         Thursday: [
           { type:"td", name:"Analysis", teacher:"Mme.Hhhh", room:"S.252" },
           { type:"tp", name:"Num ana", teacher:"Mme.Hhhh", room:"S.252", time:"10:00–12:00" },
           null
          ]
        },
        todayDay: "Sunday",
        nextEvent: { date:"12 MAR", name:"Resit Session", day:"Saturday" },
        calendar: [
           { month:"February 2026", events:[
              { date:"12 Feb", name:"Scholarship Payment", desc:"Versement 4 000 DA", tag:"tag-event", label:"Payment" },
             ]},
           { month:"March 2026", events:[
             { date:"7–18 Mar", name:"Resit Session", desc:"All S3 failed modules", tag:"tag-session", label:"Resit" },
             { date:"20 Mar", name:"Start of S4 courses", desc:"Semester 4 begins", tag:"tag-event", label:"Academic" }
           ]},
           { month:"January 2026", events:[
           { date:"15–25 Jan", name:"Exams S3", desc:"Semester 3 final exams", tag:"tag-exam", label:"Exam" }
            ]},

        ]
};

/* calculation */
function moduleAvg(m) {
    if (m.cc === null && m.exam === null) return null;
    if (m.cc === null) return m.exam;
    if (m.exam === null) return m.cc;
    return m.cc * 0.4 + m.exam * 0.6;
}
function semAvg(key) {
    let w = 0, c = 0;
    DATA.semesters[key].modules.forEach(m => {
    const a = moduleAvg(m);
    if (a !== null) { w += a * m.coeff; c += m.coeff; }
    });
   return c > 0 ? (w / c).toFixed(2) : "—";
}
function semPassed(key) {
   return DATA.semesters[key].modules.filter(m => { const a = moduleAvg(m); return a !== null && a >= 10; }).length;
}
function newModules(key) { return DATA.semesters[key].modules.filter(m => m.isNew); }

/* helprs */
const $ = id => document.getElementById(id);
const set = (id, v) => { const el=$(id); if(el) el.textContent=v; };
const gradeClass = v => v===null ? 'mn' : v>=10 ? 'mg' : 'mr';

/* render */
function renderDashboard() {
    const s = DATA.student, sch = DATA.scholarship, sem = DATA.activeSem;
    const avg = semAvg(sem), passed = semPassed(sem), total = DATA.semesters[sem].modules.length;
    const newMods = newModules(sem);
    set('dash-meta', `semestre ${s.semester} · ${s.date}`);
    set('d-avg', avg);
    set('d-passed', passed);
    set('d-total', `/ ${total}`);
    set('d-schol', sch.status);
    set('d-schol-amt', `${sch.amount.toLocaleString()} DA`);
    set('cal-day', DATA.nextEvent.day);
    set('cal-date', DATA.nextEvent.date);
    set('cal-ev', DATA.nextEvent.name);

    const bar = $('notif-bar');
    if (bar) {
        bar.style.display = newMods.length ? 'flex' : 'none';
        if (newMods.length) {
          set('notif-bar-title', 'New note available !');
          set('notif-bar-sub', `${newMods[0].name} · published just now`);
        }
    }

    const slots = ["08:00–09:30","10:00–11:30","12:00–13:30"];
    const labels = { c:"Cour", td:"TD", tp:"TP" };
    const tc = $('today-classes');
    if (tc) tc.innerHTML = (DATA.timetable[DATA.todayDay]||[]).map((cl,i) => cl ? `
       <div class="chip">
         <div class="chip-type">${labels[cl.type]}</div>
         <div class="chip-name">${cl.name}</div>
         <div class="chip-info">${cl.teacher} · ${cl.room}</div>
         <div class="chip-info">${cl.time||slots[i]}</div>
       </div>` : '').join('');
}

function renderMarks(key) {
    const sem = DATA.semesters[key];
    const avg = semAvg(key);
    const dec = parseFloat(avg) >= 10 ? "Admis(e)" : "Ajourné(e)";
    set('marks-meta', `semestre ${key.replace('S','')} · ${DATA.student.date}`);
    set('m-avg', `Annual average: ${avg}`);
    set('m-cred', `Credits: ${sem.credits}`);
    const decEl = $('m-dec');
    if (decEl) { decEl.textContent=`Decision: ${dec}`; decEl.className=`mm-d ${dec.includes('Admis')?'pass':'fail'}`; }
    const tbody = $('marks-body');
    if (!tbody) return;
    if (!sem.modules.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:20px">No data for ${key}</td></tr>`;
     return;
    }
    tbody.innerHTML = sem.modules.map(m => {
      const a = moduleAvg(m);
      return `<tr id="row-${m.name.replace(/\s+/g,'-')}">
      <td>${m.name}${m.isNew?'<span class="new-tag">New</span>':''}</td>
      <td>${m.coeff}</td>
      <td><span class="${gradeClass(m.cc)}">${m.cc??'—'}</span></td>
      <td><span class="${gradeClass(m.exam)}">${m.exam??'—'}</span></td>
      <td class="${gradeClass(a)}">${a!==null?a.toFixed(2):'—'}</td>
      </tr>`;
    }).join('');
}

function renderSemTabs() {
    const tabs = $('sem-tabs');
    if (!tabs) return;
    tabs.innerHTML = Object.keys(DATA.semesters).map(k =>
      `<button class="st ${k===DATA.activeSem?'on':''}" onclick="switchSem('${k}')">${k}</button>`
    ).join('');
}
function switchSem(key) { DATA.activeSem=key; renderSemTabs(); renderMarks(key); }

function renderTimetable() {
   set('tt-meta', `semestre ${DATA.student.semester} · ${DATA.student.date}`);
   const labels = { c:"Cour", td:"TD", tp:"TP" };
   const tbody = $('tt-body');
   if (!tbody) return;
    tbody.innerHTML = Object.entries(DATA.timetable).map(([day,cells]) =>
       `<tr><td class="day-td">${day}</td>${cells.map((cl,i) => cl
       ? `<td><div class="ttc ${cl.type}">
      <div class="ttc-type">${labels[cl.type]}</div>
      <div class="ttc-name">${cl.name}</div>
      <div class="ttc-info">${cl.teacher} · ${cl.room}</div>
      ${cl.time?`<div class="ttc-info">${cl.time}</div>`:''}
     </div></td>`
     : `<td><span class="tt-empty">—</span></td>`
   ).join('')}</tr>`
 ).join('');
}

function renderProfile() {
   const s = DATA.student, sch = DATA.scholarship;
   set('prof-meta', `semestre ${s.semester} · ${s.date}`);
   set('p-init', s.initials); set('p-name', s.name); set('p-year', s.year); set('p-year2', s.year);
   set('p-level', s.level); set('p-major', s.major);
   set('p-section', `${s.section} · ${s.group}`);
   set('p-schol-s', `${sch.status==='Paid'?'✅':' ❌'} Scholarship : ${sch.status}`);
   set('p-schol-a', `${sch.amount.toLocaleString()} DA`);
   set('p-schol-d', `versement ${sch.date}`);
   
}

function renderCalModal() {
   const body = $('modal-body');
   if (!body) return;
   body.innerHTML = DATA.calendar.map(m=>`
   <div class="cal-month">
   <div class="cal-month-title">${m.month}</div>
   ${m.events.map(e=>`
   <div class="cal-event-row">
   <div class="cal-ev-date">${e.date}</div>
   <div class="cal-ev-info">
   <h5>${e.name}</h5><p>${e.desc}</p>
   <span class="cal-tag ${e.tag}">${e.label}</span>
   </div>
    </div>`).join('')}
   </div>`).join('');
}

function buildNotifs() {
   const list = [];
   Object.keys(DATA.semesters).forEach(key => {
      newModules(key).forEach(m => list.push({ icon:"📝", title:"New note available!", sub:`${m.name} · ${key}`, time:"just now", mod:m.name }));
   });
   list.push({ icon:"📅", title:"Resit Session reminder", sub:"Starts 12 March 2026", time:"1 hour ago", mod:null });
   list.push({ icon:"✅", title:"Scholarship paid", sub:`${DATA.scholarship.amount} DA`, time:"16 days ago", mod:null });
   return list;
}

function renderNotifs(listId) {
   const el = $(listId);
   if (!el) return;
   el.innerHTML = buildNotifs().map((n,i)=>`
     <div class="nd-item ${i===0?'unread':''}" onclick="notifClick(${i})">
     <div class="nd-icon">${n.icon}</div>
     <div class="nd-body"><h5>${n.title}</h5><p>${n.sub}</p><div class="nd-time">${n.time}</div></div>
     ${i===0?'<div class="nd-dot"></div>':''}
    </div>`).join('');
}

function notifClick(i) {
    const n = buildNotifs()[i]; clearNotifs();
   if (n.mod) { goSec('marks'); flashRow(n.mod); }
}

function flashRow(modName) {
   const id = 'row-' + modName.replace(/\s+/g,'-');
    setTimeout(() => {
       const row = $(id);
       if (!row) return;
      row.scrollIntoView({ behavior:'smooth', block:'center' });
      row.style.transition='background .3s'; row.style.background='#BFDBFE';
      setTimeout(() => row.style.background='', 1200);
    }, 200);
}

/* TOAST */
function showToast(modName) {
    const t = document.createElement('div');
    t.style.cssText='position:fixed;top:70px;right:20px;z-index:999;background:#fff;border:1px solid #DDDBD4;border-radius:14px;padding:14px 16px;box-shadow:0 8px 30px rgba(0,0,0,.15);max-width:340px;width:calc(100vw - 40px);display:flex;gap:12px;align-items:center;animation:toastIn .3s ease';
    t.innerHTML=`
      <div style="width:38px;height:38px;background:var(--blue);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">📝</div>
      <div style="flex:1"><div style="font-size:13px;font-weight:700">New note available!</div><div style="font-size:12px;color:var(--muted)">${modName} · just now</div></div>
      <button onclick="goSec('marks');flashRow('${modName}');this.parentElement.remove()"
      style="padding:6px 12px;background:var(--blue);color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;white-space:nowrap">See now</button>`;
      document.body.appendChild(t);
    const s=document.createElement('style');
    s.textContent='@keyframes toastIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}';
    document.head.appendChild(s);
    setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity .4s'; setTimeout(()=>t.remove(),400); }, 5000);
}

/* navigation */
function openApp() {
    $('login-page').classList.remove('active');
    $('app-page').classList.add('active');
    init();
    const nm = newModules(DATA.activeSem);
    if (nm.length) setTimeout(() => showToast(nm[0].name), 1200);
}
function closeApp() {
   $('app-page').classList.remove('active');
   $('login-page').classList.add('active');
}

function goSec(id) {
   document.querySelectorAll('.sec').forEach(s => s.classList.remove('on'));
   document.querySelectorAll('[data-sec]').forEach(b => b.classList.remove('on'));
   $(id).classList.add('on');
   document.querySelectorAll(`[data-sec="${id}"]`).forEach(b => b.classList.add('on'));
   $('notif-dropdown').classList.remove('open');
  closeSidebar();
}

document.querySelectorAll('[data-sec]').forEach(btn =>
  btn.addEventListener('click', () => goSec(btn.dataset.sec))
);

/* sidebar */
function openSidebar() {
   $('sidebar').classList.add('open');
    $('sidebar-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeSidebar() {
   $('sidebar').classList.remove('open');
   $('sidebar-overlay').classList.remove('open');
document.body.style.overflow = '';
}

/* notif */
function toggleNotif() {
  $('notif-dropdown').classList.toggle('open');
}
function clearNotifs() {
   $('notif-dot').style.display='none';
   document.querySelectorAll('.nd-item.unread').forEach(el=>el.classList.remove('unread'));
   document.querySelectorAll('.nd-dot').forEach(el=>el.remove());
   $('notif-dropdown').classList.remove('open');
}
document.addEventListener('click', e => {
   const dd=$('notif-dropdown'), bell=$('bell-btn');
   if (dd?.classList.contains('open') && !dd.contains(e.target) && !bell.contains(e.target))
  dd.classList.remove('open');
});

/* mosal */
function openModal() { $('modal').classList.add('open'); document.body.style.overflow='hidden'; }
function closeModal(e) { if (!e||e.target===$('modal')||!e.target) { $('modal').classList.remove('open'); document.body.style.overflow=''; } }

/* init */
function init() {
   const s = DATA.student;
   set('sb-av', s.initials);
   set('sb-nm', s.name);
   set('sb-info', `${s.section} · ${s.group}`);
   renderDashboard();
   renderSemTabs();
   renderMarks(DATA.activeSem);
   renderTimetable();
   renderProfile();
   renderCalModal();
   renderNotifs('nd-list');
   $('notif-dot').style.display = 'block';
}



