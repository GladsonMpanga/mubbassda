/* =========================================================
   RENDER-EXECUTIVE.JS
   Renders the executive committee grid from the shared data store.
   ========================================================= */

function mubasExecCardHTML(member, index){
  const delay = (index % 4) + 1;
  return `
    <div class="card exec-card reveal reveal-delay-${delay}">
      <div class="exec-photo">
        <img src="${member.image}" alt="${member.name}" loading="lazy">
      </div>
      <div class="card-body">
        <h3>${member.name}</h3>
        <span class="exec-position">${member.position}</span>
      </div>
    </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#executiveGrid");
  if (!grid) return;
  const execs = mubasGetExecutives();
  grid.innerHTML = execs.map(mubasExecCardHTML).join("");

  const revealEls = grid.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("in-view"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in-view"));
  }
});
