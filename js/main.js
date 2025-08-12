// FlexCore Website - Main JavaScript

// Global Variables
let cart = [];
let currentTestimonial = 0;
let isMenuOpen = false;

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const loadingScreen = document.getElementById('loading-screen'); // fixed duplicate & match HTML id
const backToTopBtn = document.getElementById('back-to-top');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize all functionality
function initializeApp() {
    handleLoading();
    setupNavigation();
    setupScrollEffects();
    setupAnimations();
    setupProductFilters();
    setupTestimonials();
    setupForms();
    setupCart();
    setupBackToTop();
    trackAnalytics();
}

// Fixed Loading Screen Handler with Guaranteed Timeout
function handleLoading() {
    if (!loadingScreen) {
        console.error('Loading screen element not found.');
        return;
    }

    // Always hide after 3 seconds (no matter what)
    setTimeout(() => {
        hideLoadingScreen();
    }, 3000);

    // If the document is already fully loaded, hide immediately
    if (document.readyState === 'complete') {
        hideLoadingScreen();
        return;
    }

    // Hide on full page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            hideLoadingScreen();
        }, 300);
    });

    // Hide on DOM ready for faster perception
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            hideLoadingScreen();
        }, 500);
    });
}

function hideLoadingScreen() {
    if (!loadingScreen.classList.contains('hidden')) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Optional: Instant removal
function handleLoadingInstant() {
    hideLoadingScreen();
}

// Navigation Setup
function setupNavigation() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    isMenuOpen = false;
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        smoothScrollTo(targetId);
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Close mobile menu
        closeMobileMenu();
        
        // Track navigation
        trackEvent('Navigation', 'click', targetId.replace('#', ''));
    }
}

// Smooth scrolling utility
function smoothScrollTo(target) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Scroll Effects
function setupScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });

    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= 120) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Animations Setup
function setupAnimations() {
    // Add stagger animation to grid items
    const animateGridItems = (gridSelector) => {
        const items = document.querySelectorAll(`${gridSelector} > *`);
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    };

    animateGridItems('.products-grid');
    animateGridItems('.features-grid');

    // Parallax effect for hero background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-pattern');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Updated Shopping Cart and Product Functions

function addToCart(productId) {
    const products = {
        'basic-bare': { id: 'basic-bare', name: 'Basic Bare', price: 59.99, image: 'https://i.imgur.com/GuSEaVq.png' }, // Updated price
        'starter-kit': { id: 'starter-kit', name: 'Complete Starter Kit', price: 94.99, image: 'https://i.imgur.com/myAyR8N.png' },
        'casual-cores': { id: 'casual-cores', name: 'Casual Cores', price: 19.99, image: 'https://i.imgur.com/MfhviPW.png' },
        'cleat-cores': { id: 'cleat-cores', name: 'Professional Cleat Cores', price: 19.99, image: 'http://i.imgur.com/KmfodAU.png' },
        'roller-cores': { id: 'roller-cores', name: 'Roller Cores', price: 19.99, image: 'https://i.imgur.com/MuvrLOV.png' },
        'running-cores': { id: 'running-cores', name: 'Performance Running Cores', price: 19.99, image: 'https://i.imgur.com/kyuImHk.png' }
    };
    
    const product = products[productId];
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    showCartNotification(product.name);
    
    // Track add to cart
    trackEvent('Ecommerce', 'add_to_cart', productId);
}

// Updated Product Modal with new price
function viewProduct(productId) {
    const products = {
        'basic-bare': {
            name: 'Basic Bare',
            price: 59.99, // Updated price
            image: 'https://i.imgur.com/GuSEaVq.png',
            description: 'The foundation of your FlexCore system. This minimalist base shoe is crafted with premium materials and designed for maximum comfort. Available in both lace-up and slip-on styles.',
            features: ['Premium synthetic upper', 'Cushioned insole', 'Flexible construction', 'Available in 6 colors', 'Lace-up or slip-on options']
        },
        'starter-kit': {
            name: 'Complete Starter Kit',
            price: 94.99,
            originalPrice: 109.97,
            image: 'https://i.imgur.com/myAyR8N.png',
            description: 'Perfect for newcomers to the FlexCore ecosystem! This comprehensive kit includes our Basic Bare foundation plus your choice of any 2 cores from our collection.',
            features: ['1x Basic Bare shoe', 'Your choice of 2 cores', 'Carrying case included', 'Setup guide', 'Best value option']
        }
        // Add more products as needed
    };
    
    const product = products[productId];
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalOverlay = document.getElementById('modal-overlay');
    
    if (modal && modalTitle && modalBody) {
        modalTitle.textContent = product.name;
        modalBody.innerHTML = `
            <div class="modal-product">
                <div class="modal-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="modal-info">
                    <div class="modal-price">
                        <span class="price-current">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="price-original">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <p class="modal-description">${product.description}</p>
                    <div class="modal-features">
                        <h4>Key Features:</h4>
                        <ul>
                            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-primary btn-large" onclick="addToCart('${productId}'); closeProductModal();">
                            Add to Cart - $${product.price.toFixed(2)}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        modalOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Track product view
        trackEvent('Products', 'view_details', productId);
    }
}

function initializeGlobe() {
  if (isGlobeInitialized) return;
  
  const canvas = document.getElementById('globe-canvas');
  if (!canvas || typeof THREE === 'undefined') {
    console.log('Three.js not loaded or canvas not found, skipping globe initialization');
    return;
  }

  try {
    // Create scene, camera, and renderer
    globeScene = new THREE.Scene();
    globeCamera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    globeRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    globeRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    globeRenderer.setClearColor(0x000011, 1);

    // Rest of your globe code stays the same...
    // (keep all the existing globe initialization code)
    
    isGlobeInitialized = true;
  } catch (error) {
    console.error('Globe initialization failed:', error);
  }
}

function initializeEverything() {
  setupNavigation();
  setupScrollEffects();
  setupProductFilters();
  
  // Try to initialize globe, but don't let it block other functionality
  try {
    initializeGlobe();
  } catch (error) {
    console.warn('Globe failed to initialize:', error);
  }
  
  updateSpaceOrganizer();
  startAnimations();
}

// New function to navigate to products page
function viewAllProducts() {
    // Track the click
    trackEvent('Navigation', 'view_all_products', 'hero_cta');
    
    // Navigate to products page
    window.location.href = 'products.html';
}

// Export the new function
window.viewAllProducts = viewAllProducts;

// Product Filters
function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter products
        });
    });
}
