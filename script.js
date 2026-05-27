const images = {
  hero: "assets/images/coffee-catering-setup.jpg",
  heroDetail: "assets/images/latte-art-closeup.jpg",
  baristaServe: "assets/images/barista-service-cologne.jpg",
  latte: "assets/images/espresso-machine.jpg",
  baristaPour: "assets/images/barista-pouring-cafe-chocolate.jpg",
  machine: "assets/images/corporate-coffee-event.jpg",
  corporate: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  tradefair: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
  weddingEvent: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  birthday: "https://images.pexels.com/photos/27176119/pexels-photo-27176119.jpeg?auto=compress&cs=tinysrgb&w=1200",
  summerParty: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80",
  privateParty: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
  wedding: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80",
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

document.querySelectorAll('input[type="date"]').forEach((input) => {
  input.addEventListener("click", () => {
    if (typeof input.showPicker === "function") input.showPicker();
  });
});

const form = document.querySelector("[data-form]");
const note = document.querySelector("[data-form-note]");
const modal = document.querySelector("[data-modal]");
const modalClose = document.querySelector("[data-modal-close]");

const openModal = () => {
  modal.hidden = false;
  modalClose.focus();
};

const closeModal = () => {
  modal.hidden = true;
};

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = new FormData(form);
  const button = form.querySelector('button[type="submit"]');

  if (data.get("_honey")) return;

  note.textContent = "";
  note.classList.remove("success", "error");
  button.disabled = true;
  button.textContent = "Wird gesendet...";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(Object.fromEntries(data))
    });

    if (!response.ok) throw new Error("Formular konnte nicht gesendet werden.");

    openModal();
    form.reset();
  } catch (error) {
    note.textContent = "Die Anfrage konnte gerade nicht gesendet werden. Bitte schreibe direkt an info@cafechocolate.de.";
    note.classList.add("error");
  } finally {
    button.disabled = false;
    button.textContent = "Unverbindlich anfragen";
  }
});
