/* =========================================================
   DATA.JS
   Default (dummy) content + a tiny localStorage "database".
   The Admin Panel (admin.html) reads and writes these same
   keys, so anything edited there appears on the live pages
   immediately — no code changes required.
   ========================================================= */

const MUBAS_DB_KEYS = {
  news: "mubas_news",
  executives: "mubas_executives",
  settings: "mubas_settings",
};

/* ---------- Default dummy data (used the first time the site loads) ---------- */

const DEFAULT_NEWS = [
  {
    id: "n1",
    title: "Annual Week of Prayer Concludes in Power",
    date: "2026-06-28",
    category: "Spiritual",
    image: "images/news1.svg",
    excerpt: "Members gathered for seven days of consecration, testimony and song as the club closed its Annual Week of Prayer with a powerful Sabbath service.",
  },
  {
    id: "n2",
    title: "Club Choir Wins Best Choral Group at Inter-College Fest",
    date: "2026-06-14",
    category: "Choir",
    image: "images/news2.svg",
    excerpt: "The MUBAS SDA Club Choir represented the club with distinction, taking home the top prize at this year's inter-college choral festival.",
  },
  {
    id: "n3",
    title: "New Executive Committee Sworn In",
    date: "2026-05-30",
    category: "Leadership",
    image: "images/news3.svg",
    excerpt: "A new 15-member executive committee was commissioned during Sabbath worship to serve the club for the coming term.",
  },
  {
    id: "n4",
    title: "Watchmans Trumpet Launches Community Outreach",
    date: "2026-05-10",
    category: "Outreach",
    image: "images/news4.svg",
    excerpt: "Our media ministry, Watchmans Trumpet, kicked off a new outreach programme sharing short devotionals across campus.",
  },
];

const DEFAULT_EXECUTIVES = [
  { id: "e1", name: "Blessings Mvula", position: "Club President", image: "images/exec-placeholder.svg" },
  { id: "e2", name: "Grace Chirwa", position: "Vice President", image: "images/exec-placeholder.svg" },
  { id: "e3", name: "Emmanuel Phiri", position: "General Secretary", image: "images/exec-placeholder.svg" },
  { id: "e4", name: "Ruth Banda", position: "Assistant Secretary", image: "images/exec-placeholder.svg" },
  { id: "e5", name: "Joseph Kamanga", position: "Treasurer", image: "images/exec-placeholder.svg" },
  { id: "e6", name: "Faith Nyirenda", position: "Choir Director", image: "images/exec-placeholder.svg" },
  { id: "e7", name: "David Mbewe", position: "Assistant Choir Director", image: "images/exec-placeholder.svg" },
  { id: "e8", name: "Patricia Zimba", position: "AYS Leader", image: "images/exec-placeholder.svg" },
  { id: "e9", name: "Samuel Tembo", position: "Watchmans Trumpet Coordinator", image: "images/exec-placeholder.svg" },
  { id: "e10", name: "Esther Munthali", position: "Prayer Band Coordinator", image: "images/exec-placeholder.svg" },
  { id: "e11", name: "Peter Chirambo", position: "Publicity & Media", image: "images/exec-placeholder.svg" },
  { id: "e12", name: "Mercy Kachale", position: "Welfare Officer", image: "images/exec-placeholder.svg" },
  { id: "e13", name: "Isaac Gondwe", position: "Sports & Social Officer", image: "images/exec-placeholder.svg" },
  { id: "e14", name: "Hannah Msiska", position: "Small Groups Coordinator", image: "images/exec-placeholder.svg" },
  { id: "e15", name: "Moses Nkhoma", position: "Sergeant-at-Arms", image: "images/exec-placeholder.svg" },
];

const DEFAULT_SETTINGS = {
  whatsapp: "https://wa.me/265999000000",
  facebook: "https://facebook.com/mubassdaclub",
  youtube: "https://youtube.com/@mubassdaclub",
  playstore: "https://play.google.com/store/apps/details?id=com.mubas.sdaclub",
  email: "mubassdaclub@mubas.ac.mw",
  phone: "+265 999 000 000",
  address: "Malawi University of Business and Applied Sciences (MUBAS), Blantyre, Malawi",
};

/* ---------- localStorage helpers ---------- */

function mubasLoad(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    if(!raw) return fallback;
    return JSON.parse(raw);
  }catch(e){
    console.error("MUBAS DB read error for", key, e);
    return fallback;
  }
}

function mubasSave(key, value){
  try{
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }catch(e){
    console.error("MUBAS DB write error for", key, e);
    return false;
  }
}

function mubasInitDB(){
  if(!localStorage.getItem(MUBAS_DB_KEYS.news)){
    mubasSave(MUBAS_DB_KEYS.news, DEFAULT_NEWS);
  }
  if(!localStorage.getItem(MUBAS_DB_KEYS.executives)){
    mubasSave(MUBAS_DB_KEYS.executives, DEFAULT_EXECUTIVES);
  }
  if(!localStorage.getItem(MUBAS_DB_KEYS.settings)){
    mubasSave(MUBAS_DB_KEYS.settings, DEFAULT_SETTINGS);
  }
}

function mubasGetNews(){ return mubasLoad(MUBAS_DB_KEYS.news, DEFAULT_NEWS); }
function mubasGetExecutives(){ return mubasLoad(MUBAS_DB_KEYS.executives, DEFAULT_EXECUTIVES); }
function mubasGetSettings(){ return mubasLoad(MUBAS_DB_KEYS.settings, DEFAULT_SETTINGS); }

function mubasFormatDate(iso){
  try{
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }catch(e){ return iso; }
}

/* Run on every page load */
mubasInitDB();
