 // Product Data
        const products = [
            {
                id: 1,
                name: "Wireless Bluetooth Headphones",
                price: 89.99,
                originalPrice: 129.99,
                category: "audio",
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                rating: 4.5,
                reviews: 128,
                badge: "Popular"
            },
            {
                id: 2,
                name: "Smart Fitness Tracker",
                price: 49.99,
                originalPrice: 69.99,
                category: "wearables",
                image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                rating: 4.2,
                reviews: 89,
                badge: "Sale"
            },
            {
                id: 3,
                name: "Premium Smartwatch",
                price: 199.99,
                originalPrice: 249.99,
                category: "wearables",
                image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                rating: 4.7,
                reviews: 64,
                badge: "Bestseller"
            },
            {
                id: 4,
                name: "Portable Bluetooth Speaker",
                price: 59.99,
                originalPrice: 79.99,
                category: "audio",
                image: "https://images.unsplash.com/photo-1543512214-318c7553f230?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                rating: 4.4,
                reviews: 42,
                badge: "Sale"
            },
            {
                id: 5,
                name: "Wireless Earbuds",
                price: 79.99,
                originalPrice: 99.99,
                category: "audio",
                image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                rating: 4.3,
                reviews: 156,
                badge: "Popular"
            },
            {
                id: 6,
                name: "Gaming Mouse",
                price: 45.99,
                originalPrice: 59.99,
                category: "accessories",
                image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                rating: 4.6,
                reviews: 78,
                badge: "Sale"
            },
            {
                id: 7,
                name: "Mechanical Keyboard",
                price: 89.99,
                originalPrice: 119.99,
                category: "accessories",
                image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                rating: 4.8,
                reviews: 112,
                badge: "Bestseller"
            },
            {
                id: 8,
                name: "USB-C Hub Adapter",
                price: 39.99,
                originalPrice: 49.99,
                category: "accessories",
                image: "https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                rating: 4.1,
                reviews: 53,
                badge: "New"
            }
        ];

        // DOM Elements
        const productGrid = document.getElementById('productGrid');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const cartCount = document.querySelector('.cart-count');
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        const cartToggle = document.getElementById('cartToggle');
        const closeCart = document.getElementById('closeCart');
        const searchInput = document.getElementById('searchInput');
        const categoryButtons = document.querySelectorAll('.category-btn');
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        // Cart State
        let cart = [];

        // Initialize the app
        function init() {
            renderProducts(products);
            setupEventListeners();
            loadCartFromStorage();
            updateCartUI();
        }

        // Render products to the grid
        function renderProducts(productsToRender) {
            productGrid.innerHTML = '';
            
            if (productsToRender.length === 0) {
                productGrid.innerHTML = `
                    <div class="text-center" style="grid-column: 1 / -1; padding: 3rem;">
                        <i class="fas fa-search" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                        <h3>No products found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                `;
                return;
            }
            
            productsToRender.forEach(product => {
                const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                const stars = generateStarRating(product.rating);
                
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.dataset.category = product.category;
                productCard.innerHTML = `
                    ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-overlay">
                            <div class="product-actions">
                                <button class="action-btn quick-view-btn" data-id="${product.id}">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="action-btn wishlist-btn" data-id="${product.id}">
                                    <i class="fas fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-rating">
                            ${stars}
                            <span class="rating-count">(${product.reviews})</span>
                        </div>
                        <div class="product-price">
                            <span class="current-price">$${product.price.toFixed(2)}</span>
                            <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                            <span class="discount">-${discount}%</span>
                        </div>
                        <button class="add-to-cart" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>Add to Cart
                        </button>
                    </div>
                `;
                productGrid.appendChild(productCard);
            });
            
            // Add event listeners to the new buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.dataset.id);
                    addToCart(productId);
                });
            });
            
            document.querySelectorAll('.quick-view-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.dataset.id);
                    quickViewProduct(productId);
                });
            });
            
            document.querySelectorAll('.wishlist-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.dataset.id);
                    addToWishlist(productId);
                });
            });
        }

        // Generate star rating HTML
        function generateStarRating(rating) {
            let stars = '';
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;
            
            for (let i = 0; i < fullStars; i++) {
                stars += '<i class="fas fa-star"></i>';
            }
            
            if (hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            }
            
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            for (let i = 0; i < emptyStars; i++) {
                stars += '<i class="far fa-star"></i>';
            }
            
            return stars;
        }

        // Add product to cart
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            saveCartToStorage();
            updateCartUI();
            showToast(`${product.name} added to cart!`);
        }

        // Remove item from cart
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            saveCartToStorage();
            updateCartUI();
        }

        // Update cart quantity
        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            if (!item) return;
            
            item.quantity += change;
            
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                saveCartToStorage();
                updateCartUI();
            }
        }

        // Update cart UI
        function updateCartUI() {
            // Update cart count
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Update cart items
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
                cartTotal.textContent = '$0.00';
                return;
            }
            
            cartItems.innerHTML = '';
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-actions">
                            <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });
            
            cartTotal.textContent = `$${total.toFixed(2)}`;
            
            // Add event listeners to cart item buttons
            document.querySelectorAll('.decrease-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const id = parseInt(this.dataset.id);
                    updateQuantity(id, -1);
                });
            });
            
            document.querySelectorAll('.increase-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const id = parseInt(this.dataset.id);
                    updateQuantity(id, 1);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const id = parseInt(this.dataset.id);
                    removeFromCart(id);
                });
            });
        }

        // Show toast notification
        function showToast(message, isError = false) {
            toastMessage.textContent = message;
            toast.className = isError ? 'toast error' : 'toast';
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Quick view product
        function quickViewProduct(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            // In a real application, this would open a modal with product details
            showToast(`Quick view: ${product.name}`);
        }

        // Add to wishlist
        function addToWishlist(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            // In a real application, this would add the product to a wishlist
            showToast(`${product.name} added to wishlist!`);
        }

        // Filter products by category
        function filterProducts(category) {
            if (category === 'all') {
                renderProducts(products);
                return;
            }
            
            const filteredProducts = products.filter(product => product.category === category);
            renderProducts(filteredProducts);
        }

        // Search products
        function searchProducts(query) {
            if (!query.trim()) {
                renderProducts(products);
                return;
            }
            
            const searchTerm = query.toLowerCase();
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) || 
                product.category.toLowerCase().includes(searchTerm)
            );
            
            renderProducts(filteredProducts);
        }

        // Save cart to localStorage
        function saveCartToStorage() {
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        // Load cart from localStorage
        function loadCartFromStorage() {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
            }
        }

        // Setup event listeners
        function setupEventListeners() {
            // Cart toggle
            cartToggle.addEventListener('click', () => {
                cartSidebar.classList.add('open');
                overlay.classList.add('active');
            });
            
            closeCart.addEventListener('click', closeCartSidebar);
            overlay.addEventListener('click', closeCartSidebar);
            
            // Search functionality
            searchInput.addEventListener('input', (e) => {
                searchProducts(e.target.value);
            });
            
            // Category filter
            categoryButtons.forEach(button => {
                button.addEventListener('click', function() {
                    categoryButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    filterProducts(this.dataset.category);
                });
            });
            
            // Contact form submission
            document.getElementById('contactForm').addEventListener('submit', function(e) {
                e.preventDefault();
                showToast('Your message has been sent! We will get back to you soon.');
                this.reset();
            });
            
            // Login button
            document.getElementById('loginBtn').addEventListener('click', () => {
                showToast('Login functionality would be implemented here!');
            });
            
            // Checkout button
            document.querySelector('.checkout-btn').addEventListener('click', () => {
                if (cart.length === 0) {
                    showToast('Your cart is empty!', true);
                    return;
                }
                
                showToast('Proceeding to checkout...');
                setTimeout(() => {
                    cart = [];
                    saveCartToStorage();
                    updateCartUI();
                    closeCartSidebar();
                }, 1500);
            });
            
            // Hero buttons
            document.querySelectorAll('.hero-btn').forEach(button => {
                button.addEventListener('click', () => {
                    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
                });
            });
        }

        // Close cart sidebar
        function closeCartSidebar() {
            cartSidebar.classList.remove('open');
            overlay.classList.remove('active');
        }

        // Initialize the app when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);