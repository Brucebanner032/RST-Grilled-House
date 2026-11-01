
// ==========================
// RST GRILLED HOUSE
// script.js
// ==========================

document.addEventListener("DOMContentLoaded", () => {

  // ==========================
  // LOADER
  // ==========================
  const loader = document.getElementById("loader");

  window.addEventListener("load", () => {
    setTimeout(() => {
      if (loader) {
        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
        loader.style.transition = "0.5s ease";
      }
    }, 800);
  });

  // ==========================
  // DARK MODE
  // ==========================
  const themeBtn = document.getElementById("theme-toggle");

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    if (themeBtn) themeBtn.textContent = "☀️";
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      const darkMode =
        document.body.classList.contains("dark-mode");

      localStorage.setItem(
        "theme",
        darkMode ? "dark" : "light"
      );

      themeBtn.textContent = darkMode ? "☀️" : "🌙";
    });
  }

  // ==========================
  // MOBILE MENU
  // ==========================
  const hamburger =
    document.querySelector(".hamburger");

  const navLinks =
    document.querySelector(".nav-links");

  if (hamburger && navLinks) {

    hamburger.addEventListener("click", () => {

      if (
        navLinks.style.display === "flex"
      ) {
        navLinks.style.display = "none";
      } else {
        navLinks.style.display = "flex";
        navLinks.style.flexDirection = "column";
        navLinks.style.position = "absolute";
        navLinks.style.top = "80px";
        navLinks.style.right = "20px";
        navLinks.style.padding = "20px";
        navLinks.style.borderRadius = "12px";
        navLinks.style.background =
          "rgba(0,0,0,0.95)";
        navLinks.style.gap = "15px";
      }

    });

  }

  // ==========================
  // CLOSE MENU WHEN LINK CLICKED
  // ==========================
  document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

      link.addEventListener("click", () => {

        if (
          window.innerWidth <= 768 &&
          navLinks
        ) {
          navLinks.style.display = "none";
        }

      });

    });

  // ==========================
  // SMOOTH SCROLL
  // ==========================
  document
    .querySelectorAll('a[href^="#"]')
    .forEach(anchor => {

      anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target =
          document.querySelector(
            this.getAttribute("href")
          );

        if (target) {

          window.scrollTo({
            top:
              target.offsetTop - 70,
            behavior: "smooth"
          });

        }

      });

    });

  // ==========================
  // NAVBAR BACKGROUND CHANGE
  // ==========================
  const navbar =
    document.querySelector(".navbar");

  window.addEventListener("scroll", () => {

    if (!navbar) return;

    if (window.scrollY > 100) {
      navbar.style.background =
        "rgba(0,0,0,0.95)";
      navbar.style.boxShadow =
        "0 5px 20px rgba(0,0,0,0.3)";
    } else {
      navbar.style.background =
        "rgba(0,0,0,0.6)";
      navbar.style.boxShadow = "none";
    }

  });

  // ==========================
  // FADE-IN ANIMATIONS
  // ==========================
  const animatedItems =
    document.querySelectorAll(
      ".food-card, .feature-card, .stat-card, .testimonial-card"
    );

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.style.opacity = "1";
            entry.target.style.transform =
              "translateY(0)";

          }

        });

      },
      {
        threshold: 0.15
      }
    );

  animatedItems.forEach(item => {

    item.style.opacity = "0";
    item.style.transform =
      "translateY(40px)";
    item.style.transition =
      "all 0.8s ease";

    observer.observe(item);

  });

  // ==========================
  // GALLERY LIGHTBOX
  // ==========================
  const galleryImages =
    document.querySelectorAll(
      ".gallery-grid img"
    );

  galleryImages.forEach(img => {

    img.addEventListener("click", () => {

      const overlay =
        document.createElement("div");

      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.background =
        "rgba(0,0,0,0.95)";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent =
        "center";
      overlay.style.zIndex = "9999";

      const image =
        document.createElement("img");

      image.src = img.src;
      image.style.maxWidth = "90%";
      image.style.maxHeight = "90%";
      image.style.borderRadius = "12px";

      overlay.appendChild(image);

      document.body.appendChild(
        overlay
      );

      overlay.addEventListener(
        "click",
        () => {
          overlay.remove();
        }
      );

    });

  });

  // ==========================
  // RESERVATION FORM
  // ==========================
  const form =
    document.querySelector(
      ".reservation-form"
    );

  if (form) {

    form.addEventListener(
      "submit",
      e => {

        e.preventDefault();

        alert(
          "Thank you! Your reservation request has been received. We will contact you shortly."
        );

        form.reset();

      }
    );

  }

  // ==========================
  // ACTIVE NAV LINK
  // ==========================
  const sections =
    document.querySelectorAll(
      "section"
    );

  const navItems =
    document.querySelectorAll(
      ".nav-links a"
    );

  window.addEventListener(
    "scroll",
    () => {

      let current = "";

      sections.forEach(section => {

        const sectionTop =
          section.offsetTop - 120;

        if (
          pageYOffset >= sectionTop
        ) {
          current = section.getAttribute(
            "id"
          );
        }

      });

      navItems.forEach(link => {

        link.classList.remove(
          "active"
        );

        if (
          link.getAttribute("href") ===
          `#${current}`
        ) {
          link.classList.add(
            "active"
          );
        }

      });

    }
  );

});
