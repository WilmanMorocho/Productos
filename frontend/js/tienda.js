document.addEventListener('DOMContentLoaded', function() {
    // Configuración de autenticación para la tienda
    const authButtons = document.getElementById('auth-buttons');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');
    
    if (isLoggedIn) {
        authButtons.innerHTML = `
            <span class="user-welcome">Hola, ${username || 'Usuario'}</span>
            <a href="${userRole === 'admin' ? 'admin.html' : 'cliente.html'}" class="auth-btn login">Mi Cuenta</a>
            <a href="#" id="nav-logout" class="auth-btn register">Cerrar Sesión</a>
        `;
        
        document.getElementById('nav-logout').addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            localStorage.removeItem('username');
            window.location.href = 'home.html';
        });
    } else {
        authButtons.innerHTML = `
            <a href="login.html" class="auth-btn login">Iniciar Sesión</a>
            <a href="register.html" class="auth-btn register">Registrarse</a>
        `;
    }
    
    // Cargar productos desde la API (o localStorage en este caso)
    let products = [];
    let selectedProduct = null;
    
    // Función para cargar los productos
    async function loadProducts() {
        try {
            // Primero intentamos obtener productos de la API
            const response = await fetch('http://localhost:5000/api/products');
            
            if (response.ok) {
                products = await response.json();
            } else {
                // Como respaldo, usamos localStorage
                products = JSON.parse(localStorage.getItem('products') || '[]');
                
                // Si no hay productos, mostramos productos de ejemplo
                if (products.length === 0) {
                    console.log('No se encontraron productos, mostrando productos de muestra');
                    products = getSampleProducts();
                }
            }
            
            // Mostrar los productos
            displayProducts(products);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            
            // Intentar recuperar desde localStorage
            products = JSON.parse(localStorage.getItem('products') || '[]');
            
            if (products.length === 0) {
                products = getSampleProducts();
            }
            
            displayProducts(products);
        }
    }
    
    // Cargar productos al iniciar
    loadProducts();
    
    // Función para generar productos de muestra (solo como respaldo)
    function getSampleProducts() {
        return [
            { id: 1, name: 'Espresso Intenso', price: 12.99, category: 'espresso', description: 'Café espresso intenso con notas a chocolate y caramelo.', image: 'assets/espresso.jpg' },
            { id: 2, name: 'Blend Suave', price: 9.99, category: 'blend', description: 'Mezcla equilibrada con notas frutales y baja acidez.', image: 'assets/blend.jpg' },
            { id: 3, name: 'Arábica Premium', price: 15.99, category: 'arabica', description: 'Granos de arábica de altura con notas florales.', image: 'assets/arabica.jpg' },
            { id: 4, name: 'Espresso Gourmet', price: 18.50, category: 'espresso', description: 'Espresso premium con intenso sabor y aroma.', image: 'assets/espresso-gourmet.jpg' },
            { id: 5, name: 'Café de Especialidad', price: 24.99, category: 'specialty', description: 'Café de especialidad con notas a bayas silvestres.', image: 'assets/specialty.jpg' },
            { id: 6, name: 'Blend Oscuro', price: 11.50, category: 'blend', description: 'Mezcla de tueste oscuro con notas a chocolate amargo.', image: 'assets/dark-blend.jpg' }
        ];
    }
    
    // Carrito de compras
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    updateCartCount();
    
    // Evento para filtros de precio
    document.getElementById('apply-filters').addEventListener('click', function() {
        const maxPrice = document.getElementById('price-range').value;
        
        // Filtrar por precio
        const filteredProducts = products.filter(product => product.price <= maxPrice);
        
        displayProducts(filteredProducts);
    });
    
    // Actualizar etiqueta de precio
    document.getElementById('price-range').addEventListener('input', function() {
        document.getElementById('price-value').textContent = '$' + this.value;
    });
    
    // Modales
    const cartModal = document.getElementById('cart-modal');
    const quantityModal = document.getElementById('quantity-modal');
    const cartBtn = document.getElementById('cart-btn');
    const closeBtns = document.querySelectorAll('.close');
    
    // Abrir modal de carrito
    cartBtn.addEventListener('click', function() {
        displayCart();
        cartModal.style.display = 'block';
    });
    
    // Cerrar modales con X
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            cartModal.style.display = 'none';
            quantityModal.style.display = 'none';
        });
    });
    
    // Cerrar modales haciendo clic fuera
    window.addEventListener('click', function(event) {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
        if (event.target == quantityModal) {
            quantityModal.style.display = 'none';
        }
    });
    
    // Control de cantidad
    const quantityInput = document.getElementById('product-quantity');
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    const subtotalElement = document.getElementById('quantity-subtotal');
    
    decreaseBtn.addEventListener('click', function() {
        if (quantityInput.value > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
            updateSubtotal();
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        if (quantityInput.value < 99) {
            quantityInput.value = parseInt(quantityInput.value) + 1;
            updateSubtotal();
        }
    });
    
    quantityInput.addEventListener('change', function() {
        if (this.value < 1) this.value = 1;
        if (this.value > 99) this.value = 99;
        updateSubtotal();
    });
    
    function updateSubtotal() {
        if (selectedProduct) {
            const quantity = parseInt(quantityInput.value);
            const subtotal = selectedProduct.price * quantity;
            subtotalElement.textContent = subtotal.toFixed(2);
        }
    }
    
    // Botones de acción del modal de cantidad
    document.getElementById('cancel-add').addEventListener('click', function() {
        quantityModal.style.display = 'none';
    });
    
    document.getElementById('confirm-add').addEventListener('click', function() {
        if (selectedProduct) {
            const quantity = parseInt(quantityInput.value);
            addToCart(selectedProduct._id || selectedProduct.id, quantity);
            quantityModal.style.display = 'none';
        }
    });
    
    // Botón de checkout
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (!isLoggedIn) {
            alert('Debes iniciar sesión para realizar una compra');
            window.location.href = 'login.html';
            return;
        }
        
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        // Redireccionar a la página de checkout
        window.location.href = 'checkout.html';
        cartModal.style.display = 'none';
    });
    
    // Funciones auxiliares
    function displayProducts(productsToShow) {
        const productsGrid = document.getElementById('products-grid');
        
        if (productsToShow.length === 0) {
            productsGrid.innerHTML = '<p class="no-products">No se encontraron productos con los filtros seleccionados.</p>';
            return;
        }
        
        productsGrid.innerHTML = productsToShow.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image || 'assets/default-coffee.jpg'}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart-btn" data-id="${product._id || product.id}">Añadir al Carrito</button>
                </div>
            </div>
        `).join('');
        
        // Agregar eventos a botones de añadir al carrito
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                openQuantityModal(id);
            });
        });
    }
    
    function openQuantityModal(productId) {
        selectedProduct = products.find(p => (p._id || p.id) == productId);
        
        if (!selectedProduct) return;
        
        // Llenar la información del producto
        document.getElementById('product-info').innerHTML = `
            <h3>${selectedProduct.name}</h3>
            <p>${selectedProduct.description}</p>
            <div class="modal-product-price">Precio: $${selectedProduct.price.toFixed(2)}</div>
        `;
        
        // Resetear cantidad a 1
        quantityInput.value = 1;
        
        // Actualizar subtotal
        updateSubtotal();
        
        // Mostrar modal
        quantityModal.style.display = 'block';
    }
    
    function addToCart(productId, quantity = 1) {
        const product = products.find(p => (p._id || p.id) == productId);
        
        if (!product) return;
        
        // Verificar si el producto ya está en el carrito
        const existingItem = cart.find(item => (item._id || item.id) == productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product._id || product.id,
                name: product.name,
                price: product.price,
                quantity: quantity
            });
        }
        
        // Guardar carrito en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Actualizar contador de carrito
        updateCartCount();
        
        // Mostrar mensaje
        alert(`${quantity} ${quantity > 1 ? 'unidades' : 'unidad'} de ${product.name} añadidas al carrito`);
    }
    
    function displayCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Tu carrito está vacío</p>';
            cartTotal.textContent = '0.00';
            return;
        }
        
        let total = 0;
        
        cartItems.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                    </div>
                    <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                    <button class="remove-item-btn" data-id="${item.id}">&times;</button>
                </div>
            `;
        }).join('');
        
        cartTotal.textContent = total.toFixed(2);
        
        // Agregar eventos a botones de eliminar
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                removeFromCart(id);
            });
        });
    }
    
    function removeFromCart(productId) {
        cart = cart.filter(item => (item._id || item.id) != productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCart();
    }
    
    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = itemCount;
    }

    
});