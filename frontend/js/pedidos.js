document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    const username = localStorage.getItem('username');
    
    // Mostrar mensaje de "sin pedidos" por ahora
    // En una implementación real, cargaríamos los pedidos desde el backend
    document.getElementById('active-orders').style.display = 'none';
    document.getElementById('no-orders-message').style.display = 'block';
    
    // Simulación: Si queremos mostrar pedidos de ejemplo, podríamos hacer:
    /*
    const mockOrders = [
        { id: '12345', date: '2023-04-15', status: 'En proceso', total: 25.50, items: 3 },
        { id: '12346', date: '2023-04-18', status: 'Enviado', total: 34.75, items: 2 }
    ];
    
    if (mockOrders.length > 0) {
        const ordersHTML = mockOrders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <h3>Pedido #${order.id}</h3>
                    <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
                </div>
                <div class="order-details">
                    <p>Fecha: ${order.date}</p>
                    <p>Productos: ${order.items}</p>
                    <p>Total: $${order.total.toFixed(2)}</p>
                </div>
                <a href="#" class="client-btn">Ver Detalles</a>
            </div>
        `).join('');
        
        document.getElementById('active-orders').innerHTML = ordersHTML;
        document.getElementById('active-orders').style.display = 'block';
        document.getElementById('no-orders-message').style.display = 'none';
    }
    */
});