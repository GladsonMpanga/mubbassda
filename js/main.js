/* =========================================================
   MAIN.JS
   Shared behaviour for every public page:
   - sticky navbar on scroll
   - mobile nav toggle
   - active nav link highlighting
   - scroll-reveal animation
   - FAQ accordion
   - dynamic footer year
   - settings-driven links (whatsapp/facebook/youtube/playstore)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---- Sticky navbar ---- */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 40) navbar.classList.add("is-scrolled");
      else navbar.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("is-open");
      navLinks.classList.toggle("is-open");
      document.body.style.overflow = navLinks.classList.contains("is-open") ? "hidden" : "";
    });
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("is-open");
        navLinks.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---- Active nav link ---- */
  const currentPage = (window.location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav-links a[data-page]").forEach(link => {
    if (link.dataset.page === currentPage) link.classList.add("active");
  });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in-view"));
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq-item").forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      item.parentElement.querySelectorAll(".faq-item").forEach(other => {
        other.classList.remove("is-open");
        other.querySelector(".faq-answer").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("is-open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---- Footer year ---- */
  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Apply saved contact settings to every link marked with data-link ---- */
  if (typeof mubasGetSettings === "function") {
    const settings = mubasGetSettings();
    const map = {
      whatsapp: settings.whatsapp,
      facebook: settings.facebook,
      youtube: settings.youtube,
      playstore: settings.playstore,
      email: settings.email ? `mailto:${settings.email}` : null,
      phone: settings.phone ? `tel:${settings.phone.replace(/\s+/g, "")}` : null,
    };
    document.querySelectorAll("[data-link]").forEach(el => {
      const key = el.getAttribute("data-link");
      if (map[key]) el.setAttribute("href", map[key]);
    });
    document.querySelectorAll("[data-text]").forEach(el => {
      const key = el.getAttribute("data-text");
      if (settings[key]) el.textContent = settings[key];
    });
  }

  /* ---- Newsletter form (demo only, no backend) ---- */
  document.querySelectorAll(".footer-newsletter form").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input");
      const btn = form.querySelector("button");
      if (input && input.value.trim()) {
        const original = btn.textContent;
        btn.textContent = "Subscribed!";
        input.value = "";
        setTimeout(() => { btn.textContent = original; }, 2200);
      }
    });
  });

  /* ---- Contact form (demo only, no backend) ---- */
  const contactForm = document.querySelector("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = document.querySelector("#contactFormNote");
      if (note) {
        note.textContent = "Thank you! Your message has been received. We'll get back to you soon.";
        note.classList.add("is-visible");
      }
      contactForm.reset();
    });
  }

});
