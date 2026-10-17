/* =========================================================
   RENDER-NEWS.JS
   Renders news cards from the shared data store.
   - #newsPreviewGrid  -> latest 3 items (home page)
   - #newsFullGrid     -> all items (news page)
   ========================================================= */

function mubasNewsCardHTML(item){
  return `
    <article class="card news-card reveal">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="card-body">
        <span class="news-date">${mubasFormatDate(item.date)} &middot; ${item.category}</span>
        <h3>${item.title}</h3>
        <p>${item.excerpt}</p>
      </div>
    </article>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const news = mubasGetNews().slice().sort((a,b) => new Date(b.date) - new Date(a.date));

  const preview = document.querySelector("#newsPreviewGrid");
  if (preview) {
    preview.innerHTML = news.slice(0, 3).map(mubasNewsCardHTML).join("");
  }

  const full = document.querySelector("#newsFullGrid");
  if (full) {
    if (news.length === 0) {
      full.innerHTML = `<p class="text-gray">No news posted yet. Please check back soon.</p>`;
    } else {
      full.innerHTML = news.map(mubasNewsCardHTML).join("");
    }
  }

  // Re-trigger reveal observer for injected cards
  const revealEls = document.querySelectorAll(".reveal:not(.in-view)");
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
