// FlexCore Website - Main JavaScript

// Global Variables
let cart = [];
let currentTestimonial = 0;
let isMenuOpen = false;

// Globe-related variables
let globe, globeRenderer, globeScene, globeCamera;
let isGlobeInitialized = false;

// Configuration variables
let currentConfiguration = {
    color: 'black',
    size: '9',
    core: 'casual',
    price: 89.99
};
let currentShoeCount = 8;
let currentCoreCount = 8;
let currentRoom = 'small';

// DOM Elements (declare first)
let navbar;
let navToggle;
let navMenu;
let loadingScreen;
let backToTopBtn;

// Initialize the application once DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    navbar = document.getElementById('navbar');
    navToggle = document.getElementById('nav-toggle');
    navMenu = document.getElementById('nav-menu');
    loadingScreen = document.getElementById('loading-screen');
    backToTopBtn = document.getElementById('back-to-top');

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
}
    
    // Globe initialization with error handling
    try {
        initializeGlobe();
    } catch (error) {
        console.warn('Globe failed to initialize:', error);
    }
    
    updateSpaceOrganizer();
    startAnimations();
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
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        // After fade, remove from layout entirely
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Navigation Setup
function setupNavigation() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
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
        if (navMenu && navToggle && 
            !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    if (navToggle) navToggle.classList.toggle('active');
    if (navMenu) navMenu.classList.toggle('active');
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    isMenuOpen = false;
    if (navToggle) navToggle.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
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

// Shopping Cart and Product Functions
function addToCart(productId) {
    const products = {
        'basic-bare': { 
            id: 'basic-bare', 
            name: 'Basic Bare', 
            price: 59.99, 
            image: 'https://i.imgur.com/GuSEaVq.png' 
        },
        'starter-kit': { 
            id: 'starter-kit', 
            name: 'Complete Starter Kit', 
            price: 94.99, 
            image: 'https://i.imgur.com/myAyR8N.png' 
        },
        'casual-cores': { 
            id: 'casual-cores', 
            name: 'Casual Cores', 
            price: 19.99, 
            image: 'https://i.imgur.com/MfhviPW.png' 
        },
        'cleat-cores': { 
            id: 'cleat-cores', 
            name: 'Professional Cleat Cores', 
            price: 19.99, 
            image: 'http://i.imgur.com/KmfodAU.png' 
        },
        'roller-cores': { 
            id: 'roller-cores', 
            name: 'Roller Cores', 
            price: 19.99, 
            image: 'https://i.imgur.com/MuvrLOV.png' 
        },
        'running-cores': { 
            id: 'running-cores', 
            name: 'Performance Running Cores', 
            price: 19.99, 
            image: 'https://i.imgur.com/kyuImHk.png' 
        }
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

function viewProduct(productId) {
    const products = {
        'basic-bare': {
            name: 'Basic Bare',
            price: 59.99,
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
        if (modalOverlay) modalOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Track product view
        trackEvent('Products', 'view_details', productId);
    }
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    
    if (modal) modal.style.display = 'none';
    if (modalOverlay) modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
}

// Globe initialization
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

        // Basic sphere geometry for the globe
        const geometry = new THREE.SphereGeometry(5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x0088ff, 
            wireframe: true 
        });
        globe = new THREE.Mesh(geometry, material);
        globeScene.add(globe);

        globeCamera.position.z = 10;

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            if (globe) {
                globe.rotation.x += 0.01;
                globe.rotation.y += 0.01;
            }
            globeRenderer.render(globeScene, globeCamera);
        }
        animate();
        
        isGlobeInitialized = true;
    } catch (error) {
        console.error('Globe initialization failed:', error);
    }
}

// Navigation function
function viewAllProducts() {
    trackEvent('Navigation', 'view_all_products', 'hero_cta');
    window.location.href = 'products.html';
}

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
            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            trackEvent('Products', 'filter', filter);
        });
    });
}

// Utility functions
function setupTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');

    if (testimonials.length === 0) return;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentTestimonial);
        });
    }

    // Auto-rotate testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
}

function setupForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Handle form submission
            trackEvent('Form', 'submit', form.id || 'unknown');
        });
    });
}

function setupCart() {
    updateCartUI();
}

function setupBackToTop() {
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function showCartNotification(productName) {
    // Create or update notification
    let notification = document.getElementById('cart-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'cart-notification';
        notification.className = 'cart-notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = `${productName} added to cart!`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function updateSpaceOrganizer() {
    console.log('Space organizer updated');
}

function startAnimations() {
    console.log('Animations started');
}

function trackAnalytics() {
    console.log('Analytics initialized');
}

function trackEvent(category, action, label) {
    console.log(`Analytics: ${category} - ${action} - ${label}`);
    // Here you would integrate with your analytics service
    // Example: gtag('event', action, { event_category: category, event_label: label });
}

// Make functions available globally
window.addToCart = addToCart;
window.viewProduct = viewProduct;
window.closeProductModal = closeProductModal;
window.viewAllProducts = viewAllProducts;
