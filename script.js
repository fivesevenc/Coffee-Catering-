const images = {
  hero: "assets/images/coffee-catering-setup.jpg",
  heroDetail: "assets/images/latte-art-closeup.jpg",
  baristaServe: "assets/images/barista-service-cologne.jpg",
  latte: "assets/images/coffee-cup-plants.jpg",
  baristaPour: "assets/images/barista-pouring-cafe-chocolate.jpg",
  machine: "assets/images/espresso-machine.jpg",
  corporate: "assets/images/corporate-coffee-event.jpg",
  tradefair: "assets/images/coffee-catering-van.jpg",
  cupHand: "assets/images/cafe-chocolate-cup.jpg",
  cafeFront: "assets/images/coffee-bike-cafe-front.jpg",
  rhine: "assets/images/coffee-bike-rhine.jpg",
  detailPlant: "assets/images/coffee-cup-plants.jpg",
  wedding: "assets/images/barista-coffee-machine.jpg",
  gallery1: "assets/images/mobile-coffee-bar-cologne.jpg",
  gallery2: "assets/images/latte-art-closeup.jpg",
  gallery3: "assets/images/barista-pouring-cafe-chocolate.jpg",
  gallery4: "assets/images/coffee-catering-setup.jpg",
  gallery5: "assets/images/cafe-chocolate-cup.jpg",
  gallery6: "assets/images/corporate-coffee-event.jpg",
  about: "assets/images/cologne-coffee-bike.jpg"
};

document.querySelectorAll("[data-img]").forEach((image) => {
  const key = image.dataset.img;
  if (images[key]) image.src = images[key];
});

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");

const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 18);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const parallax = document.querySelector("[data-parallax]");
window.addEventListener("scroll", () => {
  if (!parallax || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const offset = Math.min(window.scrollY * 0.08, 42);
  parallax.style.transform = `translateY(${offset}px)`;
}, { passive: true });

document.querySelectorAll("[data-accordion] details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll("[data-accordion] details").forEach((item) => {
      if (item !== detail) item.open = false;
    });
  });
});

const form = document.querySelector("[data-form]");
const note = document.querySelector("[data-form-note]");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  note.textContent = "Danke! Die Formularstruktur ist vorbereitet. Sobald ein Backend angebunden ist, wird die Anfrage versendet.";
  note.classList.add("success");
});
