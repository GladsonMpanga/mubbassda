/* =========================================================
   ADMIN.JS
   Powers the Admin Panel: login gate + CRUD for News,
   Executive Committee and Contact Settings.
   Everything is stored in the browser via localStorage
   (see js/data.js) so content updates need no code changes.
   NOTE: This is a client-side demo login for convenience,
   not a secure authentication system. For real production
   use, connect this panel to a proper backend.
   ========================================================= */

const ADMIN_PASSWORD_KEY = "mubas_admin_password";
const ADMIN_SESSION_KEY = "mubas_admin_session";
const DEFAULT_ADMIN_PASSWORD = "mubas2026";

let editingNewsId = null;
let editingExecId = null;

/* ---------- Auth ---------- */

function getAdminPassword(){
  return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_ADMIN_PASSWORD;
}

function isLoggedIn(){
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

function handleLogin(e){
  e.preventDefault();
  const input = document.querySelector("#adminPasswordInput");
  const errorEl = document.querySelector("#adminLoginError");
  if (input.value === getAdminPassword()){
    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    showDashboard();
  } else {
    errorEl.textContent = "Incorrect password. Please try again.";
    input.value = "";
    input.focus();
  }
}

function handleLogout(){
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  document.querySelector("#adminLogin").style.display = "flex";
  document.querySelector("#adminDashboard").style.display = "none";
}

function showDashboard(){
  document.querySelector("#adminLogin").style.display = "none";
  document.querySelector("#adminDashboard").style.display = "flex";
  refreshDashboardStats();
  renderNewsTable();
  renderExecTable();
  loadSettingsForm();
}

/* ---------- Toast ---------- */

function showToast(message, isError){
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.toggle("is-error", !!isError);
  toast.classList.add("is-visible");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

/* ---------- View switching ---------- */

function switchAdminView(viewName){
  document.querySelectorAll(".admin-view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".admin-nav button").forEach(b => b.classList.remove("active"));
  document.querySelector(`#view-${viewName}`).classList.add("active");
  document.querySelector(`.admin-nav button[data-view="${viewName}"]`).classList.add("active");
}

/* ---------- Dashboard stats ---------- */

function refreshDashboardStats(){
  document.querySelector("#statNewsCount").textContent = mubasGetNews().length;
  document.querySelector("#statExecCount").textContent = mubasGetExecutives().length;
  document.querySelector("#statGroupsCount").textContent = "15+";
}

/* ---------- NEWS CRUD ---------- */

function renderNewsTable(){
  const news = mubasGetNews().slice().sort((a,b) => new Date(b.date) - new Date(a.date));
  const tbody = document.querySelector("#newsTableBody");
  if (news.length === 0){
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--c-gray);padding:24px;">No news posted yet. Use the form below to add your first update.</td></tr>`;
    return;
  }
  tbody.innerHTML = news.map(item => `
    <tr>
      <td><img src="${item.image}" alt=""></td>
      <td>${item.title}</td>
      <td>${item.category}</td>
      <td>${mubasFormatDate(item.date)}</td>
      <td>
        <div class="table-actions">
          <button class="edit-btn" onclick="editNews('${item.id}')">Edit</button>
          <button class="delete-btn" onclick="deleteNews('${item.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function editNews(id){
  const item = mubasGetNews().find(n => n.id === id);
  if (!item) return;
  editingNewsId = id;
  document.querySelector("#newsFormTitle").textContent = "Edit News Post";
  document.querySelector("#newsTitle").value = item.title;
  document.querySelector("#newsCategory").value = item.category;
  document.querySelector("#newsDate").value = item.date;
  document.querySelector("#newsImage").value = item.image;
  document.querySelector("#newsExcerpt").value = item.excerpt;
  document.querySelector("#newsFormCancel").style.display = "inline-flex";
  window.scrollTo({ top: document.querySelector("#newsForm").offsetTop - 100, behavior: "smooth" });
}

function deleteNews(id){
  if (!confirm("Delete this news post? This cannot be undone.")) return;
  const news = mubasGetNews().filter(n => n.id !== id);
  mubasSave(MUBAS_DB_KEYS.news, news);
  renderNewsTable();
  refreshDashboardStats();
  showToast("News post deleted.");
}

function resetNewsForm(){
  editingNewsId = null;
  document.querySelector("#newsForm").reset();
  document.querySelector("#newsFormTitle").textContent = "Add News Post";
  document.querySelector("#newsFormCancel").style.display = "none";
}

function handleNewsSubmit(e){
  e.preventDefault();
  const title = document.querySelector("#newsTitle").value.trim();
  const category = document.querySelector("#newsCategory").value.trim() || "General";
  const date = document.querySelector("#newsDate").value || new Date().toISOString().slice(0,10);
  const image = document.querySelector("#newsImage").value.trim() || "images/news1.svg";
  const excerpt = document.querySelector("#newsExcerpt").value.trim();

  if (!title || !excerpt){
    showToast("Please fill in the title and description.", true);
    return;
  }

  let news = mubasGetNews();
  if (editingNewsId){
    news = news.map(n => n.id === editingNewsId ? { ...n, title, category, date, image, excerpt } : n);
    showToast("News post updated.");
  } else {
    news.push({ id: "n" + Date.now(), title, category, date, image, excerpt });
    showToast("News post published.");
  }
  mubasSave(MUBAS_DB_KEYS.news, news);
  resetNewsForm();
  renderNewsTable();
  refreshDashboardStats();
}

/* ---------- EXECUTIVE CRUD ---------- */

function renderExecTable(){
  const execs = mubasGetExecutives();
  const tbody = document.querySelector("#execTableBody");
  if (execs.length === 0){
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--c-gray);padding:24px;">No executive members added yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = execs.map(m => `
    <tr>
      <td><img src="${m.image}" alt=""></td>
      <td>${m.name}</td>
      <td>${m.position}</td>
      <td>
        <div class="table-actions">
          <button class="edit-btn" onclick="editExec('${m.id}')">Edit</button>
          <button class="delete-btn" onclick="deleteExec('${m.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function editExec(id){
  const m = mubasGetExecutives().find(e => e.id === id);
  if (!m) return;
  editingExecId = id;
  document.querySelector("#execFormTitle").textContent = "Edit Executive Member";
  document.querySelector("#execName").value = m.name;
  document.querySelector("#execPosition").value = m.position;
  document.querySelector("#execImage").value = m.image;
  document.querySelector("#execFormCancel").style.display = "inline-flex";
  window.scrollTo({ top: document.querySelector("#execForm").offsetTop - 100, behavior: "smooth" });
}

function deleteExec(id){
  if (!confirm("Remove this executive member?")) return;
  const execs = mubasGetExecutives().filter(e => e.id !== id);
  mubasSave(MUBAS_DB_KEYS.executives, execs);
  renderExecTable();
  refreshDashboardStats();
  showToast("Executive member removed.");
}

function resetExecForm(){
  editingExecId = null;
  document.querySelector("#execForm").reset();
  document.querySelector("#execFormTitle").textContent = "Add Executive Member";
  document.querySelector("#execFormCancel").style.display = "none";
}

function handleExecSubmit(e){
  e.preventDefault();
  const name = document.querySelector("#execName").value.trim();
  const position = document.querySelector("#execPosition").value.trim();
  const image = document.querySelector("#execImage").value.trim() || "images/exec-placeholder.svg";

  if (!name || !position){
    showToast("Please fill in the name and position.", true);
    return;
  }

  let execs = mubasGetExecutives();
  if (editingExecId){
    execs = execs.map(m => m.id === editingExecId ? { ...m, name, position, image } : m);
    showToast("Executive member updated.");
  } else {
    execs.push({ id: "e" + Date.now(), name, position, image });
    showToast("Executive member added.");
  }
  mubasSave(MUBAS_DB_KEYS.executives, execs);
  resetExecForm();
  renderExecTable();
  refreshDashboardStats();
}

/* ---------- SETTINGS ---------- */

function loadSettingsForm(){
  const s = mubasGetSettings();
  document.querySelector("#settingsWhatsapp").value = s.whatsapp || "";
  document.querySelector("#settingsFacebook").value = s.facebook || "";
  document.querySelector("#settingsYoutube").value = s.youtube || "";
  document.querySelector("#settingsPlaystore").value = s.playstore || "";
  document.querySelector("#settingsEmail").value = s.email || "";
  document.querySelector("#settingsPhone").value = s.phone || "";
  document.querySelector("#settingsAddress").value = s.address || "";
}

function handleSettingsSubmit(e){
  e.preventDefault();
  const settings = {
    whatsapp: document.querySelector("#settingsWhatsapp").value.trim(),
    facebook: document.querySelector("#settingsFacebook").value.trim(),
    youtube: document.querySelector("#settingsYoutube").value.trim(),
    playstore: document.querySelector("#settingsPlaystore").value.trim(),
    email: document.querySelector("#settingsEmail").value.trim(),
    phone: document.querySelector("#settingsPhone").value.trim(),
    address: document.querySelector("#settingsAddress").value.trim(),
  };
  mubasSave(MUBAS_DB_KEYS.settings, settings);
  showToast("Contact settings saved. Changes are now live across the site.");
}

function handlePasswordSubmit(e){
  e.preventDefault();
  const current = document.querySelector("#currentPassword").value;
  const next = document.querySelector("#newPassword").value;
  if (current !== getAdminPassword()){
    showToast("Current password is incorrect.", true);
    return;
  }
  if (!next || next.length < 4){
    showToast("New password must be at least 4 characters.", true);
    return;
  }
  localStorage.setItem(ADMIN_PASSWORD_KEY, next);
  document.querySelector("#passwordForm").reset();
  showToast("Password updated successfully.");
}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", () => {
  if (isLoggedIn()) showDashboard();

  document.querySelector("#adminLoginForm").addEventListener("submit", handleLogin);
  document.querySelectorAll(".admin-logout").forEach(b => b.addEventListener("click", handleLogout));

  document.querySelectorAll(".admin-nav button[data-view]").forEach(btn => {
    btn.addEventListener("click", () => switchAdminView(btn.dataset.view));
  });

  document.querySelector("#newsForm").addEventListener("submit", handleNewsSubmit);
  document.querySelector("#newsFormCancel").addEventListener("click", resetNewsForm);

  document.querySelector("#execForm").addEventListener("submit", handleExecSubmit);
  document.querySelector("#execFormCancel").addEventListener("click", resetExecForm);

  document.querySelector("#settingsForm").addEventListener("submit", handleSettingsSubmit);
  document.querySelector("#passwordForm").addEventListener("submit", handlePasswordSubmit);
});
