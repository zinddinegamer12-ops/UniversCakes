import { getTranslation, translate, initLanguage } from './lang.js';

// ===== PRODUCTS DATA =====
const products = [
  { id: 1, category: 'candy', nameKey: 'product_candy_rosu', descKey: 'product_candy_rosu_desc', price: 18.50, img: 'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 2, category: 'candy', nameKey: 'product_candy_bar', descKey: 'product_candy_bar_desc', price: 32.00, img: 'https://images.pexels.com/photos/1414234/pexels-photo-1414234.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 3, category: 'mini', nameKey: 'product_mini_lamaie', descKey: 'product_mini_lamaie_desc', price: 12.00, img: 'https://images.pexels.com/photos/1464231/pexels-photo-1464231.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 4, category: 'mini', nameKey: 'product_ecler', descKey: 'product_ecler_desc', price: 14.50, img: 'https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 5, category: 'tort', nameKey: 'product_tort_choc', descKey: 'product_tort_choc_desc', price: 145.00, img: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 6, category: 'tort', nameKey: 'product_tort_fructe', descKey: 'product_tort_fructe_desc', price: 165.00, img: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 7, category: 'mini', nameKey: 'product_macaron', descKey: 'product_macaron_desc', price: 9.50, img: 'https://images.pexels.com/photos/239578/pexels-photo-239578.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 8, category: 'candy', nameKey: 'product_caramel', descKey: 'product_caramel_desc', price: 24.00, img: 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const categoryLabels = { candy: 'cat_candy', mini: 'cat_mini', tort: 'cat_tort' };

let currentLang = localStorage.getItem('marabou_lang') || 'fr';

// ===== CART STATE =====
let cart = JSON.parse(localStorage.getItem('marabou_cart') || '[]');

function saveCart() {
  localStorage.setItem('marabou_cart', JSON.stringify(cart));
}

// ===== RENDER PRODUCTS =====
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  if (!grid) return; // Not on products page
  
  grid.innerHTML = '';
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
  filtered.forEach((p, index) => {
    const catLabel = getTranslation(categoryLabels[p.category], currentLang);
    const name = getTranslation(p.nameKey, currentLang);
    const desc = getTranslation(p.descKey, currentLang);
    const addBtn = getTranslation('cat_btn', currentLang);
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.setProperty('--i', index);
    card.innerHTML = `
      <img class="product-img" src="${p.img}" alt="${name}" loading="lazy" />
      <div class="product-body">
        <span class="product-tag">${catLabel}</span>
        <p class="product-name">${name}</p>
        <p class="product-desc">${desc}</p>
        <div class="product-footer">
          <span class="product-price">${p.price.toFixed(2)} DH</span>
          <button class="add-to-cart" data-id="${p.id}">+ ${addBtn}</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
  });
}

// ===== RENDER FEATURED PRODUCTS (HOMEPAGE) =====
function renderFeaturedProducts() {
  const candyGrid = document.getElementById('candyGrid');
  const miniGrid = document.getElementById('miniGrid');
  const tortGrid = document.getElementById('tortGrid');
  
  if (!candyGrid || !miniGrid || !tortGrid) return; // Not on homepage
  
  const categories = ['candy', 'mini', 'tort'];
  const grids = { candy: candyGrid, mini: miniGrid, tort: tortGrid };
  
  categories.forEach(cat => {
    const grid = grids[cat];
    grid.innerHTML = '';
    
    // Get all products from each category (max 3)
    const categoryProducts = products.filter(p => p.category === cat).slice(0, 3);
    
    categoryProducts.forEach(product => {
      const catLabel = getTranslation(categoryLabels[cat], currentLang);
      const name = getTranslation(product.nameKey, currentLang);
      const desc = getTranslation(product.descKey, currentLang);
      const addBtn = getTranslation('cat_btn', currentLang);
      
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img class="product-img" src="${product.img}" alt="${name}" loading="lazy" />
        <div class="product-body">
          <span class="product-tag">${catLabel}</span>
          <p class="product-name">${name}</p>
          <p class="product-desc">${desc}</p>
          <div class="product-footer">
            <span class="product-price">${product.price.toFixed(2)} DH</span>
            <button class="add-to-cart" data-id="${product.id}">+ ${addBtn}</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
    
    grid.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
    });
  });
}

// ===== FILTER =====
function filterProducts(cat) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length === 0) return; // Not on products page
  
  filterBtns.forEach(b => {
    b.classList.toggle('active', b.dataset.filter === cat || (cat === 'all' && b.dataset.filter === 'all'));
  });
  renderProducts(cat);
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => filterProducts(btn.dataset.filter));
});
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const name = getTranslation(product.nameKey, currentLang);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  updateCartUI();
  const msg = getTranslation('msg_added_to_cart', currentLang);
  showToast(`${name} ${msg}`);
  bumpCount();
  
  // Add pulse animation to the button
  const btn = document.querySelector(`[data-id="${id}"]`);
  if (btn) {
    btn.style.animation = 'none';
    setTimeout(() => {
      btn.style.animation = 'buttonPulse 0.6s ease-out';
    }, 10);
  }
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else {
    saveCart();
    updateCartUI();
  }
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = total.toFixed(2) + ' DH';

  const itemsEl = document.getElementById('cartItems');
  if (cart.length === 0) {
    const emptyMsg = getTranslation('cart_empty', currentLang);
    itemsEl.innerHTML = `<p class="cart-empty">${emptyMsg}</p>`;
    return;
  }
  itemsEl.innerHTML = cart.map(item => {
    const name = getTranslation(item.nameKey, currentLang);
    return `
    <div class="cart-item" data-id="${item.id}">
      <img class="cart-item-img" src="${item.img}" alt="${name}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${name}</div>
        <div class="cart-item-price">${(item.price * item.qty).toFixed(2)} DH</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
        <span class="qty-display">${item.qty}</span>
        <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
      </div>
    </div>
  `;
  }).join('');

  itemsEl.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => changeQty(Number(btn.dataset.id), Number(btn.dataset.delta)));
  });
}

// ===== CART OPEN / CLOSE =====
function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);
document.getElementById('checkoutBtn').addEventListener('click', openCheckout);

// ===== CHECKOUT MODAL =====
function openCheckout() {
  if (cart.length === 0) {
    const emptyMsg = getTranslation('msg_cart_empty', currentLang);
    showToast(emptyMsg);
    return;
  }

  // Populate checkout summary
  const checkoutItems = document.getElementById('checkoutItems');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  checkoutItems.innerHTML = cart.map(item => {
    const name = getTranslation(item.nameKey, currentLang);
    return `
    <div class="checkout-item">
      <img class="checkout-item-img" src="${item.img}" alt="${name}" />
      <div class="checkout-item-info">
        <div class="checkout-item-name">${name} × ${item.qty}</div>
        <div class="checkout-item-price">${(item.price * item.qty).toFixed(2)} DH</div>
      </div>
    </div>
  `;
  }).join('');

  document.getElementById('checkoutTotal').textContent = total.toFixed(2) + ' DH';

  // Show modal
  document.getElementById('checkoutModal').classList.add('open');
  document.getElementById('checkoutOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Close cart if open
  closeCart();
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('open');
  document.getElementById('checkoutOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('checkoutClose').addEventListener('click', closeCheckout);
document.getElementById('checkoutOverlay').addEventListener('click', closeCheckout);

// ===== FORM VALIDATION =====
function formatCardNumber(value) {
  return value.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
}

function formatExpiryDate(value) {
  return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
}

document.getElementById('cardNumber').addEventListener('input', (e) => {
  e.target.value = formatCardNumber(e.target.value);
});

document.getElementById('expiryDate').addEventListener('input', (e) => {
  e.target.value = formatExpiryDate(e.target.value);
});

document.getElementById('cvv').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '');
});

// ===== CHECKOUT FORM SUBMISSION =====
document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Basic validation
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();

  if (!firstName || !lastName || !email || !phone || !address) {
    showToast('Please fill in all required fields');
    return;
  }

  // Get selected payment method
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

  // Only validate card details if card payment is selected
  if (paymentMethod === 'card') {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const cardName = document.getElementById('cardName').value.trim();

    if (!cardNumber || cardNumber.length < 13 || !expiryDate || !cvv || !cardName) {
      showToast('Please fill in all card details');
      return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock payment success (in real app, this would call payment API)
      const success = Math.random() > 0.1; // 90% success rate for demo

      if (success) {
        // Clear cart and show success
        cart = [];
        saveCart();
        updateCartUI();
        closeCheckout();

        const successMsg = getTranslation('msg_order_success', currentLang) || 'Order placed successfully!';
        showToast(successMsg);

        // Reset form
        e.target.reset();
      } else {
        showToast('Payment failed. Please try again.');
      }
    } catch (error) {
      showToast('An error occurred. Please try again.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }
  // PayPal payment is handled by the PayPal button
});

// ===== TOAST =====
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ===== CART COUNT BUMP =====
function bumpCount() {
  const el = document.getElementById('cartCount');
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 300);
}

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});

// ===== FOOTER FORM =====
document.getElementById('footerForm').addEventListener('submit', () => {
  showToast("Message sent!");
});


// ===== LANGUAGE SWITCHER =====
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    currentLang = lang;
    translate(lang);
    
    // Render products based on current page
    if (document.getElementById('productsGrid')) {
      const urlParams = new URLSearchParams(window.location.search);
      const filter = urlParams.get('filter') || 'all';
      renderProducts(filter);
    } else {
      renderFeaturedProducts();
    }
    
    updateCartUI();
  });
});

const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navbar = document.getElementById('navbar');
if (mobileMenuBtn && navbar) {
  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('nav-open');
    mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navbar.classList.contains('nav-open')) {
        navbar.classList.remove('nav-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// ===== INIT =====
initLanguage();

// Check if we're on products page
if (document.getElementById('productsGrid')) {
  const urlParams = new URLSearchParams(window.location.search);
  const filter = urlParams.get('filter') || 'all';
  renderProducts(filter);
} else {
  // Homepage
  renderFeaturedProducts();
}

updateCartUI();
