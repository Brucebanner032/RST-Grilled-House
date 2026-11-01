"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector("#theme-toggle");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector("#primary-navigation");
  const cartDialog = document.querySelector("#cart-dialog");
  const cartItems = document.querySelector("#cart-items");
  const cartEmpty = document.querySelector("#cart-empty");
  const cartSummary = document.querySelector("#cart-summary");
  const cartSubtotal = document.querySelector("#cart-subtotal");
  const cartCount = document.querySelector(".cart-count");
  const cartOpen = document.querySelector(".cart-open");
  const cartLive = document.querySelector("#cart-live");
  const copyStatus = document.querySelector("#copy-status");
  const orderSummaryText = document.querySelector("#order-summary-text");
  const reservationForm = document.querySelector("#reservation-form");
  const reservationDate = document.querySelector("#reservation-date");
  const reservationStatus = document.querySelector("#reservation-status");
  const menuSearch = document.querySelector("#menu-search");
  const menuResultCount = document.querySelector("#menu-result-count");
  const emptyMenu = document.querySelector("#empty-menu");
  const menuCards = [...document.querySelectorAll(".food-card")];
  const cart = new Map();
  let activeFilter = "all";

  const setTheme = (theme) => {
    document.body.dataset.theme = theme;
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
    themeToggle.querySelector("span").textContent = isDark ? "☼" : "◐";
  };

  try {
    const savedTheme = localStorage.getItem("theme");
    setTheme(savedTheme === "dark" ? "dark" : "light");
  } catch (error) {
    console.warn("The saved theme could not be read.", error);
    setTheme("light");
  }

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    try {
      localStorage.setItem("theme", nextTheme);
    } catch (error) {
      console.warn("The theme preference could not be saved.", error);
    }
  });

  const closeMobileMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 850) closeMobileMenu();
  });

  const updateMenu = () => {
    const query = menuSearch.value.trim().toLocaleLowerCase();
    let visibleCount = 0;

    menuCards.forEach((card) => {
      const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
      const matchesSearch = card.textContent.toLocaleLowerCase().includes(query);
      const isVisible = matchesCategory && matchesSearch;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    emptyMenu.hidden = visibleCount > 0;
    menuResultCount.textContent = `${visibleCount} ${visibleCount === 1 ? "dish" : "dishes"}`;
  };

  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll(".filter-button").forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("is-active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });
      updateMenu();
    });
  });

  menuSearch.addEventListener("input", updateMenu);
  updateMenu();

  const formatPrice = (amount) => `GH₵ ${amount.toLocaleString("en-GH")}`;

  const getProduct = (id) => {
    const card = menuCards.find((item) => item.dataset.id === id);
    if (!card) return null;

    const price = Number(card.dataset.price);
    if (!Number.isSafeInteger(price) || price < 0) return null;

    return {
      id,
      name: card.querySelector("h3").textContent.trim(),
      price
    };
  };

  const makeQuantityButton = (label, action, id, text) => {
    const button = document.createElement("button");
    button.className = "quantity-button";
    button.type = "button";
    button.dataset.cartAction = action;
    button.dataset.id = id;
    button.setAttribute("aria-label", label);
    button.textContent = text;
    return button;
  };

  const renderCart = () => {
    cartItems.replaceChildren();
    copyStatus.textContent = "";
    orderSummaryText.value = "";
    orderSummaryText.hidden = true;
    let itemCount = 0;
    let total = 0;

    cart.forEach((quantity, id) => {
      const product = getProduct(id);
      if (!product || !Number.isSafeInteger(quantity) || quantity < 1) {
        cart.delete(id);
        return;
      }

      itemCount += quantity;
      total += product.price * quantity;

      const row = document.createElement("article");
      row.className = "cart-line";

      const name = document.createElement("h3");
      name.className = "cart-line-name";
      name.textContent = product.name;

      const linePrice = document.createElement("span");
      linePrice.className = "cart-line-price";
      linePrice.textContent = formatPrice(product.price * quantity);

      const controls = document.createElement("div");
      controls.className = "cart-line-controls";
      controls.append(
        makeQuantityButton(`Remove one ${product.name}`, "decrease", id, "−")
      );

      const quantityLabel = document.createElement("span");
      quantityLabel.textContent = String(quantity);
      quantityLabel.setAttribute("aria-label", "Quantity");
      controls.append(quantityLabel);
      controls.append(
        makeQuantityButton(`Add one ${product.name}`, "increase", id, "+")
      );

      const removeButton = document.createElement("button");
      removeButton.className = "cart-remove";
      removeButton.type = "button";
      removeButton.dataset.cartAction = "remove";
      removeButton.dataset.id = id;
      removeButton.textContent = "Remove";
      removeButton.setAttribute("aria-label", `Remove ${product.name} from your bag`);

      row.append(name, linePrice, controls, removeButton);
      cartItems.append(row);
    });

    cartCount.textContent = String(itemCount);
    cartOpen.setAttribute("aria-label", `Open your cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`);
    cartSubtotal.textContent = formatPrice(total);
    cartEmpty.hidden = itemCount > 0;
    cartSummary.hidden = itemCount === 0;
  };

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".food-card");
      const id = card.dataset.id;
      const product = getProduct(id);
      const quantity = cart.get(id) || 0;

      if (!product || quantity >= 99) {
        cartLive.textContent = "The maximum quantity for one dish is 99.";
        return;
      }

      cart.set(id, quantity + 1);
      renderCart();
      cartLive.textContent = `${product.name} added to your bag. ${cartCount.textContent} ${Number(cartCount.textContent) === 1 ? "item" : "items"} in total.`;
      button.setAttribute("aria-label", `${product.name} added to bag. Add another`);
      window.setTimeout(() => {
        button.setAttribute("aria-label", `Add ${product.name} to bag`);
      }, 1200);
    });
  });

  cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-cart-action]");
    if (!button) return;

    const { id, cartAction } = button.dataset;
    const quantity = cart.get(id);
    if (!quantity) return;

    if (cartAction === "remove" || (cartAction === "decrease" && quantity === 1)) {
      cart.delete(id);
    } else if (cartAction === "decrease") {
      cart.set(id, quantity - 1);
    } else if (cartAction === "increase" && quantity < 99) {
      cart.set(id, quantity + 1);
    }

    renderCart();
  });

  cartOpen.addEventListener("click", () => cartDialog.showModal());
  document.querySelector(".dialog-close").addEventListener("click", () => cartDialog.close());
  document.querySelector(".cart-continue").addEventListener("click", () => {
    cartDialog.close();
    document.querySelector("#menu").scrollIntoView({ behavior: "smooth" });
  });

  cartDialog.addEventListener("click", (event) => {
    if (event.target === cartDialog) cartDialog.close();
  });

  document.querySelector("#copy-order").addEventListener("click", async () => {
    const orderLines = [...cart.entries()]
      .map(([id, quantity]) => {
        const product = getProduct(id);
        return product ? `${quantity} x ${product.name} — ${formatPrice(product.price * quantity)}` : null;
      })
      .filter(Boolean);

    if (orderLines.length === 0) return;

    const total = [...cart.entries()].reduce((sum, [id, quantity]) => {
      const product = getProduct(id);
      return sum + (product ? product.price * quantity : 0);
    }, 0);
    const orderText = `RST Grilled House order review\n${orderLines.join("\n")}\nSubtotal: ${formatPrice(total)}\n\nReview only — no order has been sent or paid.`;

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard access is unavailable in this browser.");
      }
      await navigator.clipboard.writeText(orderText);
      copyStatus.textContent = "Order review copied. It has not been sent or placed.";
      orderSummaryText.hidden = true;
    } catch (error) {
      console.error("The order summary could not be copied automatically.", error);
      orderSummaryText.value = orderText;
      orderSummaryText.hidden = false;
      orderSummaryText.focus();
      orderSummaryText.select();
      copyStatus.textContent = "Automatic copy is unavailable. The review is selected for you to copy manually.";
    }
  });

  const localToday = new Date();
  const year = localToday.getFullYear();
  const month = String(localToday.getMonth() + 1).padStart(2, "0");
  const day = String(localToday.getDate()).padStart(2, "0");
  reservationDate.min = `${year}-${month}-${day}`;

  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    reservationStatus.textContent = "Preview only: nothing was sent, and no table has been reserved. Please contact the restaurant directly to confirm a visit.";
  });

  const imageDialog = document.querySelector("#image-dialog");
  const previewImage = document.querySelector("#image-dialog-content");

  document.querySelectorAll(".gallery-image").forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img");
      previewImage.src = image.currentSrc || image.src;
      previewImage.alt = image.alt;
      imageDialog.showModal();
    });
  });

  document.querySelector(".image-dialog-close").addEventListener("click", () => imageDialog.close());
  imageDialog.addEventListener("click", (event) => {
    if (event.target === imageDialog) imageDialog.close();
  });

  document.querySelector("#current-year").textContent = String(new Date().getFullYear());

  if ("IntersectionObserver" in window) {
    const sections = document.querySelectorAll("main section[id]");
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll(".nav-links a").forEach((link) => {
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, {
      rootMargin: "-30% 0px -60% 0px"
    });

    sections.forEach((section) => sectionObserver.observe(section));
  }
});
