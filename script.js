"use strict";

const RESTAURANT_EMAIL = "";
const SOCIAL_LINKS = [];

document.addEventListener("DOMContentLoaded", () => {
  const contactPhone = (document.body.getAttribute("data-contact-phone") || "").trim();
  const whatsappNumber = contactPhone.replace(/\D/g, "");
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "";
  const whatsappLinks = document.querySelectorAll(".whatsapp-float, .whatsapp-contact");
  const phoneLink = document.querySelector(".contact-phone");
  const reservationForm = document.getElementById("reservation-form");
  const reservationLink = document.getElementById("reservation-whatsapp");
  const feedback = document.getElementById("reservation-feedback");
  const menuToggle = document.querySelector(".menu-toggle");
  const navPanel = document.getElementById("site-navigation");

  if (!/^\d{8,15}$/.test(whatsappNumber)) {
    console.error("Configure a valid contact phone in the page's data-contact-phone attribute, including the country code.");
  }

  if (whatsappUrl && /^\d{8,15}$/.test(whatsappNumber)) {
    whatsappLinks.forEach(link => {
      link.href = whatsappUrl;
    });
    if (phoneLink) {
      phoneLink.href = `tel:+${whatsappNumber}`;
      phoneLink.textContent = contactPhone;
    }
  } else {
    whatsappLinks.forEach(link => {
      link.hidden = true;
    });
    if (phoneLink) {
      const phoneDetail = phoneLink.closest(".contact-detail");
      if (phoneDetail) phoneDetail.hidden = true;
    }
  }

  if (menuToggle && navPanel) {
    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      navPanel.classList.remove("is-open");
    };

    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
      navPanel.classList.toggle("is-open", !isExpanded);
    });

    navPanel.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  const header = document.querySelector(".site-header");
  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const filterButtons = document.querySelectorAll(".filter-button");
  const menuItems = document.querySelectorAll(".menu-item");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.filter;
      filterButtons.forEach(filter => {
        const isSelected = filter === button;
        filter.classList.toggle("is-active", isSelected);
        filter.setAttribute("aria-pressed", String(isSelected));
      });
      menuItems.forEach(item => {
        item.hidden = selectedCategory !== "all" && item.dataset.category !== selectedCategory;
      });
    });
  });

  const lightbox = document.getElementById("gallery-lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.querySelector(".lightbox-close");
  document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      if (!lightbox || !lightboxImage || !lightboxCaption) return;
      lightboxImage.src = item.dataset.full;
      lightboxImage.alt = item.querySelector("img").alt;
      lightboxCaption.textContent = item.dataset.caption;
      lightbox.showModal();
      lightboxClose.focus();
    });
  });
  if (lightbox && lightboxClose) {
    lightboxClose.addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) lightbox.close();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && lightbox.open) lightbox.close();
    });
  }

  const dateInput = document.getElementById("reservation-date");
  const timeInput = document.getElementById("reservation-time");
  if (dateInput && timeInput) {
    const today = new Date();
    const localDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");
    dateInput.min = localDate;
    const clearDateTimeError = () => timeInput.setCustomValidity("");
    dateInput.addEventListener("input", clearDateTimeError);
    dateInput.addEventListener("change", clearDateTimeError);
    timeInput.addEventListener("input", clearDateTimeError);
    timeInput.addEventListener("change", clearDateTimeError);
  }

  if (reservationForm && reservationLink && feedback) {
    reservationForm.addEventListener("submit", event => {
      event.preventDefault();
      reservationLink.hidden = true;
      feedback.textContent = "";

      if (!whatsappUrl || !/^\d{8,15}$/.test(whatsappNumber)) {
        feedback.textContent = "WhatsApp booking is not available right now. Please contact the restaurant directly to enquire.";
        feedback.focus();
        return;
      }

      const formData = new FormData(reservationForm);
      const date = String(formData.get("date"));
      const time = String(formData.get("time"));
      const requestedDateTime = new Date(`${date}T${time}`);
      if (Number.isNaN(requestedDateTime.getTime()) || requestedDateTime <= new Date()) {
        timeInput.setCustomValidity("Choose a date and time in the future.");
        timeInput.reportValidity();
        return;
      }

      const message = [
        "Hello RST Grilled House, I would like to request a table.",
        `Name: ${formData.get("name")}`,
        `Phone: ${formData.get("phone")}`,
        `Date: ${date}`,
        `Time: ${time}`,
        `Guests: ${formData.get("guests")}`,
        formData.get("notes") ? `Notes: ${formData.get("notes")}` : ""
      ].filter(Boolean).join("\n");

      reservationLink.href = `${whatsappUrl}?text=${encodeURIComponent(message)}`;
      reservationLink.hidden = false;
      feedback.textContent = "Your request is ready. Continue to WhatsApp and send the message to contact our team. This is not a confirmed reservation; your table is booked only after we reply.";
      reservationLink.focus();
    });
  }

  const emailContact = document.getElementById("email-contact");
  const emailLink = document.querySelector(".contact-email");
  if (RESTAURANT_EMAIL && emailContact && emailLink) {
    emailLink.href = `mailto:${RESTAURANT_EMAIL}`;
    emailLink.textContent = RESTAURANT_EMAIL;
    emailContact.hidden = false;
  }

  const socialNav = document.getElementById("footer-socials");
  if (socialNav && SOCIAL_LINKS.length) {
    SOCIAL_LINKS.forEach(profile => {
      const url = new URL(profile.url);
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        console.error(`Unsupported social profile URL: ${profile.url}`);
        return;
      }
      const link = document.createElement("a");
      link.href = url.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = profile.label;
      socialNav.append(link);
    });
    socialNav.hidden = socialNav.childElementCount === 0;
  }

  const currentYear = document.getElementById("current-year");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }
});
