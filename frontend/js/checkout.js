document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está autenticado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        alert('Debes iniciar sesión para finalizar la compra');
        window.location.href = 'login.html';
        return;
    }
    
    // Verificar si hay productos en el carrito
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        window.location.href = 'tienda.html';
        return;
    }
    
    // Configuración de autenticación para la página
    const authButtons = document.getElementById('auth-buttons');
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');
    
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
    
    // Cargar detalles del usuario si están disponibles
    loadUserDetails();
    
    // Mostrar resumen del carrito
    displayCheckoutSummary();
    
    // Manejar cambio de método de pago
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Ocultar todos los detalles de pago
            document.querySelectorAll('.payment-details').forEach(details => {
                details.style.display = 'none';
            });
            
            // Mostrar los detalles correspondientes al método seleccionado
            document.getElementById(`${this.value}-details`).style.display = 'block';
        });
    });
    
    // Manejar envío del formulario
    document.getElementById('shipping-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar formulario (podríamos añadir más validaciones aquí)
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const zip = document.getElementById('zip').value;
        const phone = document.getElementById('phone').value;
        
        if (!firstName || !lastName || !address || !city || !zip || !phone) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }
        
        // Verificar método de pago
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        
        // Si es tarjeta de crédito, validar esos campos también
        if (paymentMethod === 'credit-card') {
            const cardNumber = document.getElementById('card-number').value;
            const expiryDate = document.getElementById('expiry-date').value;
            const cvv = document.getElementById('cvv').value;
            const cardName = document.getElementById('card-name').value;
            
            if (!cardNumber || !expiryDate || !cvv || !cardName) {
                alert('Por favor completa todos los datos de la tarjeta');
                return;
            }
        }
        
        // Crear objeto con los datos del pedido
        const orderData = {
            customer: {
                firstName,
                lastName,
                address,
                city,
                zip,
                phone
            },
            paymentMethod,
            items: cart,
            total: calculateTotal(),
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        // Guardar el pedido en localStorage (en un sistema real iría a la base de datos)
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const orderId = Date.now().toString(); // Generar un ID único
        
        orders.push({
            id: orderId,
            ...orderData
        });
        
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Limpiar el carrito
        localStorage.removeItem('cart');
        
        // Mostrar confirmación y redirigir
        alert('¡Gracias por tu compra! Tu pedido ha sido recibido.');
        window.location.href = 'orden-confirmada.html?id=' + orderId;
    });
    
    // Función para cargar detalles del usuario
    function loadUserDetails() {
        const username = localStorage.getItem('username');
        if (!username) return;
        
        // Buscar al usuario actual
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const currentUser = users.find(u => u.username === username);
        
        if (currentUser && currentUser.fullname) {
            // Dividir el nombre completo en nombre y apellido
            const nameParts = currentUser.fullname.split(' ');
            if (nameParts.length > 0) {
                document.getElementById('first-name').value = nameParts[0];
                if (nameParts.length > 1) {
                    document.getElementById('last-name').value = nameParts.slice(1).join(' ');
                }
            }
        }
    }
    
    // Función para mostrar el resumen del pedido
    function displayCheckoutSummary() {
        const checkoutItems = document.getElementById('checkout-items');
        const subtotalElement = document.getElementById('checkout-subtotal');
        const shippingElement = document.getElementById('checkout-shipping');
        const totalElement = document.getElementById('checkout-total');
        
        if (cart.length === 0) {
            checkoutItems.innerHTML = '<p>No hay productos en el carrito</p>';
            return;
        }
        
        // Calcular subtotal
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = 0.00; // Envío gratuito
        const total = subtotal + shipping;
        
        // Mostrar productos
        checkoutItems.innerHTML = cart.map(item => `
            <div class="checkout-item">
                <div class="checkout-item-name">${item.name} x${item.quantity}</div>
                <div class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');
        
        // Actualizar totales
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = `$${shipping.toFixed(2)} (Envío gratuito)`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
    
    // Función para calcular el total
    function calculateTotal() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = 0.00; // Envío gratuito
        return subtotal + shipping;
    }
});