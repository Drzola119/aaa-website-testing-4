/**
 * SIZZLE & BUN - INTERACTION SCRIPTS
 * Keyboard accessible, respects reduced motion, zero heavy external dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('header');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  const orderModal = document.getElementById('orderModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const orderTriggerBtns = document.querySelectorAll('.order-trigger-btn');
  const selectItemBtns = document.querySelectorAll('.select-item-btn');
  const orderForm = document.getElementById('orderForm');
  const burgerSelect = document.getElementById('order-burger-select');
  const qtyInput = document.getElementById('order-quantity');
  const qtyMinusBtn = document.getElementById('qtyMinus');
  const qtyPlusBtn = document.getElementById('qtyPlus');
  const orderTotalDisplay = document.getElementById('orderTotal');

  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterFeedback = document.getElementById('newsletterFeedback');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const currentYearSpan = document.getElementById('currentYear');

  // Set Current Copyright Year
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --- Header Sticky Styling ---
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Mobile Navigation Toggle ---
  const toggleMobileNav = (open) => {
    const isExpanded = open !== undefined ? open : mobileNavToggle.getAttribute('aria-expanded') !== 'true';
    mobileNavToggle.setAttribute('aria-expanded', String(isExpanded));
    mobileNav.setAttribute('aria-hidden', String(!isExpanded));
    if (isExpanded) {
      mobileNav.classList.add('open');
    } else {
      mobileNav.classList.remove('open');
    }
  };

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      toggleMobileNav(!isExpanded);
    });
  }

  // Close mobile nav when clicking any nav link
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMobileNav(false);
    });
  });

  // --- Scroll Reveal Animations ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('revealed'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    reveals.forEach((el) => revealObserver.observe(el));
  }

  // --- Price Calculator & Order Modal ---
  const burgerPrices = {
    'The Golden Smash': 14.50,
    'Truffle Smokehouse': 16.95,
    'Fiery Red Diablo': 15.75
  };

  const updateModalTotal = () => {
    if (!burgerSelect || !qtyInput || !orderTotalDisplay) return;
    const selectedBurger = burgerSelect.value;
    const price = burgerPrices[selectedBurger] || 14.50;
    const quantity = parseInt(qtyInput.value, 10) || 1;
    const total = (price * quantity).toFixed(2);
    orderTotalDisplay.textContent = `$${total}`;
  };

  let previousActiveElement = null;

  const openOrderModal = (preselectedBurger = null) => {
    previousActiveElement = document.activeElement;
    if (preselectedBurger && burgerSelect) {
      burgerSelect.value = preselectedBurger;
    }
    if (qtyInput) qtyInput.value = '1';
    updateModalTotal();

    orderModal.classList.add('active');
    orderModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus first focusable element inside modal
    setTimeout(() => {
      if (burgerSelect) burgerSelect.focus();
    }, 50);
  };

  const closeOrderModal = () => {
    orderModal.classList.remove('active');
    orderModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  };

  // Open Modal Triggers
  orderTriggerBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMobileNav(false);
      openOrderModal();
    });
  });

  selectItemBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const burgerName = btn.getAttribute('data-name');
      openOrderModal(burgerName);
    });
  });

  // Close Modal Triggers
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeOrderModal);
  }

  if (orderModal) {
    orderModal.addEventListener('click', (e) => {
      if (e.target === orderModal) {
        closeOrderModal();
      }
    });
  }

  // Keyboard accessibility (ESC closes modal or mobile menu)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (orderModal && orderModal.classList.contains('active')) {
        closeOrderModal();
      } else if (mobileNavToggle && mobileNavToggle.getAttribute('aria-expanded') === 'true') {
        toggleMobileNav(false);
        mobileNavToggle.focus();
      }
    }
  });

  // Quantity Counter Buttons
  if (qtyMinusBtn && qtyInput) {
    qtyMinusBtn.addEventListener('click', () => {
      let currentVal = parseInt(qtyInput.value, 10) || 1;
      if (currentVal > 1) {
        qtyInput.value = currentVal - 1;
        updateModalTotal();
      }
    });
  }

  if (qtyPlusBtn && qtyInput) {
    qtyPlusBtn.addEventListener('click', () => {
      let currentVal = parseInt(qtyInput.value, 10) || 1;
      if (currentVal < 20) {
        qtyInput.value = currentVal + 1;
        updateModalTotal();
      }
    });
  }

  if (burgerSelect) {
    burgerSelect.addEventListener('change', updateModalTotal);
  }
  if (qtyInput) {
    qtyInput.addEventListener('input', updateModalTotal);
  }

  // Toast Helper
  let toastTimer = null;
  const showToast = (message) => {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('active');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('active');
    }, 4500);
  };

  // Order Form Submit
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const burger = burgerSelect.value;
      const qty = qtyInput.value;
      const orderType = orderForm.querySelector('input[name="orderType"]:checked')?.value || 'pickup';
      const orderTypeText = orderType === 'delivery' ? 'delivery' : 'express pickup';

      closeOrderModal();
      showToast(`🔥 Order placed for ${qty}x ${burger} for ${orderTypeText}! Preparing now.`);
    });
  }

  // Newsletter Form Submit
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();
      if (email) {
        newsletterFeedback.textContent = `🎉 Welcome aboard! We sent your free truffle fries voucher to ${email}.`;
        newsletterFeedback.style.color = 'var(--color-mustard-300)';
        newsletterForm.reset();
        setTimeout(() => {
          newsletterFeedback.textContent = '';
        }, 6000);
      }
    });
  }
});
