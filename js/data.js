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
    title: "MUBAS SDA Club Students Visits QECH",
    date: "2026-06-28",
    category: "Spiritual",
    image: "images/news.jpg",
    excerpt: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Provident impedit quidem optio qui nulla quo inventore expedita, cumque quas odit, dolorem aspernatur hic ullam. Aut amet sapiente voluptates dignissimos obcaecati?",
  },
  {
    id: "n2",
    title: "New Music Coming",
    date: "2026-06-14",
    category: "Choir",
    image: "images/news2.jpg",
    excerpt: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Provident impedit quidem optio qui nulla quo inventore expedita, cumque quas odit, dolorem aspernatur hic ullam. Aut amet sapiente voluptates dignissimos obcaecati?",
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
  { id: "e1", name: "Gladson Mpanga", position: "Chairperson", image: "images/Mpanga.jpg" },
  { id: "e2", name: "Cifuniro Ngunda", position: "Vice Chairperson", image: "images/NGUNDA.jpg" },
  { id: "e3", name: "Ethel Majiga", position: "Committe Member", image: "images/Ethel.jpg" },
  { id: "e4", name: "Luciano Mussa", position: "Committe Member", image: "images/Mussa.jpg" },
  { id: "e5", name: "Innocent Kapombo", position: "Committe Member", image: "images/Kapombo.jpg" },
  { id: "e6", name: "Mirrium Jumbe", position: "Music Director", image: "images/Jumbe.jpg" },
  { id: "e7", name: "Serrif Banda", position: "Secretary", image: "images/Sherrif.jpg" },
  { id: "e8", name: "Grant Chisi", position: "Vice Secretary", image: "images/Chisi.jpg" },
  { id: "e9", name: "Precious Kundete", position: "AY Director", image: "images/Kundete.jpg" },
  { id: "e10", name: "Stepen Tchaile", position: "Evangelism Director", image: "images/Tchaile.jpg" },
  { id: "e11", name: "Levson Jenala", position: "Treasurer", image: "images/Levson.jpg" },
  { id: "e12", name: "Benjamin Zimba", position: "Welfare Librarian", image: "images/Zimba.jpg" },
  { id: "e13", name: "Zepha Malunga", position: "Vice Librarin", image: "images/Zepha.jpg" },
  { id: "e14", name: "Hope Kapale", position: "Health and Temperance Directorr", image: "images/Kapale.jpg" },
  { id: "e15", name: "Nikoleni Moyo", position: "Interest Coordinator", image: "images/Nikoleni.jpg" },
];

const DEFAULT_SETTINGS = {
  whatsapp: "https://wa.me/265887371847",
  facebook: "https://facebook.com/MUBAS SDA Club",
  youtube: "https://youtube.com/@MUBAS SDA Club",
  playstore: "https://play.google.com/store/apps/details?id=com.macintec.mubassdaclub",
  email: "mubassdaclub@gmail.com",
  phone: "+265 887 371 847",
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

const MUBAS_CONTENT_VERSION = "2026-10-25-2";

function mubasInitDB() {
  const savedVersion = localStorage.getItem(
    "mubas_content_version"
  );

  if (savedVersion !== MUBAS_CONTENT_VERSION) {
    mubasSave(MUBAS_DB_KEYS.news, DEFAULT_NEWS);
    mubasSave(MUBAS_DB_KEYS.executives, DEFAULT_EXECUTIVES);

    localStorage.setItem(
      "mubas_content_version",
      MUBAS_CONTENT_VERSION
    );
  }

  if (!localStorage.getItem(MUBAS_DB_KEYS.settings)) {
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
