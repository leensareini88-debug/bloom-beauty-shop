function renderNavbar() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const accountHtml = user
    ? `
        <div class="nav-account">
          <a href="/orders.html" class="nav-greeting" title="View your orders" style="
            font-size: 12px;
            color: var(--mauve);
            font-family: var(--font-sans);
            letter-spacing: 0.5px;
            margin-right: 4px;
          ">Hi, ${user.name.split(' ')[0]}</a>
          <button id="logout-btn" aria-label="Logout" title="Logout">
            <i class="ti ti-logout"></i>
          </button>
        </div>
      `
    : `
        <div class="nav-account">
          <a href="/login.html" class="nav-signin-link">Sign In</a>
          <a href="/login.html" id="account-link" aria-label="Account">
            <i class="ti ti-user"></i>
          </a>
        </div>
      `;

  return `
    <!-- Announcement bar -->
    <div class="announcement-bar">
      ✨ Free shipping on orders over $75 · Flash Sale — Up to 30% off
    </div>

    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-left">
        <button class="nav-hamburger" id="hamburger-btn" aria-label="Menu">
          <i class="ti ti-menu-2"></i>
        </button>
        <a href="/index.html" class="nav-logo">Bloom Beauty</a>
      </div>

      <div class="nav-search" style="position:relative; flex:1; max-width:500px;">
        <div style="position:relative;">
          <span style="position:absolute; left:14px; top:50%;
            transform:translateY(-50%); color:#8a7060; font-size:16px;
            display:flex; align-items:center;">
            <i class="ti ti-search" style="font-size:16px;"></i>
          </span>
          <input
            id="global-search"
            type="text"
            placeholder="Search products..."
            autocomplete="off"
            style="
              width:100%; padding:10px 16px 10px 44px;
              border:1px solid #e8ddd5; border-radius:24px;
              font-size:13px; color:#3d2014; outline:none;
              background:#fdf8f5;
              font-family:'Inter',sans-serif;
              transition:all 0.3s;
            "
          >
        </div>
        <div id="search-dropdown" style="
          display:none;
          position:absolute;
          top:calc(100% + 8px);
          left:0; right:0;
          background:white;
          border-radius:12px;
          box-shadow:0 8px 32px rgba(122,79,58,0.15);
          border:1px solid #e8ddd5;
          z-index:9999;
          max-height:400px;
          overflow-y:auto;
        "></div>
      </div>

      <div class="nav-icons">
        ${accountHtml}
        <a href="/wishlist.html" id="wishlist-btn" aria-label="Wishlist">
          <i class="ti ti-heart"></i>
          <span class="cart-count" id="wishlist-count">0</span>
        </a>
        <a href="/cart.html" aria-label="Cart">
          <i class="ti ti-shopping-bag"></i>
          <span class="cart-count" id="cart-count">0</span>
        </a>
      </div>

      <div class="nav-links" id="nav-links">
        <a href="/index.html">Home</a>
        <a href="/index.html#products">Shop</a>
        <a href="/skincare.html">Skincare</a>
        <a href="/makeup.html">Makeup</a>
        <a href="/haircare.html">Haircare</a>
        <a href="/bodycare.html">Body Care</a>
        <a href="/index.html#sale">Sale</a>
        <a href="/index.html#contact">Contact</a>
      </div>
    </nav>
  `;
}

function renderFooter() {
  return `
    <footer class="footer" id="footer">
      <div class="footer-brand">
        <a href="/index.html" class="nav-logo">Bloom Beauty</a>
        <p>Your destination for skincare, makeup, haircare &amp; authentic beauty essentials.</p>
        <div class="social-icons">
          <a href="#" aria-label="Instagram"><i class="ti ti-brand-instagram"></i></a>
          <a href="#" aria-label="WhatsApp"><i class="ti ti-brand-whatsapp"></i></a>
        </div>
      </div>
      <div class="footer-links">
        <h4>Shop</h4>
        <a href="/skincare.html">Skincare</a>
        <a href="/makeup.html">Makeup</a>
        <a href="/haircare.html">Haircare</a>
        <a href="/bodycare.html">Body Care</a>
        <a href="/index.html#sale">Sale</a>
        <a href="/index.html#products">New Arrivals</a>
      </div>
      <div class="footer-links">
        <h4>Help</h4>
        <a href="/index.html#contact">Contact Us</a>
        <a href="/index.html#contact">FAQs</a>
        <a href="/index.html#contact">Shipping Policy</a>
        <a href="/index.html#contact">Returns</a>
        <a href="/orders.html">Track Order</a>
      </div>
      <div class="footer-links">
        <h4>Connect</h4>
        <a href="#footer">Instagram</a>
        <a href="#footer">WhatsApp</a>
      </div>
      <div class="footer-bottom">
        &copy; 2026 Bloom Beauty. All rights reserved.
      </div>
    </footer>
  `;
}

function addPageTransitions() {
  const transitionStyle = document.createElement('style');
  transitionStyle.textContent = `
    body { opacity: 0; transition: opacity 0.4s ease; }
    body.loaded { opacity: 1; }
  `;
  document.head.appendChild(transitionStyle);

  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('mailto') ||
        link.target === '_blank') return;

    e.preventDefault();
    document.body.classList.remove('loaded');

    setTimeout(() => {
      window.location.href = href;
    }, 400);
  });
}

function initNavbar() {
  document.getElementById('navbar-placeholder').innerHTML = renderNavbar();

  (function initLiveSearch() {
    const input = document.getElementById('global-search');
    const dropdown = document.getElementById('search-dropdown');
    if (!input || !dropdown) return;

    let allProducts = [];
    let debounceTimer = null;

    fetch('/api/products')
      .then(r => r.json())
      .then(data => { allProducts = data; })
      .catch(() => {});

    input.addEventListener('focus', () => {
      input.style.borderColor = '#c9956a';
      input.style.boxShadow = '0 0 0 3px rgba(201,149,106,0.15)';
    });
    input.addEventListener('blur', () => {
      input.style.borderColor = '#e8ddd5';
      input.style.boxShadow = 'none';
    });

    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const q = input.value.trim().toLowerCase();
        if (!q) { dropdown.style.display = 'none'; dropdown.innerHTML = ''; return; }

        const results = allProducts.filter(p =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.ingredients && p.ingredients.some(i => i.toLowerCase().includes(q)))
        ).slice(0, 6);

        if (!results.length) {
          dropdown.innerHTML = '<div style="padding:16px 20px; color:#8a7060; font-size:13px;">No products found</div>';
          dropdown.style.display = 'block';
          return;
        }

        dropdown.innerHTML = results.map(p => `
          <a href="/product.html?id=${p._id}" style="
            display:flex; align-items:center; gap:12px;
            padding:10px 16px; text-decoration:none;
            border-bottom:1px solid #f5ede8;
            transition:background 0.2s;
          " onmouseover="this.style.background='#fdf5f0'" onmouseout="this.style.background='white'">
            <img src="${p.image || ''}" alt="${p.name}" style="
              width:44px; height:44px; object-fit:cover;
              border-radius:8px; flex-shrink:0;
            ">
            <div style="flex:1; min-width:0;">
              <div style="font-size:13px; font-weight:600; color:#3d2014;
                white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${p.name}
              </div>
              <div style="font-size:11px; color:#8a7060; text-transform:capitalize; margin-top:2px;">
                ${p.category}
              </div>
            </div>
            <div style="font-size:13px; font-weight:700; color:#c9956a; flex-shrink:0;">
              $${Number(p.price).toFixed(2)}
            </div>
          </a>
        `).join('');

        dropdown.style.display = 'block';
      }, 300);
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        dropdown.style.display = 'none';
        input.blur();
      }
      if (e.key === 'Enter') {
        const first = dropdown.querySelector('a');
        if (first) first.click();
      }
    });

    document.addEventListener('click', e => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  })();

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      showToast('See you soon! 👋', 'success');
      setTimeout(() => {
        window.location.href = '/index.html';
      }, 600);
    });
  }

  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  updateCartCountUI();
  updateWishlistCountUI();

  requestAnimationFrame(() => {
    document.body.classList.add('loaded');
  });

  addPageTransitions();
}

function initFooter() {
  document.getElementById('footer-placeholder').innerHTML = renderFooter();
}

window.renderNavbar = renderNavbar;
window.renderFooter = renderFooter;
window.initNavbar = initNavbar;
window.initFooter = initFooter;
