/* ============================================================
   Auth check
   ============================================================ */
function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function showAuthModal(redirectUrl) {
  // Remove existing modal if any
  const existing = document.getElementById('auth-modal');
  if (existing) existing.remove();

  const redirectParam = redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : '';
  const registerRedirectParam = redirectUrl ? `&redirect=${encodeURIComponent(redirectUrl)}` : '';

  const modal = document.createElement('div');
  modal.id = 'auth-modal';
  modal.innerHTML = `
    <div id="auth-modal-overlay" style="
      position: fixed; inset: 0;
      background: rgba(30,15,10,0.6);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    ">
      <div style="
        background: white;
        border-radius: 20px;
        padding: 48px 40px;
        max-width: 420px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(122,79,58,0.2);
        animation: slideUp 0.3s ease;
      ">
        <div style="width:64px; height:64px; background:#fdf8f5; border-radius:50%; display:flex; align-items:center; justify-content:center; margin: 0 auto 16px;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c4917f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <h2 style="
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          color: #3d2014;
          margin-bottom: 8px;
        ">Join Bloom Beauty</h2>
        <p style="
          color: #8a7060;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 32px;
        ">Sign in to save favorites, add to cart, and enjoy a personalized beauty experience.</p>

        <a href="/login.html${redirectParam}" style="
          display: block;
          background: #3d2014;
          color: white;
          padding: 14px 32px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 12px;
          transition: background 0.3s;
        ">Sign In</a>

        <a href="/login.html?tab=register${registerRedirectParam}" style="
          display: block;
          background: transparent;
          color: #3d2014;
          padding: 14px 32px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          border: 1.5px solid #c4917f;
          margin-bottom: 20px;
          transition: all 0.3s;
        ">Create Account</a>

        <button onclick="document.getElementById('auth-modal').remove()" style="
          background: none;
          border: none;
          color: #8a7060;
          font-size: 13px;
          cursor: pointer;
          text-decoration: underline;
        ">Continue browsing</button>
      </div>
    </div>
  `;

  // Add animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `;
  document.head.appendChild(style);
  document.body.appendChild(modal);

  // Close on overlay click
  document.getElementById('auth-modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) modal.remove();
  });
}

function getCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Normalize legacy entries that were stored with an `id` field instead of `_id`
  let changed = false;
  cart.forEach((item) => {
    if (!item._id && item.id) {
      item._id = item.id;
      delete item.id;
      changed = true;
    }
  });

  if (changed) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  return cart;
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product, quantity) {
  if (!isLoggedIn()) { showAuthModal(window.location.pathname); return; }

  let cart = getCart();
  const existingIndex = cart.findIndex(item => item._id === product._id);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: quantity,
      selectedShade: product.selectedShade || null
    });
  }

  saveCart(cart);
  updateCartCountUI();
  showToast('Added to cart!', 'cart');
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item._id !== productId);
  saveCart(cart);
  updateCartCountUI();
}

function updateQuantity(productId, quantity) {
  let cart = getCart();

  if (quantity <= 0) {
    cart = cart.filter((item) => item._id !== productId);
  } else {
    const item = cart.find((item) => item._id === productId);
    if (item) {
      item.quantity = quantity;
    }
  }

  saveCart(cart);
  updateCartCountUI();
}

function getCartTotal() {
  return getCart().reduce((total, item) => total + item.price * item.quantity, 0);
}

function getCartCount() {
  return getCart().reduce((count, item) => count + item.quantity, 0);
}

function updateCartCountUI() {
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = getCartCount();
  }
  updateWishlistCountUI();
}

/* ============================================================
   Wishlist
   ============================================================ */
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
  } catch(e) {
    return [];
  }
}

function saveWishlist(wishlist) {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateWishlistCountUI();
}

function addToWishlist(product) {
  if (!isLoggedIn()) { showAuthModal(window.location.pathname); return; }
  const wishlist = getWishlist();
  if (!wishlist.some((item) => item._id === product._id)) {
    wishlist.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    saveWishlist(wishlist);
  }
}

function removeFromWishlist(productId) {
  const wishlist = getWishlist().filter((item) => item._id !== productId);
  saveWishlist(wishlist);
}

function toggleWishlist(product) {
  if (!isLoggedIn()) {
    showAuthModal(window.location.pathname);
    return false;
  }
  let wishlist = getWishlist();
  const existingIndex = wishlist.findIndex(item => item._id === product._id);

  if (existingIndex > -1) {
    wishlist.splice(existingIndex, 1);
    saveWishlist(wishlist);
    showToast('Removed from wishlist', 'error');
    return false;
  } else {
    wishlist.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
    saveWishlist(wishlist);
    showToast('Added to wishlist! ♡', 'info');
    return true;
  }
}

function isInWishlist(productId) {
  return getWishlist().some(item => item._id === productId);
}

function getWishlistCount() {
  return getWishlist().length;
}

function updateWishlistCountUI() {
  try {
    const wishlist = getWishlist();
    const count = wishlist.length;
    document.querySelectorAll('#wishlist-count').forEach(badge => {
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
      }
    });
  } catch(e) {}
}

/* ============================================================
   Heart burst (mini fountain) effect
   ============================================================ */
function heartBurst(originEl) {
  if (!originEl) return;

  const rect = originEl.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const particleCount = 10;

  originEl.classList.remove('pulse');
  requestAnimationFrame(() => originEl.classList.add('pulse'));

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'heart-burst-particle';
    particle.innerHTML = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M19.5 12.572 12 20l-7.5-7.428A5 5 0 1 1 12 6.06a5 5 0 1 1 7.5 6.512z"/></svg>';

    const angle = (Math.PI / particleCount) * i - Math.PI / 2 - Math.PI / 4 + (Math.random() * 0.6 - 0.3);
    const distance = 40 + Math.random() * 50;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance - 20;
    const rotation = (Math.random() * 120 - 60) + 'deg';
    const duration = 0.6 + Math.random() * 0.5;
    const size = 10 + Math.random() * 10;

    particle.style.left = `${originX}px`;
    particle.style.top = `${originY}px`;
    particle.style.fontSize = `${size}px`;
    particle.style.setProperty('--burst-x', `${x}px`);
    particle.style.setProperty('--burst-y', `${y}px`);
    particle.style.setProperty('--burst-rot', rotation);
    particle.style.setProperty('--burst-duration', `${duration}s`);

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), duration * 1000 + 50);
  }
}

/* ============================================================
   Toast notifications
   ============================================================ */
function showToast(message, type = 'success') {
  document.querySelectorAll('.bloom-toast').forEach(t => t.remove());

  const colors = {
    success: { bg: '#6b8f71', icon: '✓' },
    error:   { bg: '#c0392b', icon: '✕' },
    info:    { bg: '#c4917f', icon: '♡' },
    cart:    { bg: '#3d2014', icon: '🛍️' },
  };

  const style = colors[type] || colors.success;

  const toast = document.createElement('div');
  toast.className = 'bloom-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    background: ${style.bg};
    color: white;
    padding: 14px 20px;
    border-radius: 10px;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    z-index: 99999;
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.3s ease;
    max-width: 300px;
  `;

  toast.innerHTML = `
    <span style="font-size:16px;">${style.icon}</span>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(16px)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

window.isLoggedIn = isLoggedIn;
window.showAuthModal = showAuthModal;
window.getCart = getCart;
window.saveCart = saveCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.getCartTotal = getCartTotal;
window.getCartCount = getCartCount;
window.updateCartCountUI = updateCartCountUI;
window.getWishlist = getWishlist;
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.toggleWishlist = toggleWishlist;
window.isInWishlist = isInWishlist;
window.getWishlistCount = getWishlistCount;
window.updateWishlistCountUI = updateWishlistCountUI;
window.showToast = showToast;
window.heartBurst = heartBurst;
