{
  let toastTimer = null;

  const showToast = (message, type) => {
    let toast = document.getElementById('bs-cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'bs-cart-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = `bs-cart-toast bs-cart-toast--${type} bs-cart-toast--visible`;

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('bs-cart-toast--visible');
    }, 2500);
  }

  async function updateHeaderCartCount() {
    try {
      const cart = await fetch('/cart.js').then(r => r.json());
      const count = cart.item_count;

      document.querySelectorAll('a[href="/cart"]').forEach(link => {
        let bubble = link.querySelector('.cart-count-bubble');
        if (count > 0) {
          if (!bubble) {
            bubble = document.createElement('span');
            bubble.className = 'cart-count-bubble';
            link.appendChild(bubble);
          }
          bubble.innerHTML =
            `<span aria-hidden="true">${count}</span>` +
            `<span class="visually-hidden">${count} item${count !== 1 ? 's' : ''}</span>`;
        } else if (bubble) {
          bubble.remove();
        }
      });
    } catch (e) {
      console.warn('[best-sellers] Could not update cart count:', e);
    }
  }

  const initBestSellers = (section) => {
    const sectionId = section.dataset.sectionId;

    // tabs
    const tablist = section.querySelector('.best-sellers__tabs');
    if (!tablist) return;

    const tabs   = [...section.querySelectorAll('.best-sellers__tab')];
    const panels = [...section.querySelectorAll('.best-sellers__panel')];

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        if (tab.getAttribute('aria-selected') === 'true') return;

        tabs.forEach((t) => {
          t.classList.remove('best-sellers__tab--active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach((p) => { p.hidden = true; });

        tab.classList.add('best-sellers__tab--active');
        tab.setAttribute('aria-selected', 'true');

        const panel = document.getElementById(tab.getAttribute('aria-controls'));
        if (panel) panel.hidden = false;
      });
    });

    // wishlist popup
    let overlay = document.getElementById(`best-sellers-overlay-${sectionId}`);
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'best-sellers__overlay';
      overlay.id = `best-sellers-overlay-${sectionId}`;
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);
    }
    const popup        = document.getElementById(`best-sellers-popup-${sectionId}`);
    const popupClose   = document.getElementById(`best-sellers-popup-close-${sectionId}`);
    const popupMessage = document.getElementById(`best-sellers-popup-message-${sectionId}`);
    let lastWishlistBtn = null;

    const openPopup = (productName, triggerBtn) => {
      lastWishlistBtn = triggerBtn;
      if (popupMessage) popupMessage.textContent = `${productName} has been added to your wishlist.`;
      overlay?.classList.add('is-active');
      overlay?.setAttribute('aria-hidden', 'false');
      popup?.classList.add('is-active');
      popup?.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-scroll-locked');
      popupClose?.focus();
    }

    const closePopup = () => {
      overlay?.classList.remove('is-active');
      overlay?.setAttribute('aria-hidden', 'true');
      popup?.classList.remove('is-active');
      popup?.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-scroll-locked');
      lastWishlistBtn?.focus();
      lastWishlistBtn = null;
    }

    section.addEventListener('click', (e) => {
      const btn = e.target.closest('.best-sellers__action--wishlist');
      if (btn) openPopup(btn.dataset.productName ?? '', btn);
    });

    popupClose?.addEventListener('click', closePopup);
    overlay?.addEventListener('click', closePopup);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup?.classList.contains('is-active')) closePopup();
    });

    // add to cart
    section.addEventListener('click', async (e) => {
      const btn = e.target.closest('.best-sellers__action--cart');
      if (!btn || btn.disabled) return;

      const variantId = btn.dataset.variantId;
      if (!variantId) {
        console.warn('[best-sellers] cart button missing data-variant-id');
        return;
      }

      btn.disabled = true;
      btn.classList.add('best-sellers__action--disabled');

      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body: JSON.stringify({ id: Number(variantId), quantity: 1 }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.description || `Cart error ${res.status}`);
        }

        showToast('Product added to cart', 'success');
        updateHeaderCartCount();
      } catch (err) {
        console.error('[best-sellers] Add to cart failed:', err);
        showToast(err.message || 'Could not add to cart', 'error');
      } finally {
        btn.disabled = false;
        btn.classList.remove('best-sellers__action--disabled');
      }
    });
  }

  document.querySelectorAll('.best-sellers[data-section-id]').forEach(initBestSellers);
};
